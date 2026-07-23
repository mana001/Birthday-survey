import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Award,
  Crown,
  HelpCircle,
  ChevronRight,
  Heart,
  MessageSquare,
  Zap,
  PenTool,
  Flame,
  Shield,
  Landmark,
  Lock,
} from 'lucide-react';
import { Member, SurveySubmission, MemberAnswer, ThemeMode, HighScorePrivilege } from '../types';
import { SURVEY_QUESTIONS } from '../data/surveyData';
import { IconHelper } from './IconHelper';
import { soundEngine } from '../utils/audio';

interface SurveyInterfaceProps {
  theme: ThemeMode;
  member: Member;
  nickname: string;
  onCompleteSurvey: (submission: SurveySubmission) => void;
  onCancel: () => void;
  onGoHome?: () => void;
}

type SurveyStep = 'intro_seg1' | 'seg1_questions' | 'seg1_privilege' | 'intro_seg2' | 'seg2_questions' | 'completed';

export const SurveyInterface: React.FC<SurveyInterfaceProps> = ({
  theme,
  member,
  nickname,
  onCompleteSurvey,
  onCancel,
  onGoHome,
}) => {
  const [surveyStep, setSurveyStep] = useState<SurveyStep>('intro_seg1');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [textInputAnswer, setTextInputAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<MemberAnswer[]>([]);
  const [relationshipNotes, setRelationshipNotes] = useState('');
  const [finalScore, setFinalScore] = useState(0);

  // High Score Privilege state
  const [privilegeType, setPrivilegeType] = useState<'dare' | 'wish' | 'question' | 'request'>('dare');
  const [privilegeContent, setPrivilegeContent] = useState('');
  const [punishmentPenalty, setPunishmentPenalty] = useState('');

  const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex];
  const totalQuestions = SURVEY_QUESTIONS.length;

  const handleOptionClick = (optionId: string) => {
    soundEngine.playPluck(500 + selectedOptionIds.length * 80);
    if (currentQuestion.type === 'single') {
      setSelectedOptionIds([optionId]);
    } else if (currentQuestion.type === 'multiple') {
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(selectedOptionIds.filter((id) => id !== optionId));
      } else {
        setSelectedOptionIds([...selectedOptionIds, optionId]);
      }
    }
  };

  // Save or update answer in state
  const saveCurrentAnswer = (qIndex: number, optIds: string[], txtAns: string) => {
    const q = SURVEY_QUESTIONS[qIndex];
    if (!q) return;

    let pointsEarned = 0;
    if (q.segment === 1) {
      if (q.type === 'text') {
        pointsEarned = txtAns.trim().length > 1 ? 1 : 0;
      } else if (q.type === 'single') {
        const correctOptionIds = (q.options || [])
          .filter((o) => o.isCorrect)
          .map((o) => o.id);
        pointsEarned = correctOptionIds.includes(optIds[0]) ? 1 : 0;
      } else if (q.type === 'multiple') {
        const correctOptionIds = (q.options || [])
          .filter((o) => o.isCorrect)
          .map((o) => o.id);
        const totalCorrect = correctOptionIds.length || 1;
        let correctCount = 0;
        optIds.forEach((id) => {
          if (correctOptionIds.includes(id)) {
            correctCount++;
          } else {
            correctCount = Math.max(0, correctCount - 0.5);
          }
        });
        pointsEarned = Math.min(1, Math.max(0, Number((correctCount / totalCorrect).toFixed(2))));
      }
    }

    const answerRecord: MemberAnswer = {
      questionId: q.id,
      selectedOptionIds: [...optIds],
      textAnswer: q.type === 'text' ? txtAns.trim() : undefined,
      pointsEarned,
      maxPoints: 1,
    };

    setUserAnswers((prev) => {
      const idx = prev.findIndex((a) => a.questionId === q.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = answerRecord;
        return copy;
      }
      return [...prev, answerRecord];
    });
  };

  const loadQuestionState = (targetIndex: number) => {
    const q = SURVEY_QUESTIONS[targetIndex];
    if (!q) return;
    const existing = userAnswers.find((a) => a.questionId === q.id);
    if (existing) {
      setSelectedOptionIds(existing.selectedOptionIds || []);
      setTextInputAnswer(existing.textAnswer || '');
    } else {
      setSelectedOptionIds([]);
      setTextInputAnswer('');
    }
  };

  const handlePreviousQuestion = () => {
    soundEngine.playPluck(350);
    // Save current state first
    saveCurrentAnswer(currentQuestionIndex, selectedOptionIds, textInputAnswer);

    if (currentQuestionIndex === 0) {
      setSurveyStep('intro_seg1');
    } else if (currentQuestionIndex === 4) {
      setSurveyStep('intro_seg2');
    } else {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      loadQuestionState(prevIdx);
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playChime();
    saveCurrentAnswer(currentQuestionIndex, selectedOptionIds, textInputAnswer);

    // If finishing Segment I (Index 3 = Question 4)
    if (currentQuestionIndex === 3) {
      const seg1Answers = userAnswers.filter((a) => {
        const qItem = SURVEY_QUESTIONS.find((q) => q.id === a.questionId);
        return qItem && qItem.segment === 1;
      });
      
      let currentPoints = 0;
      const curQ = SURVEY_QUESTIONS[currentQuestionIndex];
      if (curQ.type === 'text') {
        currentPoints = textInputAnswer.trim().length > 1 ? 1 : 0;
      } else if (curQ.type === 'single') {
        const correctOptIds = (curQ.options || []).filter(o => o.isCorrect).map(o => o.id);
        currentPoints = correctOptIds.includes(selectedOptionIds[0]) ? 1 : 0;
      }

      const calcScore = Math.round(
        seg1Answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0) + currentPoints
      );
      setFinalScore(calcScore);
      setSurveyStep('seg1_privilege');
      return;
    }

    // If finishing Segment II (Index 7 = Question 8)
    if (currentQuestionIndex === 7) {
      finishSurvey();
      return;
    }

    const nextIdx = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIdx);
    loadQuestionState(nextIdx);
  };

  const handleSavePrivilegeAndContinue = () => {
    soundEngine.playFanfare();
    setSurveyStep('intro_seg2');
  };

  const handleStartSegment2Questions = () => {
    soundEngine.playChime();
    setSurveyStep('seg2_questions');
    setCurrentQuestionIndex(4); // Question 5
    loadQuestionState(4);
  };

  const finishSurvey = () => {
    soundEngine.playFanfare();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#eab308', '#d97706', '#ffffff'],
      });
    } catch (e) {
      console.log('Confetti triggered');
    }

    setSurveyStep('completed');

    const highScorePrivilegeObj: HighScorePrivilege | undefined = privilegeContent.trim()
      ? {
          type: privilegeType,
          content: privilegeContent.trim(),
          punishmentPenalty: punishmentPenalty.trim() || undefined,
        }
      : undefined;

    const submission: SurveySubmission = {
      id: `sub-${member.id}-${Date.now()}`,
      memberId: member.id,
      nickname,
      submittedAt: new Date().toISOString(),
      segment1Score: finalScore,
      segment1MaxScore: 4,
      answers: userAnswers,
      relationshipNotes: relationshipNotes.trim() || `${nickname} sends divine birthday blessings!`,
      highScorePrivilege: highScorePrivilegeObj,
    };

    onCompleteSurvey(submission);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Header Member Info Badge (No Exit Survey Button) */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            soundEngine.playPluck(350);
            onCancel();
          }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
            theme === 'night'
              ? 'bg-[#131826] border-[#D4AF37]/30 text-[#E0D7C6] hover:bg-[#D4AF37]/20'
              : 'bg-[#FAF7F0] border-[#C89B27]/40 text-[#1E2330] hover:bg-[#C89B27]/20'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Return to Members</span>
        </button>

        {/* Member Info Badge */}
        <div
          className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-bold ${
            theme === 'night'
              ? 'bg-[#131826] border-[#D4AF37]/30 text-[#F4D03F]'
              : 'bg-[#FAF7F0] border-[#C89B27]/40 text-[#9A7210]'
          }`}
        >
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-[#0A0B10]`}>
            <IconHelper name={member.avatarIcon} className="w-3.5 h-3.5" />
          </div>
          <span>
            {nickname} <span className="opacity-60 font-normal">({member.name})</span>
          </span>
        </div>
      </div>

      {/* STEP 1: INTRO CARD FOR SEGMENT I */}
      {surveyStep === 'intro_seg1' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl border backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between ${
            theme === 'night'
              ? 'bg-[#131826]/95 border-[#D4AF37]/40 text-[#E0D7C6]'
              : 'bg-white/95 border-[#C89B27]/30 text-[#1E2330]'
          }`}
        >
          {/* Top Segment Progress Line */}
          <div className={`w-full h-2 ${theme === 'night' ? 'bg-[#0B0E17]/60' : 'bg-[#FAF7F0]'}`}>
            <div className="bg-[#D4AF37] h-full w-1/2 rounded-r-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          </div>

          <div className="p-6 sm:p-10 flex flex-col items-center text-center">
            {/* Center Top Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${
              theme === 'night'
                ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]'
                : 'bg-[#FFF6DF] border border-[#EEDC9A] text-[#9A7210]'
            }`}>
              <HelpCircle className="w-8 h-8 text-[#D4AF37]" />
            </div>

            {/* PHASE 1 OF 2 Pill Badge */}
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-[0.2em] mb-4 font-sans ${
              theme === 'night'
                ? 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#F4D03F]'
                : 'bg-[#FFF3D6] border-[#F2DEAA] text-[#8C5D0D]'
            }`}>
              PHASE 1 OF 2
            </div>

            {/* Title */}
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-3 tracking-tight ${
              theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
            }`}>
              Segment I: Olympian Knowledge Quiz
            </h2>

            {/* Subtitle Description */}
            <p className={`text-sm font-serif max-w-lg leading-relaxed mb-6 ${
              theme === 'night' ? 'text-[#E0D7C6]/80' : 'text-[#5C6479]'
            }`}>
              Welcome to the Knowledge Trial! In this segment, test your knowledge about the Birthday Boy, <strong className={theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'}>{nickname}</strong>. Answer questions about his favorite late-night meals, bucket list dreams, signature powers, and unique habits.
            </p>

            {/* Feature Blocks Container */}
            <div className="w-full max-w-lg space-y-3 mb-6 text-left">
              <div
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  theme === 'night'
                    ? 'bg-[#0B0E17]/60 border-[#D4AF37]/25'
                    : 'bg-[#FAF7F0] border-[#C89B27]/25'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider font-sans ${
                    theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
                  }`}>
                    Multiple Choice & Written
                  </h4>
                  <p className={`text-xs font-sans mt-0.5 ${
                    theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
                  }`}>
                    Select options or type your own written insights.
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  theme === 'night'
                    ? 'bg-[#0B0E17]/60 border-[#D4AF37]/25'
                    : 'bg-[#FAF7F0] border-[#C89B27]/25'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider font-sans ${
                    theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
                  }`}>
                    Vault Preserved
                  </h4>
                  <p className={`text-xs font-sans mt-0.5 ${
                    theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
                  }`}>
                    Quiz answers remain sealed safely in the Vault until revealed.
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  theme === 'night'
                    ? 'bg-[#0B0E17]/60 border-[#D4AF37]/30'
                    : 'bg-[#FAF7F0] border-[#C89B27]/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-500 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider font-sans ${
                    theme === 'night' ? 'text-amber-300' : 'text-amber-800'
                  }`}>
                    High Score Privilege & Dare Penalty
                  </h4>
                  <p className={`text-xs font-sans mt-0.5 ${
                    theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
                  }`}>
                    Ask the Birthday Boy a Question, Wish or Dare. Refusal results in an Olympian Penalty!
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="w-full border-t border-[#D4AF37]/20 pt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playChime();
                  setSurveyStep('seg1_questions');
                  setCurrentQuestionIndex(0);
                  loadQuestionState(0);
                }}
                className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-[0.15em] shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center gap-2.5 transition-all cursor-pointer font-sans"
              >
                <span>Begin Segment I Questions</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 2: SEGMENT I QUESTIONS */}
      {surveyStep === 'seg1_questions' && currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl shadow-xl relative overflow-hidden ${
            theme === 'night'
              ? 'bg-[#131826]/95 border-[#D4AF37]/40 text-[#E0D7C6]'
              : 'bg-white border-[#C89B27]/40 text-[#1E2330]'
          }`}
        >
          {/* Progress Segment Indicator */}
          <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] mb-4 font-sans ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
          }`}>
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              Segment I: Birthday Boy Quiz
            </span>
            <span className="font-serif opacity-80">
              Question {currentQuestionIndex + 1} / 4
            </span>
          </div>

          {/* Progress Bar */}
          <div className={`w-full h-1.5 rounded-full mb-6 overflow-hidden border ${
            theme === 'night' ? 'bg-[#0B0E17] border-[#D4AF37]/30' : 'bg-[#FAF7F0] border-[#C89B27]/30'
          }`}>
            <div
              className="bg-[#D4AF37] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              style={{ width: `${((currentQuestionIndex + 1) / 4) * 100}%` }}
            />
          </div>

          {/* Question Title & Subtitle */}
          <h3 className={`font-serif text-xl sm:text-2xl font-light mb-2 leading-snug ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
          }`}>
            {currentQuestion.title}
          </h3>
          <p className={`text-xs font-serif mb-6 flex items-center gap-1 ${
            theme === 'night' ? 'text-[#D4AF37]' : 'text-[#8C6B1F]'
          }`}>
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            {currentQuestion.subtitle}
          </p>

          {/* QUESTION TYPE HANDLING */}
          {currentQuestion.type === 'text' ? (
            <div className="mb-6 space-y-3">
              <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-sans ${
                theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'
              }`}>
                <PenTool className="w-4 h-4 text-[#D4AF37]" />
                <span>Fill in your answer:</span>
              </label>
              <textarea
                value={textInputAnswer}
                onChange={(e) => setTextInputAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder || 'Type your response here...'}
                rows={3}
                className={`w-full p-4 rounded-2xl border text-sm font-serif outline-none transition-all ${
                  theme === 'night'
                    ? 'bg-[#0B0E17] border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#E0D7C6] placeholder-[#E0D7C6]/40'
                    : 'bg-[#FAF7F0] border-[#C89B27]/40 focus:border-[#9A7210] text-[#1E2330] placeholder-[#5C6479]/60'
                }`}
              />
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {(currentQuestion.options || []).map((option) => {
                const isSelected = selectedOptionIds.includes(option.id);

                let borderClass =
                  theme === 'night'
                    ? 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50 bg-[#0B0E17]/80 text-[#E0D7C6]'
                    : 'border-[#C89B27]/30 hover:border-[#C89B27] bg-[#FAF7F0] text-[#1E2330]';

                if (isSelected) {
                  borderClass =
                    theme === 'night'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/25 text-[#F4D03F] shadow-[0_0_20px_rgba(212,175,55,0.15)] font-bold'
                      : 'border-[#9A7210] bg-[#D4AF37]/20 text-[#8C6B1F] shadow-[0_4px_15px_rgba(200,155,39,0.15)] font-bold';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionClick(option.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${borderClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#D4AF37] text-[#0A0B10] font-bold' : 'bg-[#D4AF37]/15 text-[#D4AF37]'}`}>
                        {option.icon ? (
                          <IconHelper name={option.icon} className="w-4 h-4" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-serif">
                        {option.text}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0A0B10]' : 'border-[#D4AF37]/30'}`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Actions (Back & Next) */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-sans ${
                theme === 'night'
                  ? 'bg-[#0B0E17] border-[#D4AF37]/30 text-[#E0D7C6] hover:bg-[#D4AF37]/20'
                  : 'bg-[#FAF7F0] border-[#C89B27]/40 text-[#1E2330] hover:bg-[#C89B27]/20'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <button
              type="button"
              disabled={currentQuestion.type === 'text' ? !textInputAnswer.trim() : selectedOptionIds.length === 0}
              onClick={handleNextQuestion}
              className="py-3 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-[0.1em] shadow-[0_4px_20px_rgba(245,158,11,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <span>{currentQuestionIndex === 3 ? 'View High Score Privilege' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: HIGH SCORE PRIVILEGE CARD */}
      {surveyStep === 'seg1_privilege' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl border backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between ${
            theme === 'night'
              ? 'bg-[#131826]/95 border-[#D4AF37]/40 text-[#E0D7C6]'
              : 'bg-white/95 border-[#C89B27]/30 text-[#1E2330]'
          }`}
        >
          <div className="p-6 sm:p-10 flex flex-col items-center text-center">
            {/* Top Bookmark Box */}
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 shadow-sm ${
              theme === 'night'
                ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                : 'bg-[#FFF6DF] border-[#EEDC9A] text-[#9A7210]'
            }`}>
              <Landmark className="w-7 h-7 text-[#D4AF37]" />
            </div>

            {/* Pill Badge */}
            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-[0.15em] mb-4 font-sans ${
              theme === 'night'
                ? 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#F4D03F]'
                : 'bg-[#FFF3D6] border-[#F2DEAA] text-[#8C5D0D]'
            }`}>
              <Landmark className="w-3.5 h-3.5" />
              <span>HIGH SCORE OLYMPIAN PRIVILEGES</span>
            </div>

            {/* Main Heading */}
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-3 tracking-tight ${
              theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
            }`}>
              Royal Dare, Wish or Question Window
            </h2>

            {/* Description */}
            <p className={`text-sm font-serif max-w-lg leading-relaxed mb-6 ${
              theme === 'night' ? 'text-[#E0D7C6]/80' : 'text-[#5C6479]'
            }`}>
              By sacred Olympian Law, if you score high in Segment I, the Birthday Boy <strong className={theme === 'night' ? 'text-[#F4D03F] font-bold' : 'text-amber-800 font-bold'}>MUST</strong> answer your question, grant your wish, or perform your dare — or face divine punishment!
            </p>

            <div className="w-full max-w-xl text-left space-y-6">
              {/* Section 1: Challenge Type Selection */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2.5 font-sans ${
                  theme === 'night' ? 'text-[#E0D7C6]' : 'text-[#1E2330]'
                }`}>
                  1. SELECT YOUR CHALLENGE TYPE:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Royal Dare Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPluck(523.25);
                      setPrivilegeType('dare');
                    }}
                    className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      privilegeType === 'dare'
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-500 shadow-[0_4px_15px_rgba(245,158,11,0.4)]'
                        : theme === 'night'
                        ? 'bg-[#0B0E17]/60 text-[#E0D7C6] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                        : 'bg-[#FAF7F0] text-[#1E2330] border-[#C89B27]/30 hover:border-[#C89B27]'
                    }`}
                  >
                    <Zap className={`w-5 h-5 ${privilegeType === 'dare' ? 'text-white' : 'text-amber-500'}`} />
                    <span className="font-sans">⚡ Royal Dare</span>
                  </button>

                  {/* Special Wish Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPluck(587.33);
                      setPrivilegeType('wish');
                    }}
                    className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      privilegeType === 'wish'
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-500 shadow-[0_4px_15px_rgba(245,158,11,0.4)]'
                        : theme === 'night'
                        ? 'bg-[#0B0E17]/60 text-[#E0D7C6] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                        : 'bg-[#FAF7F0] text-[#1E2330] border-[#C89B27]/30 hover:border-[#C89B27]'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 ${privilegeType === 'wish' ? 'text-white' : 'text-amber-500'}`} />
                    <span className="font-sans">🌟 Special Wish</span>
                  </button>

                  {/* Truth Question Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPluck(659.25);
                      setPrivilegeType('question');
                    }}
                    className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      privilegeType === 'question'
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-500 shadow-[0_4px_15px_rgba(245,158,11,0.4)]'
                        : theme === 'night'
                        ? 'bg-[#0B0E17]/60 text-[#E0D7C6] border-[#D4AF37]/25 hover:border-[#D4AF37]/50'
                        : 'bg-[#FAF7F0] text-[#1E2330] border-[#C89B27]/30 hover:border-[#C89B27]'
                    }`}
                  >
                    <HelpCircle className={`w-5 h-5 ${privilegeType === 'question' ? 'text-white' : 'text-amber-500'}`} />
                    <span className="font-sans">❓ Truth Question</span>
                  </button>
                </div>
              </div>

              {/* Section 2: Write Challenge */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans ${
                  theme === 'night' ? 'text-[#E0D7C6]' : 'text-[#1E2330]'
                }`}>
                  <PenTool className={`w-3.5 h-3.5 ${theme === 'night' ? 'text-amber-400' : 'text-amber-700'}`} />
                  <span>
                    2. WRITE YOUR {
                      privilegeType === 'dare' ? 'DARE' :
                      privilegeType === 'wish' ? 'SPECIAL WISH' : 'TRUTH QUESTION'
                    }:
                  </span>
                </label>
                <textarea
                  value={privilegeContent}
                  onChange={(e) => setPrivilegeContent(e.target.value)}
                  placeholder={
                    privilegeType === 'dare'
                      ? "e.g. 'I dare you to wear the laurel crown all night and sing a solo on karaoke!'"
                      : privilegeType === 'wish'
                      ? "e.g. 'I wish for a 3-course artisan dinner cooked by the Birthday Boy for the Council!'"
                      : "e.g. 'What was your most memorable moment or biggest dream this past year?'"
                  }
                  rows={3}
                  className={`w-full p-4 rounded-2xl border text-sm font-serif outline-none resize-none transition-all ${
                    theme === 'night'
                      ? 'bg-[#0B0E17]/80 border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#E0D7C6] placeholder-[#E0D7C6]/40'
                      : 'bg-[#FAF7F0] border-[#C89B27]/30 focus:border-[#9A7210] text-[#1E2330] placeholder-[#5C6479]/60'
                  }`}
                />
              </div>

              {/* Section 3: Divine Punishment / Penalty */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans ${
                  theme === 'night' ? 'text-rose-300' : 'text-rose-800'
                }`}>
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>3. DIVINE PUNISHMENT / PENALTY IF BIRTHDAY BOY REFUSES OR FAILS:</span>
                </label>
                <input
                  type="text"
                  value={punishmentPenalty}
                  onChange={(e) => setPunishmentPenalty(e.target.value)}
                  placeholder="e.g. 'Must buy a round of drinks for the Council' or 'Do 20 pushups'"
                  className={`w-full p-3.5 rounded-2xl border text-sm font-serif outline-none transition-all ${
                    theme === 'night'
                      ? 'bg-[#1D1118]/80 border-rose-500/30 focus:border-rose-500 text-[#E0D7C6] placeholder-[#E0D7C6]/40'
                      : 'bg-[#FFF2F4] border-rose-300 focus:border-rose-500 text-[#1E2330] placeholder-[#5C6479]/60'
                  }`}
                />
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="w-full max-w-xl border-t border-[#D4AF37]/20 pt-6 mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPluck(350);
                  setSurveyStep('seg1_questions');
                  setCurrentQuestionIndex(3);
                  loadQuestionState(3);
                }}
                className={`px-5 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-sans ${
                  theme === 'night'
                    ? 'bg-[#0B0E17] border-[#D4AF37]/30 text-[#E0D7C6] hover:bg-[#D4AF37]/20'
                    : 'bg-[#FAF7F0] border-[#C89B27]/40 text-[#1E2330] hover:bg-[#C89B27]/20'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Questions</span>
              </button>

              <button
                type="button"
                onClick={handleSavePrivilegeAndContinue}
                className="py-3.5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-[0.1em] shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center gap-2 transition-all cursor-pointer font-sans"
              >
                <span>Seal Challenge & Proceed to Segment II</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: INTRO CARD FOR SEGMENT II */}
      {surveyStep === 'intro_seg2' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl border backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between ${
            theme === 'night'
              ? 'bg-[#131826]/95 border-[#D4AF37]/40 text-[#E0D7C6]'
              : 'bg-white/95 border-[#C89B27]/30 text-[#1E2330]'
          }`}
        >
          <div className="p-6 sm:p-10 flex flex-col items-center text-center">
            {/* Top Pink/Red Heart Container */}
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 shadow-sm ${
              theme === 'night'
                ? 'bg-rose-950/50 border-rose-800/60 text-rose-400'
                : 'bg-[#FFF0F3] border-rose-200 text-rose-600'
            }`}>
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
            </div>

            {/* PHASE 2 OF 2 Pill Badge */}
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-[0.15em] mb-4 font-sans ${
              theme === 'night'
                ? 'bg-rose-950/50 border-rose-800/50 text-rose-300'
                : 'bg-[#FFF0F3] border-rose-200 text-rose-700'
            }`}>
              PHASE 2 OF 2
            </div>

            {/* Title */}
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-3 tracking-tight ${
              theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
            }`}>
              Segment II: Tribute, Memories & Wishes
            </h2>

            {/* Subtitle Description */}
            <p className={`text-sm font-serif max-w-lg leading-relaxed mb-6 ${
              theme === 'night' ? 'text-[#E0D7C6]/80' : 'text-[#5C6479]'
            }`}>
              You have completed Segment I! Now step into Segment II: Tribute & Wishes. There are no right or wrong answers here — simply express your unique friendship bond, recount favorite stories, assign divine superlatives, and write a personal birthday wish.
            </p>

            {/* Feature Cards */}
            <div className="w-full max-w-lg space-y-3 mb-6 text-left">
              <div
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  theme === 'night'
                    ? 'bg-[#1A131B]/80 border-rose-500/25'
                    : 'bg-[#FFF5F7] border-rose-200/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                  theme === 'night'
                    ? 'bg-rose-950/60 border-rose-800/60 text-rose-400'
                    : 'bg-rose-100 border-rose-200 text-rose-600'
                }`}>
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider font-sans ${
                    theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
                  }`}>
                    Honest Appreciation
                  </h4>
                  <p className={`text-xs font-sans mt-0.5 ${
                    theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
                  }`}>
                    Share what makes your bond with the Birthday Boy special.
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                  theme === 'night'
                    ? 'bg-[#1A131B]/80 border-rose-500/25'
                    : 'bg-[#FFF5F7] border-rose-200/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                  theme === 'night'
                    ? 'bg-rose-950/60 border-rose-800/60 text-rose-400'
                    : 'bg-rose-100 border-rose-200 text-rose-600'
                }`}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider font-sans ${
                    theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
                  }`}>
                    Personal Memory & Tribute
                  </h4>
                  <p className={`text-xs font-sans mt-0.5 ${
                    theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
                  }`}>
                    Write your favorite story and personal wish for the Vault.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="w-full max-w-lg border-t border-[#D4AF37]/20 pt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPluck(350);
                  setSurveyStep('seg1_questions');
                  setCurrentQuestionIndex(3);
                  loadQuestionState(3);
                }}
                className={`px-5 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-sans ${
                  theme === 'night'
                    ? 'bg-[#0B0E17] border-[#D4AF37]/30 text-[#E0D7C6] hover:bg-[#D4AF37]/20'
                    : 'bg-[#FAF7F0] border-[#C89B27]/40 text-[#1E2330] hover:bg-[#C89B27]/20'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Segment I Questions</span>
              </button>

              <button
                type="button"
                onClick={handleStartSegment2Questions}
                className="py-3.5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-[0.1em] shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center gap-2 transition-all cursor-pointer font-sans"
              >
                <span>Begin Segment II Tribute</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 5: SEGMENT II QUESTIONS */}
      {surveyStep === 'seg2_questions' && currentQuestion && (
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`p-6 sm:p-8 rounded-3xl border backdrop-blur-xl shadow-xl relative overflow-hidden ${
            theme === 'night'
              ? 'bg-[#131826]/95 border-[#D4AF37]/40 text-[#E0D7C6]'
              : 'bg-white border-[#C89B27]/40 text-[#1E2330]'
          }`}
        >
          {/* REQUIREMENT 2: SMALL PINK STRIP FOR SEGMENT II */}
          <div className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 py-2 px-4 text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 font-sans mb-5 rounded-2xl shadow-sm">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
            <span>Segment II ♡ Tribute, Memories & Wishes</span>
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>

          {/* Progress Segment Indicator */}
          <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] mb-4 font-sans ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
          }`}>
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              Segment II Question
            </span>
            <span className="font-serif opacity-80">
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Progress Bar */}
          <div className={`w-full h-1.5 rounded-full mb-6 overflow-hidden border ${
            theme === 'night' ? 'bg-[#0B0E17] border-[#D4AF37]/30' : 'bg-[#FAF7F0] border-[#C89B27]/30'
          }`}>
            <div
              className="bg-pink-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Title & Subtitle */}
          <h3 className={`font-serif text-xl sm:text-2xl font-light mb-2 leading-snug ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#1E2330]'
          }`}>
            {currentQuestion.title}
          </h3>
          <p className={`text-xs font-serif mb-6 flex items-center gap-1 ${
            theme === 'night' ? 'text-[#D4AF37]' : 'text-[#8C6B1F]'
          }`}>
            <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            {currentQuestion.subtitle}
          </p>

          {/* QUESTION TYPE HANDLING */}
          {currentQuestion.type === 'text' ? (
            <div className="mb-6 space-y-3">
              <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-2 font-sans ${
                theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'
              }`}>
                <PenTool className="w-4 h-4 text-[#D4AF37]" />
                <span>Fill in your answer:</span>
              </label>
              <textarea
                value={textInputAnswer}
                onChange={(e) => setTextInputAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder || 'Type your response here...'}
                rows={3}
                className={`w-full p-4 rounded-2xl border text-sm font-serif outline-none transition-all ${
                  theme === 'night'
                    ? 'bg-[#0B0E17] border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#E0D7C6] placeholder-[#E0D7C6]/40'
                    : 'bg-[#FAF7F0] border-[#C89B27]/40 focus:border-[#9A7210] text-[#1E2330] placeholder-[#5C6479]/60'
                }`}
              />
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {(currentQuestion.options || []).map((option) => {
                const isSelected = selectedOptionIds.includes(option.id);

                let borderClass =
                  theme === 'night'
                    ? 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50 bg-[#0B0E17]/80 text-[#E0D7C6]'
                    : 'border-[#C89B27]/30 hover:border-[#C89B27] bg-[#FAF7F0] text-[#1E2330]';

                if (isSelected) {
                  borderClass =
                    theme === 'night'
                      ? 'border-pink-500 bg-pink-500/20 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.2)] font-bold'
                      : 'border-pink-600 bg-pink-50 text-pink-900 shadow-[0_4px_15px_rgba(236,72,153,0.15)] font-bold';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionClick(option.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${borderClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-pink-500 text-white font-bold' : 'bg-[#D4AF37]/15 text-[#D4AF37]'}`}>
                        {option.icon ? (
                          <IconHelper name={option.icon} className="w-4 h-4" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-serif">
                        {option.text}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-pink-500 bg-pink-500 text-white' : 'border-[#D4AF37]/30'}`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Personal Toast field on Last Question */}
          {currentQuestionIndex === 7 && (
            <div className="mb-6">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans ${
                theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'
              }`}>
                <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                Personal Birthday Toast to the Birthday Boy:
              </label>
              <textarea
                value={relationshipNotes}
                onChange={(e) => setRelationshipNotes(e.target.value)}
                placeholder="Write your heartfelt birthday wishes or fun memories..."
                rows={3}
                className={`w-full p-3.5 rounded-2xl border text-sm font-serif outline-none resize-none ${
                  theme === 'night'
                    ? 'bg-[#0B0E17] border-[#D4AF37]/30 text-[#E0D7C6] placeholder-[#E0D7C6]/40'
                    : 'bg-[#FAF7F0] border-[#C89B27]/40 text-[#1E2330] placeholder-[#5C6479]/60'
                }`}
              />
            </div>
          )}

          {/* Question Actions (Back & Next) */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-sans ${
                theme === 'night'
                  ? 'bg-[#0B0E17] border-[#D4AF37]/30 text-[#E0D7C6] hover:bg-[#D4AF37]/20'
                  : 'bg-[#FAF7F0] border-[#C89B27]/40 text-[#1E2330] hover:bg-[#C89B27]/20'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <button
              type="button"
              disabled={currentQuestion.type === 'text' ? !textInputAnswer.trim() : selectedOptionIds.length === 0}
              onClick={handleNextQuestion}
              className="py-3 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-[0.1em] shadow-[0_4px_20px_rgba(245,158,11,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer font-sans"
            >
              <span>{currentQuestionIndex === 7 ? 'Submit Survey to Vault' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 6: SURVEY SUBMITTED CELEBRATION VIEW */}
      {surveyStep === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-3xl border text-center flex flex-col items-center shadow-2xl ${
            theme === 'night'
              ? 'bg-[#131826] border-[#D4AF37]/40 text-[#E0D7C6]'
              : 'bg-white border-[#C89B27]/40 text-[#1E2330]'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37] text-[#0A0B10] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <Award className="w-8 h-8" />
          </div>

          <h2 className={`font-serif text-2xl sm:text-3xl font-light mb-2 ${
            theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
          }`}>
            Survey Submitted to Vault!
          </h2>

          <p className={`text-sm max-w-md mb-6 leading-relaxed font-serif ${
            theme === 'night' ? 'text-[#E0D7C6]/70' : 'text-[#5C6479]'
          }`}>
            Thank you, <strong className={theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'}>{nickname}</strong>! Your answers and privilege request have been recorded in the divine scrolls for the Birthday Boy.
          </p>

          {/* SHOW PRIVILEGE SUMMARY IF ENTERED */}
          {privilegeContent && (
            <div className={`p-4 rounded-2xl border mb-6 w-full max-w-md text-left ${
              theme === 'night' ? 'bg-[#0B0E17] border-[#D4AF37]/30' : 'bg-[#FAF7F0] border-[#C89B27]/30'
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5 font-sans ${
                theme === 'night' ? 'text-[#D4AF37]' : 'text-[#9A7210]'
              }`}>
                <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Your High Score Privilege Challenge:</span>
              </div>
              <p className={`text-xs font-serif italic ${
                theme === 'night' ? 'text-[#E0D7C6]' : 'text-[#1E2330]'
              }`}>
                "{privilegeContent}"
              </p>
            </div>
          )}

          {/* PRIVATE RESULTS EXPLANATION BOX */}
          <div className={`p-5 rounded-2xl border mb-6 w-full max-w-md text-center shadow-inner ${
            theme === 'night'
              ? 'bg-[#0B0E17]/90 border-[#D4AF37]/30 text-[#E0D7C6]'
              : 'bg-[#FAF7F0] border-[#C89B27]/30 text-[#1E2330]'
          }`}>
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-2 text-[#D4AF37]">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <h3 className={`font-serif text-base font-bold mb-1.5 ${
              theme === 'night' ? 'text-[#F4D03F]' : 'text-[#9A7210]'
            }`}>
              Survey Results are Private
            </h3>
            <p className={`text-xs leading-relaxed font-serif ${
              theme === 'night' ? 'text-[#E0D7C6]/80' : 'text-[#5C6479]'
            }`}>
              The submitted surveys and results are currently visible only to the Owner. Once the Birthday Boy / Owner toggles "Publish Results", all submitted cards will be revealed to everyone here!
            </p>
          </div>

          {/* BACK TO THE ASSEMBLY BUTTON */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playPluck(500);
              if (onGoHome) {
                onGoHome();
              } else {
                onCancel();
              }
            }}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-[0.15em] shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center gap-2.5 transition-all cursor-pointer font-sans hover:scale-105"
          >
            <Landmark className="w-4 h-4 text-white" />
            <span>Back to the Assembly</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
