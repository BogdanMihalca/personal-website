"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  gameId: string;
  isActive: boolean;
}

const BOARD_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_FOOD = { x: 10, y: 10 };

export const TerminalSnakeGame = ({ isActive }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || (direction.x === 0 && direction.y === 0)) return;

    setSnake((currentSnake) => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (
        head.x < 0 ||
        head.x >= BOARD_SIZE ||
        head.y < 0 ||
        head.y >= BOARD_SIZE
      ) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore((prev) => prev + 10);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setDirection((prev) => (prev.y !== 1 ? { x: 0, y: -1 } : prev));
          break;
        case "s":
        case "arrowdown":
          setDirection((prev) => (prev.y !== -1 ? { x: 0, y: 1 } : prev));
          break;
        case "a":
        case "arrowleft":
          setDirection((prev) => (prev.x !== 1 ? { x: -1, y: 0 } : prev));
          break;
        case "d":
        case "arrowright":
          setDirection((prev) => (prev.x !== -1 ? { x: 1, y: 0 } : prev));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver, isActive]);

  useEffect(() => {
    if (!isActive || gameOver) return;

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameOver, isActive]);

  return (
    <div className="bg-gray-900/80 p-4 rounded border border-cyan-500/50 backdrop-blur my-2">
      <div className="flex justify-between items-center mb-3">
        <div className="text-cyan-400 text-sm font-mono">
          🐍 SNAKE GAME | Score: {score}
        </div>
        {gameOver && (
          <div className="text-red-400 text-sm font-mono animate-pulse">
            GAME OVER
          </div>
        )}
      </div>

      <div
        className="grid gap-px bg-gray-800 p-2 rounded mx-auto"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          width: "min(400px, 80vw)",
          height: "min(400px, 80vw)",
          aspectRatio: "1",
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
          const x = i % BOARD_SIZE;
          const y = Math.floor(i / BOARD_SIZE);
          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          );
          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <motion.div
              key={`cell-${x}-${y}`}
              className={`
                ${isFood ? "bg-red-500" : ""}
                ${isSnake && !isHead ? "bg-green-500" : ""}
                ${isHead ? "bg-green-300" : ""}
                ${!isSnake && !isFood ? "bg-gray-700" : ""}
                rounded-sm
              `}
              initial={{ scale: 0.8 }}
              animate={{
                scale: isFood ? [0.8, 1.2, 0.8] : 1,
                boxShadow: isHead ? "0 0 10px #00ff00" : "none",
              }}
              transition={{
                scale: isFood
                  ? { duration: 0.5, repeat: Infinity }
                  : { duration: 0.1 },
                boxShadow: { duration: 0.1 },
              }}
            />
          );
        })}
      </div>

      <div className="mt-3 text-xs text-cyan-600 font-mono">
        Use WASD or arrow keys to control • Avoid walls and yourself
      </div>
    </div>
  );
};
