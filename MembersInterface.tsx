import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  KeyRound,
  UserCheck,
  Search,
  Sparkles,
  X,
  Lock,
  CheckCircle2,
  Crown,
  Tag,
  Clock,
} from 'lucide-react';
import { Member, SurveySubmission, ThemeMode } from '../types';
import { OLYMPIAN_MEMBERS } from '../data/surveyData';
import { IconHelper } from './IconHelper';
import { soundEngine } from '../utils/audio';

interface MembersInterfaceProps {
  theme: ThemeMode;
  submissions: SurveySubmission[];
  onSelectMemberForSurvey: (member: Member, nickname: string) => void;
  onBackToHome: () => void;
}

export const MembersInterface: React.FC<MembersInterfaceProps> = ({
  theme,
  submissions,
  onSelectMemberForSurvey,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const completedMemberIds = new Set(submissions.map((s) => s.memberId));

  const filteredMembers = OLYMPIAN_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.defaultNickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (member: Member) => {
    soundEngine.playPluck(523.25);
    setSelectedMember(member);
    setNicknameInput(member.defaultNickname);
    setPasscodeInput('');
    setPasscodeError('');
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
    setPasscodeError('');
  };

  const handleVerifyAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const trimmedCode = passcodeInput.trim().toUpperCase();
    if (trimmedCode !== selectedMember.code) {
      soundEngine.playPluck(220);
      setPasscodeError(`Invalid passcode! Use ${selectedMember.code} to proceed.`);
      return;
    }

    soundEngine.playFanfare();
    const nickname = nicknameInput.trim() || selectedMember.defaultNickname;
    onSelectMemberForSurvey(selectedMember, nickname);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            soundEngine.playPluck(440);
            onBackToHome();
          }}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            theme === 'night'
              ? 'bg-[#131826] border-[#D4AF37]/30 text-[#E0D7C6] hover:bg-[#D4AF37]/20'
              : 'bg-[#F4EFE6] border-[#C89B27]/40 text-[#1E2330] hover:bg-[#C89B27]/20'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Return to Olympus</span>
        </button>

        <div className="text-left sm:text-right">
          <h2 className={`font-serif text-2xl font-light tracking-wide ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
          }`}>
            The 10 Olympian Council Members
          </h2>
          <p className={`text-xs font-serif ${
            theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
          }`}>
            Select an oracle card & enter secret passcode to submit survey answers
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 relative max-w-md mx-auto">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search oracle by name or title..."
          className={`w-full pl-11 pr-4 py-2.5 rounded-full border text-xs font-serif outline-none shadow-md transition-all ${
            theme === 'night'
              ? 'bg-[#131826]/90 border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#E0D7C6] placeholder-[#E0D7C6]/40'
              : 'bg-white border-[#C89B27]/40 focus:border-[#9A7210] text-[#1E2330] placeholder-[#5C6479]/50'
          }`}
        />
      </div>

      {/* 10 Olympian Member Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
        {filteredMembers.map((member, idx) => {
          const isCompleted = completedMemberIds.has(member.id);

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -4, scale: 1.015 }}
              onClick={() => handleCardClick(member)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-xs hover:shadow-md ${
                theme === 'night'
                  ? 'bg-[#131826]/95 border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#E0D7C6] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                  : 'bg-white border-[#EADDCD] hover:border-[#C89B27] text-[#1E2330] hover:shadow-[0_8px_25px_rgba(200,155,39,0.12)]'
              }`}
            >
              {/* Top Row: Square Icon Box (Left) + Status Pill Badge (Right) */}
              <div className="flex items-start justify-between gap-1.5">
                {/* Icon Box */}
                <div
                  className={`w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold border transition-transform group-hover:scale-105 shrink-0 ${
                    theme === 'night'
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37]/35 text-[#F4D03F]'
                      : 'bg-[#FFF9EE] border-[#F2E3C6] text-[#B8860B]'
                  }`}
                >
                  <IconHelper name={member.avatarIcon} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Status Pill Badge */}
                {isCompleted ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium border ${
                      theme === 'night'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                        : 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]'
                    }`}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Done</span>
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium border ${
                      theme === 'night'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                        : 'bg-[#FFF8E7] text-[#8C6200] border-[#F5E5BE]'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-[#B8860B] dark:text-[#F4D03F] shrink-0" />
                    <span>Pending</span>
                  </span>
                )}
              </div>

              {/* Middle Row: Name + Title (Role) */}
              <div className="mt-3 mb-2.5 text-left">
                <h3
                  className={`font-serif text-sm sm:text-base font-bold tracking-tight line-clamp-1 group-hover:text-[#B8860B] dark:group-hover:text-[#F4D03F] transition-colors ${
                    theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
                  }`}
                >
                  {member.name}
                </h3>
                <p
                  className={`text-[11px] sm:text-xs font-serif mt-0.5 line-clamp-1 leading-relaxed ${
                    theme === 'night' ? 'text-[#E0D7C6]/75' : 'text-[#7C5E10]'
                  }`}
                >
                  {member.title}
                </p>
              </div>

              {/* Bottom Row: Olympian #0X + Key Icon Select Trigger */}
              <div
                className={`pt-2 border-t flex items-center justify-between text-xs font-serif ${
                  theme === 'night' ? 'border-[#D4AF37]/20' : 'border-[#F2E8D5]'
                }`}
              >
                <span
                  className={`text-[10px] sm:text-[11px] tracking-wide ${
                    theme === 'night' ? 'text-[#E0D7C6]/50' : 'text-[#8A92A6]'
                  }`}
                >
                  Olympian #{String(idx + 1).padStart(2, '0')}
                </span>

                <div
                  className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-xs font-bold transition-all ${
                    theme === 'night'
                      ? 'bg-[#D4AF37]/15 group-hover:bg-[#D4AF37] group-hover:text-[#0A0B10] text-[#F4D03F] border-[#D4AF37]/30'
                      : 'bg-[#FFF9EE] group-hover:bg-[#D4AF37] group-hover:text-[#0A0B10] text-[#9A7210] border-[#D4AF37]/40'
                  }`}
                >
                  <KeyRound className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Select</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MEMBER VERIFICATION MODAL */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl relative overflow-hidden ${
                theme === 'night'
                  ? 'bg-[#131826] border-[#D4AF37]/40 text-[#E0D7C6]'
                  : 'bg-white border-[#C89B27]/40 text-[#1E2330]'
              }`}
            >
              {/* Close Modal Button */}
              <button
                onClick={handleCloseModal}
                className={`absolute top-4 right-4 p-2 rounded-full border transition-colors cursor-pointer ${
                  theme === 'night'
                    ? 'bg-[#0B0E17] text-[#E0D7C6]/60 hover:text-[#F4D03F] border-[#D4AF37]/20'
                    : 'bg-[#F4EFE6] text-[#5C6479] hover:text-[#9A7210] border-[#C89B27]/20'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedMember.color} flex items-center justify-center text-[#0A0B10] font-bold shadow-md border border-[#D4AF37]/40`}
                >
                  <IconHelper name={selectedMember.avatarIcon} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-serif text-xl font-light ${
                    theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
                  }`}>
                    {selectedMember.name}
                  </h3>
                  <p className={`text-xs uppercase tracking-wider font-sans ${
                    theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
                  }`}>
                    {selectedMember.title}
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyAndProceed} className="space-y-4">
                {/* Nickname Selection Field */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5 ${
                    theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
                  }`}>
                    <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Choose Your Nickname:
                  </label>
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="Enter nickname..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-serif outline-none ${
                      theme === 'night'
                        ? 'bg-[#0B0E17] border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#E0D7C6]'
                        : 'bg-[#FAF7F0] border-[#C89B27]/40 focus:border-[#9A7210] text-[#1E2330]'
                    }`}
                    required
                  />
                  <p className={`text-[11px] mt-1 italic font-serif ${
                    theme === 'night' ? 'text-[#E0D7C6]/60' : 'text-[#5C6479]'
                  }`}>
                    Identifies your responses on your submitted card.
                  </p>
                </div>

                {/* Passcode Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
                    }`}>
                      <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Enter Passcode:
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPluck(600);
                        setPasscodeInput(selectedMember.code);
                        setPasscodeError('');
                      }}
                      className={`text-[11px] font-bold hover:underline uppercase tracking-wider cursor-pointer ${
                        theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
                      }`}
                    >
                      Fill Code ({selectedMember.code})
                    </button>
                  </div>

                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      setPasscodeError('');
                    }}
                    placeholder={`e.g. ${selectedMember.code}`}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold uppercase tracking-widest outline-none ${
                      theme === 'night'
                        ? 'bg-[#0B0E17] border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#E0D7C6]'
                        : 'bg-[#FAF7F0] border-[#C89B27]/40 focus:border-[#9A7210] text-[#1E2330]'
                    }`}
                    required
                  />
                </div>

                {/* Error message */}
                {passcodeError && (
                  <p className="text-xs text-rose-500 font-serif bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
                    {passcodeError}
                  </p>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#F9E8B3] text-[#0A0B10] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>PROCEED TO SURVEY TRIALS</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
