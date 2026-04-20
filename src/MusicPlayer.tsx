import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';

// Using reliable public domain / placeholder sound URLs for the AI generated music simulation
const TRACKS = [
  {
    id: 1,
    title: "NEON_DROPS_01.WAV",
    // placeholder tracks from freesound / internet archive / cc0 libraries
    url: "https://actions.google.com/sounds/v1/science_fiction/alien_spaceship_interior.ogg"
  },
  {
    id: 2,
    title: "NEURAL_LINK_BETA.MP3",
    url: "https://actions.google.com/sounds/v1/science_fiction/ambient_hum.ogg"
  },
  {
    id: 3,
    title: "CYBER_PULSE_99.FLAC",
    url: "https://actions.google.com/sounds/v1/science_fiction/sci_fi_hover_craft.ogg"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      id="music-player-card" 
      className="border-glitch p-4 bg-void/80 flex flex-col gap-4 w-full max-w-md backdrop-blur-md"
    >
      <div className="flex justify-between items-center border-b border-cyan pb-2 border-dashed">
        <h2 className="text-xl glitch-text" data-text="AUDIO_SYS_OP">AUDIO_SYS_OP</h2>
        <span id="player-status" className="text-xs text-magenta animate-pulse">
          {isPlaying ? '[ ACTIVE ]' : '[ IDLE ]'}
        </span>
      </div>
      
      <div id="track-info" className="flex flex-col gap-1">
        <div className="text-sm opacity-70">CURRENT_TRACK:</div>
        <div className="text-lg text-cyan truncate">
          {'>'} {currentTrack.title}
        </div>
      </div>

      <div className="flex gap-4 items-center mt-2">
        <button 
          id="btn-prev-track"
          onClick={prevTrack} 
          className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-cyan hover:text-void border border-cyan px-3 py-1 transition-colors"
          aria-label="Previous Track"
        >
          <SkipBack size={20} />
        </button>
        <button 
          id="btn-play-pause"
          onClick={togglePlay} 
          className="min-h-[44px] flex items-center justify-center hover:bg-magenta hover:text-void border border-magenta px-4 py-1 flex-1 transition-colors font-bold text-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} className="mr-2"/> : <Play size={24} className="mr-2"/>}
          {isPlaying ? 'PAUSE_STREAM' : 'INIT_STREAM'}
        </button>
        <button 
          id="btn-next-track"
          onClick={nextTrack} 
          className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-cyan hover:text-void border border-cyan px-3 py-1 transition-colors"
          aria-label="Next Track"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <audio 
        id="hidden-audio-element"
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        loop={false}
      />
    </motion.div>
  );
}
