import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Users,
  ChevronRight,
  CheckCircle2,
  Crown,
  Calendar,
} from 'lucide-react';
import { ThemeMode, SurveySubmission } from '../types';
import { soundEngine } from '../utils/audio';
import { PhotoSlider } from './PhotoSlider';
import { SubmissionMeter } from './SubmissionMeter';

interface FirstInterfaceProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  submissions: SurveySubmission[];
  isOwner: boolean;
  isPublished: boolean;
  onOpenOwnerModal: () => void;
  onNavigateToMembers: () => void;
  onNavigateToSubmissions: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const FirstInterface: React.FC<FirstInterfaceProps> = ({
  theme,
  submissions,
  isOwner,
  isPublished,
  onOpenOwnerModal,
  onNavigateToMembers,
  onNavigateToSubmissions,
}) => {
  const completedCount = submissions.length;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col items-center gap-4 sm:gap-6">
      
      {/* 3- "THE ORACLE BIRTHDAY" SEPARATELY DISPLAYED ABOVE THE CARD WITH A TURNING ICON */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full flex items-center justify-center pt-1 pb-1"
      >
        <div
          className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border shadow-xl backdrop-blur-md transition-all ${
            theme === 'night'
              ? 'bg-[#131826]/90 border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.2)] text-[#F4D03F]'
              : 'bg-white/95 border-[#C89B27]/50 shadow-[0_10px_30px_rgba(200,155,39,0.15)] text-[#9A7210]'
          }`}
        >
          {/* Turning / Rotating Icon */}
          <Sparkles
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] animate-spin shrink-0"
            style={{ animationDuration: '7s' }}
          />

          <span className="font-serif font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            THE ORACLE BIRTHDAY
          </span>

          {/* Secondary Turning Icon in Reverse Direction */}
          <Sparkles
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] animate-spin shrink-0"
            style={{ animationDuration: '7s', animationDirection: 'reverse' }}
          />
        </div>
      </motion.div>

      {/* MAIN LAYOUT: Single Master Hero Card + Submission Progress Meter */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* UNIFIED MASTER HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`lg:col-span-7 flex flex-col justify-between p-5 sm:p-7 md:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
            theme === 'night'
              ? 'bg-[#131826]/90 border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] text-[#E0D7C6]'
              : 'bg-white/95 border-[#C89B27]/40 shadow-[0_15px_40px_rgba(200,155,39,0.12)] text-[#1E2330]'
          }`}
        >
          {/* Ambient Starlight Radial Accent */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Section 1: Hero Tribute Copy */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className={`inline-flex items-center gap-1.5 text-xs font-serif ${
                theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#8C6B1F]'
              }`}>
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Olympia Sanctuary</span>
              </div>

              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                Ancient Greece Edition
              </span>
            </div>

            <h2 className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-light tracking-tight leading-tight mb-2 italic ${
              theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
            }`}>
              Honoring The Birthday Boy
            </h2>

            <p className={`text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-6 font-serif ${
              theme === 'night' ? 'text-[#E0D7C6]/75' : 'text-[#5C6479]'
            }`}>
              Step into the sacred halls of Mount Olympus. Cast your answers in the 2-Segment Birthday Survey to grant divine blessings, funny memories, and trivia prowess!
            </p>
          </div>

          {/* Section 2: Integrated Auto-Sliding Picture Carousel (Olympia & Ancient Greece) */}
          <div className="mb-5 sm:mb-6">
            <PhotoSlider />
          </div>

          {/* Section 3: Integrated Action Row */}
          <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playChime();
                onNavigateToMembers();
              }}
              className="w-full sm:w-auto flex-1 py-3.5 sm:py-4 px-5 sm:px-6 rounded-full bg-[#D4AF37] hover:bg-[#F9E8B3] text-[#0A0B10] font-bold uppercase tracking-[0.18em] text-xs transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ASSEMBLE FOR THE TRIALS</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            <button
              onClick={() => {
                soundEngine.playPluck(659.25);
                if (!isPublished && !isOwner) {
                  onOpenOwnerModal();
                } else {
                  onNavigateToSubmissions();
                }
              }}
              className={`w-full sm:w-auto py-3.5 sm:py-4 px-5 sm:px-6 rounded-full border text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                theme === 'night'
                  ? 'bg-[#0B0E17] text-[#E0D7C6] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                  : 'bg-[#F4EFE6] text-[#1E2330] border-[#C89B27]/40 hover:border-[#C89B27]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {isPublished || isOwner ? 'Survey Vault' : 'Vault (Locked)'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Received vs Remaining Meter + Council Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-5 flex flex-col justify-between gap-6"
        >
          {/* Submission Meter (Received vs Remaining) */}
          <SubmissionMeter theme={theme} receivedCount={completedCount} totalMembers={10} />

          {/* Olympian Council Overview Card */}
          <div
            className={`p-6 rounded-3xl border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between gap-4 ${
              theme === 'night'
                ? 'bg-[#131826]/90 border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.12)] text-[#E0D7C6]'
                : 'bg-white/95 border-[#C89B27]/35 shadow-[0_10px_30px_rgba(200,155,39,0.1)] text-[#1E2330]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-serif font-bold text-sm tracking-wide ${
                  theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
                }`}>
                  10 Olympian Council Members
                </h3>
                <p className={`text-xs ${
                  theme === 'night' ? 'text-[#E0D7C6]/60' : 'text-[#5C6479]'
                }`}>
                  Each member holds a unique secret passcode (e.g. ZEUS01, ATHENA02) to record their survey.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-serif pt-2 border-t border-[#D4AF37]/20">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span className={`font-bold ${theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'}`}>10 Passcodes</span>
              </div>
              <div
                onClick={onOpenOwnerModal}
                className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center gap-2 cursor-pointer hover:bg-[#D4AF37]/20 transition-colors"
              >
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className={`font-bold ${theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'}`}>Owner Vault</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
