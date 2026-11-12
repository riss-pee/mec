import React, { useState } from 'react';
import { Target, WallBarrier, ThemeMode } from '../types/game';
import { Plus, Trash2, Shield, Target as TargetIcon, Play, RefreshCw, Layers, Sparkles, Crosshair, Move } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface TeacherEditorProps {
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  walls: WallBarrier[];
  setWalls: React.Dispatch<React.SetStateAction<WallBarrier[]>>;
  cannonX: number;
  cannonY: number;
  setCannonX: (val: number | ((prev: number) => number)) => void;
  setCannonY: (val: number | ((prev: number) => number)) => void;
  clickMode?: 'target' | 'cannon';
  setClickMode?: (mode: 'target' | 'cannon') => void;
  onLaunchCustomMission: () => void;
  theme: ThemeMode;
}

export const TeacherEditor: React.FC<TeacherEditorProps> = ({
  targets,
  setTargets,
  walls,
  setWalls,
  cannonX,
  cannonY,
  setCannonX,
  setCannonY,
  clickMode = 'target',
  setClickMode,
  onLaunchCustomMission,
  theme,
}) => {
  const isDark = theme === 'tactical';

  // State for new Target input
  const [newTargetX, setNewTargetX] = useState<number>(4);
  const [newTargetY, setNewTargetY] = useState<number>(3);
  const [targetType, setTargetType] = useState<'drone' | 'cruiser'>('drone');

  // State for new Wall Barrier input
  const [wallX1, setWallX1] = useState<number>(2);
  const [wallY1, setWallY1] = useState<number>(0);
  const [wallX2, setWallX2] = useState<number>(2);
  const [wallY2, setWallY2] = useState<number>(5);
  const [wallName, setWallName] = useState<string>('Energy Barrier');

  // Add Target
  const handleAddTarget = () => {
    soundManager.playClick();
    const existing = targets.find((t) => t.x === newTargetX && t.y === newTargetY);
    if (existing) return;

    const nextLetter = String.fromCharCode(65 + (targets.length % 26));
    const newTarget: Target = {
      id: `custom-t-${Date.now()}`,
      name: `Target ${nextLetter}`,
      x: newTargetX,
      y: newTargetY,
      hp: 1,
      maxHp: 1,
      type: targetType,
      quadrant: newTargetX > 0 && newTargetY > 0 ? 1 : newTargetX < 0 && newTargetY > 0 ? 2 : newTargetX < 0 && newTargetY < 0 ? 3 : 4,
    };
    setTargets((prev) => [...prev, newTarget]);
  };

  const handleRemoveTarget = (id: string) => {
    soundManager.playClick();
    setTargets((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Wall Barrier
  const handleAddWall = () => {
    soundManager.playClick();
    const newWall: WallBarrier = {
      id: `custom-w-${Date.now()}`,
      name: wallName || `Wall ${walls.length + 1}`,
      x1: wallX1,
      y1: wallY1,
      x2: wallX2,
      y2: wallY2,
    };
    setWalls((prev) => [...prev, newWall]);
  };

  const handleRemoveWall = (id: string) => {
    soundManager.playClick();
    setWalls((prev) => prev.filter((w) => w.id !== id));
  };

  // Load Presets
  const handleLoadPreset = (preset: 'fortress' | 'cross' | 'clear') => {
    soundManager.playClick();
    if (preset === 'fortress') {
      setCannonX(-4);
      setCannonY(-2);
      setTargets([
        { id: 'p-1', name: 'Target A', x: 5, y: 3, hp: 1, maxHp: 1, type: 'cruiser', quadrant: 1 },
        { id: 'p-2', name: 'Target B', x: 6, y: -4, hp: 1, maxHp: 1, type: 'drone', quadrant: 4 },
        { id: 'p-3', name: 'Target C', x: -5, y: 4, hp: 1, maxHp: 1, type: 'drone', quadrant: 2 },
      ]);
      setWalls([
        { id: 'pw-1', name: 'Fortress Wall', x1: 3, y1: 0, x2: 3, y2: 5 },
        { id: 'pw-2', name: 'Moat Barrier', x1: 2, y1: -2, x2: 7, y2: -2 },
      ]);
    } else if (preset === 'cross') {
      setCannonX(0);
      setCannonY(-4);
      setTargets([
        { id: 'p-1', name: 'Target A', x: 4, y: 4, hp: 1, maxHp: 1, type: 'cruiser', quadrant: 1 },
        { id: 'p-2', name: 'Target B', x: -4, y: 4, hp: 1, maxHp: 1, type: 'cruiser', quadrant: 2 },
        { id: 'p-3', name: 'Target C', x: 4, y: -4, hp: 1, maxHp: 1, type: 'drone', quadrant: 4 },
      ]);
      setWalls([
        { id: 'pw-1', name: 'North Shield', x1: 2, y1: 1, x2: 2, y2: 5 },
        { id: 'pw-2', name: 'West Shield', x1: -2, y1: 1, x2: -2, y2: 5 },
      ]);
    } else {
      setCannonX(0);
      setCannonY(0);
      setTargets([]);
      setWalls([]);
    }
  };

  return (
    <div
      className={`border rounded-xl p-3 sm:p-4 flex flex-col gap-3 transition-all ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-lg' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Quick Action */}
      <div className={`border-b pb-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          type="button"
          onClick={onLaunchCustomMission}
          className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play Mission</span>
        </button>
      </div>

      {/* Preset Scenarios */}
      <div className="flex items-center gap-1.5 text-xs flex-wrap">
        <span className={`font-medium text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Presets:</span>
        <button
          type="button"
          onClick={() => handleLoadPreset('fortress')}
          className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
            isDark ? 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-sky-800 border-slate-200'
          }`}
        >
          Fortress Siege
        </button>
        <button
          type="button"
          onClick={() => handleLoadPreset('cross')}
          className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
            isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-amber-800 border-slate-200'
          }`}
        >
          Twin Shields
        </button>
        <button
          type="button"
          onClick={() => handleLoadPreset('clear')}
          className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
            isDark ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-rose-800 border-slate-200'
          }`}
        >
          Clear All
        </button>
      </div>

      {/* Section 0: Artillery Cannon Base Position */}
      <div className={`border rounded-lg p-3 flex flex-col gap-2 ${
        isDark ? 'border-emerald-800/80 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/50'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-emerald-600" />
            Cannon Battery Base Position (X₀, Y₀)
          </span>
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
            isDark ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300' : 'bg-white border-emerald-300 text-emerald-800'
          }`}>
            ({cannonX}, {cannonY})
          </span>
        </div>

        <p className={`text-[11px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Reposition the cannon anywhere on the grid. Custom origins demonstrate point-slope equations <code className="font-bold text-emerald-700">y - y₀ = m(x - x₀)</code> and shift the roots (where y = 0).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Base X₀ Coordinate</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCannonX((x) => Math.max(-10, x - 1))}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                -
              </button>
              <input
                type="number"
                min="-10"
                max="10"
                value={cannonX}
                onChange={(e) => setCannonX(Math.max(-10, Math.min(10, parseInt(e.target.value, 10) || 0)))}
                className={`w-full px-2 py-1 text-xs font-mono font-bold rounded text-center border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-emerald-300' : 'bg-white border-slate-200 text-emerald-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setCannonX((x) => Math.min(10, x + 1))}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Base Y₀ Coordinate</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCannonY((y) => Math.max(-10, y - 1))}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                -
              </button>
              <input
                type="number"
                min="-10"
                max="10"
                value={cannonY}
                onChange={(e) => setCannonY(Math.max(-10, Math.min(10, parseInt(e.target.value, 10) || 0)))}
                className={`w-full px-2 py-1 text-xs font-mono font-bold rounded text-center border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-emerald-300' : 'bg-white border-slate-200 text-emerald-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setCannonY((y) => Math.min(10, y + 1))}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                +
              </button>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-medium">Quick Battery Placements:</span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => { setCannonX(0); setCannonY(0); }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                (0, 0) Origin
              </button>
              <button
                type="button"
                onClick={() => { setCannonX(-4); setCannonY(-2); }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-emerald-800 border-slate-200'
                }`}
              >
                (-4, -2) Q3
              </button>
              <button
                type="button"
                onClick={() => { setCannonX(4); setCannonY(-3); }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-emerald-800 border-slate-200'
                }`}
              >
                (4, -3) Q4
              </button>
              <button
                type="button"
                onClick={() => { setCannonX(-5); setCannonY(4); }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-emerald-800 border-slate-200'
                }`}
              >
                (-5, 4) Q2
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Click Mode Selector */}
        {setClickMode && (
          <div className={`flex items-center justify-between pt-2 border-t text-[11px] ${
            isDark ? 'border-slate-800/80' : 'border-emerald-200/80'
          }`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Grid Click Action:</span>
            <div className={`flex items-center gap-1 p-0.5 rounded border ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setClickMode('target')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  clickMode === 'target'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Place Target
              </button>
              <button
                type="button"
                onClick={() => setClickMode('cannon')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                  clickMode === 'cannon'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                Place Cannon Base
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 1: Set Target Coordinates */}
      <div className={`border rounded-lg p-3 flex flex-col gap-2 ${
        isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
            <TargetIcon className="w-4 h-4 text-sky-500" />
            Add Target Point
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Targets: {targets.length}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">X Coordinate</label>
            <input
              type="number"
              min="-10"
              max="10"
              value={newTargetX}
              onChange={(e) => setNewTargetX(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-2.5 py-1 text-xs font-mono font-bold rounded border ${
                isDark ? 'bg-slate-900 border-slate-700 text-sky-300' : 'bg-white border-slate-200 text-sky-800'
              }`}
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Y Coordinate</label>
            <input
              type="number"
              min="-10"
              max="10"
              value={newTargetY}
              onChange={(e) => setNewTargetY(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-2.5 py-1 text-xs font-mono font-bold rounded border ${
                isDark ? 'bg-slate-900 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-amber-800'
              }`}
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Type</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as 'drone' | 'cruiser')}
              className={`w-full px-2 py-1 text-xs rounded border ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="drone">Drone (Light)</option>
              <option value="cruiser">Cruiser (Armored)</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddTarget}
              className="w-full py-1.5 px-3 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Targets Chips */}
        {targets.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {targets.map((t) => (
              <span
                key={t.id}
                className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                }`}
              >
                <span className="text-sky-600 font-bold">({t.x}, {t.y})</span>
                <span className="text-[10px] text-slate-500 font-sans">{t.type}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTarget(t.id)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Set Wall Barriers (Requires Quadratic Cannon) */}
      <div className={`border rounded-lg p-3 flex flex-col gap-2 ${
        isDark ? 'border-amber-900/40 bg-amber-950/20' : 'border-amber-200 bg-amber-50/50'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
            <Shield className="w-4 h-4 text-amber-500" />
            Add Wall Barrier (Blocks Linear Shots)
          </span>
          <span className={`text-[11px] font-mono ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>Walls: {walls.length}</span>
        </div>

        <p className={`text-[11px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Linear shots traveling along <code className="font-bold text-sky-700">y = mx</code> will be blocked. Students must use the <strong className="text-amber-700">Quadratic Cannon</strong> to lob over these walls!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">X₁ Start</label>
            <input
              type="number"
              min="-10"
              max="10"
              value={wallX1}
              onChange={(e) => setWallX1(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-2 py-1 text-xs font-mono font-bold rounded border ${
                isDark ? 'bg-slate-900 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-amber-800'
              }`}
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Y₁ Start</label>
            <input
              type="number"
              min="-10"
              max="10"
              value={wallY1}
              onChange={(e) => setWallY1(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-2 py-1 text-xs font-mono font-bold rounded border ${
                isDark ? 'bg-slate-900 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-amber-800'
              }`}
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">X₂ End</label>
            <input
              type="number"
              min="-10"
              max="10"
              value={wallX2}
              onChange={(e) => setWallX2(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-2 py-1 text-xs font-mono font-bold rounded border ${
                isDark ? 'bg-slate-900 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-amber-800'
              }`}
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Y₂ End</label>
            <input
              type="number"
              min="-10"
              max="10"
              value={wallY2}
              onChange={(e) => setWallY2(parseInt(e.target.value, 10) || 0)}
              className={`w-full px-2 py-1 text-xs font-mono font-bold rounded border ${
                isDark ? 'bg-slate-900 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-amber-800'
              }`}
            />
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-end">
            <button
              type="button"
              onClick={handleAddWall}
              className="w-full py-1.5 px-3 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Wall Chips */}
        {walls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {walls.map((w) => (
              <span
                key={w.id}
                className={`px-2 py-1 rounded border text-[11px] font-mono flex items-center gap-1.5 ${
                  isDark ? 'bg-amber-950/40 border-amber-800/60 text-amber-300' : 'bg-white border-amber-200 text-amber-900 shadow-2xs'
                }`}
              >
                <span>
                  ({w.x1}, {w.y1}) ➔ ({w.x2}, {w.y2})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveWall(w.id)}
                  className="text-amber-500 hover:text-rose-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Launch Mission CTA */}
      <div className="pt-1 flex items-center justify-between">
        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Ready to test? Load this scenario in the <strong>Custom Mission</strong> tab.
        </span>
        <button
          type="button"
          onClick={onLaunchCustomMission}
          className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch & Play Mission</span>
        </button>
      </div>
    </div>
  );
};
