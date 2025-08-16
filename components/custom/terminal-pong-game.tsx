"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface PongGameProps {
  gameId: string;
  isActive: boolean;
  onScoreChange?: (score: number) => void;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 300;
const PADDLE_HEIGHT = 60;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 8;

export const TerminalPongGame = ({
  isActive,
  onScoreChange,
}: PongGameProps) => {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerPaddle, setPlayerPaddle] = useState({
    y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
  });
  const [aiPaddle, setAiPaddle] = useState({
    y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
  });
  const [ball, setBall] = useState<Ball>({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    dx: 3,
    dy: 2,
  });
  const [gameOver, setGameOver] = useState(false);

  // Reset ball position
  const resetBall = useCallback(() => {
    setBall({
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      dx: Math.random() > 0.5 ? 3 : -3,
      dy: (Math.random() - 0.5) * 4,
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (!isActive || gameOver) return;

    const gameLoop = setInterval(() => {
      setBall((prevBall) => {
        const newBall = { ...prevBall };

        // Move ball
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        // Bounce off top and bottom
        if (newBall.y <= 0 || newBall.y >= GAME_HEIGHT - BALL_SIZE) {
          newBall.dy = -newBall.dy;
        }

        // Check collision with player paddle
        if (
          newBall.x <= PADDLE_WIDTH &&
          newBall.y >= playerPaddle.y &&
          newBall.y <= playerPaddle.y + PADDLE_HEIGHT
        ) {
          newBall.dx = Math.abs(newBall.dx);
          newBall.dy += (Math.random() - 0.5) * 2;
        }

        // Check collision with AI paddle
        if (
          newBall.x >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newBall.y >= aiPaddle.y &&
          newBall.y <= aiPaddle.y + PADDLE_HEIGHT
        ) {
          newBall.dx = -Math.abs(newBall.dx);
          newBall.dy += (Math.random() - 0.5) * 2;
        }

        // Score points
        if (newBall.x < 0) {
          setAiScore((prev) => prev + 1);
          setTimeout(resetBall, 500);
        } else if (newBall.x > GAME_WIDTH) {
          setPlayerScore((prev) => {
            const newScore = prev + 1;
            onScoreChange?.(newScore);
            return newScore;
          });
          setTimeout(resetBall, 500);
        }

        return newBall;
      });

      // Move AI paddle
      setAiPaddle((prev) => {
        const center = prev.y + PADDLE_HEIGHT / 2;
        const ballCenter = ball.y + BALL_SIZE / 2;
        const speed = 2;

        if (center < ballCenter - 5) {
          return { y: Math.min(prev.y + speed, GAME_HEIGHT - PADDLE_HEIGHT) };
        } else if (center > ballCenter + 5) {
          return { y: Math.max(prev.y - speed, 0) };
        }
        return prev;
      });
    }, 16); // ~60fps

    return () => clearInterval(gameLoop);
  }, [
    isActive,
    gameOver,
    ball.y,
    playerPaddle.y,
    aiPaddle.y,
    resetBall,
    onScoreChange,
  ]);

  // Player controls
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const speed = 8;

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setPlayerPaddle((prev) => ({ y: Math.max(prev.y - speed, 0) }));
          break;
        case "s":
        case "arrowdown":
          setPlayerPaddle((prev) => ({
            y: Math.min(prev.y + speed, GAME_HEIGHT - PADDLE_HEIGHT),
          }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isActive]);

  // Check for game over
  useEffect(() => {
    if (playerScore >= 10 || aiScore >= 10) {
      setGameOver(true);
    }
  }, [playerScore, aiScore]);

  return (
    <div className="bg-gray-900/80 p-4 rounded border border-cyan-500/50 backdrop-blur my-2">
      <div className="flex justify-between items-center mb-3">
        <div className="text-cyan-400 text-sm font-mono">
          🏓 NEURAL PONG | Player: {playerScore} - AI: {aiScore}
        </div>
        {gameOver && (
          <div className="text-purple-400 text-sm font-mono animate-pulse">
            {playerScore > aiScore ? "VICTORY!" : "DEFEAT!"}
          </div>
        )}
      </div>

      <div
        className="relative bg-black/50 border border-cyan-500/30 mx-auto"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
        }}
      >
        {/* Center line */}
        <div
          className="absolute bg-cyan-500/30"
          style={{
            left: "50%",
            top: 0,
            width: "2px",
            height: "100%",
            transform: "translateX(-50%)",
          }}
        />

        {/* Player paddle */}
        <motion.div
          className="absolute bg-cyan-400"
          style={{
            left: 0,
            top: playerPaddle.y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
          animate={{
            boxShadow: "0 0 20px #00ffff",
          }}
        />

        {/* AI paddle */}
        <motion.div
          className="absolute bg-red-400"
          style={{
            right: 0,
            top: aiPaddle.y,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
          animate={{
            boxShadow: "0 0 20px #ff0000",
          }}
        />

        {/* Ball */}
        <motion.div
          className="absolute bg-yellow-400 rounded-full"
          style={{
            left: ball.x,
            top: ball.y,
            width: BALL_SIZE,
            height: BALL_SIZE,
          }}
          animate={{
            boxShadow: "0 0 15px #ffff00",
            scale: [1, 1.2, 1],
          }}
          transition={{
            scale: { duration: 0.5, repeat: Infinity },
          }}
        />
      </div>

      <div className="mt-3 text-xs text-cyan-600 font-mono">
        Use W/S or arrow keys to control • First to 10 points wins
      </div>
    </div>
  );
};
