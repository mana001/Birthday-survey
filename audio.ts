// Web Audio API Synthesizer for Mount Olympus Ambient Music & SFX

export interface AudioTrackInfo {
  title: string;
  artist: string;
  pixabayId: string;
  url: string;
}

export const CURRENT_TRACK_INFO: AudioTrackInfo = {
  title: "Greek Promenade | Ancient Greek music",
  artist: "ArtManz",
  pixabayId: "330440",
  url: "https://pixabay.com/music/folk-greek-promenade-ancient-greek-music-330440/"
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicLoopTimer: number | null = null;
  private bgAudio: HTMLAudioElement | null = null;
  public isMuted = false;
  public trackInfo: AudioTrackInfo = CURRENT_TRACK_INFO;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    try {
      if (!this.bgAudio) {
        this.bgAudio = new Audio('/audio/greek_music.mp3');
        this.bgAudio.loop = true;
        this.bgAudio.volume = 0.45;

        this.bgAudio.addEventListener('ended', () => {
          if (this.isMusicPlaying && !this.isMuted) {
            this.bgAudio?.play().catch(() => this.playGreekPromenade());
          }
        });

        this.bgAudio.addEventListener('error', (e) => {
          console.warn('Audio element error, falling back to Greek Promenade synth:', e);
          this.playGreekPromenade();
        });
      }
    } catch (e) {
      console.warn('Could not initialize background audio element:', e);
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.value = 0.22; // Gentle background volume for Greek Promenade
      this.sfxGain.gain.value = 0.25;

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Sound Effects ---
  public playPluck(frequency = 440) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.65);
      }, i * 100);
    });
  }

  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    // Olympian celebratory fanfare
    const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    arpeggio.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.85);
      }, idx * 120);
    });
  }

  // --- Background Greek Promenade Synthesis & Audio Player ---
  public toggleMusic(enable?: boolean): boolean {
    this.initCtx();

    if (enable !== undefined) {
      if (enable) {
        if (!this.isMusicPlaying) {
          this.startMusic();
        }
        return true;
      } else {
        this.stopMusic();
        return false;
      }
    }

    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public startMusic() {
    this.isMusicPlaying = true;
    if (this.isMuted) return;

    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (!this.bgAudio && typeof window !== 'undefined') {
      this.initAudioElement();
    }

    if (this.bgAudio) {
      this.bgAudio.loop = true;
      this.bgAudio.volume = 0.45;
      const playPromise = this.bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play auto-prevented by browser or error, starting Greek Promenade synth fallback:', err);
          this.playGreekPromenade();
        });
      }
    } else {
      this.playGreekPromenade();
    }
  }

  public checkAndResume() {
    if (this.isMusicPlaying && !this.isMuted) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (this.bgAudio) {
        if (this.bgAudio.paused) {
          this.bgAudio.play().catch(() => {
            if (!this.musicLoopTimer) {
              this.playGreekPromenade();
            }
          });
        }
      } else {
        if (!this.musicLoopTimer) {
          this.playGreekPromenade();
        }
      }
    }
  }

  // Authentic Ancient Greek Promenade melody (Bouzouki / Lyre / Aulos)
  private playGreekPromenade() {
    if (!this.isMusicPlaying || this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.musicGain) return;

    // Ancient Greek Dorian & Mixolydian Promenade Mode Frequencies (D, E, F#, G, A, B, C, D)
    const scale = [
      293.66, // D4
      329.63, // E4
      369.99, // F#4 (Greek Hijaz/Dorian)
      392.00, // G4
      440.00, // A4
      493.88, // B4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      739.99, // F#5
    ];

    // Greek Promenade Motif Sequence (Bright Bouzouki & Lyre Promenade March)
    const promenadePattern = [
      { note: 0, dur: 0.3, type: 'bouzouki' },
      { note: 2, dur: 0.3, type: 'bouzouki' },
      { note: 4, dur: 0.5, type: 'bouzouki' },
      { note: 3, dur: 0.3, type: 'aulos' },
      { note: 2, dur: 0.3, type: 'bouzouki' },
      { note: 4, dur: 0.6, type: 'bouzouki' },
      { note: 5, dur: 0.3, type: 'bouzouki' },
      { note: 7, dur: 0.8, type: 'aulos' },
      { note: 6, dur: 0.3, type: 'bouzouki' },
      { note: 5, dur: 0.3, type: 'bouzouki' },
      { note: 4, dur: 0.4, type: 'bouzouki' },
      { note: 3, dur: 0.4, type: 'aulos' },
      { note: 2, dur: 0.5, type: 'bouzouki' },
      { note: 1, dur: 0.3, type: 'bouzouki' },
      { note: 0, dur: 0.9, type: 'bouzouki' },
    ];

    const stepTime = 320; // BPM ~94 Promenade March Tempo

    promenadePattern.forEach((item, step) => {
      setTimeout(() => {
        if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.isMuted) return;

        const freq = scale[item.note % scale.length];
        const now = this.ctx.currentTime;

        // Bouzouki / Lyre dual harmonic oscillator
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (item.type === 'bouzouki') {
          osc1.type = 'sawtooth';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(freq, now);
          osc2.frequency.setValueAtTime(freq * 2, now); // Octave chime

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + item.dur);
        } else {
          // Aulos flute tone
          osc1.type = 'triangle';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(freq, now);
          osc2.frequency.setValueAtTime(freq * 1.005, now); // Subtle chorus chorus vibrato

          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + item.dur * 1.2);
        }

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.musicGain);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + item.dur * 1.3);
        osc2.stop(now + item.dur * 1.3);
      }, step * stepTime);
    });

    // Loop sequence
    const loopDuration = promenadePattern.length * stepTime + 600;
    this.musicLoopTimer = window.setTimeout(() => {
      this.playGreekPromenade();
    }, loopDuration);
  }

  public setAudioUrl(url: string) {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.bgAudio = new Audio(url);
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.45;
    if (this.isMusicPlaying && !this.isMuted) {
      this.bgAudio.play().catch(e => console.warn('Could not play new audio URL:', e));
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.bgAudio) {
      try {
        this.bgAudio.pause();
      } catch (e) {
        // ignore
      }
    }
    if (this.musicLoopTimer) {
      clearTimeout(this.musicLoopTimer);
      this.musicLoopTimer = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      if (this.isMusicPlaying) {
        this.startMusic();
      }
    }
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();

