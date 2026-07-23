import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, KeyRound, X, Unlock, Lock } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface OwnerAuthModalProps {
  isOpen: boolean;
  isOwner: boolean;
  onClose: () => void;
  onSetOwnerMode: (isOwner: boolean) => void;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  isOwner,
  onClose,
  onSetOwnerMode,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = passcode.trim().toUpperCase();

    // Valid owner codes
    if (code === '1234' || code === 'OWNER2026' || code === 'OLYMPIA') {
      soundEngine.playFanfare();
      onSetOwnerMode(true);
      setError('');
      onClose();
    } else {
      soundEngine.playPluck(220);
      setError('Invalid Owner Passcode. Use 1234 or OWNER2026');
    }
  };

  const handleLogout = () => {
    soundEngine.playPluck(400);
    onSetOwnerMode(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B10]/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md p-6 rounded-2xl bg-[#1A1C23] border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#0A0B10] text-[#E0D7C6]/60 hover:text-[#D4AF37] border border-[#D4AF37]/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0A0B10] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)] mx-auto font-bold">
            <Crown className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-xl font-light text-center text-[#E0D7C6] mb-1">
            {isOwner ? 'Owner Mode Active' : 'Owner Portal Verification'}
          </h3>
          <p className="text-xs text-center text-[#E0D7C6]/60 font-serif mb-6">
            {isOwner
              ? 'You have full access to survey results, visibility toggles, and council stats.'
              : 'Enter owner passcode to access survey results vault & publish controls.'}
          </p>

          {!isOwner ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Enter Owner Passcode:
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPluck(600);
                      setPasscode('1234');
                      setError('');
                    }}
                    className="text-[11px] font-bold text-[#D4AF37] hover:underline uppercase tracking-wider"
                  >
                    Quick Fill (1234)
                  </button>
                </div>

                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 1234"
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0B10] border border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#E0D7C6] text-sm font-bold tracking-widest outline-none"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-rose-400 font-serif bg-rose-500/10 p-3 rounded-xl border border-rose-500/30">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#D4AF37] hover:bg-[#F9E8B3] text-[#0A0B10] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>UNLOCK OWNER ACCESS</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-serif text-emerald-300 text-center">
                Owner privileges granted! You can now publish results, review all submissions, and reset demo data.
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3.5 px-6 rounded-full bg-[#0A0B10] text-[#E0D7C6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>Lock Owner Mode</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
