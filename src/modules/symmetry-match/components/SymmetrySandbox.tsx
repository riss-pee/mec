import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Paintbrush,
  Sparkles,
  Trash2,
  HelpCircle,
  CheckCircle,
  XCircle,
  Bookmark,
  RefreshCw,
  Sliders,
  Grid,
} from 'lucide-react';
import { GridBlock, SymmetryType, MirrorAxis, PlayerStats, LineSegment, Coordinate } from '../types';
import { areBlocksSymmetric, areSegmentsSymmetric, reflectBlock, reflectPoint } from '../utils/geometry';
import SymmetryGrid from './SymmetryGrid';
import { useLanguage } from '../i18n';

interface SymmetrySandboxProps {
  stats: PlayerStats;
  updateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
}

const PALETTE_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
];

export default function SymmetrySandbox({ stats, updateStats }: SymmetrySandboxProps) {
  const { language, t } = useLanguage();

  // Sandbox state
  const [gridSize, setGridSize] = useState<number>(8);
  const [blocks, setBlocks] = useState<GridBlock[]>([]);
  const [activeColor, setActiveColor] = useState<string>('#3b82f6');
  const [mirrorAxisType, setMirrorAxisType] = useState<SymmetryType>('vertical');

  // Snapped Line Drawer state
  const [activeTool, setActiveTool] = useState<'line' | 'block'>('line');
  const [lineSegments, setLineSegments] = useState<LineSegment[]>([]);
  const [activeVertex, setActiveVertex] = useState<Coordinate | null>(null);

  // Mode:
  // 'auto-reflect' = drawing on one side instantly mirrors to the other
  // 'solve' = drawing on Side A, user has to manually draw on Side B and test symmetry
  const [sandboxMode, setSandboxMode] = useState<'auto-reflect' | 'solve'>('auto-reflect');
  const [solveState, setSolveState] = useState<'drawing' | 'correct' | 'incorrect'>('drawing');
  const [isSymmetricResult, setIsSymmetricResult] = useState<boolean | null>(null);

  // Derive the mirror axis parameter
  const getMirrorAxis = (): MirrorAxis => {
    const isLineTool = activeTool === 'line';
    const coordinateValue = isLineTool ? (gridSize / 2) : ((gridSize - 1) / 2);
    let label = 'Vertical Axis';
    switch (mirrorAxisType) {
      case 'vertical':
        label = `Vertical Mirror (x = ${isLineTool ? coordinateValue : coordinateValue + 0.5})`;
        break;
      case 'horizontal':
        label = `Horizontal Mirror (y = ${isLineTool ? coordinateValue : coordinateValue + 0.5})`;
        break;
      case 'diagonal-up':
        label = 'Diagonal (y = x)';
        break;
      case 'diagonal-down':
        label = 'Diagonal (y = -x)';
        break;
    }
    return {
      type: mirrorAxisType,
      coordinateValue,
      label,
    };
  };

  const axisInfo = getMirrorAxis();

  // Reset grid when grid size, axis, mode or tool changes
  useEffect(() => {
    handleClear();
  }, [gridSize, mirrorAxisType, sandboxMode, activeTool]);

  const handleClear = () => {
    setBlocks([]);
    setLineSegments([]);
    setActiveVertex(null);
    setSolveState('drawing');
    setIsSymmetricResult(null);
  };

  // Check if a block belongs to Side A (Primary drawing side)
  const isSideA = (x: number, y: number): boolean => {
    const mid = (gridSize - 1) / 2;
    switch (mirrorAxisType) {
      case 'vertical':
        return x < mid;
      case 'horizontal':
        return y > mid; // Top half in Cartesian
      case 'diagonal-up':
        return y > x; // Upper-left triangle
      case 'diagonal-down':
        return x + y < gridSize - 1; // Upper-left quadrant
      default:
        return true;
    }
  };

  // Check if a vertex coordinate is strictly on Side A
  const isVertexSideA = (x: number, y: number): boolean => {
    const val = axisInfo.coordinateValue;
    switch (mirrorAxisType) {
      case 'vertical':
        return x < val;
      case 'horizontal':
        return y > val;
      case 'diagonal-up':
        return y > x;
      case 'diagonal-down':
        return x + y < gridSize;
      default:
        return true;
    }
  };

  // Check if a vertex coordinate is strictly on Side B
  const isVertexSideB = (x: number, y: number): boolean => {
    if (isVertexSideA(x, y)) return false;
    const ref = reflectPoint({ x, y }, mirrorAxisType, axisInfo.coordinateValue, gridSize);
    const isOnAxis = ref.x === x && ref.y === y;
    return !isOnAxis;
  };

  const handleCellClick = (x: number, y: number) => {
    setSolveState('drawing');
    setIsSymmetricResult(null);

    const existingIndex = blocks.findIndex((b) => b.x === x && b.y === y);

    if (sandboxMode === 'auto-reflect') {
      const reflected = reflectBlock({ x, y, color: activeColor }, mirrorAxisType, axisInfo.coordinateValue, gridSize);
      const isAxisCell = reflected.x === x && reflected.y === y;

      if (existingIndex > -1) {
        // Remove both
        setBlocks((prev) =>
          prev.filter(
            (b) => !(b.x === x && b.y === y) && !(b.x === reflected.x && b.y === reflected.y)
          )
        );
      } else {
        // Add both
        setBlocks((prev) => {
          const cleaned = prev.filter(
            (b) => !(b.x === x && b.y === y) && !(b.x === reflected.x && b.y === reflected.y)
          );
          if (isAxisCell) {
            return [...cleaned, { x, y, color: activeColor }];
          } else {
            return [
              ...cleaned,
              { x, y, color: activeColor },
              { x: reflected.x, y: reflected.y, color: activeColor },
            ];
          }
        });
      }
    } else {
      // 'solve' Mode
      if (existingIndex > -1) {
        setBlocks((prev) => prev.filter((b) => !(b.x === x && b.y === y)));
      } else {
        setBlocks((prev) => [...prev, { x, y, color: activeColor }]);
      }
    }
  };

  // Handle vertex dot click in line drawing mode
  const handleVertexClick = (pt: Coordinate) => {
    setSolveState('drawing');
    setIsSymmetricResult(null);

    if (!activeVertex) {
      setActiveVertex(pt);
    } else {
      // If same point is clicked, deselect active vertex
      if (activeVertex.x === pt.x && activeVertex.y === pt.y) {
        setActiveVertex(null);
        return;
      }

      const start = activeVertex;
      const end = pt;

      const existingSegIndex = lineSegments.findIndex(
        (s) =>
          (s.start.x === start.x && s.start.y === start.y && s.end.x === end.x && s.end.y === end.y) ||
          (s.start.x === end.x && s.start.y === end.y && s.end.x === start.x && s.end.y === end.y)
      );

      if (existingSegIndex > -1) {
        // Erase line segment (and reflection if auto-reflect)
        const segToRemove = lineSegments[existingSegIndex];
        if (sandboxMode === 'auto-reflect') {
          const startRef = reflectPoint(segToRemove.start, mirrorAxisType, axisInfo.coordinateValue, gridSize);
          const endRef = reflectPoint(segToRemove.end, mirrorAxisType, axisInfo.coordinateValue, gridSize);

          setLineSegments((prev) =>
            prev.filter(
              (s) =>
                !(s.start.x === segToRemove.start.x && s.start.y === segToRemove.start.y && s.end.x === segToRemove.end.x && s.end.y === segToRemove.end.y) &&
                !(s.start.x === segToRemove.end.x && s.start.y === segToRemove.end.y && s.end.x === segToRemove.start.x && s.end.y === segToRemove.start.y) &&
                !(s.start.x === startRef.x && s.start.y === startRef.y && s.end.x === endRef.x && s.end.y === endRef.y) &&
                !(s.start.x === endRef.x && s.start.y === endRef.y && s.end.x === startRef.x && s.end.y === startRef.y)
            )
          );
        } else {
          setLineSegments((prev) => prev.filter((_, idx) => idx !== existingSegIndex));
        }
      } else {
        // Draw new segment
        const newSeg: LineSegment = {
          id: `line_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          start,
          end,
          color: activeColor,
        };

        if (sandboxMode === 'auto-reflect') {
          const startReflected = reflectPoint(start, mirrorAxisType, axisInfo.coordinateValue, gridSize);
          const endReflected = reflectPoint(end, mirrorAxisType, axisInfo.coordinateValue, gridSize);

          const isSame =
            (start.x === startReflected.x && start.y === startReflected.y && end.x === endReflected.x && end.y === endReflected.y) ||
            (start.x === endReflected.x && start.y === endReflected.y && end.x === startReflected.x && end.y === startReflected.y);

          if (isSame) {
            setLineSegments((prev) => [...prev, newSeg]);
          } else {
            const refSeg: LineSegment = {
              id: `line_${Date.now()}_ref_${Math.random().toString(36).substr(2, 9)}`,
              start: startReflected,
              end: endReflected,
              color: activeColor,
            };
            setLineSegments((prev) => [...prev, newSeg, refSeg]);
          }
        } else {
          setLineSegments((prev) => [...prev, newSeg]);
        }
      }

      // Continuously chain lines for super fluid drawing!
      setActiveVertex(pt);
    }
  };

  // Generate a random asymmetric starting pattern on Side A
  const handleGenerateSideA = () => {
    handleClear();

    if (activeTool === 'line') {
      const count = 3 + Math.floor(Math.random() * 3); // 3 to 5 segments
      const newSegs: LineSegment[] = [];

      // Collect available vertices on Side A
      const sideAVertices: Coordinate[] = [];
      for (let x = 0; x <= gridSize; x++) {
        for (let y = 0; y <= gridSize; y++) {
          if (isVertexSideA(x, y)) {
            sideAVertices.push({ x, y });
          }
        }
      }

      if (sideAVertices.length < 3) return;

      let currentStart = sideAVertices[Math.floor(Math.random() * sideAVertices.length)];
      for (let i = 0; i < count; i++) {
        const neighbors = sideAVertices.filter((v) => {
          const dx = Math.abs(v.x - currentStart.x);
          const dy = Math.abs(v.y - currentStart.y);
          const isSelf = dx === 0 && dy === 0;
          return !isSelf && dx <= 2 && dy <= 2;
        });

        if (neighbors.length > 0) {
          const nextEnd = neighbors[Math.floor(Math.random() * neighbors.length)];
          newSegs.push({
            id: `line_rand_${i}_${Date.now()}`,
            start: currentStart,
            end: nextEnd,
            color: PALETTE_COLORS[Math.floor(Math.random() * PALETTE_COLORS.length)],
          });
          if (Math.random() > 0.4) {
            currentStart = nextEnd;
          } else {
            currentStart = sideAVertices[Math.floor(Math.random() * sideAVertices.length)];
          }
        }
      }
      setLineSegments(newSegs);
    } else {
      const count = 3 + Math.floor(Math.random() * 4);
      const newBlocks: GridBlock[] = [];
      const usedKeys = new Set<string>();

      for (let i = 0; i < count; i++) {
        let x = 0;
        let y = 0;
        let attempts = 0;

        while (attempts < 100) {
          x = Math.floor(Math.random() * gridSize);
          y = Math.floor(Math.random() * gridSize);
          if (isSideA(x, y) && !usedKeys.has(`${x},${y}`)) {
            usedKeys.add(`${x},${y}`);
            newBlocks.push({
              x,
              y,
              color: PALETTE_COLORS[Math.floor(Math.random() * PALETTE_COLORS.length)],
            });
            break;
          }
          attempts++;
        }
      }
      setBlocks(newBlocks);
    }
  };

  // Solve mode: check if Side A and Side B are mathematically symmetric
  const handleCheckSymmetry = () => {
    if (activeTool === 'line') {
      const segsA = lineSegments.filter((s) => isVertexSideA(s.start.x, s.start.y) || isVertexSideA(s.end.x, s.end.y));
      const segsB = lineSegments.filter((s) => isVertexSideB(s.start.x, s.start.y) || isVertexSideB(s.end.x, s.end.y));

      if (segsA.length === 0) {
        alert(t('alertDrawReferenceLines'));
        return;
      }

      const symmetric = areSegmentsSymmetric(
        segsA,
        segsB,
        mirrorAxisType,
        axisInfo.coordinateValue,
        gridSize
      );

      setIsSymmetricResult(symmetric);
      setSolveState(symmetric ? 'correct' : 'incorrect');

      if (symmetric) {
        updateStats((prev) => ({
          ...prev,
          score: prev.score + 150,
        }));
      }
    } else {
      // Separate blocks into Side A and Side B
      const blocksA = blocks.filter((b) => isSideA(b.x, b.y));
      const blocksB = blocks.filter((b) => !isSideA(b.x, b.y));

      if (blocksA.length === 0) {
        alert(t('alertDrawReferenceBlocks'));
        return;
      }

      const symmetric = areBlocksSymmetric(
        blocksA,
        blocksB,
        mirrorAxisType,
        axisInfo.coordinateValue,
        gridSize
      );

      setIsSymmetricResult(symmetric);
      setSolveState(symmetric ? 'correct' : 'incorrect');

      if (symmetric) {
        updateStats((prev) => ({
          ...prev,
          score: prev.score + 150,
        }));
      }
    }
  };

  // Save the current canvas pattern to local gallery
  const handleSaveToGallery = () => {
    if (activeTool === 'block' && blocks.length === 0) {
      alert(t('alertEmptyGrid'));
      return;
    }
    if (activeTool === 'line' && lineSegments.length === 0) {
      alert(t('alertEmptyLine'));
      return;
    }

    updateStats((prev) => {
      const saves = prev.sandboxSaves || [];
      const newSave = {
        id: `save_${Date.now()}`,
        timestamp: Date.now(),
        gridSize,
        blocks: activeTool === 'block' ? blocks : [],
        lineSegments: activeTool === 'line' ? lineSegments : [],
        activeTool,
        axis: mirrorAxisType,
      };
      return {
        ...prev,
        sandboxSaves: [newSave, ...saves].slice(0, 12),
      };
    });

    alert(t('alertSavedGallery'));
  };

  // Load a saved pattern from gallery
  const handleLoadSave = (save: any) => {
    setGridSize(save.gridSize);
    setMirrorAxisType(save.axis);
    setBlocks(save.blocks || []);
    setLineSegments(save.lineSegments || []);
    setActiveTool(save.activeTool || (save.blocks && save.blocks.length > 0 ? 'block' : 'line'));
    setSolveState('drawing');
    setIsSymmetricResult(null);
  };

  return (
    <motion.div
      id="symmetry-sandbox-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* LEFT SIDEBAR: TOOLBOX AND OPTIONS */}
      <div id="sandbox-toolbox-panel" className="lg:col-span-4 flex flex-col gap-5">
        {/* MODE CONTROLS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 select-none">
          <div>
            <h2 className="font-display font-extrabold text-base text-slate-800 flex items-center gap-2 uppercase tracking-tight">
              <Sliders className="w-5 h-5 text-indigo-600" />
              {t('sandboxControlsTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t('sandboxControlsDesc')}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              id="btn-sandbox-mode-auto"
              onClick={() => setSandboxMode('auto-reflect')}
              className={`py-2 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                sandboxMode === 'auto-reflect'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('autoMirrorModeBtn')}
            </button>
            <button
              id="btn-sandbox-mode-solve"
              onClick={() => setSandboxMode('solve')}
              className={`py-2 text-xs font-display font-bold uppercase tracking-wider rounded-lg transition-all ${
                sandboxMode === 'solve'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('puzzleModeBtn')}
            </button>
          </div>

          {/* Grid Size Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('gridScaleLabel')}</label>
            <div className="grid grid-cols-3 gap-2">
              {[6, 8, 10].map((size) => (
                <button
                  key={size}
                  id={`btn-sandbox-gridsize-${size}`}
                  onClick={() => setGridSize(size)}
                  className={`py-2 rounded-lg text-xs font-display font-bold border transition-all ${
                    gridSize === size
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {size} x {size}
                </button>
              ))}
            </div>
          </div>

          {/* Mirror Axis Selection - Mathematical axis names preserved */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">{t('mirrorAxisLabel')}</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'vertical', label: 'Vertical Line' },
                { type: 'horizontal', label: 'Horizontal Line' },
                { type: 'diagonal-up', label: 'Diagonal (y = x)' },
                { type: 'diagonal-down', label: 'Diagonal (-y = x)' },
              ].map((ax) => (
                <button
                  key={ax.type}
                  id={`btn-sandbox-axis-${ax.type}`}
                  onClick={() => setMirrorAxisType(ax.type as SymmetryType)}
                  className={`py-2 px-3 rounded-lg text-xs font-display font-bold border text-center transition-all ${
                    mirrorAxisType === ax.type
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {ax.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BRUSH AND COLOR PICKER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 select-none">
          <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Paintbrush className="w-4.5 h-4.5 text-indigo-600" />
            {t('drawingToolPaletteTitle')}
          </h3>

          {/* Snapped Line Drawer vs. Block Painter Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl">
            <button
              id="btn-tool-line"
              onClick={() => {
                setActiveTool('line');
                handleClear();
              }}
              className={`py-2 px-3 text-[11px] font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTool === 'line'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 rotate-45" />
              {t('toolLineDrawer')}
            </button>
            <button
              id="btn-tool-block"
              onClick={() => {
                setActiveTool('block');
                handleClear();
              }}
              className={`py-2 px-3 text-[11px] font-display font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTool === 'block'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              {t('toolBlockPainter')}
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {PALETTE_COLORS.map((col) => (
              <button
                key={col}
                id={`btn-sandbox-color-${col.replace('#', '')}`}
                onClick={() => setActiveColor(col)}
                className={`w-9 h-9 rounded-full relative transition-all duration-200 hover:scale-110 active:scale-95 ${
                  activeColor === col ? 'ring-4 ring-indigo-100 scale-105 shadow-sm' : 'border border-slate-200'
                }`}
                style={{ backgroundColor: col }}
              >
                {activeColor === col && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SAVED SYMMETRIES GALLERY */}
        {stats.sandboxSaves && stats.sandboxSaves.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2 select-none">
              <Bookmark className="w-4.5 h-4.5 text-amber-500 fill-amber-100" />
              {t('symmetryGalleryTitle')}
            </h3>

            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
              {stats.sandboxSaves.map((save) => (
                <button
                  key={save.id}
                  id={`btn-load-gallery-${save.id}`}
                  onClick={() => handleLoadSave(save)}
                  className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all text-left"
                >
                  <div className="flex items-center gap-2 select-none">
                    <Grid className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-tight">
                        {save.gridSize}x{save.gridSize} - {save.axis}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(save.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {save.activeTool === 'line'
                      ? t('linesCount', { count: save.lineSegments?.length || 0 })
                      : t('blocksCount', { count: save.blocks?.length || 0 })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT WORKSPACE: ACTIVE CANVAS DRAW AREA */}
      <div id="sandbox-grid-workspace" className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[450px]">
          {/* Header instructions */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6 select-none">
            <div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-slate-200 ${
                sandboxMode === 'auto-reflect' ? 'bg-indigo-50 text-indigo-600 border-indigo-100/50' : 'bg-amber-50 text-amber-700 border-amber-100/50'
              }`}>
                {sandboxMode === 'auto-reflect' ? t('autoMirrorBanner') : t('solverBanner')}
              </span>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                {sandboxMode === 'auto-reflect'
                  ? activeTool === 'line'
                    ? t('autoMirrorLineInst')
                    : t('autoMirrorBlockInst')
                  : activeTool === 'line'
                    ? t('solverLineInst')
                    : t('solverBlockInst')}
              </p>
            </div>

            <div className="flex gap-2">
              {sandboxMode === 'solve' && (
                <button
                  id="btn-sandbox-randomize-side-a"
                  onClick={handleGenerateSideA}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg border border-indigo-100 text-indigo-600 bg-indigo-50/30 hover:bg-indigo-50 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t('generatePatternBtn')}
                </button>
              )}
              <button
                id="btn-sandbox-clear-grid"
                onClick={handleClear}
                className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg border border-rose-100 text-rose-600 bg-rose-50/30 hover:bg-rose-50 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t('clearBtn')}
              </button>
            </div>
          </div>

          {/* ACTIVE GRID CANVAS */}
          <div className="flex items-center justify-center p-2 bg-slate-50/50 rounded-xl border border-slate-100">
            <SymmetryGrid
              id="sandbox-drawing-grid"
              gridSize={gridSize}
              blocks={activeTool === 'block' ? blocks : []}
              mirrorAxis={axisInfo}
              interactive={activeTool === 'block'}
              onCellClick={activeTool === 'block' ? handleCellClick : undefined}
              title={
                sandboxMode === 'auto-reflect'
                  ? (activeTool === 'line' ? t('lineDrawingSandbox') : t('blockDrawingSandbox'))
                  : (activeTool === 'line' ? t('lineSymmetrySolver') : t('blockSymmetrySolver'))
              }
              badge={sandboxMode === 'auto-reflect' ? t('autoReflectingBadge') : t('symmetryQuizBadge')}
              isCorrectShadow={solveState === 'correct'}
              isIncorrectShadow={solveState === 'incorrect'}
              
              // Line Drawing props
              lineSegments={activeTool === 'line' ? lineSegments : []}
              activeVertex={activeTool === 'line' ? activeVertex : null}
              interactiveLineDrawing={activeTool === 'line'}
              onVertexClick={handleVertexClick}
            />
          </div>

          {/* SOLVER PANEL & FEEDBACKS */}
          <div className="w-full mt-6 pt-4 border-t border-slate-200 flex flex-col gap-4">
            <AnimatePresence>
              {solveState !== 'drawing' && (
                <motion.div
                   id="sandbox-feedback-message"
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className={`p-4 rounded-xl flex items-center justify-between border ${
                     solveState === 'correct'
                       ? 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
                       : 'border-rose-200 bg-rose-50/50 text-rose-800'
                   }`}
                >
                  <div className="flex items-center gap-3">
                    {solveState === 'correct' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-sm font-bold uppercase tracking-tight">{t('perfectSymmetryTitle')}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {activeTool === 'line'
                              ? t('perfectLineSymmetryDesc')
                              : t('perfectBlockSymmetryDesc')}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <p className="text-sm font-bold uppercase tracking-tight">{t('tryAgainTitle')}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {activeTool === 'line'
                              ? t('tryAgainLineDesc')
                              : t('tryAgainBlockDesc')}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>
                  {activeTool === 'line'
                    ? t('snappingLineHelp', { gridSize })
                    : t('blockCoordHelp', { max: gridSize - 1 })}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  id="btn-sandbox-save-art"
                  onClick={handleSaveToGallery}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-700 hover:bg-slate-50 font-display font-extrabold text-xs uppercase tracking-wider transition-all"
                >
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  {t('saveGalleryBtn')}
                </button>

                {sandboxMode === 'solve' && (
                  <button
                    id="btn-sandbox-check-symmetry"
                    onClick={handleCheckSymmetry}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-md shadow-indigo-100 hover:shadow-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t('verifySymmetryBtn')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
