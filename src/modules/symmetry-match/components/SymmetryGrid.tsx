import React from 'react';
import { Coordinate, GridBlock, MirrorAxis, SymmetryType, LineSegment } from '../types';

interface SymmetryGridProps {
  id: string;
  gridSize: number;
  blocks?: GridBlock[];
  polygonPoints?: Coordinate[];
  polygonColor?: string;
  mirrorAxis?: MirrorAxis;
  showCoordinates?: boolean;
  interactive?: boolean;
  onCellClick?: (x: number, y: number) => void;
  title?: string;
  badge?: string;
  isCorrectShadow?: boolean;
  isIncorrectShadow?: boolean;
  
  // Custom Line Drawing props
  lineSegments?: LineSegment[];
  activeVertex?: Coordinate | null;
  hoveredVertex?: Coordinate | null;
  interactiveLineDrawing?: boolean;
  onVertexClick?: (pt: Coordinate) => void;
  onVertexHover?: (pt: Coordinate | null) => void;
}

export default function SymmetryGrid({
  id,
  gridSize,
  blocks = [],
  polygonPoints = [],
  polygonColor = '#3b82f6',
  mirrorAxis,
  showCoordinates = true,
  interactive = false,
  onCellClick,
  title,
  badge,
  isCorrectShadow = false,
  isIncorrectShadow = false,
  
  // Custom Line Drawing props
  lineSegments = [],
  activeVertex = null,
  hoveredVertex = null,
  interactiveLineDrawing = false,
  onVertexClick,
  onVertexHover,
}: SymmetryGridProps) {
  // Local state for tracking hover coordinates in highly-performant way
  const [localHoveredVertex, setLocalHoveredVertex] = React.useState<Coordinate | null>(null);

  // Dimension parameters for SVG
  const padding = 30; // space for coordinates/labels
  const cellSize = 40;
  const size = gridSize * cellSize;
  const svgWidth = size + padding * 2;
  const svgHeight = size + padding * 2;

  // Render cells for SVG background
  const gridLines = [];
  for (let i = 0; i <= gridSize; i++) {
    // Vertical lines
    gridLines.push(
      <line
        key={`v-${i}`}
        id={`${id}-grid-line-v-${i}`}
        x1={padding + i * cellSize}
        y1={padding}
        x2={padding + i * cellSize}
        y2={padding + size}
        stroke="#f1f5f9"
        strokeWidth={1}
      />
    );
    // Horizontal lines
    gridLines.push(
      <line
        key={`h-${i}`}
        id={`${id}-grid-line-h-${i}`}
        x1={padding}
        y1={padding + i * cellSize}
        x2={padding + size}
        y2={padding + i * cellSize}
        stroke="#f1f5f9"
        strokeWidth={1}
      />
    );
  }

  // Draw axis coordinates labels (0, 1, 2, ... N)
  const coordLabels = [];
  if (showCoordinates) {
    for (let i = 0; i <= gridSize; i++) {
      // X labels (on bottom)
      coordLabels.push(
        <text
          key={`lbl-x-${i}`}
          id={`${id}-label-x-${i}`}
          x={padding + i * cellSize}
          y={padding + size + 20}
          textAnchor="middle"
          className="font-mono text-[10px] font-bold fill-slate-400 select-none"
        >
          {i}
        </text>
      );
      // Y labels (on left, inverted so 0 is at bottom, matching standard quadrant coordinates!)
      // Note: SVG 0 is at top, but in middle school geometry, (0,0) is bottom-left. Let's invert y-axis display so (0,0) is bottom-left!
      coordLabels.push(
        <text
          key={`lbl-y-${i}`}
          id={`${id}-label-y-${i}`}
          x={padding - 15}
          y={padding + (gridSize - i) * cellSize + 4}
          textAnchor="end"
          className="font-mono text-[10px] font-bold fill-slate-400 select-none"
        >
          {i}
        </text>
      );
    }
  }

  // Convert logical coordinates to SVG pixels
  const getSvgX = (x: number) => padding + x * cellSize;
  const getSvgY = (y: number) => {
    // Invert Y so that 0 is bottom
    return padding + (gridSize - y) * cellSize;
  };

  // Render individual block squares
  const blockElements = blocks.map((block, index) => {
    // Block coordinates (x, y) represent top-left of standard Cartesian grid, which spans from x to x+1, y to y+1.
    // SVG coordinates:
    const blockX = getSvgX(block.x) + 2;
    const blockY = getSvgY(block.y + 1) + 2; // block.y Cartesian has its base at block.y, top at block.y+1
    const side = cellSize - 4;

    return (
      <g key={`blk-${index}`} id={`${id}-block-g-${index}`}>
        <rect
          id={`${id}-block-rect-${index}`}
          x={blockX}
          y={blockY}
          width={side}
          height={side}
          rx={6}
          fill={block.color}
          className="transition-all duration-300 shadow-sm"
        />
        {/* Subtle grid pattern inside blocks */}
        <rect
          x={blockX + 2}
          y={blockY + 2}
          width={side - 4}
          height={side - 4}
          rx={4}
          fill="none"
          stroke="white"
          strokeOpacity={0.15}
          strokeWidth={1.5}
        />
      </g>
    );
  });

  // Render polygon points and lines
  let polygonElement = null;
  let vertexMarkerElements: React.ReactNode[] = [];

  if (polygonPoints.length > 0) {
    const pointsString = polygonPoints
      .map((p) => `${getSvgX(p.x)},${getSvgY(p.y)}`)
      .join(' ');

    polygonElement = (
      <polygon
        id={`${id}-polygon`}
        points={pointsString}
        fill={polygonColor}
        fillOpacity={0.25}
        stroke={polygonColor}
        strokeWidth={3}
        strokeLinejoin="round"
        className="transition-all duration-500"
      />
    );

    // Circle markers at vertices
    vertexMarkerElements = polygonPoints.map((pt, index) => {
      const cx = getSvgX(pt.x);
      const cy = getSvgY(pt.y);
      return (
        <g key={`vtx-${index}`} id={`${id}-vertex-g-${index}`}>
          <circle
            id={`${id}-vertex-outer-${index}`}
            cx={cx}
            cy={cy}
            r={6}
            fill="#ffffff"
            stroke={polygonColor}
            strokeWidth={2}
          />
          <circle
            id={`${id}-vertex-inner-${index}`}
            cx={cx}
            cy={cy}
            r={3}
            fill={polygonColor}
          />
          {/* Coordinate label text above vertex */}
          <text
            id={`${id}-vertex-coords-${index}`}
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            className="font-mono text-[10px] font-bold fill-gray-700 bg-white px-1 select-none"
          >
            ({pt.x},{pt.y})
          </text>
        </g>
      );
    });
  }

  // Render mirror axis line
  let mirrorLineElement = null;
  if (mirrorAxis) {
    const { type, coordinateValue } = mirrorAxis;
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

    const isFractional = coordinateValue % 1 !== 0;
    const visualValue = isFractional ? coordinateValue + 0.5 : coordinateValue;

    if (type === 'vertical') {
      x1 = getSvgX(visualValue);
      y1 = padding - 10;
      x2 = x1;
      y2 = padding + size + 10;
    } else if (type === 'horizontal') {
      x1 = padding - 10;
      y1 = getSvgY(visualValue);
      x2 = padding + size + 10;
      y2 = y1;
    } else if (type === 'diagonal-up') {
      // y = x line, from (0,0) bottom-left to (gridSize, gridSize) top-right
      x1 = getSvgX(0);
      y1 = getSvgY(0);
      x2 = getSvgX(gridSize);
      y2 = getSvgY(gridSize);
    } else if (type === 'diagonal-down') {
      // y = gridSize - x, from (0, gridSize) top-left to (gridSize, 0) bottom-right
      x1 = getSvgX(0);
      y1 = getSvgY(gridSize);
      x2 = getSvgX(gridSize);
      y2 = getSvgY(0);
    }

    mirrorLineElement = (
      <g id={`${id}-mirror-g`} className="pointer-events-none">
        {/* Glow backdrop for mirror */}
        <line
          id={`${id}-mirror-glow`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#f43f5e"
          strokeWidth={8}
          strokeLinecap="round"
          strokeOpacity={0.2}
        />
        {/* Actual mirror line */}
        <line
          id={`${id}-mirror-main`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#f43f5e"
          strokeWidth={3.5}
          strokeDasharray="6,4"
          strokeLinecap="round"
        />
        {/* Label badge for mirror */}
        <g transform={`translate(${x2 - 10}, ${y2 - 10})`}>
          {/* Label is rendered cleanly in UI header, but let's draw mirror indicator */}
          <circle r={10} fill="#f43f5e" />
          <path
            d="M-4 -4 L4 4 M-4 4 L4 -4"
            stroke="white"
            strokeWidth={1.5}
          />
        </g>
      </g>
    );
  }

  // Handle cell click & vertex clicks with precise scale-aware calculations
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Convert client coordinates to responsive viewBox coordinates
    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;

    const viewBoxX = (e.clientX - rect.left) * scaleX;
    const viewBoxY = (e.clientY - rect.top) * scaleY;

    if (interactiveLineDrawing) {
      // Find fractional grid coordinates
      const rawX = (viewBoxX - padding) / cellSize;
      const rawY = gridSize - (viewBoxY - padding) / cellSize;

      const roundedX = Math.round(rawX);
      const roundedY = Math.round(rawY);

      if (roundedX >= 0 && roundedX <= gridSize && roundedY >= 0 && roundedY <= gridSize) {
        // Calculate coordinate physical distance
        const vertexX = padding + roundedX * cellSize;
        const vertexY = padding + (gridSize - roundedY) * cellSize;

        const dx = viewBoxX - vertexX;
        const dy = viewBoxY - vertexY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const snapThreshold = cellSize * 0.45;
        if (dist <= snapThreshold && onVertexClick) {
          onVertexClick({ x: roundedX, y: roundedY });
        }
      }
    } else if (interactive && onCellClick) {
      // Block painting mode
      const innerX = viewBoxX - padding;
      const innerY = viewBoxY - padding;

      if (innerX >= 0 && innerX <= size && innerY >= 0 && innerY <= size) {
        const cellX = Math.floor(innerX / cellSize);
        const cellY = gridSize - 1 - Math.floor(innerY / cellSize);
        onCellClick(cellX, cellY);
      }
    }
  };

  // Move-listener on SVG to update hovered vertex state with zero latency
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactiveLineDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const scaleX = svgWidth / rect.width;
    const scaleY = svgHeight / rect.height;

    const viewBoxX = (e.clientX - rect.left) * scaleX;
    const viewBoxY = (e.clientY - rect.top) * scaleY;

    const rawX = (viewBoxX - padding) / cellSize;
    const rawY = gridSize - (viewBoxY - padding) / cellSize;

    const roundedX = Math.round(rawX);
    const roundedY = Math.round(rawY);

    if (roundedX >= 0 && roundedX <= gridSize && roundedY >= 0 && roundedY <= gridSize) {
      const vertexX = padding + roundedX * cellSize;
      const vertexY = padding + (gridSize - roundedY) * cellSize;

      const dx = viewBoxX - vertexX;
      const dy = viewBoxY - vertexY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const snapThreshold = cellSize * 0.45;
      if (dist <= snapThreshold) {
        const nextHovered = { x: roundedX, y: roundedY };
        if (!localHoveredVertex || localHoveredVertex.x !== roundedX || localHoveredVertex.y !== roundedY) {
          setLocalHoveredVertex(nextHovered);
          if (onVertexHover) {
            onVertexHover(nextHovered);
          }
        }
        return;
      }
    }

    if (localHoveredVertex !== null) {
      setLocalHoveredVertex(null);
      if (onVertexHover) {
        onVertexHover(null);
      }
    }
  };

  const handleSvgMouseLeave = () => {
    if (localHoveredVertex !== null) {
      setLocalHoveredVertex(null);
      if (onVertexHover) {
        onVertexHover(null);
      }
    }
  };

  // Render custom line segments
  const lineSegmentElements = (lineSegments || []).map((seg) => {
    const x1 = getSvgX(seg.start.x);
    const y1 = getSvgY(seg.start.y);
    const x2 = getSvgX(seg.end.x);
    const y2 = getSvgY(seg.end.y);

    return (
      <line
        key={`seg-${seg.id}`}
        id={`seg-${seg.id}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={seg.color}
        strokeWidth={4.5}
        strokeLinecap="round"
        className="transition-all duration-300 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.12)]"
      />
    );
  });

  // Render dashed active preview line
  let previewLineElement = null;
  const currentHovered = hoveredVertex || localHoveredVertex;
  if (interactiveLineDrawing && activeVertex && currentHovered) {
    const x1 = getSvgX(activeVertex.x);
    const y1 = getSvgY(activeVertex.y);
    const x2 = getSvgX(currentHovered.x);
    const y2 = getSvgY(currentHovered.y);

    previewLineElement = (
      <line
        id={`${id}-preview-line`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#4f46e5"
        strokeWidth={3}
        strokeDasharray="5,4"
        strokeOpacity={0.6}
        className="pointer-events-none"
      />
    );
  }

  // Render intersection vertices as static visual guides with absolute zero event handler overhead
  const vertexDots: React.ReactNode[] = [];
  if (interactiveLineDrawing) {
    const currentHovered = hoveredVertex || localHoveredVertex;
    for (let x = 0; x <= gridSize; x++) {
      for (let y = 0; y <= gridSize; y++) {
        const cx = getSvgX(x);
        const cy = getSvgY(y);
        const isHovered = currentHovered && currentHovered.x === x && currentHovered.y === y;
        const isActive = activeVertex && activeVertex.x === x && activeVertex.y === y;

        vertexDots.push(
          <circle
            key={`dot-${x}-${y}`}
            id={`${id}-dot-${x}-${y}`}
            cx={cx}
            cy={cy}
            r={isActive ? 6 : isHovered ? 5.5 : 3}
            fill={isActive ? '#4f46e5' : isHovered ? '#6366f1' : '#cbd5e1'}
            className="transition-all duration-100 pointer-events-none"
          />
        );
      }
    }
  }

  // Classes for conditional correct/incorrect answer states
  let borderClass = 'border-slate-200 bg-white';
  if (isCorrectShadow) {
    borderClass = 'border-emerald-500 ring-4 ring-emerald-100 bg-emerald-50/10';
  } else if (isIncorrectShadow) {
    borderClass = 'border-rose-500 ring-4 ring-rose-100 bg-rose-50/10';
  } else if (interactive) {
    borderClass = 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/5';
  }

  return (
    <div
      id={`${id}-card-container`}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 shadow-sm ${borderClass}`}
    >
      {/* Title / Badge Overlay */}
      {(title || badge) && (
        <div className="w-full flex items-center justify-between mb-3 px-1 select-none">
          {title && (
            <span className="font-display font-extrabold text-xs text-slate-700 uppercase tracking-wider">
              {title}
            </span>
          )}
          {badge && (
            <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/50 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        id={`${id}-svg`}
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        onClick={handleSvgClick}
        onMouseMove={handleSvgMouseMove}
        onMouseLeave={handleSvgMouseLeave}
        className={`max-w-[320px] h-auto ${interactive || interactiveLineDrawing ? 'cursor-pointer' : ''}`}
      >
        {/* Background Grid Cells */}
        {gridLines}

        {/* Labels & Coordinates */}
        {coordLabels}

        {/* The Shapes / Polyominoes */}
        {blockElements}

        {/* Polygons */}
        {polygonElement}
        {vertexMarkerElements}

        {/* Mirror Line */}
        {mirrorLineElement}

        {/* Drawn Snapping Line Segments */}
        {lineSegmentElements}

        {/* Dynamic Draw Preview Line */}
        {previewLineElement}

        {/* Snapping Vertex Points Dots */}
        {vertexDots}
      </svg>
    </div>
  );
}
