import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  PieChart, 
  Grid3X3, 
  FlipHorizontal2, 
  Calculator, 
  Crosshair, 
  Sun, 
  Car,
  Search
} from 'lucide-react';
import { MODULES_REGISTRY } from '../data/modulesRegistry';

interface NavigationDockProps {
  activeModule: string | null;
  onSelectModule: (id: string | null) => void;
  onOpenCommandPalette: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  PieChart,
  Grid3X3,
  FlipHorizontal2,
  Calculator,
  Crosshair,
  Sun,
  Car,
};

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeModule,
  onSelectModule,
  onOpenCommandPalette,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="retro-dock px-3 py-2 rounded-xl flex items-center gap-2 border-3 border-black bg-[#FFFDF5] shadow-[5px_5px_0px_#000]"
      >
        {/* Hub / Home button */}
        <DockItem
          icon={Home}
          label="Hub Overview"
          shortcut="Esc"
          isActive={activeModule === null}
          onClick={() => onSelectModule(null)}
          color="#FFD166"
        />

        <div className="w-0.5 h-6 bg-black/20 mx-0.5" />

        {/* Modules items */}
        {MODULES_REGISTRY.map((mod) => {
          const IconComp = ICON_MAP[mod.iconName] || PieChart;
          return (
            <DockItem
              key={mod.id}
              icon={IconComp}
              label={mod.title}
              shortcut={mod.shortcut}
              isActive={activeModule === mod.id}
              onClick={() => onSelectModule(mod.id)}
              color={mod.colorScheme.primary}
            />
          );
        })}

        <div className="w-0.5 h-6 bg-black/20 mx-0.5" />

        {/* Command palette search button */}
        <DockItem
          icon={Search}
          label="Search Modules"
          shortcut="?K"
          isActive={false}
          onClick={onOpenCommandPalette}
          color="#E2E8F0"
        />
      </motion.nav>
    </div>
  );
};

interface DockItemProps {
  icon: React.ElementType;
  label: string;
  shortcut: string;
  isActive: boolean;
  onClick: () => void;
  color: string;
}

const DockItem: React.FC<DockItemProps> = ({
  icon: Icon,
  label,
  shortcut,
  isActive,
  onClick,
  color,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`relative group p-2 rounded-lg transition-all flex items-center justify-center border-2 ${
        isActive
          ? 'border-black text-black shadow-[2px_2px_0px_#000]'
          : 'border-transparent text-slate-700 hover:text-black hover:border-black/50 hover:bg-[#FFF9E6]'
      }`}
      style={{
        backgroundColor: isActive ? color : undefined,
      }}
      aria-label={label}
    >
      <Icon className="w-5 h-5 stroke-[2.2]" />

      {/* Retro Tooltip Sticky Note */}
      <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#FEF08A] border-2 border-black text-black text-xs font-mono font-bold rounded shadow-[2px_2px_0px_#000] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1.5">
        <span>{label}</span>
        <span className="text-[10px] bg-black text-white px-1 py-0.2 rounded font-mono">
          {shortcut}
        </span>
      </div>
    </motion.button>
  );
};
