import { SnakeGame } from './SnakeGame';
import { MusicPlayer } from './MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div id="root-container" className="relative min-h-screen glitch-container flex flex-col items-center justify-center p-4">
      {/* Scanlines Overlay & Static Noise */}
      <div id="fx-scanlines" className="scanlines"></div>
      <div id="fx-noise" className="static-noise"></div>

      <motion.header 
        id="main-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 z-10 w-full flex justify-between items-start max-w-5xl px-4"
      >
        <div id="header-title" className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-bold glitch-text" data-text="NEON_SERPENT">
            NEON_SERPENT
          </h1>
          <p id="header-version" className="text-magenta tracking-[0.3em] font-bold mt-2 text-sm sm:text-base">V. 1.0.9 // ONLINE</p>
        </div>
      </motion.header>

      <main id="main-content" className="z-10 flex flex-col xl:flex-row gap-8 items-center xl:items-start w-full max-w-5xl px-4">
        <div id="game-section" className="flex-1 w-full flex justify-center relative">
          <SnakeGame />
        </div>
        
        <div id="music-section" className="w-full xl:w-[320px] flex justify-center">
          <MusicPlayer />
        </div>
      </main>

      <footer id="main-footer" className="fixed bottom-4 left-4 z-10 text-cyan/50 text-sm tracking-widest hidden md:block">
        [ SYS_OP ] NEURAL INTERFACE SECURE
      </footer>
    </div>
  );
}
