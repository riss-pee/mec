import React, { useRef, useEffect, useCallback } from 'react';
import { Target, ThemeMode, ExplosionParticle, DetonationMarker, TrajectoryTrace, WallBarrier, CannonType } from '../types/game';
import {
  formatSlopeFraction,
  getLineEquation,
  getLineRoots,
  isCollinearRay,
  getQuadraticCoefficients,
  getQuadraticY,
  checkLinearWallCollision,
  checkQuadraticWallCollision,
} from '../utils/mathUtils';
import { soundManager } from '../audio/soundManager';

interface CartesianCanvasProps {
  targets: Target[];
  aimX: number;
  aimY: number;
  cannonX?: number;
  cannonY?: number;
  firing: boolean;
  theme: ThemeMode;
  level: string;
  showSlopeTriangle: boolean;
  lastDetonation: DetonationMarker | null;
  lastTrace: TrajectoryTrace | null;
  invertedAlertTarget: Target | null;
  walls?: WallBarrier[];
  cannonType?: CannonType;
  allowRepositionCannon?: boolean;
  clickMode?: 'target' | 'cannon';
  calculatedAim?: boolean;
  onGridClick?: (x: number, y: number) => void;
  onDetonationComplete?: () => void;
}

export const CartesianCanvas: React.FC<CartesianCanvasProps> = ({
  targets,
  aimX,
  aimY,
  cannonX = 0,
  cannonY = 0,
  firing,
  theme,
  level,
  showSlopeTriangle,
  lastDetonation,
  lastTrace,
  invertedAlertTarget,
  walls = [],
  cannonType = 'linear',
  allowRepositionCannon = false,
  clickMode = 'target',
  calculatedAim = false,
  onGridClick,
  onDetonationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<ExplosionParticle[]>([]);
  const hoverCoordRef = useRef<{ x: number; y: number } | null>(null);
  const sizeRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 600,
    height: 600,
    dpr: 1,
  });

  // Observe container size and keep canvas buffer in sync without layout feedback loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width > 0 && height > 0) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        sizeRef.current = { width, height, dpr };
      }
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    observer.observe(container);

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Shell projectile animation state
  const projectileRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    currentX: number;
    currentY: number;
    progress: number;
    speed: number;
    isLinearBeam: boolean;
    isQuadratic: boolean;
    quadA: number;
    quadB: number;
    quadC: number;
    isBlockedByWall: boolean;
    hitX: number;
    hitY: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    currentX: 0,
    currentY: 0,
    progress: 0,
    speed: 0.045,
    isLinearBeam: false,
    isQuadratic: false,
    quadA: 0,
    quadB: 0,
    quadC: 0,
    isBlockedByWall: false,
    hitX: 0,
    hitY: 0,
  });

  // Cannon recoil animation
  const recoilRef = useRef<number>(0);

  // Trigger fire animation when firing prop changes to true
  useEffect(() => {
    if (firing) {
      const isLinearBeam = cannonType === 'linear';
      const isQuadratic = cannonType === 'quadratic';
      const quad = getQuadraticCoefficients(aimX, aimY, cannonX, cannonY);

      let isBlockedByWall = false;
      let hitX = aimX;
      let hitY = aimY;

      if (walls && walls.length > 0) {
        if (!isQuadratic) {
          const check = checkLinearWallCollision(aimX, aimY, walls, cannonX, cannonY);
          if (check.blocked && check.hitPoint) {
            isBlockedByWall = true;
            hitX = check.hitPoint.x;
            hitY = check.hitPoint.y;
          }
        } else {
          const check = checkQuadraticWallCollision(aimX, aimY, quad.a, quad.b, quad.c, walls, cannonX);
          if (check.blocked && check.hitPoint) {
            isBlockedByWall = true;
            hitX = check.hitPoint.x;
            hitY = check.hitPoint.y;
          }
        }
      }

      // If target was engaged, travel to target; if wall blocked, travel to wall hit point;
      // if missed, travel through aim / edge
      const targetHit = lastTrace?.hitTarget;
      const finalDestX = isBlockedByWall ? hitX : targetHit ? targetHit.x : (lastTrace?.beyondX ?? aimX);
      const finalDestY = isBlockedByWall ? hitY : targetHit ? targetHit.y : (lastTrace?.beyondY ?? aimY);

      projectileRef.current = {
        active: true,
        startX: cannonX,
        startY: cannonY,
        endX: finalDestX,
        endY: finalDestY,
        currentX: cannonX,
        currentY: cannonY,
        progress: 0,
        speed: isLinearBeam ? 0.07 : 0.035,
        isLinearBeam,
        isQuadratic,
        quadA: quad.a,
        quadB: quad.b,
        quadC: quad.c,
        isBlockedByWall,
        hitX,
        hitY,
      };
      recoilRef.current = 1.0;
    }
  }, [firing, aimX, aimY, cannonX, cannonY, level, cannonType, walls, lastTrace]);

  // Create explosion particles
  const spawnExplosion = useCallback(
    (canvasX: number, canvasY: number, isHit: boolean, isWallDeflect = false) => {
      const count = isHit ? 36 : isWallDeflect ? 28 : 20;
      const baseColor = isHit ? '#10B981' : isWallDeflect ? '#F59E0B' : '#EF4444';
      const secondaryColor = isHit ? '#34D399' : isWallDeflect ? '#FDE047' : '#F97316';

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.2;
        particlesRef.current.push({
          x: canvasX,
          y: canvasY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4.5 + 2,
          color: Math.random() > 0.4 ? baseColor : secondaryColor,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 25 + 20,
        });
      }
    },
    []
  );

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pulseTime = 0;

    const render = () => {
      pulseTime += 0.04;

      const { width, height, dpr } = sizeRef.current;
      if (width <= 0 || height <= 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Determine Grid Scale
      // 1 Quadrant Mode (0 to 8) -> shifted origin to bottom-left area for maximum visibility
      // Other levels: -10 to +10 centered
      const isLevel1 = level === 'level1_q1' || level === 'q1_mode';
      const minDimension = Math.min(width, height);

      // Cell size in pixels
      const cellSize = Math.floor((minDimension * 0.82) / (isLevel1 ? 9.5 : 21));

      // Origin center
      const originX = isLevel1 ? Math.floor(width * 0.18) : Math.floor(width / 2);
      const originY = isLevel1 ? Math.floor(height * 0.82) : Math.floor(height / 2);

      // Coordinate transformers
      const toCanvasX = (gx: number) => originX + gx * cellSize;
      const toCanvasY = (gy: number) => originY - gy * cellSize; // Canvas Y is inverted

      // 1. Draw Canvas Background
      const isDark = theme === 'tactical';
      ctx.fillStyle = isDark ? '#0b111e' : '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Quadrant Tints (Soft, clean math graph aesthetic)
      if (!isLevel1) {
        // Q1 (+, +) Top-Right (Sky)
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.025)' : 'rgba(2, 132, 199, 0.035)';
        ctx.fillRect(originX, 0, width - originX, originY);
        // Q2 (-, +) Top-Left (Purple)
        ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.025)' : 'rgba(124, 58, 237, 0.03)';
        ctx.fillRect(0, 0, originX, originY);
        // Q3 (-, -) Bottom-Left (Amber/Coral)
        ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.025)' : 'rgba(239, 68, 68, 0.025)';
        ctx.fillRect(0, originY, originX, height - originY);
        // Q4 (+, -) Bottom-Right (Amber/Gold)
        ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.025)' : 'rgba(217, 119, 6, 0.03)';
        ctx.fillRect(originX, originY, width - originX, height - originY);
      }

      // 3. Grid Lines
      const minX = isLevel1 ? 0 : -10;
      const maxX = isLevel1 ? 8 : 10;
      const minY = isLevel1 ? 0 : -10;
      const maxY = isLevel1 ? 8 : 10;

      // Minor and Major Grid lines
      for (let x = minX; x <= maxX; x++) {
        const cx = toCanvasX(x);
        const isAxis = x === 0;
        const isMajor = x % 5 === 0;

        ctx.strokeStyle = isAxis
          ? isDark ? '#38bdf8' : '#0f172a'
          : isMajor
          ? isDark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(148, 163, 184, 0.45)'
          : isDark ? 'rgba(51, 65, 85, 0.25)' : 'rgba(226, 232, 240, 0.95)';
        ctx.lineWidth = isAxis ? 2.5 : isMajor ? 1.2 : 0.8;

        ctx.beginPath();
        ctx.moveTo(cx, toCanvasY(maxY));
        ctx.lineTo(cx, toCanvasY(minY));
        ctx.stroke();

        // X-Axis Numbers
        if (x !== 0 || isLevel1) {
          ctx.save();
          ctx.font = '700 13px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.strokeStyle = isDark ? '#0b111e' : '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.lineJoin = 'round';
          ctx.strokeText(x.toString(), cx, originY + (isLevel1 ? 8 : 8));
          ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
          ctx.fillText(x.toString(), cx, originY + (isLevel1 ? 8 : 8));
          ctx.restore();
        }
      }

      for (let y = minY; y <= maxY; y++) {
        const cy = toCanvasY(y);
        const isAxis = y === 0;
        const isMajor = y % 5 === 0;

        ctx.strokeStyle = isAxis
          ? isDark ? '#38bdf8' : '#0f172a'
          : isMajor
          ? isDark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(148, 163, 184, 0.45)'
          : isDark ? 'rgba(51, 65, 85, 0.25)' : 'rgba(226, 232, 240, 0.95)';
        ctx.lineWidth = isAxis ? 2.5 : isMajor ? 1.2 : 0.8;

        ctx.beginPath();
        ctx.moveTo(toCanvasX(minX), cy);
        ctx.lineTo(toCanvasX(maxX), cy);
        ctx.stroke();

        // Y-Axis Numbers
        if (y !== 0) {
          ctx.save();
          ctx.font = '700 13px "JetBrains Mono", monospace';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.strokeStyle = isDark ? '#0b111e' : '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.lineJoin = 'round';
          ctx.strokeText(y.toString(), originX - (isLevel1 ? 8 : 8), cy);
          ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
          ctx.fillText(y.toString(), originX - (isLevel1 ? 8 : 8), cy);
          ctx.restore();
        }
      }

      // Axis terminal arrows and axis labels
      ctx.save();
      ctx.fillStyle = isDark ? '#38bdf8' : '#0f172a';
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0f172a';
      ctx.lineWidth = 2;

      // X-Axis Arrow at maxX
      const endXPixel = toCanvasX(maxX);
      ctx.beginPath();
      ctx.moveTo(endXPixel + 6, toCanvasY(0));
      ctx.lineTo(endXPixel - 4, toCanvasY(0) - 5);
      ctx.lineTo(endXPixel - 4, toCanvasY(0) + 5);
      ctx.closePath();
      ctx.fill();

      // Label at right edge
      ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = isDark ? '#0b111e' : '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.strokeText('+X (Run)', endXPixel + 9, toCanvasY(0));
      ctx.fillText('+X (Run)', endXPixel + 9, toCanvasY(0));

      // Y-Axis Arrow at maxY
      const topYPixel = toCanvasY(maxY);
      ctx.beginPath();
      ctx.moveTo(toCanvasX(0), topYPixel - 6);
      ctx.lineTo(toCanvasX(0) - 5, topYPixel + 4);
      ctx.lineTo(toCanvasX(0) + 5, topYPixel + 4);
      ctx.closePath();
      ctx.fill();

      // Label at top edge
      ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.strokeStyle = isDark ? '#0b111e' : '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.strokeText('+Y (Rise)', toCanvasX(0), topYPixel - 9);
      ctx.fillText('+Y (Rise)', toCanvasX(0), topYPixel - 9);
      ctx.restore();

      // 4. Origin (0, 0) Label
      ctx.save();
      ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.strokeStyle = isDark ? '#0b111e' : '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.strokeText('(0, 0)', originX - 12, originY + 8);
      ctx.fillText('(0, 0)', originX - 12, originY + 8);
      ctx.restore();

      // 5. Quadrant Roman Numeral Watermarks
      if (!isLevel1) {
        ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(100, 116, 139, 0.16)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('QUADRANT I (+, +)', toCanvasX(5.5), toCanvasY(5.5));
        ctx.fillText('QUADRANT II (−, +)', toCanvasX(-5.5), toCanvasY(5.5));
        ctx.fillText('QUADRANT III (−, −)', toCanvasX(-5.5), toCanvasY(-5.5));
        ctx.fillText('QUADRANT IV (+, −)', toCanvasX(5.5), toCanvasY(-5.5));
      }

      // 6. Draw Wall Barriers
      if (walls && walls.length > 0) {
        walls.forEach((wall) => {
          const wx1 = toCanvasX(wall.x1);
          const wy1 = toCanvasY(wall.y1);
          const wx2 = toCanvasX(wall.x2);
          const wy2 = toCanvasY(wall.y2);

          ctx.save();
          // Glow outer - scaled down so it doesn't overpower adjacent cells
          ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(217, 119, 6, 0.2)';
          ctx.lineWidth = 8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(wx1, wy1);
          ctx.lineTo(wx2, wy2);
          ctx.stroke();

          // Outer energy field
          ctx.strokeStyle = isDark ? '#f59e0b' : '#d97706';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(wx1, wy1);
          ctx.lineTo(wx2, wy2);
          ctx.stroke();

          // Inner high energy core
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(wx1, wy1);
          ctx.lineTo(wx2, wy2);
          ctx.stroke();

          // Barrier End Nodes
          [ [wx1, wy1], [wx2, wy2] ].forEach(([nx, ny]) => {
            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fef3c7';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          });

          // Floating Center Label
          const midX = (wx1 + wx2) / 2;
          const midY = (wy1 + wy2) / 2;
          ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.96)';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(midX - 20, midY - 9, 40, 18, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
          ctx.font = '700 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('WALL', midX, midY);

          ctx.restore();
        });
      }

      // 7. Last Shot Persistent Trajectory Line & Equation & Roots
      if (lastTrace) {
        ctx.save();
        const startCX = toCanvasX(lastTrace.startX);
        const startCY = toCanvasY(lastTrace.startY);
        const hit = lastTrace.hitTarget;
        const color = lastTrace.color || (lastTrace.cannonType === 'quadratic' ? '#f59e0b' : '#38bdf8');

        ctx.strokeStyle = color;

        if (lastTrace.cannonType === 'quadratic' && lastTrace.quadraticA !== undefined && lastTrace.quadraticB !== undefined) {
          const a = lastTrace.quadraticA;
          const b = lastTrace.quadraticB;
          const c = lastTrace.quadraticC ?? 0;
          const endX = lastTrace.beyondX ?? lastTrace.endX;
          const targetX = hit ? hit.x : endX;

          // Segment 1: Solid arc from start to hit target (or throughout if no hit)
          ctx.beginPath();
          ctx.setLineDash([]);
          ctx.lineWidth = 3;
          const steps1 = 28;
          for (let s = 0; s <= steps1; s++) {
            const frac = s / steps1;
            const gx = lastTrace.startX + (targetX - lastTrace.startX) * frac;
            const gy = getQuadraticY(gx, a, b, c);
            const cx = toCanvasX(gx);
            const cy = toCanvasY(gy);
            if (s === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
          ctx.stroke();

          // Segment 2: If target engaged, continue with dotted line beyond target
          if (hit && Math.abs(endX - targetX) > 0.05) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 2.2;
            const steps2 = 20;
            for (let s = 0; s <= steps2; s++) {
              const frac = s / steps2;
              const gx = targetX + (endX - targetX) * frac;
              const gy = getQuadraticY(gx, a, b, c);
              const cx = toCanvasX(gx);
              const cy = toCanvasY(gy);
              if (s === 0) ctx.moveTo(cx, cy);
              else ctx.lineTo(cx, cy);
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }
        } else {
          // Linear straight line (Laser)
          const endX = lastTrace.beyondX ?? lastTrace.endX;
          const endY = lastTrace.beyondY ?? lastTrace.endY;
          const targetX = hit ? hit.x : endX;
          const targetY = hit ? hit.y : endY;

          // Segment 1: Solid line from start to hit target (or throughout if no hit)
          ctx.beginPath();
          ctx.setLineDash([]);
          ctx.lineWidth = 3;
          ctx.moveTo(startCX, startCY);
          ctx.lineTo(toCanvasX(targetX), toCanvasY(targetY));
          ctx.stroke();

          // Segment 2: If target engaged, continue with dotted line beyond target
          if (hit && (Math.abs(endX - targetX) > 0.05 || Math.abs(endY - targetY) > 0.05)) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.lineWidth = 2.2;
            ctx.moveTo(toCanvasX(targetX), toCanvasY(targetY));
            ctx.lineTo(toCanvasX(endX), toCanvasY(endY));
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
        ctx.setLineDash([]);

        // Line Equation Badge along the shot
        const traceEndCX = toCanvasX(lastTrace.endX);
        const traceEndCY = toCanvasY(lastTrace.endY);
        const midCX = (startCX + traceEndCX) / 2;
        const midCY = (startCY + traceEndCY) / 2 - 14;

        ctx.font = '700 11px "JetBrains Mono", monospace';
        const eqWidth = ctx.measureText(lastTrace.equation).width;

        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(midCX - eqWidth / 2 - 8, midCY - 11, eqWidth + 16, 22, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(lastTrace.equation, midCX, midCY);

        // Draw Roots / Zeroes Markers (where trajectory intersects X-axis y = 0)
        const traceRoots =
          lastTrace.roots ??
          (lastTrace.cannonType === 'quadratic'
            ? getQuadraticCoefficients(lastTrace.endX, lastTrace.endY, lastTrace.startX, lastTrace.startY).roots
            : getLineRoots(lastTrace.endX, lastTrace.endY, lastTrace.startX, lastTrace.startY));

        if (traceRoots.hasRoots && traceRoots.roots.length > 0) {
          traceRoots.roots.forEach((rootVal) => {
            if (rootVal >= minX - 0.5 && rootVal <= maxX + 0.5) {
              const rootCX = toCanvasX(rootVal);
              const rootCY = toCanvasY(0);

              // Pulsing glow ring around root on X-axis
              const pulse = 1 + Math.sin(pulseTime * 3) * 0.15;
              ctx.strokeStyle = '#f59e0b';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(rootCX, rootCY, 10 * pulse, 0, Math.PI * 2);
              ctx.stroke();

              // Solid diamond marker on axis
              ctx.fillStyle = '#fbbf24';
              ctx.beginPath();
              ctx.moveTo(rootCX, rootCY - 6);
              ctx.lineTo(rootCX + 6, rootCY);
              ctx.lineTo(rootCX, rootCY + 6);
              ctx.lineTo(rootCX - 6, rootCY);
              ctx.closePath();
              ctx.fill();

              // Label badge for the Root
              const rootLabel = `Zero: x = ${rootVal.toFixed(2)}`;
              ctx.font = '700 10px "JetBrains Mono", monospace';
              const rWidth = ctx.measureText(rootLabel).width;
              ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)';
              ctx.strokeStyle = '#f59e0b';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.roundRect(rootCX - rWidth / 2 - 5, rootCY + 8, rWidth + 10, 18, 3);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(rootLabel, rootCX, rootCY + 17);
            }
          });
        }

        ctx.restore();
      }

      // 8. Interactive Slope Right-Triangle (Run along X, Rise along Y from cannon battery)
      if (showSlopeTriangle && (aimX !== cannonX || aimY !== cannonY) && !firing) {
        ctx.save();
        const startCX = toCanvasX(cannonX);
        const startCY = toCanvasY(cannonY);
        const targetCX = toCanvasX(aimX);
        const targetCY = toCanvasY(aimY);
        const cornerCX = targetCX;
        const cornerCY = startCY;

        const deltaX = aimX - cannonX;
        const deltaY = aimY - cannonY;

        // Triangle area fill
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.07)';
        ctx.beginPath();
        ctx.moveTo(startCX, startCY);
        ctx.lineTo(cornerCX, cornerCY);
        ctx.lineTo(targetCX, targetCY);
        ctx.closePath();
        ctx.fill();

        // Horizontal Run leg (Δx)
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startCX, startCY);
        ctx.lineTo(cornerCX, cornerCY);
        ctx.stroke();

        // Vertical Rise leg (Δy)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cornerCX, cornerCY);
        ctx.lineTo(targetCX, targetCY);
        ctx.stroke();

        // Right angle marker
        const markerSize = 10;
        const signX = deltaX >= 0 ? 1 : -1;
        const signY = deltaY >= 0 ? 1 : -1;

        ctx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cornerCX - signX * markerSize, cornerCY);
        ctx.lineTo(cornerCX - signX * markerSize, cornerCY - signY * markerSize);
        ctx.lineTo(cornerCX, cornerCY - signY * markerSize);
        ctx.stroke();

        // Leg Labels with readable badge cards
        ctx.font = '700 13px "JetBrains Mono", monospace';
        const runText = `Run: Δx = ${deltaX}`;
        const riseText = `Rise: Δy = ${deltaY}`;

        // Run badge
        const runW = ctx.measureText(runText).width;
        const runMidX = (startCX + cornerCX) / 2;
        const runY = startCY + (deltaY >= 0 ? 18 : -18);

        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(runMidX - runW / 2 - 6, runY - 10, runW + 12, 20, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0284c7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(runText, runMidX, runY);

        // Rise badge
        const riseW = ctx.measureText(riseText).width;
        const riseX = cornerCX + (deltaX >= 0 ? riseW / 2 + 10 : -riseW / 2 - 10);
        const riseMidY = (cornerCY + targetCY) / 2;

        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(riseX - riseW / 2 - 6, riseMidY - 10, riseW + 12, 20, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(riseText, riseX, riseMidY);

        ctx.restore();
      }

      // 9. Miss Diagnostic Projections (Detonation drop-lines to axes)
      if (lastDetonation && !lastDetonation.hit) {
        ctx.save();
        const detCX = toCanvasX(lastDetonation.gridX);
        const detCY = toCanvasY(lastDetonation.gridY);
        const xProjCY = toCanvasY(0);
        const yProjCX = toCanvasX(0);

        // Dashed lines to X and Y axes
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;

        // Line to X-axis
        ctx.beginPath();
        ctx.moveTo(detCX, detCY);
        ctx.lineTo(detCX, xProjCY);
        ctx.stroke();

        // Line to Y-axis
        ctx.beginPath();
        ctx.moveTo(detCX, detCY);
        ctx.lineTo(yProjCX, detCY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Small indicator squares on axes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(detCX - 4, xProjCY - 4, 8, 8);
        ctx.fillRect(yProjCX - 4, detCY - 4, 8, 8);

        // Detonation Coordinates Callout Badge
        const badgeText = lastDetonation.blockedByWall
          ? `Blocked at Wall (${lastDetonation.gridX.toFixed(1)}, ${lastDetonation.gridY.toFixed(1)})`
          : `Detonated at (${lastDetonation.gridX}, ${lastDetonation.gridY})`;
        ctx.font = '700 11px "JetBrains Mono", monospace';
        const bWidth = ctx.measureText(badgeText).width;

        ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(220, 38, 38, 0.95)';
        ctx.beginPath();
        ctx.roundRect(detCX - bWidth / 2 - 8, detCY - 30, bWidth + 16, 20, 4);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(badgeText, detCX, detCY - 20);

        ctx.restore();
      }

      // 10. Inverted Mistake Ghost Arrow
      if (invertedAlertTarget) {
        ctx.save();
        const targetCX = toCanvasX(invertedAlertTarget.x);
        const targetCY = toCanvasY(invertedAlertTarget.y);
        const firedCX = toCanvasX(invertedAlertTarget.y); // Fired at (b, a)
        const firedCY = toCanvasY(invertedAlertTarget.x);

        // Draw curved comparison arrow
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 3]);

        ctx.beginPath();
        ctx.moveTo(firedCX, firedCY);
        const controlX = (firedCX + targetCX) / 2 + (targetCY - firedCY) * 0.3;
        const controlY = (firedCY + targetCY) / 2 + (targetCX - firedCX) * 0.3;
        ctx.quadraticCurveTo(controlX, controlY, targetCX, targetCY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow marker
        ctx.font = '700 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText('Swapped X ↔ Y', controlX, controlY - 8);

        ctx.restore();
      }

      // 11. Draw Targets (Compact Visual Sprites - scaled appropriately so they never overlap grid labels or adjacent cells)
      targets.forEach((target) => {
        const tx = toCanvasX(target.x);
        const ty = toCanvasY(target.y);

        ctx.save();
        ctx.translate(tx, ty);

        // Compact pulsing radar ring (stays tightly around the node)
        const ringRadius = 7.5 + Math.sin(pulseTime * 2.5 + target.x) * 1.5;
        ctx.strokeStyle = isDark ? 'rgba(239, 68, 68, 0.5)' : 'rgba(220, 38, 38, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Target Core Shape based on type
        if (target.type === 'drone') {
          // Quad-rotor drone shape - compact
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = isDark ? '#fca5a5' : '#7f1d1d';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Drone rotors - compact
          const rotorOffsets = [
            [-5.5, -5.5],
            [5.5, -5.5],
            [-5.5, 5.5],
            [5.5, 5.5],
          ];
          rotorOffsets.forEach(([rx, ry]) => {
            ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
            ctx.beginPath();
            ctx.arc(rx, ry, 2, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (target.type === 'cruiser') {
          // Armored Cruiser diamond - compact
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(0, -6.5);
          ctx.lineTo(6.5, 0);
          ctx.lineTo(0, 6.5);
          ctx.lineTo(-6.5, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Collinear node / standard
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.restore();
      });

      // 12. Animated Projectile Flight & Laser Beam
      const p = projectileRef.current;
      if (p.active) {
        p.progress += p.speed;

        if (p.isLinearBeam) {
          // Linear Laser Beam
          const currProgress = Math.min(p.progress, 1);
          const currX = p.startX + (p.endX - p.startX) * currProgress;
          const currY = p.startY + (p.endY - p.startY) * currProgress;
          const startCX = toCanvasX(p.startX);
          const startCY = toCanvasY(p.startY);
          const headCX = toCanvasX(currX);
          const headCY = toCanvasY(currY);

          ctx.save();
          // Laser beam glow
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(startCX, startCY);
          ctx.lineTo(headCX, headCY);
          ctx.stroke();

          // Laser solid core
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Laser white core center
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Laser beam head pulse
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(headCX, headCY, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (p.progress >= 1.0) {
            p.active = false;
            const detHit = targets.some((t) => t.x === p.endX && t.y === p.endY);
            if (detHit || p.isBlockedByWall) {
              spawnExplosion(toCanvasX(p.endX), toCanvasY(p.endY), detHit, p.isBlockedByWall);
            }
            onDetonationComplete?.();
          }
        } else if (p.isQuadratic) {
          // Quadratic Mortar Flight (Parabolic Arc)
          const currProgress = Math.min(p.progress, 1);
          const currX = p.startX + (p.endX - p.startX) * currProgress;
          const currY = getQuadraticY(currX, p.quadA, p.quadB, p.quadC ?? 0);

          const projCX = toCanvasX(currX);
          const projCY = toCanvasY(currY);

          // Flight Trail Arc
          ctx.save();
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const trailSteps = 24;
          for (let s = 0; s <= trailSteps; s++) {
            const frac = (s / trailSteps) * currProgress;
            const gx = p.startX + (p.endX - p.startX) * frac;
            const gy = getQuadraticY(gx, p.quadA, p.quadB, p.quadC ?? 0);
            const cx = toCanvasX(gx);
            const cy = toCanvasY(gy);
            if (s === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
          ctx.stroke();

          // Mortar Shell
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(projCX, projCY, 5.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();

          if (p.progress >= 1.0) {
            p.active = false;
            const detHit = targets.some((t) => t.x === p.endX && t.y === p.endY);
            if (detHit || p.isBlockedByWall) {
              spawnExplosion(toCanvasX(p.endX), toCanvasY(p.endY), detHit, p.isBlockedByWall);
            }
            onDetonationComplete?.();
          }
        } else {
          // Standard Linear ballistic shell
          const currProgress = Math.min(p.progress, 1);
          const currX = p.startX + (p.endX - p.startX) * currProgress;
          const currY = p.startY + (p.endY - p.startY) * currProgress;
          const projCX = toCanvasX(currX);
          const projCY = toCanvasY(currY);

          // Flight Trail
          ctx.save();
          ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.6)' : 'rgba(2, 132, 199, 0.6)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(toCanvasX(p.startX), toCanvasY(p.startY));
          ctx.lineTo(projCX, projCY);
          ctx.stroke();

          // Shell Core
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(projCX, projCY, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();

          if (p.progress >= 1.0) {
            p.active = false;
            const detHit = targets.some((t) => t.x === p.endX && t.y === p.endY);
            if (detHit || p.isBlockedByWall) {
              spawnExplosion(toCanvasX(p.endX), toCanvasY(p.endY), detHit, p.isBlockedByWall);
            }
            onDetonationComplete?.();
          }
        }
      }

      // 13. Explosion Particle Physics
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.94;
        pt.vy *= 0.94;
        pt.life++;
        pt.alpha = 1 - pt.life / pt.maxLife;

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * (1 - pt.life / (pt.maxLife * 1.5)), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (pt.life >= pt.maxLife) {
          particles.splice(i, 1);
        }
      }

      // 13b. Trajectory Aim Guide Preview (Drawn in global canvas coords - Disabled in Calculated Aim Mode)
      if (!p.active && !calculatedAim && (aimX !== cannonX || aimY !== cannonY)) {
        ctx.save();
        if (cannonType === 'quadratic') {
          // Quadratic parabolic arc preview
          const quad = getQuadraticCoefficients(aimX, aimY, cannonX, cannonY);
          ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.65)' : 'rgba(217, 119, 6, 0.7)';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([4, 4]);

          ctx.beginPath();
          const steps = 30;
          for (let s = 0; s <= steps; s++) {
            const frac = s / steps;
            const gx = cannonX + (aimX - cannonX) * frac;
            const gy = getQuadraticY(gx, quad.a, quad.b, quad.c);
            const cx = toCanvasX(gx);
            const cy = toCanvasY(gy);
            if (s === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          // Linear line preview
          ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(toCanvasX(cannonX), toCanvasY(cannonY));
          ctx.lineTo(toCanvasX(aimX), toCanvasY(aimY));
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
      }

      // 14. Artillery Turret Mechanism at Cannon Battery (cannonX, cannonY)
      const turretCX = toCanvasX(cannonX);
      const turretCY = toCanvasY(cannonY);

      // Battery Position Callout Marker & Range Ring
      if (cannonX !== 0 || cannonY !== 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(turretCX, turretCY, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const bText = `Battery (${cannonX}, ${cannonY})`;
        ctx.font = '700 11px "JetBrains Mono", monospace';
        const bw = ctx.measureText(bText).width;
        ctx.fillStyle = isDark ? 'rgba(6, 78, 59, 0.92)' : 'rgba(209, 250, 229, 0.95)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(turretCX - bw / 2 - 5, turretCY + 18, bw + 10, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#6ee7b7' : '#065f46';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bText, turretCX, turretCY + 27);
        ctx.restore();
      }

      ctx.save();
      ctx.translate(turretCX, turretCY);

      // Aim Angle relative to cannon battery
      const aimAngle = Math.atan2(-(aimY - cannonY), aimX - cannonX);

      // Base Platform - Compact (radius 9.5px, doesn't overlap (0,0) or adjacent axis numbers)
      ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
      ctx.beginPath();
      ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rotating Gun Barrel
      ctx.save();
      ctx.rotate(aimAngle);

      // Recoil kickback
      if (recoilRef.current > 0) {
        recoilRef.current = Math.max(0, recoilRef.current - 0.08);
      }
      const recoilOffset = -recoilRef.current * 4;

      // Barrel - Compact 14px length, 5px thickness
      ctx.fillStyle = cannonType === 'quadratic' ? (isDark ? '#d97706' : '#f59e0b') : isDark ? '#334155' : '#64748b';
      ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(0 + recoilOffset, -2.5, 14, 5, 1.5);
      ctx.fill();
      ctx.stroke();

      // Muzzle Brake
      ctx.fillStyle = cannonType === 'quadratic' ? '#f59e0b' : isDark ? '#0284c7' : '#0369a1';
      ctx.beginPath();
      ctx.roundRect(12 + recoilOffset, -4, 3.5, 8, 1);
      ctx.fill();

      ctx.restore(); // restore turret rotation

      // Central Dome - Compact 4.5px
      ctx.fillStyle = isDark ? '#0f172a' : '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Center Origin LED
      ctx.fillStyle = cannonType === 'quadratic' ? '#fbbf24' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // restore turret translation

      // 15. Current Aim Target Reticle at entered coordinates (aimX, aimY - Hidden in Calculated Aim mode)
      if (!calculatedAim && (aimX !== 0 || aimY !== 0)) {
        const aimCX = toCanvasX(aimX);
        const aimCY = toCanvasY(aimY);

        ctx.save();
        ctx.strokeStyle = cannonType === 'quadratic' ? '#f59e0b' : isDark ? '#38bdf8' : '#0284c7';
        ctx.lineWidth = 1.2;

        // Concentric aim rings - compact
        ctx.beginPath();
        ctx.arc(aimCX, aimCY, 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(aimCX, aimCY, 2, 0, Math.PI * 2);
        ctx.fillStyle = cannonType === 'quadratic' ? '#f59e0b' : isDark ? '#38bdf8' : '#0284c7';
        ctx.fill();

        // Crosshairs - compact
        ctx.beginPath();
        ctx.moveTo(aimCX - 8, aimCY);
        ctx.lineTo(aimCX - 3, aimCY);
        ctx.moveTo(aimCX + 3, aimCY);
        ctx.lineTo(aimCX + 8, aimCY);
        ctx.moveTo(aimCX, aimCY - 8);
        ctx.lineTo(aimCX, aimCY - 3);
        ctx.moveTo(aimCX, aimCY + 3);
        ctx.lineTo(aimCX, aimCY + 8);
        ctx.stroke();

        ctx.restore();
      }

      // 16. Interactive Mouse Hover Crosshair & Coordinate Indicator
      const hover = hoverCoordRef.current;
      if (hover && !p.active) {
        const hcx = toCanvasX(hover.x);
        const hcy = toCanvasY(hover.y);

        ctx.save();
        // Subtle projection lines to axes
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        ctx.beginPath();
        ctx.moveTo(hcx, hcy);
        ctx.lineTo(hcx, toCanvasY(0));
        ctx.moveTo(hcx, hcy);
        ctx.lineTo(toCanvasX(0), hcy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Grid Intersection Point Dot
        ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.beginPath();
        ctx.arc(hcx, hcy, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Floating Coordinate Pill - larger text and better visibility
        const coordText = `(${hover.x}, ${hover.y})`;
        ctx.font = '700 13px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(coordText).width;
        const pillWidth = textWidth + 18;
        const pillHeight = 24;

        // Position pill slightly above-right of the coordinate point
        let pillX = hcx + 10;
        let pillY = hcy - 30;
        if (pillX + pillWidth > width - 10) pillX = hcx - pillWidth - 10;
        if (pillY < 10) pillY = hcy + 12;

        ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)';
        ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(coordText, pillX + pillWidth / 2, pillY + pillHeight / 2);

        ctx.restore();
      }

      // 17. Calculated Aim Mode Canvas Indicator (Mental Math Active)
      if (calculatedAim) {
        ctx.save();
        ctx.font = '800 11px "JetBrains Mono", monospace';
        ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.85)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('⚡ CALCULATED AIM ACTIVE [2× MULTIPLIER]', width - 14, height - 12);
        ctx.restore();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    targets,
    aimX,
    aimY,
    cannonX,
    cannonY,
    theme,
    level,
    showSlopeTriangle,
    lastDetonation,
    lastTrace,
    invertedAlertTarget,
    walls,
    cannonType,
    calculatedAim,
    spawnExplosion,
    onDetonationComplete,
  ]);

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const { width, height } = sizeRef.current;
    if (width <= 0 || height <= 0) return;

    const isLevel1 = level === 'level1_q1' || level === 'q1_mode';
    const originX = isLevel1 ? Math.floor(width * 0.18) : Math.floor(width / 2);
    const originY = isLevel1 ? Math.floor(height * 0.82) : Math.floor(height / 2);

    const minDimension = Math.min(width, height);
    const cellSize = Math.floor((minDimension * 0.82) / (isLevel1 ? 9.5 : 21));

    const gx = Math.round((cx - originX) / cellSize);
    const gy = Math.round((originY - cy) / cellSize);

    const maxUnits = isLevel1 ? 8 : 10;
    const minUnits = isLevel1 ? 0 : -10;

    if (gx >= minUnits && gx <= maxUnits && gy >= minUnits && gy <= maxUnits) {
      hoverCoordRef.current = { x: gx, y: gy };
    } else {
      hoverCoordRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    hoverCoordRef.current = null;
  };

  const handleClick = () => {
    if (hoverCoordRef.current && onGridClick) {
      soundManager.playClick();
      onGridClick(hoverCoordRef.current.x, hoverCoordRef.current.y);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 min-w-0 flex items-center justify-center select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </div>
  );
};
