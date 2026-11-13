import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Sparkles, User, School, Shield } from 'lucide-react';
import { PIXEL_AVATARS, AVATAR_CATEGORIES, PixelAvatar } from '../../../data/avatarLibrary';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';

interface ProfileCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileCustomizationModal: React.FC<ProfileCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [chosenAvatar, setChosenAvatar] = useState<string>(user?.avatar || '🚀');
  const [chosenAvatarId, setChosenAvatarId] = useState<string>(user?.avatarId || 'avatar-astro-rocket');
  const [displayName, setDisplayName] = useState<string>(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !user) return null;

  const filteredAvatars = PIXEL_AVATARS.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  const handleSelect = (avatar: PixelAvatar) => {
    setChosenAvatar(avatar.emoji);
    setChosenAvatarId(avatar.id);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      updateProfile({
        avatar: chosenAvatar,
        avatarId: chosenAvatarId,
        displayName: displayName.trim() || user.displayName,
        isFirstLogin: false,
      });
      toast.success('Profile avatar updated successfully!');
      onClose();
    } catch {
      toast.error('Failed to update profile avatar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-mono select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-[#FFFDF5] border-3 border-black shadow-[6px_6px_0px_#000] rounded-2xl p-6 sm:p-8 text-slate-900 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#FFD166] border-2 border-black flex items-center justify-center text-sm shadow-[1px_1px_0px_#000]">
              🎨
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-black tracking-tight">
                Personalize Your STEM Passport Avatar
              </h2>
              <span className="text-[11px] text-slate-500 font-bold block">
                Choose an original pixel-art character representing your scientific journey
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-black bg-white hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border-3 border-black bg-[#FFD166]/20 shadow-[2px_2px_0px_#000] flex items-center justify-center text-4xl">
              {chosenAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-base text-black font-black">{displayName || user.displayName}</strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase border border-black bg-[#FFD166]">
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-slate-600 font-bold mt-0.5">
                {user.username ? `@${user.username}` : user.email}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {user.schoolName || 'Govt. Mizo High School, Aizawl'} • {user.grade || 'Explorer'}
              </div>
            </div>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Display Name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display Name"
              className="px-3 py-1.5 bg-[#F5F5F0] border-2 border-black rounded-lg text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#FFD166] w-full sm:w-44"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {AVATAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_#FFD166]'
                  : 'bg-white text-slate-700 border-black/20 hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Avatar Picker Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1 mb-6">
          {filteredAvatars.map((a) => {
            const isSelected = chosenAvatar === a.emoji || chosenAvatarId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => handleSelect(a)}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${a.bg} ${
                  isSelected
                    ? 'border-black shadow-[3px_3px_0px_#000] scale-105 ring-2 ring-black'
                    : 'border-black/30 hover:border-black hover:scale-102'
                }`}
              >
                <span className="text-3xl leading-none">{a.emoji}</span>
                <span className="text-[10px] font-bold text-black truncate max-w-full text-center">
                  {a.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t-2 border-black/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-bold">
            Avatars update instantly across all workshops and classroom scoreboards.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-black font-bold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              {isSaving ? 'Saving...' : 'Save Avatar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
