import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    directionRef.current = { x: 0, y: -1 };
    setScore(0);
    setGameOver(false);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setIsPaused(false);
  };

  const handleInput = useCallback((cmd: string) => {
    switch (cmd) {
      case 'UP':
        if (directionRef.current.y === 0) {
          setDirection({ x: 0, y: -1 });
          directionRef.current = { x: 0, y: -1 };
        }
        break;
      case 'DOWN':
        if (directionRef.current.y === 0) {
          setDirection({ x: 0, y: 1 });
          directionRef.current = { x: 0, y: 1 };
        }
        break;
      case 'LEFT':
        if (directionRef.current.x === 0) {
          setDirection({ x: -1, y: 0 });
          directionRef.current = { x: -1, y: 0 };
        }
        break;
      case 'RIGHT':
        if (directionRef.current.x === 0) {
          setDirection({ x: 1, y: 0 });
          directionRef.current = { x: 1, y: 0 };
        }
        break;
      case 'PAUSE':
        setIsPaused(p => !p);
        break;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          handleInput('UP');
          break;
        case 'ArrowDown':
        case 's':
          handleInput('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          handleInput('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          handleInput('RIGHT');
          break;
        case ' ':
          handleInput('PAUSE');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        // Collision with walls
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - (score * 2)));
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      id="snake-game-card" 
      className="border-glitch p-6 bg-void/90 flex flex-col items-center w-full max-w-[500px]"
    >
      <div id="game-header" className="w-full flex justify-between items-end mb-4 border-b border-cyan pb-2 border-dashed">
        <h2 className="text-2xl glitch-text" data-text="SNAKE.EXE">SNAKE.EXE</h2>
        <div id="game-score" className="text-xl text-magenta font-bold tracking-wider">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        id="game-canvas"
        className="relative w-full aspect-square border-2 border-cyan/50 bg-black overflow-hidden"
      >
        {/* Render Food */}
        <div 
          id="game-food"
          className="absolute bg-magenta"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            boxShadow: '0 0 10px #FF00FF'
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => (
          <div 
            key={`${segment.x}-${segment.y}-${index}`}
            className="absolute bg-neon-green origin-center"
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              border: '1px solid black',
              boxShadow: index === 0 ? '0 0 8px #39FF14' : 'none',
              zIndex: index === 0 ? 10 : 1,
              transform: 'scale(0.9)' // slight gap between segments
            }}
          />
        ))}

        {gameOver && (
          <div id="game-over-overlay" className="absolute inset-0 bg-void/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <h3 className="text-4xl text-magenta mb-4 glitch-text font-bold" data-text="TERMINATED">TERMINATED</h3>
            <button 
              id="btn-reboot"
              onClick={resetGame}
              className="mt-4 px-6 min-h-[44px] flex items-center justify-center border-2 border-cyan hover:bg-cyan hover:text-void transition-colors text-xl font-bold uppercase tracking-widest"
            >
              REBOOT_SYS
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div id="game-paused-overlay" className="absolute inset-0 bg-void/50 flex items-center justify-center z-20">
            <h3 className="text-2xl text-cyan animate-pulse tracking-[0.2em] font-bold bg-void/80 px-4 py-2 border border-cyan">PAUSED</h3>
          </div>
        )}
      </div>

      {/* Responsive Touch D-Pad for Mobile */}
      <div id="touch-controls" className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[200px] md:hidden">
         <div />
         <button id="btn-up" aria-label="Up" className="min-h-[44px] border border-cyan flex justify-center items-center active:bg-cyan active:text-void" onClick={() => handleInput('UP')}><ArrowUp size={24} /></button>
         <div />
         <button id="btn-left" aria-label="Left" className="min-h-[44px] border border-cyan flex justify-center items-center active:bg-cyan active:text-void" onClick={() => handleInput('LEFT')}><ArrowLeft size={24} /></button>
         <button id="btn-down" aria-label="Down" className="min-h-[44px] border border-cyan flex justify-center items-center active:bg-cyan active:text-void" onClick={() => handleInput('DOWN')}><ArrowDown size={24} /></button>
         <button id="btn-right" aria-label="Right" className="min-h-[44px] border border-cyan flex justify-center items-center active:bg-cyan active:text-void" onClick={() => handleInput('RIGHT')}><ArrowRight size={24} /></button>
      </div>

      <div id="desktop-instructions" className="mt-4 text-xs text-cyan/70 text-center uppercase tracking-widest flex-col sm:flex-row gap-2 sm:gap-4 hidden md:flex">
        <span>[ DIR: W/A/S/D or ARROWS ]</span>
        <span>[ CMD: SPACE to PAUSE ]</span>
      </div>
    </motion.div>
  );
}
