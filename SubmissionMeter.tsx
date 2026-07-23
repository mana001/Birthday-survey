import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, BarChart3, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';

interface SubmissionMeterProps {
  theme: ThemeMode;
  receivedCount: number;
  totalMembers?: number;
}

export const SubmissionMeter: React.FC<SubmissionMeterProps> = ({
  theme,
  receivedCount,
  totalMembers = 10,
}) => {
  const remainingCount = Math.max(0, totalMembers - receivedCount);
  const percentage = Math.round((receivedCount / totalMembers) * 100);

  return (
    <div
      className={`p-5 rounded-2xl backdrop-blur-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        theme === 'night'
          ? 'bg-[#131826]/90 border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.12)] text-[#E0D7C6]'
          : 'bg-white/90 border-[#C89B27]/35 shadow-[0_10px_30px_rgba(200,155,39,0.1)] text-[#1E2330]'
      }`}
    >
      {/* Background Subtle Accent */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className={`font-serif text-xs font-bold uppercase tracking-wider ${
              theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
            }`}>
              Council Response Progress
            </h3>
            <p className={`text-[10px] font-sans ${
              theme === 'night' ? 'text-[#E0D7C6]/60' : 'text-[#5C6479]'
            }`}>
              Survey Submissions Track
            </p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[11px] font-bold ${
          theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
        }`}>
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>{percentage}%</span>
        </div>
      </div>

      {/* Compact Opposite Scale: Received (Left) vs Remaining (Right) */}
      <div className="flex items-center justify-between gap-3 my-2 px-1">
        {/* RECEIVED BADGE (LEFT) */}
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold shrink-0 ${
            theme === 'night' ? 'text-emerald-400' : 'text-emerald-700'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              theme === 'night' ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              Received:
            </span>
            <span className={`font-serif text-sm font-bold ${
              theme === 'night' ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              {receivedCount}
            </span>
          </div>
        </div>

        {/* REMAINING BADGE (RIGHT) */}
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-1.5 text-right">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              theme === 'night' ? 'text-amber-300' : 'text-amber-800'
            }`}>
              Remaining:
            </span>
            <span className={`font-serif text-sm font-bold ${
              theme === 'night' ? 'text-amber-300' : 'text-amber-800'
            }`}>
              {remainingCount}
            </span>
          </div>
          <div className={`w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold shrink-0 ${
            theme === 'night' ? 'text-amber-400' : 'text-amber-700'
          }`}>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Clean Solid Gold Meter Bar (No Multicolor Gradient) */}
      <div className="mt-2 pt-2 border-t border-[#D4AF37]/20">
        <div className="h-2 w-full bg-[#0B0E17]/20 dark:bg-[#0B0E17]/80 rounded-full overflow-hidden border border-[#D4AF37]/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
