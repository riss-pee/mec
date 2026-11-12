/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  OpticalElement,
  TorchSource,
  RaySegment,
  ImageFormation,
  CaliperMeasurement,
} from '../types/optics';
import { traceTorchRays, tracePrincipalRays, getLaserColorHex } from '../physics/rayTracer';
import { Ruler, Maximize2, Minimize2, Eye, EyeOff, Crosshair, LocateFixed } from 'lucide-react';

interface OpticsCanvasProps {
  element: OpticalElement;
  torch: TorchSource;
  onUpdateElement: (patch: Partial<OpticalElement>) => void;
  onUpdateTorch: (patch: Partial<TorchSource>) => void;
}

export const OpticsCanvas: React.FC<OpticsCanvasProps> = ({
  element,
  torch,
  onUpdateElement,
  onUpdateTorch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [showFocalMarkers, setShowFocalMarkers] = useState(true);
  const [showVirtualRays, setShowVirtualRays] = useState(true);
  const [showTorchAxisRef, setShowTorchAxisRef] = useState(true);
  const [caliper, setCaliper] = useState<CaliperMeasurement>({
    active: false,
    p1: null,
    p2: null,
    distanceCm: null,
  });

  // Dragging state
  type DragTarget =
    | { type: 'torch-pos' }
    | { type: 'torch-rot' }
    | { type: 'torch-axis' }
    | { type: 'focal-point'; side: 'left' | 'right' }
    | { type: 'element-pos' }
    | { type: 'caliper-p1' }
    | { type: 'caliper-p2' }
    | null;

  const [dragTarget, setDragTarget] = useState<DragTarget>(null);

  // Bench coordinate system: X from -70 to +70 cm, Y from -27 to +27 cm (optical axis at Y = 0)
  const viewRangeX = 140; // cm total width (-70 to +70)
  const viewRangeY = 54;  // cm total height (-27 to +27)

  const [canvasDim, setCanvasDim] = useState({ width: 1100, height: 460 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasDim({
          width: Math.max(700, rect.width),
          height: Math.max(420, rect.height),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Convert bench (cm) -> canvas SVG coordinates (px)
  const cmToPxX = useCallback((cmX: number) => {
    return ((cmX + 70) / viewRangeX) * canvasDim.width;
  }, [canvasDim.width, viewRangeX]);

  const cmToPxY = useCallback((cmY: number) => {
    // Canvas Y: positive cmY is UP
    return ((-cmY + 27) / viewRangeY) * canvasDim.height;
  }, [canvasDim.height, viewRangeY]);

  // Convert canvas SVG px -> bench (cm)
  const pxToCmX = useCallback((pxX: number) => {
    return (pxX / canvasDim.width) * viewRangeX - 70;
  }, [canvasDim.width, viewRangeX]);

  const pxToCmY = useCallback((pxY: number) => {
    return 27 - (pxY / canvasDim.height) * viewRangeY;
  }, [canvasDim.height, viewRangeY]);

  // Compute rays
  const bounds = { minX: -70, maxX: 70, minY: -27, maxY: 27 };
  let raySegments: RaySegment[] = [];
  let imageFormation: ImageFormation | null = null;

  if (torch.rayMode === 'principal-rays') {
    const res = tracePrincipalRays(element, torch, bounds);
    raySegments = res.segments;
    imageFormation = res.image;
  } else {
    raySegments = traceTorchRays(element, torch, bounds);
  }

  // Filter virtual rays if toggled off
  const renderedSegments = showVirtualRays
    ? raySegments
    : raySegments.filter((seg) => !seg.isVirtual);

  // Mouse interaction handlers for dragging
  const handleMouseDown = (target: DragTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    setDragTarget(target);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragTarget || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mousePxX = e.clientX - rect.left;
    const mousePxY = e.clientY - rect.top;
    const mouseCmX = Math.max(-68, Math.min(68, pxToCmX(mousePxX)));
    const mouseCmY = Math.max(-25, Math.min(25, pxToCmY(mousePxY)));

    if (dragTarget.type === 'torch-pos') {
      const newY = Math.round(mouseCmY * 2) / 2;
      onUpdateTorch({
        x: Math.round(mouseCmX * 2) / 2,
        y: newY,
        objectHeight: newY,
      });
    } else if (dragTarget.type === 'torch-rot') {
      const dx = mouseCmX - torch.x;
      const dy = mouseCmY - torch.y;
      const angleRad = Math.atan2(dy, dx);
      let angleDeg = Math.round((angleRad * 180) / Math.PI);
      if (angleDeg > 180) angleDeg -= 360;
      const clamped = Math.max(-60, Math.min(60, angleDeg));
      onUpdateTorch({ angle: clamped });
    } else if (dragTarget.type === 'torch-axis') {
      const newX = Math.round(mouseCmX * 2) / 2;
      onUpdateTorch({ x: newX });
    } else if (dragTarget.type === 'focal-point') {
      const dist = Math.abs(mouseCmX - element.x);
      const clampedF = Math.max(5, Math.min(50, Math.round(dist * 2) / 2));
      const signedF = element.focalLength < 0 ? -clampedF : clampedF;
      onUpdateElement({ focalLength: signedF });
    } else if (dragTarget.type === 'element-pos') {
      onUpdateElement({ x: Math.round(mouseCmX * 2) / 2 });
    } else if (dragTarget.type === 'caliper-p1') {
      setCaliper((prev) => ({
        ...prev,
        p1: { x: mouseCmX, y: mouseCmY },
        distanceCm: prev.p2 ? Math.hypot(mouseCmX - prev.p2.x, mouseCmY - prev.p2.y) : null,
      }));
    } else if (dragTarget.type === 'caliper-p2') {
      setCaliper((prev) => ({
        ...prev,
        p2: { x: mouseCmX, y: mouseCmY },
        distanceCm: prev.p1 ? Math.hypot(mouseCmX - prev.p1.x, mouseCmY - prev.p1.y) : null,
      }));
    }
  }, [dragTarget, pxToCmX, pxToCmY, onUpdateTorch, onUpdateElement, torch.x, torch.y, element.x, element.focalLength]);

  const handleMouseUp = () => {
    setDragTarget(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!caliper.active || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickCmX = pxToCmX(e.clientX - rect.left);
    const clickCmY = pxToCmY(e.clientY - rect.top);

    if (!caliper.p1) {
      setCaliper((prev) => ({ ...prev, p1: { x: clickCmX, y: clickCmY }, distanceCm: null }));
    } else if (!caliper.p2) {
      const d = Math.hypot(clickCmX - caliper.p1.x, clickCmY - caliper.p1.y);
      setCaliper((prev) => ({ ...prev, p2: { x: clickCmX, y: clickCmY }, distanceCm: d }));
    } else {
      setCaliper((prev) => ({ ...prev, p1: { x: clickCmX, y: clickCmY }, p2: null, distanceCm: null }));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Precomputed coordinates
  const axisYPx = cmToPxY(0);
  const elemXPx = cmToPxX(element.x);
  const torchXPx = cmToPxX(torch.x);
  const torchYPx = cmToPxY(torch.y);
  const fAbs = Math.abs(element.focalLength);
  const isLens = element.type === 'convex-lens' || element.type === 'concave-lens';
  const isMirror = element.type === 'concave-mirror' || element.type === 'convex-mirror' || element.type === 'plane-mirror';

  // Ruler ticks (-60 to +60 in 5cm steps)
  const rulerTicks = [];
  for (let x = -60; x <= 60; x += 5) {
    rulerTicks.push(x);
  }

  // Laser beam ink color
  const laserColor = getLaserColorHex(torch.colorScheme);

  // Helper to draw little sketched directional arrow along ray segment
  const renderRayArrow = (p1: { x: number; y: number }, p2: { x: number; y: number }, color: string) => {
    const midX = (cmToPxX(p1.x) + cmToPxX(p2.x)) / 2;
    const midY = (cmToPxY(p1.y) + cmToPxY(p2.y)) / 2;
    const angle = Math.atan2(cmToPxY(p2.y) - cmToPxY(p1.y), cmToPxX(p2.x) - cmToPxX(p1.x));
    const dist = Math.hypot(cmToPxX(p2.x) - cmToPxX(p1.x), cmToPxY(p2.y) - cmToPxY(p1.y));
    if (dist < 45) return null; // Only draw arrow on long enough segments

    const arrowLen = 9;
    const x1 = midX - arrowLen * Math.cos(angle - 0.45);
    const y1 = midY - arrowLen * Math.sin(angle - 0.45);
    const x2 = midX - arrowLen * Math.cos(angle + 0.45);
    const y2 = midY - arrowLen * Math.sin(angle + 0.45);

    return (
      <path
        d={`M ${x1} ${y1} L ${midX} ${midY} L ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-[#fffef9] rounded-lg border-2 border-slate-700/80 shadow-[4px_6px_0px_rgba(51,65,85,0.22)] overflow-hidden select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
      style={{ minHeight: isFullscreen ? '100vh' : '490px' }}
    >
      {/* Notebook Perforation strip at left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#f8f4e6] border-r border-slate-300 flex flex-col justify-evenly items-center z-20 pointer-events-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400/50 shadow-inner" />
        ))}
      </div>

      {/* Canvas Top Bar Controls & Status Overlay (Styled like Student Lab Notes Header) */}
      <div className="flex items-center justify-between pl-6 pr-4 py-2 bg-[#f9f5e8] border-b-2 border-slate-700/60 text-xs font-hand text-slate-800 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <span className="text-base select-none">✏️</span>
            <span>{element.name}</span>
            <span className="font-sketch text-xs text-blue-800 px-1.5 py-0.5 bg-blue-100/70 border border-blue-300 rounded">
              ({element.type === 'plane-mirror' ? 'f = ∞ (flat)' : element.type === 'prism' ? `Dispersive Prism (Apex ${element.prismApexAngle || 60}°)` : `f = ${element.focalLength > 0 ? '+' : ''}${element.focalLength.toFixed(1)} cm`})
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-600 font-hand text-sm">
            <span>·</span>
            <span>Torch at [{torch.x.toFixed(1)}, {torch.y.toFixed(1)}] cm</span>
            <span>·</span>
            <span>Angle {torch.angle}°</span>
            <span>·</span>
            <span>Mode: {torch.rayMode === 'single-pencil' ? 'Single Ray' : torch.rayMode === 'principal-rays' ? '3 Principal Rays' : `${torch.beamWidth}° Cone`}</span>
          </div>
        </div>

        {/* Notebook Toolbar Toggles (Hand-drawn style sketch buttons) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTorchAxisRef(!showTorchAxisRef)}
            title="Toggle Torch Axis Reference Line & Position Highlight"
            className={`px-2.5 py-1 rounded text-xs font-hand font-semibold transition-all flex items-center gap-1 sketch-card-sm ${
              showTorchAxisRef ? 'bg-teal-100 text-teal-900 border-teal-600' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LocateFixed className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden md:inline">Object Guide</span>
          </button>

          <button
            onClick={() => setShowFocalMarkers(!showFocalMarkers)}
            title="Toggle Focal Markers & Visual Labels"
            className={`px-2.5 py-1 rounded text-xs font-hand font-semibold transition-all flex items-center gap-1 sketch-card-sm ${
              showFocalMarkers ? 'bg-amber-100 text-amber-900 border-amber-600' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Focal Points</span>
          </button>

          <button
            onClick={() => setShowRuler(!showRuler)}
            title="Toggle Metric Grid & Ruler"
            className={`px-2.5 py-1 rounded text-xs font-hand font-semibold transition-all flex items-center gap-1 sketch-card-sm ${
              showRuler ? 'bg-sky-100 text-sky-900 border-sky-600' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-sky-700" />
            <span className="hidden md:inline">Axis Ruler</span>
          </button>

          <button
            onClick={() => setShowVirtualRays(!showVirtualRays)}
            title="Toggle Virtual Ray Backtraces (Dashed Lines)"
            className={`px-2.5 py-1 rounded text-xs font-hand font-semibold transition-all flex items-center gap-1 sketch-card-sm ${
              showVirtualRays ? 'bg-purple-100 text-purple-900 border-purple-600' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {showVirtualRays ? <Eye className="w-3.5 h-3.5 text-purple-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden md:inline">Virtual Rays</span>
          </button>

          <button
            onClick={() => {
              setCaliper((prev) => ({
                active: !prev.active,
                p1: null,
                p2: null,
                distanceCm: null,
              }));
            }}
            title="Caliper: Measure distance between any two optical points"
            className={`px-2.5 py-1 rounded text-xs font-hand font-semibold transition-all flex items-center gap-1 sketch-card-sm ${
              caliper.active ? 'bg-emerald-100 text-emerald-900 border-emerald-600' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>📏 Ruler Caliper</span>
            {caliper.distanceCm !== null && (
              <span className="font-sketch font-bold text-emerald-800 ml-0.5">
                {caliper.distanceCm.toFixed(1)}cm
              </span>
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Bench'}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors ml-1"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Interactive SVG Canvas (Notebook Graph Paper) */}
      <div className="relative flex-1 w-full bg-[#fcf9ee] pl-4">
        <svg
          className="w-full h-full block cursor-crosshair"
          viewBox={`0 0 ${canvasDim.width} ${canvasDim.height}`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
        >
          <defs>
            {/* Student Quad Graph Paper Grid Pattern */}
            <pattern id="notebook-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeOpacity="0.35" />
            </pattern>

            {/* Hand-drawn Lens Glass Wash Gradient */}
            <linearGradient id="lens-watercolor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.55" />
            </linearGradient>

            {/* Student Mirror Hand-drawn 45° Silvering Hatch Pattern */}
            <pattern id="mirror-pencil-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="1.4" />
            </pattern>

            {/* Subtle soft glow for bright flashlight bulb */}
            <filter id="ink-soft-glow" filterUnits="userSpaceOnUse" x="-100" y="-100" width="3000" height="2000">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Quad Graph Paper Grid Background */}
          <rect width="100%" height="100%" fill="url(#notebook-grid)" />

          {/* 2. Red Left Notebook Margin Line */}
          <line
            x1={cmToPxX(-65)}
            y1={0}
            x2={cmToPxX(-65)}
            y2={canvasDim.height}
            stroke="#f87171"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />

          {/* 3. Optical Axis (Drawn like a ruled pencil line) */}
          <line
            x1="0"
            y1={axisYPx}
            x2={canvasDim.width}
            y2={axisYPx}
            stroke="#334155"
            strokeWidth="2"
            strokeDasharray="10 5"
            strokeOpacity="0.85"
          />

          {/* Handwritten Axis Label */}
          <text
            x={cmToPxX(-63)}
            y={axisYPx - 9}
            fill="#475569"
            fontSize="14"
            fontFamily="'Patrick Hand', cursive"
            fontWeight="bold"
          >
            ✏️ Principal Optical Axis (y = 0)
          </text>

          {/* 4. Metric Scale Ruler along Principal Axis */}
          {showRuler && (
            <g className="ruler-group" opacity="0.95">
              {rulerTicks.map((tickX) => {
                const px = cmToPxX(tickX);
                const isMajor = tickX % 10 === 0;
                const isZero = tickX === 0;
                const tickHeight = isZero ? 13 : isMajor ? 9 : 4.5;

                return (
                  <g key={`tick-${tickX}`}>
                    <line
                      x1={px}
                      y1={axisYPx - tickHeight}
                      x2={px}
                      y2={axisYPx + tickHeight}
                      stroke={isZero ? '#b45309' : isMajor ? '#1e293b' : '#64748b'}
                      strokeWidth={isZero ? 2.5 : isMajor ? 1.5 : 1}
                      strokeLinecap="round"
                    />
                    {isMajor && (
                      <text
                        x={px}
                        y={axisYPx + 20}
                        textAnchor="middle"
                        fill={isZero ? '#b45309' : '#334155'}
                        fontSize="13"
                        fontFamily="'Patrick Hand', cursive"
                        fontWeight={isZero ? 'bold' : 'normal'}
                      >
                        {tickX > 0 ? `+${tickX}` : tickX}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Unit Tag */}
              <text
                x={canvasDim.width - 24}
                y={axisYPx + 20}
                textAnchor="end"
                fill="#475569"
                fontSize="14"
                fontFamily="'Patrick Hand', cursive"
                fontWeight="bold"
              >
                [cm]
              </text>
            </g>
          )}

          {/* 5. REFERENCE LINE & OBJECT PROJECTION DROP-LINE (HAND-DRAWN TECHNICAL NOTES) */}
          {showTorchAxisRef && (() => {
            const isTorchOnAxis = Math.abs(torch.y) < 0.2;
            const distToElem = Math.abs(element.x - torch.x);
            const ySign = torch.y >= 0 ? 1 : -1;
            const raSize = 10;
            const xSign = torch.x <= element.x ? 1 : -1;

            return (
              <g className="torch-axis-reference-group">
                {/* Vertical Notebook Guideline */}
                <line
                  x1={torchXPx}
                  y1={0}
                  x2={torchXPx}
                  y2={canvasDim.height}
                  stroke="#0d9488"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  strokeOpacity="0.55"
                />

                {/* Hand-drawn Drop-Line Connecting Torch to Principal Axis */}
                {!isTorchOnAxis && (
                  <>
                    <line
                      x1={torchXPx}
                      y1={torchYPx}
                      x2={torchXPx}
                      y2={axisYPx}
                      stroke="#0f766e"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                      strokeLinecap="round"
                    />
                    {/* Hand-drawn right-angle square symbol ∟ */}
                    {Math.abs(torchYPx - axisYPx) > 16 && (
                      <path
                        d={`M ${torchXPx} ${axisYPx - ySign * raSize} 
                            L ${torchXPx + xSign * raSize} ${axisYPx - ySign * raSize} 
                            L ${torchXPx + xSign * raSize} ${axisYPx}`}
                        fill="none"
                        stroke="#0f766e"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </>
                )}

                {/* Axis Cross-Tick Marker */}
                <line
                  x1={torchXPx}
                  y1={axisYPx - 14}
                  x2={torchXPx}
                  y2={axisYPx + 14}
                  stroke="#0f766e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Draggable Axis Highlight Anchor & Hand-sketched Note Card */}
                <g
                  className="cursor-ew-resize group select-none"
                  onMouseDown={(e) => handleMouseDown({ type: 'torch-axis' }, e)}
                >
                  <circle
                    cx={torchXPx}
                    cy={axisYPx}
                    r="10"
                    fill="#14b8a6"
                    fillOpacity="0.2"
                  />
                  {/* Sketched diamond point */}
                  <polygon
                    points={`${torchXPx},${axisYPx - 7} ${torchXPx + 7},${axisYPx} ${torchXPx},${axisYPx + 7} ${torchXPx - 7},${axisYPx}`}
                    fill="#0f766e"
                    stroke="#134e4a"
                    strokeWidth="1.8"
                  />
                  <circle cx={torchXPx} cy={axisYPx} r="2.5" fill="#f0fdfa" />

                  {/* Sketched Mini Post-it Tag with Position */}
                  {(() => {
                    const badgeY = torch.y >= 0 ? axisYPx + 24 : axisYPx - 52;
                    return (
                      <g className="transition-transform group-hover:scale-105">
                        <rect
                          x={torchXPx - 42}
                          y={badgeY}
                          width="84"
                          height="26"
                          rx="4"
                          fill="#fef08a"
                          stroke="#ca8a04"
                          strokeWidth="1.5"
                          className="filter drop-shadow"
                        />
                        <text
                          x={torchXPx}
                          y={badgeY + 13}
                          textAnchor="middle"
                          fill="#713f12"
                          fontSize="13"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          x = {torch.x > 0 ? `+${torch.x.toFixed(1)}` : torch.x.toFixed(1)} cm
                        </text>
                        <text
                          x={torchXPx}
                          y={badgeY + 23}
                          textAnchor="middle"
                          fill="#854d0e"
                          fontSize="11"
                          fontFamily="'Patrick Hand', cursive"
                        >
                          {distToElem > 0.5 ? `dₒ = ${distToElem.toFixed(1)} cm` : 'at element'}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              </g>
            );
          })()}

          {/* 6. FOCAL POINTS & DISTINCT VISUAL MARKERS (HAND-DRAWN STYLE) */}
          {showFocalMarkers && (
            <g className="focal-markers-group">
              {/* LENS FOCAL POINTS */}
              {isLens && element.focalLength !== 0 && (
                <>
                  {/* F1 (Front Focus, Left of Lens) */}
                  {(() => {
                    const f1X = element.x - fAbs;
                    const f1Px = cmToPxX(f1X);
                    return (
                      <g
                        className="cursor-ew-resize group"
                        onMouseDown={(e) => handleMouseDown({ type: 'focal-point', side: 'left' }, e)}
                      >
                        {/* Vertical pencil dashed line */}
                        <line
                          x1={f1Px}
                          y1={axisYPx - 26}
                          x2={f1Px}
                          y2={axisYPx + 26}
                          stroke="#0284c7"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                        {/* Sketched diamond point */}
                        <polygon
                          points={`${f1Px},${axisYPx - 7} ${f1Px + 7},${axisYPx} ${f1Px},${axisYPx + 7} ${f1Px - 7},${axisYPx}`}
                          fill="#0284c7"
                          stroke="#0c4a6e"
                          strokeWidth="2"
                        />
                        {/* Hand-drawn Circular Badge */}
                        <circle
                          cx={f1Px}
                          cy={axisYPx - 24}
                          r="11"
                          fill="#e0f2fe"
                          stroke="#0369a1"
                          strokeWidth="1.5"
                        />
                        <text
                          x={f1Px}
                          y={axisYPx - 19}
                          textAnchor="middle"
                          fill="#0369a1"
                          fontSize="14"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          F₁
                        </text>
                        {/* Distance note */}
                        <text
                          x={f1Px}
                          y={axisYPx + 36}
                          textAnchor="middle"
                          fill="#0369a1"
                          fontSize="13"
                          fontFamily="'Patrick Hand', cursive"
                        >
                          {f1X.toFixed(1)}cm
                        </text>
                      </g>
                    );
                  })()}

                  {/* F2 (Back Focus, Right of Lens) */}
                  {(() => {
                    const f2X = element.x + fAbs;
                    const f2Px = cmToPxX(f2X);
                    return (
                      <g
                        className="cursor-ew-resize group"
                        onMouseDown={(e) => handleMouseDown({ type: 'focal-point', side: 'right' }, e)}
                      >
                        <line
                          x1={f2Px}
                          y1={axisYPx - 26}
                          x2={f2Px}
                          y2={axisYPx + 26}
                          stroke="#0284c7"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                        <polygon
                          points={`${f2Px},${axisYPx - 7} ${f2Px + 7},${axisYPx} ${f2Px},${axisYPx + 7} ${f2Px - 7},${axisYPx}`}
                          fill="#0284c7"
                          stroke="#0c4a6e"
                          strokeWidth="2"
                        />
                        <circle
                          cx={f2Px}
                          cy={axisYPx - 24}
                          r="11"
                          fill="#e0f2fe"
                          stroke="#0369a1"
                          strokeWidth="1.5"
                        />
                        <text
                          x={f2Px}
                          y={axisYPx - 19}
                          textAnchor="middle"
                          fill="#0369a1"
                          fontSize="14"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          F₂
                        </text>
                        <text
                          x={f2Px}
                          y={axisYPx + 36}
                          textAnchor="middle"
                          fill="#0369a1"
                          fontSize="13"
                          fontFamily="'Patrick Hand', cursive"
                        >
                          +{f2X.toFixed(1)}cm
                        </text>
                      </g>
                    );
                  })()}

                  {/* 2F1 Marker */}
                  {(() => {
                    const doubleF1X = element.x - 2 * fAbs;
                    const doubleF1Px = cmToPxX(doubleF1X);
                    return (
                      <g key="2F1">
                        <circle
                          cx={doubleF1Px}
                          cy={axisYPx}
                          r="5.5"
                          fill="#f1f5f9"
                          stroke="#475569"
                          strokeWidth="1.8"
                        />
                        <text
                          x={doubleF1Px}
                          y={axisYPx - 12}
                          textAnchor="middle"
                          fill="#475569"
                          fontSize="13"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          2F₁
                        </text>
                      </g>
                    );
                  })()}

                  {/* 2F2 Marker */}
                  {(() => {
                    const doubleF2X = element.x + 2 * fAbs;
                    const doubleF2Px = cmToPxX(doubleF2X);
                    return (
                      <g key="2F2">
                        <circle
                          cx={doubleF2Px}
                          cy={axisYPx}
                          r="5.5"
                          fill="#f1f5f9"
                          stroke="#475569"
                          strokeWidth="1.8"
                        />
                        <text
                          x={doubleF2Px}
                          y={axisYPx - 12}
                          textAnchor="middle"
                          fill="#475569"
                          fontSize="13"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          2F₂
                        </text>
                      </g>
                    );
                  })()}

                  {/* Focal Length Dimension Callout Bracket (Hand-sketched dimension line) */}
                  {(() => {
                    const startPx = cmToPxX(element.x);
                    const endPx = cmToPxX(element.x + fAbs);
                    const bracketY = axisYPx + 54;
                    return (
                      <g opacity="0.9">
                        <line x1={startPx} y1={bracketY - 5} x2={startPx} y2={bracketY + 5} stroke="#0284c7" strokeWidth="1.5" />
                        <line x1={endPx} y1={bracketY - 5} x2={endPx} y2={bracketY + 5} stroke="#0284c7" strokeWidth="1.5" />
                        <line x1={startPx} y1={bracketY} x2={endPx} y2={bracketY} stroke="#0284c7" strokeWidth="1.6" />
                        <text
                          x={(startPx + endPx) / 2}
                          y={bracketY - 4}
                          textAnchor="middle"
                          fill="#0284c7"
                          fontSize="14"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          |← f = {fAbs.toFixed(1)} cm →|
                        </text>
                      </g>
                    );
                  })()}
                </>
              )}

              {/* MIRROR FOCAL POINT & CENTER OF CURVATURE */}
              {isMirror && element.type !== 'plane-mirror' && (
                <>
                  {/* Focus F */}
                  {(() => {
                    const isConcave = element.type === 'concave-mirror';
                    const fx = isConcave ? element.x - fAbs : element.x + fAbs;
                    const fPx = cmToPxX(fx);
                    return (
                      <g
                        className="cursor-ew-resize group"
                        onMouseDown={(e) => handleMouseDown({ type: 'focal-point', side: isConcave ? 'left' : 'right' }, e)}
                      >
                        <line
                          x1={fPx}
                          y1={axisYPx - 26}
                          x2={fPx}
                          y2={axisYPx + 26}
                          stroke="#d97706"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                        <polygon
                          points={`${fPx},${axisYPx - 7} ${fPx + 7},${axisYPx} ${fPx},${axisYPx + 7} ${fPx - 7},${axisYPx}`}
                          fill="#d97706"
                          stroke="#78350f"
                          strokeWidth="2"
                        />
                        <circle
                          cx={fPx}
                          cy={axisYPx - 24}
                          r="11"
                          fill="#fef3c7"
                          stroke="#b45309"
                          strokeWidth="1.5"
                        />
                        <text
                          x={fPx}
                          y={axisYPx - 19}
                          textAnchor="middle"
                          fill="#92400e"
                          fontSize="14"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          F
                        </text>
                        <text
                          x={fPx}
                          y={axisYPx + 36}
                          textAnchor="middle"
                          fill="#92400e"
                          fontSize="13"
                          fontFamily="'Patrick Hand', cursive"
                        >
                          {fx.toFixed(1)}cm
                        </text>
                      </g>
                    );
                  })()}

                  {/* Center of Curvature C (2F) */}
                  {(() => {
                    const isConcave = element.type === 'concave-mirror';
                    const cx = isConcave ? element.x - 2 * fAbs : element.x + 2 * fAbs;
                    const cPx = cmToPxX(cx);
                    return (
                      <g key="mirror-C">
                        <circle
                          cx={cPx}
                          cy={axisYPx}
                          r="6"
                          fill="#be185d"
                          stroke="#831843"
                          strokeWidth="2"
                        />
                        <circle
                          cx={cPx}
                          cy={axisYPx - 24}
                          r="11"
                          fill="#fce7f3"
                          stroke="#be185d"
                          strokeWidth="1.5"
                        />
                        <text
                          x={cPx}
                          y={axisYPx - 19}
                          textAnchor="middle"
                          fill="#9d174d"
                          fontSize="14"
                          fontFamily="'Patrick Hand', cursive"
                          fontWeight="bold"
                        >
                          C
                        </text>
                        <text
                          x={cPx}
                          y={axisYPx + 36}
                          textAnchor="middle"
                          fill="#9d174d"
                          fontSize="13"
                          fontFamily="'Patrick Hand', cursive"
                        >
                          {cx.toFixed(1)}cm
                        </text>
                      </g>
                    );
                  })()}
                </>
              )}
            </g>
          )}

          {/* 7. PRINCIPAL RAYS MODE: FORMED IMAGE ARROW */}
          {torch.rayMode === 'principal-rays' && (
            <g className="principal-objects">
              {/* Hand-drawn Formed Image Arrow (Real or Virtual) */}
              {imageFormation && imageFormation.exists && isFinite(imageFormation.x) && (() => {
                const basePxY = axisYPx;
                const tipPxY = cmToPxY(imageFormation.height);
                const imgPxX = cmToPxX(imageFormation.x);
                const isReal = imageFormation.isReal;
                const isUpright = imageFormation.height >= 0;
                const mainColor = isReal ? '#15803d' : '#7c3aed';
                const fillColor = isReal ? '#dcfce7' : '#f3e8ff';

                return (
                  <g className="image-arrow select-none">
                    {/* Sketched Image Arrow Stem (dashed if virtual, solid if real) */}
                    <line
                      x1={imgPxX}
                      y1={basePxY}
                      x2={imgPxX}
                      y2={tipPxY}
                      stroke={mainColor}
                      strokeWidth="3.2"
                      strokeDasharray={isReal ? undefined : '5 4'}
                      strokeLinecap="round"
                    />

                    {/* Sketched Arrowhead pointing upright or inverted */}
                    <polygon
                      points={`${imgPxX},${tipPxY - (isUpright ? 10 : -10)} ${imgPxX - 6.5},${tipPxY + (isUpright ? 3 : -3)} ${imgPxX + 6.5},${tipPxY + (isUpright ? 3 : -3)}`}
                      fill={isReal ? '#22c55e' : '#c084fc'}
                      stroke={mainColor}
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />

                    {/* Handwritten Image Note Tag */}
                    <rect
                      x={imgPxX - 52}
                      y={Math.max(basePxY, tipPxY) + 14}
                      width="104"
                      height="32"
                      rx="4"
                      fill={fillColor}
                      stroke={mainColor}
                      strokeWidth="1.4"
                      className="filter drop-shadow-sm"
                    />
                    <text
                      x={imgPxX}
                      y={Math.max(basePxY, tipPxY) + 28}
                      textAnchor="middle"
                      fill={mainColor}
                      fontSize="13"
                      fontFamily="'Patrick Hand', cursive"
                      fontWeight="bold"
                    >
                      {isReal ? 'REAL IMAGE (Inverted)' : 'VIRTUAL IMAGE (Upright)'}
                    </text>
                    <text
                      x={imgPxX}
                      y={Math.max(basePxY, tipPxY) + 41}
                      textAnchor="middle"
                      fill={mainColor}
                      fontSize="12"
                      fontFamily="'Patrick Hand', cursive"
                    >
                      m = {imageFormation.magnification.toFixed(2)} · dᵢ = {imageFormation.distance > 0 ? '+' : ''}{imageFormation.distance.toFixed(1)} cm
                    </text>
                  </g>
                );
              })()}
            </g>
          )}

          {/* 8. HAND-DRAWN OPTICAL ELEMENT RENDERING */}
          <g
            className="element-group cursor-ew-resize"
            onMouseDown={(e) => handleMouseDown({ type: 'element-pos' }, e)}
          >
            {/* 1. BICONVEX LENS (Hand-sketched curved glass with converging arrows) */}
            {element.type === 'convex-lens' && (() => {
              const hPx = (element.height / viewRangeY) * canvasDim.height;
              const halfH = hPx / 2;
              const bulge = Math.min(22, 120 / (fAbs || 10));
              const topY = axisYPx - halfH;
              const botY = axisYPx + halfH;

              return (
                <g>
                  {/* Subtle glass wash */}
                  <path
                    d={`M ${elemXPx} ${topY}
                        Q ${elemXPx + bulge} ${axisYPx} ${elemXPx} ${botY}
                        Q ${elemXPx - bulge} ${axisYPx} ${elemXPx} ${topY} Z`}
                    fill="url(#lens-watercolor)"
                    stroke="#1e40af"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  {/* Sketched double stroke for hand-drawn look */}
                  <path
                    d={`M ${elemXPx} ${topY + 3}
                        Q ${elemXPx + bulge - 2} ${axisYPx} ${elemXPx} ${botY - 3}`}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                    opacity="0.8"
                  />
                  {/* Optical Center Meridian Line */}
                  <line
                    x1={elemXPx}
                    y1={topY}
                    x2={elemXPx}
                    y2={botY}
                    stroke="#1e3a8a"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  {/* Converging Textbook Arrowheads at Apex (∧ top, ∨ bot) */}
                  <path d={`M ${elemXPx - 6} ${topY + 7} L ${elemXPx} ${topY} L ${elemXPx + 6} ${topY + 7}`} stroke="#1e40af" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <path d={`M ${elemXPx - 6} ${botY - 7} L ${elemXPx} ${botY} L ${elemXPx + 6} ${botY - 7}`} stroke="#1e40af" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  {/* Handwritten label */}
                  <text
                    x={elemXPx}
                    y={topY - 8}
                    textAnchor="middle"
                    fill="#1e40af"
                    fontSize="13"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                  >
                    Convex Lens
                  </text>
                </g>
              );
            })()}

            {/* 2. BICONCAVE LENS (Hand-sketched pinched glass with diverging arrows) */}
            {element.type === 'concave-lens' && (() => {
              const hPx = (element.height / viewRangeY) * canvasDim.height;
              const halfH = hPx / 2;
              const widthHalf = 10;
              const dip = Math.min(14, 100 / (fAbs || 10));
              const topY = axisYPx - halfH;
              const botY = axisYPx + halfH;

              return (
                <g>
                  <path
                    d={`M ${elemXPx - widthHalf} ${topY}
                        L ${elemXPx + widthHalf} ${topY}
                        Q ${elemXPx + widthHalf - dip} ${axisYPx} ${elemXPx + widthHalf} ${botY}
                        L ${elemXPx - widthHalf} ${botY}
                        Q ${elemXPx - widthHalf + dip} ${axisYPx} ${elemXPx - widthHalf} ${topY} Z`}
                    fill="url(#lens-watercolor)"
                    stroke="#1e40af"
                    strokeWidth="2.2"
                  />
                  <line
                    x1={elemXPx}
                    y1={topY}
                    x2={elemXPx}
                    y2={botY}
                    stroke="#1e3a8a"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  {/* Diverging Arrowheads (inverted arrows) */}
                  <path d={`M ${elemXPx - 6} ${topY} L ${elemXPx} ${topY + 7} L ${elemXPx + 6} ${topY}`} stroke="#1e40af" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <path d={`M ${elemXPx - 6} ${botY} L ${elemXPx} ${botY - 7} L ${elemXPx + 6} ${botY}`} stroke="#1e40af" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  <text
                    x={elemXPx}
                    y={topY - 8}
                    textAnchor="middle"
                    fill="#1e40af"
                    fontSize="13"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                  >
                    Concave Lens
                  </text>
                </g>
              );
            })()}

            {/* 3. CONCAVE MIRROR (Hand-sketched curved reflective arc + 45° back silvering hatches) */}
            {element.type === 'concave-mirror' && (() => {
              const hPx = (element.height / viewRangeY) * canvasDim.height;
              const halfH = hPx / 2;
              const curve = Math.min(24, 120 / (fAbs || 10));
              const topY = axisYPx - halfH;
              const botY = axisYPx + halfH;

              return (
                <g>
                  {/* Backing 45° pencil hatch strip */}
                  <path
                    d={`M ${elemXPx - curve} ${topY}
                        Q ${elemXPx} ${axisYPx} ${elemXPx - curve} ${botY}
                        L ${elemXPx - curve + 8} ${botY}
                        Q ${elemXPx + 8} ${axisYPx} ${elemXPx - curve + 8} ${topY} Z`}
                    fill="url(#mirror-pencil-hatch)"
                  />
                  {/* Reflective front arc */}
                  <path
                    d={`M ${elemXPx - curve} ${topY} Q ${elemXPx} ${axisYPx} ${elemXPx - curve} ${botY}`}
                    stroke="#0f172a"
                    strokeWidth="3.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <text
                    x={elemXPx}
                    y={topY - 8}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="13"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                  >
                    Concave Mirror
                  </text>
                </g>
              );
            })()}

            {/* 4. CONVEX MIRROR */}
            {element.type === 'convex-mirror' && (() => {
              const hPx = (element.height / viewRangeY) * canvasDim.height;
              const halfH = hPx / 2;
              const curve = Math.min(24, 120 / (fAbs || 10));
              const topY = axisYPx - halfH;
              const botY = axisYPx + halfH;

              return (
                <g>
                  {/* Backing hatch */}
                  <path
                    d={`M ${elemXPx} ${topY}
                        Q ${elemXPx - curve} ${axisYPx} ${elemXPx} ${botY}
                        L ${elemXPx + 8} ${botY}
                        Q ${elemXPx - curve + 8} ${axisYPx} ${elemXPx + 8} ${topY} Z`}
                    fill="url(#mirror-pencil-hatch)"
                  />
                  {/* Reflective front arc (bulges left) */}
                  <path
                    d={`M ${elemXPx} ${topY} Q ${elemXPx - curve} ${axisYPx} ${elemXPx} ${botY}`}
                    stroke="#0f172a"
                    strokeWidth="3.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <text
                    x={elemXPx}
                    y={topY - 8}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="13"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                  >
                    Convex Mirror
                  </text>
                </g>
              );
            })()}

            {/* 5. PLANE MIRROR (Flat vertical line with hatched back) */}
            {element.type === 'plane-mirror' && (() => {
              const hPx = (element.height / viewRangeY) * canvasDim.height;
              const halfH = hPx / 2;
              const topY = axisYPx - halfH;
              const botY = axisYPx + halfH;

              return (
                <g>
                  {/* Backing hatched rect */}
                  <rect
                    x={elemXPx}
                    y={topY}
                    width="10"
                    height={hPx}
                    fill="url(#mirror-pencil-hatch)"
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  {/* Reflective front line */}
                  <line
                    x1={elemXPx}
                    y1={topY}
                    x2={elemXPx}
                    y2={botY}
                    stroke="#0f172a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <text
                    x={elemXPx}
                    y={topY - 8}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="13"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                  >
                    Plane Mirror
                  </text>
                </g>
              );
            })()}

            {/* 6. EQUILATERAL / APEX PRISM */}
            {element.type === 'prism' && (() => {
              const side = element.height;
              const apexAngle = (element.prismApexAngle || 60) * (Math.PI / 180);
              const halfBase = side * Math.sin(apexAngle / 2);
              const heightPrism = side * Math.cos(apexAngle / 2);

              const apexPxX = cmToPxX(element.x);
              const apexPxY = cmToPxY(heightPrism / 2);
              const leftPxX = cmToPxX(element.x - halfBase);
              const leftPxY = cmToPxY(-heightPrism / 2);
              const rightPxX = cmToPxX(element.x + halfBase);
              const rightPxY = cmToPxY(-heightPrism / 2);

              return (
                <g>
                  <polygon
                    points={`${apexPxX},${apexPxY} ${rightPxX},${rightPxY} ${leftPxX},${leftPxY}`}
                    fill="url(#lens-watercolor)"
                    stroke="#0284c7"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  {/* Apex angle arc doodle */}
                  <path
                    d={`M ${apexPxX - 10} ${apexPxY + 16} Q ${apexPxX} ${apexPxY + 20} ${apexPxX + 10} ${apexPxY + 16}`}
                    stroke="#0369a1"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <text
                    x={apexPxX}
                    y={apexPxY - 8}
                    textAnchor="middle"
                    fill="#0369a1"
                    fontSize="13"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                  >
                    Glass Prism (Apex {element.prismApexAngle || 60}°)
                  </text>
                </g>
              );
            })()}
          </g>

          {/* 9. CHARMING HAND-DRAWN FLASHLIGHT / TORCH LIGHT SOURCE DOODLE */}
          {(() => {
            const isParallel = torch.rayMode === 'parallel-array';
            const apertureCm = torch.beamAperture || 6;
            const apertureHalfPx = isParallel ? (apertureCm / 2) * (canvasDim.height / viewRangeY) : 15;
            const lensRy = Math.max(15, apertureHalfPx);
            const headTopY = -lensRy - 2;
            const headBotY = lensRy + 2;

            return (
              <g
                className="torch-source-group"
                transform={`translate(${torchXPx}, ${torchYPx}) rotate(${-torch.angle})`}
              >
                {/* Soft sketched light cone highlight emerging from front */}
                {!isParallel && torch.rayMode !== 'single-pencil' && torch.rayMode !== 'principal-rays' && torch.beamWidth > 0 && (
                  <path
                    d={`M 0 0 
                        L 140 ${-Math.tan((torch.beamWidth * Math.PI) / 360) * 140}
                        L 140 ${Math.tan((torch.beamWidth * Math.PI) / 360) * 140} Z`}
                    fill={laserColor}
                    opacity={0.16}
                    className="pointer-events-none"
                  />
                )}

                {/* Hand-drawn Flashlight Casing - Draggable Handle */}
                <g
                  className="cursor-move group"
                  onMouseDown={(e) => handleMouseDown({ type: 'torch-pos' }, e)}
                >
                  {/* Flashlight Tail Cap */}
                  <rect x="-82" y="-7" width="10" height="14" rx="3" fill="#cbd5e1" stroke="#334155" strokeWidth="1.8" />

                  {/* Flashlight Main Barrel with Hand-drawn Grip Lines */}
                  <rect x="-72" y="-9" width="38" height="18" rx="3" fill="#fde047" stroke="#334155" strokeWidth="1.8" />
                  <line x1="-64" y1="-8" x2="-64" y2="8" stroke="#ca8a04" strokeWidth="1.5" />
                  <line x1="-56" y1="-8" x2="-56" y2="8" stroke="#ca8a04" strokeWidth="1.5" />
                  <line x1="-48" y1="-8" x2="-48" y2="8" stroke="#ca8a04" strokeWidth="1.5" />
                  <line x1="-40" y1="-8" x2="-40" y2="8" stroke="#ca8a04" strokeWidth="1.5" />

                  {/* Cute Red Toggle Switch on Barrel */}
                  <rect x="-56" y="-12" width="10" height="3.5" rx="1.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />

                  {/* Tapered Collar Transition */}
                  <polygon
                    points="-34,-9 -18,-13 -18,13 -34,9"
                    fill="#fef08a"
                    stroke="#334155"
                    strokeWidth="1.8"
                  />

                  {/* Reflector Head / Collimator Housing */}
                  <polygon
                    points={`-18,-13 -5,${headTopY + 1} -5,${headBotY - 1} -18,13`}
                    fill="#e2e8f0"
                    stroke="#334155"
                    strokeWidth="1.8"
                  />

                  {/* Front Bezel Ring holding Glass Bulb */}
                  <rect
                    x="-5"
                    y={headTopY}
                    width="5"
                    height={headBotY - headTopY}
                    rx="2"
                    fill="#94a3b8"
                    stroke="#334155"
                    strokeWidth="1.8"
                  />

                  {/* Front Bulb with Radiant Glow */}
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="4"
                    ry={lensRy}
                    fill={laserColor}
                    stroke="#334155"
                    strokeWidth="1.5"
                    opacity="0.95"
                  />
                  {/* Little shiny bulb highlight */}
                  <ellipse
                    cx="-1"
                    cy="-2"
                    rx="1.5"
                    ry={Math.max(3, lensRy - 4)}
                    fill="#ffffff"
                    opacity="0.8"
                  />

                  {/* Friendly "Drag Me" hint text above flashlight */}
                  <text
                    x="-45"
                    y="-16"
                    textAnchor="middle"
                    fill="#475569"
                    fontSize="12"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                    className="select-none pointer-events-none opacity-80 group-hover:opacity-100"
                  >
                    🔦 Drag Torch
                  </text>
                </g>

                {/* Hand-drawn Rotation / Aiming Dial Handle (Hidden in principal-rays mode) */}
                {torch.rayMode !== 'principal-rays' && (
                  <g
                    className="cursor-pointer group"
                    transform="translate(26, 0)"
                    onMouseDown={(e) => handleMouseDown({ type: 'torch-rot' }, e)}
                  >
                    <circle cx="0" cy="0" r="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" className="transition-transform group-hover:scale-125" />
                    <circle cx="0" cy="0" r="2.5" fill="#854d0e" />
                    <text
                      x="0"
                      y="-10"
                      textAnchor="middle"
                      fill="#854d0e"
                      fontSize="11"
                      fontFamily="'Patrick Hand', cursive"
                      className="pointer-events-none"
                    >
                      Aim ↺
                    </text>
                  </g>
                )}
              </g>
            );
          })()}

          {/* 10. TRACED RAYS RENDERING (HAND-DRAWN INK PEN LINES & ARROWS) */}
          <g className="rays-group">
            {renderedSegments.map((seg, idx) => {
              const dPath = seg.points
                .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${cmToPxX(pt.x)} ${cmToPxY(pt.y)}`)
                .join(' ');

              const isVirt = !!seg.isVirtual;
              // Choose fountain pen color
              const inkColor = isVirt ? '#64748b' : seg.color;

              return (
                <g key={`ray-group-${idx}`}>
                  {/* Main Ink Path */}
                  <path
                    d={dPath}
                    stroke={inkColor}
                    strokeWidth={isVirt ? 1.8 : Math.max(2, (seg.width || 2))}
                    strokeDasharray={isVirt ? '5 4' : undefined}
                    strokeOpacity={isVirt ? 0.75 : 0.95}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Sketched Directional Arrows along ray segments for real rays */}
                  {!isVirt && seg.points.length >= 2 && (() => {
                    const arrows = [];
                    for (let i = 0; i < seg.points.length - 1; i++) {
                      const arrowNode = renderRayArrow(seg.points[i], seg.points[i + 1], inkColor);
                      if (arrowNode) {
                        arrows.push(<g key={`arrow-${idx}-${i}`}>{arrowNode}</g>);
                      }
                    }
                    return arrows;
                  })()}
                </g>
              );
            })}

            {/* Glowing Emitter Origin Node at Candle Tip in Principal Rays Mode */}
            {torch.rayMode === 'principal-rays' && (
              <g className="principal-emitter-anchor pointer-events-none">
                <circle cx={torchXPx} cy={torchYPx} r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              </g>
            )}
          </g>

          {/* 11. HAND-DRAWN STUDENT CALIPER / MEASURING RULER */}
          {caliper.active && (
            <g className="caliper-group">
              {caliper.p1 && (
                <g
                  className="cursor-move"
                  onMouseDown={(e) => handleMouseDown({ type: 'caliper-p1' }, e)}
                >
                  <circle cx={cmToPxX(caliper.p1.x)} cy={cmToPxY(caliper.p1.y)} r="8" fill="#10b981" stroke="#064e3b" strokeWidth="2" />
                  <text x={cmToPxX(caliper.p1.x)} y={cmToPxY(caliper.p1.y) - 12} textAnchor="middle" fill="#064e3b" fontSize="13" fontFamily="'Patrick Hand', cursive" fontWeight="bold">A</text>
                </g>
              )}
              {caliper.p2 && (
                <g
                  className="cursor-move"
                  onMouseDown={(e) => handleMouseDown({ type: 'caliper-p2' }, e)}
                >
                  <circle cx={cmToPxX(caliper.p2.x)} cy={cmToPxY(caliper.p2.y)} r="8" fill="#10b981" stroke="#064e3b" strokeWidth="2" />
                  <text x={cmToPxX(caliper.p2.x)} y={cmToPxY(caliper.p2.y) - 12} textAnchor="middle" fill="#064e3b" fontSize="13" fontFamily="'Patrick Hand', cursive" fontWeight="bold">B</text>
                </g>
              )}
              {caliper.p1 && caliper.p2 && (
                <>
                  {/* Caliper measurement line */}
                  <line
                    x1={cmToPxX(caliper.p1.x)}
                    y1={cmToPxY(caliper.p1.y)}
                    x2={cmToPxX(caliper.p2.x)}
                    y2={cmToPxY(caliper.p2.y)}
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                  {/* Sketched Measurement Note Card */}
                  <rect
                    x={(cmToPxX(caliper.p1.x) + cmToPxX(caliper.p2.x)) / 2 - 40}
                    y={(cmToPxY(caliper.p1.y) + cmToPxY(caliper.p2.y)) / 2 - 14}
                    width="80"
                    height="24"
                    rx="4"
                    fill="#ecfdf5"
                    stroke="#059669"
                    strokeWidth="1.8"
                    className="filter drop-shadow"
                  />
                  <text
                    x={(cmToPxX(caliper.p1.x) + cmToPxX(caliper.p2.x)) / 2}
                    y={(cmToPxY(caliper.p1.y) + cmToPxY(caliper.p2.y)) / 2 + 3}
                    textAnchor="middle"
                    fill="#065f46"
                    fontSize="13"
                    fontFamily="'Patrick Hand', cursive"
                    fontWeight="bold"
                  >
                    📏 {caliper.distanceCm?.toFixed(1)} cm
                  </text>
                </>
              )}
            </g>
          )}
        </svg>

        {/* Floating Student Sticky Note in Bottom Left Corner */}
        <div className="absolute bottom-3 left-6 pointer-events-none flex flex-wrap items-center gap-2 font-hand text-sm z-20">
          <div className="bg-[#fef9c3] border-2 border-[#ca8a04] px-3 py-1.5 rounded-sm shadow-[2px_2px_0px_rgba(202,138,4,0.3)] text-amber-950 flex items-center gap-2">
            <span>📌</span>
            <span className="font-bold">Object:</span>
            <span>dₒ = {Math.abs(element.x - torch.x).toFixed(1)} cm</span>
            {imageFormation && imageFormation.exists && (
              <>
                <span className="text-amber-600">|</span>
                <span className="font-bold">Image:</span>
                <span className={imageFormation.isReal ? 'text-green-800 font-bold' : 'text-purple-800 font-bold'}>
                  dᵢ = {imageFormation.distance > 0 ? '+' : ''}{imageFormation.distance.toFixed(1)} cm ({imageFormation.isReal ? 'Real, Inverted' : 'Virtual, Upright'}, m = {imageFormation.magnification.toFixed(2)})
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
