import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Compass, Landmark, Columns, Trees, Waves } from 'lucide-react';

import assemblyHallImg from '../assets/images/assembly_hall_greece_1784752688538.jpg';
import templeGreeceImg from '../assets/images/temple_greece_view_1784752704859.jpg';
import seaGreeceImg from '../assets/images/sea_greece_view_1784752718950.jpg';
import gardenGreeceImg from '../assets/images/garden_greece_view_1784752733295.jpg';
import mountainGreeceImg from '../assets/images/mountain_greece_view_1784752746699.jpg';

export interface SlideItem {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
}

export const SLIDES: SlideItem[] = [
  {
    id: 'assembly-hall',
    url: assemblyHallImg,
    title: 'Ancient Olympian Council Assembly Hall',
    subtitle: 'Classical Odeon & Stone Council Amphitheatre of Mount Olympus',
    icon: Landmark,
  },
  {
    id: 'ancient-greece-temple',
    url: templeGreeceImg,
    title: 'Sacred Temple of Hera & Marble Sanctuary',
    subtitle: 'Classical Doric Columns & Ancient Olympian Ruins',
    icon: Columns,
  },
  {
    id: 'aegean-sea-view',
    url: seaGreeceImg,
    title: 'Azure Aegean Sea & Ancient Shoreline',
    subtitle: 'Sunlit Coastal Cliffs of Classical Ancient Greece',
    icon: Waves,
  },
  {
    id: 'sacred-garden-view',
    url: gardenGreeceImg,
    title: 'Sacred Olive Garden & Terraces',
    subtitle: 'Golden Mediterranean Sunbeams through Ancient Laurel Trees',
    icon: Trees,
  },
  {
    id: 'mount-olympus-view',
    url: mountainGreeceImg,
    title: 'Majestic Mount Olympus Mountain Peaks',
    subtitle: 'Divine Peaks & Mystical Valleys of the Gods',
    icon: Compass,
  },
];

export const PhotoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl group">
      {/* Slide Image with Smooth Cross-Fade Animation */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide.id}
          src={currentSlide.url}
          alt={currentSlide.title}
          referrerPolicy="no-referrer"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>

      {/* Dark Vignette Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17]/90 via-[#0B0E17]/25 to-transparent pointer-events-none" />

      {/* Slide Caption Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 right-16 z-10 flex items-center gap-3">
        <div className="p-2.5 rounded-full bg-[#D4AF37] text-[#0A0B10] font-bold shadow-lg shadow-[#D4AF37]/30 shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B0E17]/85 border border-[#D4AF37]/40 text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
            <Compass className="w-3 h-3 text-[#D4AF37]" />
            <span>Olympian View {currentIndex + 1} / {SLIDES.length}</span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-light text-[#E0D7C6] tracking-wide leading-tight">
            {currentSlide.title}
          </h3>
          <p className="text-[11px] text-[#E0D7C6]/75 font-serif line-clamp-1">
            {currentSlide.subtitle}
          </p>
        </div>
      </div>

      {/* Controls Overlay */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0B0E17]/70 hover:bg-[#D4AF37] text-[#E0D7C6] hover:text-[#0A0B10] border border-[#D4AF37]/30 transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
        title="Previous Picture"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#0B0E17]/70 hover:bg-[#D4AF37] text-[#E0D7C6] hover:text-[#0A0B10] border border-[#D4AF37]/30 transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-md"
        title="Next Picture"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Top Right: Play/Pause Auto-Slide Toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-3 right-3 p-2 rounded-full bg-[#0B0E17]/80 hover:bg-[#D4AF37] text-[#E0D7C6] hover:text-[#0A0B10] border border-[#D4AF37]/40 transition-all cursor-pointer shadow-md flex items-center gap-1.5 px-3 text-[10px] font-bold uppercase tracking-wider"
        title={isPlaying ? 'Pause Auto-slide' : 'Start Auto-slide'}
      >
        {isPlaying ? <Pause className="w-3 h-3 text-[#D4AF37]" /> : <Play className="w-3 h-3 text-[#D4AF37]" />}
        <span className="hidden sm:inline">{isPlaying ? 'Auto' : 'Paused'}</span>
      </button>

      {/* Bottom Center Dots Indicator */}
      <div className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 bg-[#0B0E17]/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/20">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? 'w-6 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                : 'w-2 bg-[#E0D7C6]/30 hover:bg-[#E0D7C6]/60'
            }`}
            title={slide.title}
          />
        ))}
      </div>
    </div>
  );
};
