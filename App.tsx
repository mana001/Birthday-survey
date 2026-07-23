/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenState, ThemeMode, Member, SurveySubmission } from './types';
import {
  getStoredSubmissions,
  saveSubmission,
  getStoredPublishedState,
  setStoredPublishedState,
  getStoredTheme,
  setStoredTheme,
  resetAllSubmissions,
} from './utils/storage';
import { soundEngine } from './utils/audio';

import { FirstInterface } from './components/FirstInterface';
import { MembersInterface } from './components/MembersInterface';
import { SurveyInterface } from './components/SurveyInterface';
import { SubmissionsInterface } from './components/SubmissionsInterface';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { HeaderBar } from './components/HeaderBar';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme());
  const [isOwner, setIsOwner] = useState(false);
  const [isPublished, setIsPublished] = useState(getStoredPublishedState());
  const [submissions, setSubmissions] = useState<SurveySubmission[]>(getStoredSubmissions());
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [activeNickname, setActiveNickname] = useState('');
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-play music immediately on mount and resume on any user gesture or visibility change
  useEffect(() => {
    // Attempt immediate start on mount
    if (!isMuted && isMusicPlaying) {
      soundEngine.startMusic();
    }

    const handleInteraction = () => {
      if (!isMuted) {
        soundEngine.checkAndResume();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isMuted) {
        soundEngine.checkAndResume();
      }
    };

    const events = ['click', 'pointerdown', 'touchstart', 'mousemove', 'scroll', 'wheel', 'keydown', 'focus'];
    events.forEach((ev) => window.addEventListener(ev, handleInteraction, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleInteraction));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMuted, isMusicPlaying]);

  // Apply dark mode class to root for theme transitions
  useEffect(() => {
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const handleToggleMusic = () => {
    const playing = soundEngine.toggleMusic();
    setIsMusicPlaying(playing);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (muted) setIsMusicPlaying(false);
  };

  const handleSelectMemberForSurvey = (member: Member, nickname: string) => {
    setActiveMember(member);
    setActiveNickname(nickname);
    setScreen('survey');
  };

  const handleCompleteSurvey = (newSubmission: SurveySubmission) => {
    const updated = saveSubmission(newSubmission);
    setSubmissions(updated);
  };

  const handleTogglePublishState = (newState: boolean) => {
    setStoredPublishedState(newState);
    setIsPublished(newState);
  };

  const handleResetData = () => {
    const defaultData = resetAllSubmissions();
    setSubmissions(defaultData);
    setIsPublished(false);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-serif selection:bg-[#D4AF37] selection:text-[#0A0B10] ${
        theme === 'night'
          ? 'bg-[#0A0B10] text-[#E0D7C6] bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15)_0%,transparent_70%)]'
          : 'bg-[#FAF8F3] text-[#1A1C23] bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.12)_0%,transparent_70%)]'
      }`}
    >
      {/* Background Starlight / Greek Column Aesthetic Highlights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Top Floating Strip Menu & Title Bar */}
        <HeaderBar
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isOwner={isOwner}
          onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
          onNavigateHome={() => setScreen('landing')}
        />

        <main className="flex-grow flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            {screen === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <FirstInterface
                  theme={theme}
                  onToggleTheme={handleToggleTheme}
                  submissions={submissions}
                  isOwner={isOwner}
                  isPublished={isPublished}
                  onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
                  onNavigateToMembers={() => setScreen('members')}
                  onNavigateToSubmissions={() => setScreen('submissions')}
                  isMusicPlaying={isMusicPlaying}
                  onToggleMusic={handleToggleMusic}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                />
              </motion.div>
            )}

            {screen === 'members' && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <MembersInterface
                  theme={theme}
                  submissions={submissions}
                  onSelectMemberForSurvey={handleSelectMemberForSurvey}
                  onBackToHome={() => setScreen('landing')}
                />
              </motion.div>
            )}

            {screen === 'survey' && activeMember && (
              <motion.div
                key="survey"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <SurveyInterface
                  theme={theme}
                  member={activeMember}
                  nickname={activeNickname}
                  onCompleteSurvey={handleCompleteSurvey}
                  onCancel={() => setScreen('members')}
                  onGoHome={() => setScreen('landing')}
                />
              </motion.div>
            )}

            {screen === 'submissions' && (
              <motion.div
                key="submissions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                <SubmissionsInterface
                  theme={theme}
                  submissions={submissions}
                  isOwner={isOwner}
                  isPublished={isPublished}
                  onTogglePublishState={handleTogglePublishState}
                  onResetData={handleResetData}
                  onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
                  onBackToHome={() => setScreen('landing')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Minimal Footnote */}
        <footer className="py-4 text-center text-xs text-amber-700/60 dark:text-amber-300/40 font-medium">
          Mount Olympus Birthday Survey • Celebrating The Birthday Boy
        </footer>
      </div>

      {/* Owner Auth Modal */}
      <OwnerAuthModal
        isOpen={isOwnerModalOpen}
        isOwner={isOwner}
        onClose={() => setIsOwnerModalOpen(false)}
        onSetOwnerMode={(ownerState) => setIsOwner(ownerState)}
      />
    </div>
  );
}
