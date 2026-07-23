import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  X,
  Award,
  Calendar,
  MessageSquare,
  ShieldAlert,
  RotateCcw,
  Crown,
  User,
} from 'lucide-react';
import { SurveySubmission, Member, ThemeMode } from '../types';
import { OLYMPIAN_MEMBERS, SURVEY_QUESTIONS } from '../data/surveyData';
import { IconHelper } from './IconHelper';
import { soundEngine } from '../utils/audio';

interface SubmissionsInterfaceProps {
  theme: ThemeMode;
  submissions: SurveySubmission[];
  isOwner: boolean;
  isPublished: boolean;
  onTogglePublishState: (newState: boolean) => void;
  onResetData: () => void;
  onOpenOwnerModal: () => void;
  onBackToHome: () => void;
}

export const SubmissionsInterface: React.FC<SubmissionsInterfaceProps> = ({
  theme,
  submissions,
  isOwner,
  isPublished,
  onTogglePublishState,
  onResetData,
  onOpenOwnerModal,
  onBackToHome,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<SurveySubmission | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const canViewResults = isOwner || isPublished;

  const getMemberById = (id: string): Member | undefined => {
    return OLYMPIAN_MEMBERS.find((m) => m.id === id);
  };

  const handleCardClick = (sub: SurveySubmission) => {
    soundEngine.playPluck(587.33);
    setSelectedSubmission(sub);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
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
          <span>Return to Sanctuary</span>
        </button>

        <div className="text-left sm:text-right">
          <h2 className={`font-serif text-2xl font-light tracking-wide ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
          }`}>
            Submitted Survey Vault
          </h2>
          <p className={`text-xs font-serif ${
            theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
          }`}>
            {canViewResults ? 'Click on any oracle card to inspect full answers' : 'Owner Controlled Results Vault'}
          </p>
        </div>
      </div>

      {/* ACCESS DENIED / LOCKED VAULT VIEW IF NOT PUBLISHED & NOT OWNER */}
      {!canViewResults ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 sm:p-12 rounded-2xl border text-center max-w-xl mx-auto flex flex-col items-center shadow-2xl ${
            theme === 'night'
              ? 'bg-[#131826] border-[#D4AF37]/40 text-[#E0D7C6]'
              : 'bg-white border-[#C89B27]/40 text-[#1E2330]'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Lock className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h3 className={`font-serif text-2xl font-light mb-2 ${
            theme === 'night' ? 'text-[#E0D7C6]' : 'text-[#9A7210]'
          }`}>
            Survey Results are Private
          </h3>

          <p className={`text-sm mb-6 leading-relaxed font-serif ${
            theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
          }`}>
            The submitted surveys and results are currently visible only to the Owner. Once the Birthday Boy / Owner toggles "Publish Results", all submitted cards will be revealed to everyone here!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playPluck(600);
                onOpenOwnerModal();
              }}
              className="py-3.5 px-8 rounded-full bg-[#D4AF37] hover:bg-[#F9E8B3] text-[#0A0B10] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>Log In as Owner</span>
            </button>

            <button
              onClick={onBackToHome}
              className={`py-3.5 px-8 rounded-full font-bold text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
                theme === 'night'
                  ? 'bg-[#0B0E17] text-[#E0D7C6] border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                  : 'bg-[#FAF7F0] text-[#1E2330] border-[#C89B27]/30 hover:border-[#C89B27]'
              }`}
            >
              Return Home
            </button>
          </div>
        </motion.div>
      ) : (
        /* OWNER / PUBLISHED RESULTS VIEW */
        <div>
          {/* Owner Control Dashboard Bar */}
          <div
            className={`mb-6 p-4 rounded-2xl border backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-md ${
              theme === 'night'
                ? 'bg-[#131826]/90 border-[#D4AF37]/40 text-[#E0D7C6]'
                : 'bg-white border-[#C89B27]/35 text-[#1E2330]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] block ${
                  theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'
                }`}>
                  Vault Controls
                </span>
                <span className="text-sm font-serif">
                  Total Submissions: <strong className={theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'}>{submissions.length} / 10</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Owner Toggle for Visibility */}
              {isOwner && (
                <button
                  onClick={() => {
                    soundEngine.playChime();
                    onTogglePublishState(!isPublished);
                  }}
                  className={`py-2.5 px-5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    isPublished
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                      : 'bg-[#D4AF37]/20 text-[#9A7210] dark:text-[#D4AF37] border-[#D4AF37]/40'
                  }`}
                >
                  {isPublished ? (
                    <>
                      <Eye className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <span>Results Published to Everyone</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-[#D4AF37]" />
                      <span>Publish Results to Everyone</span>
                    </>
                  )}
                </button>
              )}

              {/* Reset Submissions Option */}
              {isOwner && (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2.5 px-4 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset demo data"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden md:inline">Reset Submissions</span>
                </button>
              )}
            </div>
          </div>

          {/* CARDS GRID FOR ORGANIZED DISPLAY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {submissions.map((sub) => {
              const member = getMemberById(sub.memberId);
              if (!member) return null;

              return (
                <motion.div
                  key={sub.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCardClick(sub)}
                  className={`p-4 rounded-2xl border backdrop-blur-xl shadow-md cursor-pointer flex flex-col justify-between relative group transition-all ${
                    theme === 'night'
                      ? 'bg-[#131826]/90 border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#E0D7C6]'
                      : 'bg-white border-[#C89B27]/35 hover:border-[#9A7210] text-[#1E2330]'
                  }`}
                >
                  {/* Small Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-[#0A0B10] font-bold shrink-0 shadow-sm border border-[#D4AF37]/30`}
                      >
                        <IconHelper name={member.avatarIcon} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`font-serif text-sm group-hover:text-[#D4AF37] transition-colors line-clamp-1 ${
                          theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
                        }`}>
                          {sub.nickname}
                        </h4>
                        <span className={`text-[10px] ${
                          theme === 'night' ? 'text-[#E0D7C6]/60' : 'text-[#5C6479]'
                        }`}>
                          {member.name}
                        </span>
                      </div>
                    </div>

                    {/* Vaulted Badge (No public score numbers displayed) */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0 font-sans">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Vaulted
                    </span>
                  </div>

                  {/* Submission date tag */}
                  <div className="flex items-center justify-between text-[10px] text-[#5C6479] dark:text-[#E0D7C6]/50 mt-2 pt-2 border-t border-[#D4AF37]/20 font-serif">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                    <span className="text-[#9A7210] dark:text-[#D4AF37] font-sans font-semibold group-hover:underline">
                      Inspect →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* FULL ANSWERS DETAILED MODAL */}
          <AnimatePresence>
            {selectedSubmission && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl border shadow-2xl relative ${
                    theme === 'night'
                      ? 'bg-[#131826] border-[#D4AF37]/40 text-[#E0D7C6]'
                      : 'bg-white border-[#C89B27]/40 text-[#1E2330]'
                  }`}
                >
                  {/* Modal Close Button */}
                  <button
                    onClick={handleCloseModal}
                    className={`absolute top-4 right-4 p-2 rounded-full border transition-colors cursor-pointer ${
                      theme === 'night'
                        ? 'bg-[#0B0E17] text-[#E0D7C6]/60 hover:text-[#F4D03F] border-[#D4AF37]/20'
                        : 'bg-[#FAF7F0] text-[#5C6479] hover:text-[#9A7210] border-[#C89B27]/20'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Member Profile Header */}
                  {(() => {
                    const member = getMemberById(selectedSubmission.memberId);
                    if (!member) return null;

                    return (
                      <div>
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#D4AF37]/20">
                          <div
                            className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-[#0A0B10] font-bold shadow-lg border border-[#D4AF37]/40`}
                          >
                            <IconHelper name={member.avatarIcon} className="w-7 h-7" />
                          </div>
                          <div>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-bold uppercase tracking-wider mb-1 ${
                              theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'
                            }`}>
                              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>{member.name} • {member.title}</span>
                            </div>
                            <h3 className={`font-serif text-2xl font-light ${
                              theme === 'night' ? 'text-[#E0D7C6]' : 'text-[#9A7210]'
                            }`}>
                              {selectedSubmission.nickname}'s Full Survey Scroll
                            </h3>
                            <p className={`text-xs font-serif ${
                              theme === 'night' ? 'text-[#E0D7C6]/60' : 'text-[#5C6479]'
                            }`}>
                              Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* High Score Privilege Section (If Present) */}
                        {selectedSubmission.highScorePrivilege && (
                          <div className={`p-4 rounded-xl border mb-6 ${
                            theme === 'night' ? 'bg-[#0B0E17] border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-[#FAF7F0] border-[#C89B27]/50'
                          }`}>
                            <h5 className="text-[10px] font-bold text-[#9A7210] dark:text-[#D4AF37] uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5 font-sans">
                              <Crown className="w-4 h-4 text-[#D4AF37]" />
                              <span>
                                High Score Privilege {
                                  selectedSubmission.highScorePrivilege.type === 'dare' ? 'Royal Dare' :
                                  selectedSubmission.highScorePrivilege.type === 'wish' ? 'Special Wish' :
                                  selectedSubmission.highScorePrivilege.type === 'question' ? 'Truth Question' : 'Request / Command'
                                }:
                              </span>
                            </h5>
                            <p className="text-sm font-serif italic text-[#1E2330] dark:text-[#E0D7C6] mb-2.5">
                              "{selectedSubmission.highScorePrivilege.content}"
                            </p>
                            <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-serif text-amber-800 dark:text-amber-300 flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                              <span>
                                Refusal Penalty: {selectedSubmission.highScorePrivilege.punishmentPenalty ? selectedSubmission.highScorePrivilege.punishmentPenalty : `If the Birthday Boy refuses this ${selectedSubmission.highScorePrivilege.type}, he MUST be punished by an Olympian Dare!`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Full Questions and Selected Answers Breakdown */}
                        <h4 className="font-serif text-lg font-light text-[#9A7210] dark:text-[#E0D7C6] mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                          <span>Detailed Survey Answers</span>
                        </h4>

                        <div className="space-y-4 mb-6">
                          {SURVEY_QUESTIONS.map((q, idx) => {
                            const answerRecord = selectedSubmission.answers.find(
                              (a) => a.questionId === q.id
                            );
                            const selectedOptionIds = answerRecord?.selectedOptionIds || [];

                            return (
                              <div
                                key={q.id}
                                className={`p-4 rounded-xl border ${
                                  theme === 'night'
                                    ? 'bg-[#0B0E17] border-[#D4AF37]/20'
                                    : 'bg-[#FAF7F0] border-[#C89B27]/20'
                                }`}
                              >
                                <div className="text-xs font-bold text-[#9A7210] dark:text-[#D4AF37] uppercase tracking-wider mb-1 font-sans">
                                  Q{idx + 1}. {q.title}
                                </div>

                                <div className="space-y-1.5 mt-2">
                                  {q.type === 'text' ? (
                                    <div className="p-3 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-serif text-[#1E2330] dark:text-[#E0D7C6] italic">
                                      "{answerRecord?.textAnswer || 'No response provided'}"
                                    </div>
                                  ) : (
                                    (q.options || []).map((opt) => {
                                      const isSelected = selectedOptionIds.includes(opt.id);
                                      if (!isSelected) return null;

                                      return (
                                        <div
                                          key={opt.id}
                                          className="p-2.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-serif text-[#1E2330] dark:text-[#E0D7C6] flex items-center gap-2"
                                        >
                                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                          <span>{opt.text}</span>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Personal Message / Note */}
                        {selectedSubmission.relationshipNotes && (
                          <div className={`p-4 rounded-xl border ${
                            theme === 'night' ? 'bg-[#0B0E17] border-[#D4AF37]/30' : 'bg-[#FAF7F0] border-[#C89B27]/30'
                          }`}>
                            <h5 className="text-[10px] font-bold text-[#9A7210] dark:text-[#D4AF37] uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                              <span>Personal Birthday Message:</span>
                            </h5>
                            <p className="text-sm italic text-[#1E2330] dark:text-[#E0D7C6] font-serif">
                              "{selectedSubmission.relationshipNotes}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* RESET CONFIRMATION MODAL */}
          <AnimatePresence>
            {showResetConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl text-center ${
                    theme === 'night'
                      ? 'bg-[#131826] border-rose-500/40 text-[#E0D7C6]'
                      : 'bg-white border-rose-500/40 text-[#1E2330]'
                  }`}
                >
                  <ShieldAlert className="w-12 h-12 text-rose-500 dark:text-rose-400 mx-auto mb-3" />
                  <h3 className="font-serif text-xl font-light text-[#1E2330] dark:text-[#E0D7C6] mb-2">
                    Reset Survey Submissions?
                  </h3>
                  <p className="text-xs text-[#5C6479] dark:text-[#E0D7C6]/70 mb-6 font-serif">
                    This will restore the initial seed submissions. Are you sure?
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        onResetData();
                        setShowResetConfirm(false);
                      }}
                      className="py-2.5 px-6 rounded-full bg-rose-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className={`py-2.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider border cursor-pointer ${
                        theme === 'night'
                          ? 'bg-[#0B0E17] text-[#E0D7C6] border-[#D4AF37]/20'
                          : 'bg-[#FAF7F0] text-[#1E2330] border-[#C89B27]/30'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
