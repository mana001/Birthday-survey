import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Sun,
  Moon,
  Music,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { soundEngine } from '../utils/audio';

interface HeaderBarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isOwner: boolean;
  onOpenOwnerModal: () => void;
  onNavigateHome: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  theme,
  onToggleTheme,
  isMusicPlaying,
  onToggleMusic,
  isMuted,
  onToggleMute,
  isOwner,
  onOpenOwnerModal,
  onNavigateHome,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-4 pb-2 flex flex-col gap-2 border-b border-[#D4AF37]/20 pb-4 mb-2 z-20">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex items-center justify-between gap-4"
      >
        {/* FAR LEFT: Elegant Pure Text "OLYMPIA" */}
        <button
          onClick={() => {
            soundEngine.playPluck(523.25);
            onNavigateHome();
          }}
          className="flex flex-col text-left cursor-pointer group"
          title="Return to Home Sanctuary"
        >
          <h1 className={`font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.3em] uppercase transition-all group-hover:text-[#D4AF37] leading-none ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
          }`}>
            OLYMPIA
          </h1>
          <span className={`text-[9px] font-sans tracking-[0.25em] font-bold uppercase mt-1 ${
            theme === 'night' ? 'text-[#D4AF37]/80' : 'text-[#8C6B1F]/80'
          }`}>
            Sacred Birthday Survey
          </span>
        </button>

        {/* FAR RIGHT: Small Floating Strip Menu */}
        <div
          className={`flex items-center gap-1 sm:gap-2 p-1.5 rounded-full backdrop-blur-xl border shadow-lg transition-colors ${
            theme === 'night'
              ? 'bg-[#131826]/95 border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
              : 'bg-white/95 border-[#C89B27]/35 shadow-[0_8px_25px_rgba(200,155,39,0.12)]'
          }`}
        >
          {/* HOME Button */}
          <button
            onClick={() => {
              soundEngine.playPluck(523.25);
              onNavigateHome();
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              theme === 'night'
                ? 'bg-[#0B0E17] text-[#F4D03F] border-[#D4AF37]/40 hover:bg-[#D4AF37]/20'
                : 'bg-[#F4EFE6] text-[#9A7210] border-[#C89B27]/40 hover:bg-[#C89B27]/20'
            }`}
            title="Return to Home"
          >
            <Home className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>HOME</span>
          </button>

          {/* MUSIC Button */}
          <button
            onClick={() => {
              soundEngine.playPluck(659.25);
              onToggleMusic();
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isMusicPlaying
                ? 'bg-[#D4AF37] text-[#0A0B10] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : theme === 'night'
                ? 'bg-[#0B0E17] text-[#E0D7C6]/80 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                : 'bg-[#F4EFE6] text-[#1E2330] border-[#C89B27]/30 hover:border-[#C89B27]'
            }`}
            title="Toggle Greek Promenade Music"
          >
            <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">MUSIC</span>
          </button>

          {/* SOUNDS Button (Mute/Unmute SFX) */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              !isMuted
                ? 'bg-[#D4AF37]/20 text-[#9A7210] dark:text-[#F4D03F] border-[#D4AF37]/40'
                : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
            }`}
            title="Toggle Sound Effects"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">SOUNDS</span>
              </>
            )}
          </button>

          {/* Day / Night Theme Toggle */}
          <button
            onClick={() => {
              soundEngine.playPluck(587.33);
              onToggleTheme();
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              theme === 'night'
                ? 'bg-[#0B0E17] text-[#F4D03F] border-[#D4AF37]/40 hover:bg-[#D4AF37]/20'
                : 'bg-[#F4EFE6] text-[#9A7210] border-[#C89B27]/40 hover:bg-[#C89B27]/20'
            }`}
            title="Toggle Day / Night Mode"
          >
            {theme === 'night' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#F4D03F]" />
                <span>NIGHT</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#9A7210]" />
                <span>DAY</span>
              </>
            )}
          </button>

          {/* Owner Portal Credentials Access */}
          <button
            onClick={() => {
              soundEngine.playPluck(783.99);
              onOpenOwnerModal();
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              isOwner
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
                : theme === 'night'
                ? 'bg-[#0B0E17] text-[#F4D03F] border-[#D4AF37]/40 hover:bg-[#D4AF37]/20'
                : 'bg-[#F4EFE6] text-[#9A7210] border-[#C89B27]/40 hover:bg-[#C89B27]/20'
            }`}
            title="Owner Credentials"
          >
            {isOwner ? <Unlock className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span className="hidden md:inline">{isOwner ? 'OWNER' : 'PORTAL'}</span>
          </button>
        </div>
      </motion.header>

      {/* Greek Promenade Track Attribution Bar */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] border backdrop-blur-md transition-all ${
          theme === 'night'
            ? 'bg-[#0D121F]/80 border-[#D4AF37]/20 text-[#E0D7C6]'
            : 'bg-[#F9F6F0]/90 border-[#C89B27]/20 text-[#2C2416]'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Music className={`w-3.5 h-3.5 flex-shrink-0 ${isMusicPlaying ? 'text-[#D4AF37] animate-pulse' : 'text-gray-400'}`} />
          <span className="truncate">
            <span className="font-semibold text-[#D4AF37]">Greek Promenade</span>
            <span className="opacity-70"> | Ancient Greek music</span>
            <span className="ml-1 opacity-80">by <strong>ArtManz</strong></span>
          </span>
        </div>
        <a
          href="https://pixabay.com/music/folk-greek-promenade-ancient-greek-music-330440/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[10px] font-medium text-[#D4AF37] hover:underline hover:text-[#F4D03F] transition-colors ml-2"
          title="View track on Pixabay"
        >
          Pixabay #330440 ↗
        </a>
      </motion.div>
    </div>
  );
};
