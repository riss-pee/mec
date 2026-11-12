import React, { useRef, useEffect, useState } from 'react';
import { playPaintSound } from '../utils/audio';

interface FractionGridProps {
  rows: number;
  cols: number;
  shaded: boolean[];
  onChange: (newShaded: boolean[]) => void;
  showNumbers: boolean;
  interactive?: boolean;
}

export default function FractionGrid({
  rows,
  cols,
  shaded,
  onChange,
  showNumbers,
  interactive = true,
}: FractionGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const drawingStateRef = useRef<{
    isDrawing: boolean;
    drawMode: 'shade' | 'unshade';
    modifiedIndices: Set<number>;
  }>({
    isDrawing: false,
    drawMode: 'shade',
    modifiedIndices: new Set(),
  });

  // Calculate coordinates and get cell index
  const getCellFromEvent = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const cellWidth = rect.width / cols;
    const cellHeight = rect.height / rows;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      return { row, col, index: row * cols + col };
    }
    return null;
  };

  // Render Grid onto Canvas
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set canvas dimensions with device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const cellW = w / cols;
    const cellH = h / rows;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Cell Backgrounds (Shaded & Unshaded)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        const isShaded = shaded[index];
        const isHovered = hoveredCell && hoveredCell.row === r && hoveredCell.col === c;

        // Base fill color
        if (isShaded) {
          // Vibrant amber fill
          ctx.fillStyle = '#f59e0b';
        } else {
          // Soft gray/white unshaded background
          ctx.fillStyle = '#f8fafc';
        }
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);

        // Highlight hovered cell if interactive
        if (interactive && isHovered) {
          ctx.fillStyle = isShaded ? 'rgba(251, 191, 36, 0.4)' : 'rgba(148, 163, 184, 0.15)';
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
    }

    // 2. Draw Cell Numbers (if enabled and cell is big enough)
    const canShowNumber = cellW >= 24 && cellH >= 18;
    if (showNumbers && canShowNumber) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Auto-size font based on cell dimensions
      const fontSize = Math.min(cellW * 0.45, cellH * 0.5, 12);
      ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const isShaded = shaded[index];
          const numStr = (index + 1).toString();

          ctx.fillStyle = isShaded ? '#ffffff' : '#475569';
          ctx.fillText(numStr, c * cellW + cellW / 2, r * cellH + cellH / 2);
        }
      }
    }

    // 3. Draw Grid Lines
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    // Dynamic line width to avoid visual noise on dense grids
    ctx.lineWidth = Math.max(0.5, Math.min(1.5, 12 / Math.max(rows, cols)));

    ctx.beginPath();
    // Vertical lines
    for (let c = 0; c <= cols; c++) {
      const x = c * cellW;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    // Horizontal lines
    for (let r = 0; r <= rows; r++) {
      const y = r * cellH;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // 4. Draw Hover Highlight Border
    if (interactive && hoveredCell) {
      ctx.strokeStyle = '#3b82f6'; // vibrant blue border
      ctx.lineWidth = 2;
      ctx.strokeRect(hoveredCell.col * cellW, hoveredCell.row * cellH, cellW, cellH);
    }
  };

  // Redraw when grid sizes, shading, hovered, or showNumbers options change
  useEffect(() => {
    drawGrid();
  }, [rows, cols, shaded, hoveredCell, showNumbers, interactive]);

  // Handle ResizeObserver to redraw on layout changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      drawGrid();
    });
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [rows, cols, shaded, showNumbers, interactive]);

  // Handle Interactive Mouse Down / Touch Start
  const handleStart = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!interactive) return;
    if ('button' in e && e.button !== 0) return; // Only respond to left clicks

    const cell = getCellFromEvent(e);
    if (!cell) return;

    const currentShaded = shaded[cell.index];
    const mode = currentShaded ? 'unshade' : 'shade';

    drawingStateRef.current = {
      isDrawing: true,
      drawMode: mode,
      modifiedIndices: new Set([cell.index]),
    };

    const newShaded = [...shaded];
    newShaded[cell.index] = mode === 'shade';
    onChange(newShaded);

    // Play pitch tone based on index for gamey feel
    const pitch = 300 + (cell.index % 30) * 15;
    playPaintSound(pitch, 0.05);
  };

  // Handle Interactive Mouse Move / Touch Move
  const handleMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!interactive) return;

    const cell = getCellFromEvent(e);
    
    // Update hovered cell coordinate for hover drawing
    if (cell) {
      setHoveredCell({ row: cell.row, col: cell.col });
    } else {
      setHoveredCell(null);
    }

    const { isDrawing, drawMode, modifiedIndices } = drawingStateRef.current;
    if (!isDrawing || !cell) return;

    // Prevent default scrolling behaviour on touch to allow smooth painting
    if (e.cancelable) {
      e.preventDefault();
    }

    if (!modifiedIndices.has(cell.index)) {
      modifiedIndices.add(cell.index);
      
      const newShaded = [...shaded];
      newShaded[cell.index] = drawMode === 'shade';
      onChange(newShaded);

      const pitch = 300 + (cell.index % 30) * 15;
      playPaintSound(pitch, 0.04);
    }
  };

  // Handle Interactive Mouse Up / Touch End
  const handleEnd = () => {
    if (!interactive) return;
    drawingStateRef.current.isDrawing = false;
    drawingStateRef.current.modifiedIndices.clear();
  };

  // Handle mouse leaving canvas
  const handleMouseLeave = () => {
    setHoveredCell(null);
    handleEnd();
  };

  return (
    <div className="relative w-full aspect-square md:aspect-auto md:h-[460px] max-w-[460px] mx-auto bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center p-3">
      <canvas
        id="fraction-grid-canvas"
        ref={canvasRef}
        className={`w-full h-full max-w-full max-h-full ${
          interactive ? 'cursor-crosshair' : 'cursor-default'
        } touch-none`}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
}
