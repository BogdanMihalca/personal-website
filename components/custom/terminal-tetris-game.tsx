"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TetrisGameProps {
  gameId: string;
  isActive: boolean;
  onScoreChange?: (score: number) => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 15;

// Tetris pieces
const PIECES = [
  // I piece
  [[1, 1, 1, 1]],
  // O piece
  [
    [1, 1],
    [1, 1],
  ],
  // T piece
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  // S piece
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  // Z piece
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  // J piece
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  // L piece
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
];

const COLORS = [
  "#00ffff", // cyan
  "#ffff00", // yellow
  "#ff00ff", // magenta
  "#00ff00", // green
  "#ff0000", // red
  "#0000ff", // blue
  "#ffa500", // orange
];

interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

export const TerminalTetrisGame = ({
  isActive,
  onScoreChange,
}: TetrisGameProps) => {
  const [board, setBoard] = useState<string[][]>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(""))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Create new piece
  const createNewPiece = useCallback((): Piece => {
    const pieceIndex = Math.floor(Math.random() * PIECES.length);
    return {
      shape: PIECES[pieceIndex],
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      color: COLORS[pieceIndex],
    };
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((piece: Piece): number[][] => {
    // Don't rotate O piece (square)
    if (piece.shape.length === 2 && piece.shape[0].length === 2) {
      return piece.shape;
    }

    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map((row) => row[index]).reverse()
    );
    return rotated;
  }, []);

  // Check collision
  const checkCollision = useCallback(
    (piece: Piece, deltaX = 0, deltaY = 0): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.x + x + deltaX;
            const newY = piece.y + y + deltaY;

            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && board[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    [board]
  );

  // Place piece on board
  const placePiece = useCallback(
    (piece: Piece) => {
      const newBoard = board.map((row) => [...row]);

      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.y + y;
            const boardX = piece.x + x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = piece.color;
            }
          }
        }
      }

      setBoard(newBoard);
    },
    [board]
  );

  // Clear completed lines
  const clearLines = useCallback(
    (newBoard: string[][]) => {
      const completedLines: number[] = [];

      for (let y = 0; y < BOARD_HEIGHT; y++) {
        if (newBoard[y].every((cell) => cell !== "")) {
          completedLines.push(y);
        }
      }

      if (completedLines.length > 0) {
        // Remove completed lines
        const filteredBoard = newBoard.filter(
          (_, index) => !completedLines.includes(index)
        );

        // Add new empty lines at top
        const emptyLines = Array(completedLines.length)
          .fill(null)
          .map(() => Array(BOARD_WIDTH).fill(""));
        const finalBoard = [...emptyLines, ...filteredBoard];

        setBoard(finalBoard);
        setLines((prev) => prev + completedLines.length);

        // Update score
        const points = completedLines.length * 100 * level;
        setScore((prev) => {
          const newScore = prev + points;
          onScoreChange?.(newScore);
          return newScore;
        });
      }
    },
    [level, onScoreChange]
  );

  // Move piece down
  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver) return;

    if (!checkCollision(currentPiece, 0, 1)) {
      setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null));
    } else {
      placePiece(currentPiece);
      const newBoard = [...board];
      clearLines(newBoard);

      const newPiece = createNewPiece();
      if (checkCollision(newPiece)) {
        setGameOver(true);
      } else {
        setCurrentPiece(newPiece);
      }
    }
  }, [
    currentPiece,
    gameOver,
    checkCollision,
    placePiece,
    board,
    clearLines,
    createNewPiece,
  ]);

  // Game loop
  useEffect(() => {
    if (!isActive || gameOver) return;

    const dropTime = Math.max(50, 500 - (level - 1) * 50);
    const interval = setInterval(moveDown, dropTime);

    return () => clearInterval(interval);
  }, [isActive, gameOver, level, moveDown]);

  // Initialize first piece
  useEffect(() => {
    if (isActive && !currentPiece && !gameOver) {
      setCurrentPiece(createNewPiece());
    }
  }, [isActive, currentPiece, gameOver, createNewPiece]);

  // Controls
  useEffect(() => {
    if (!isActive || !currentPiece) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "a":
        case "arrowleft":
          if (!checkCollision(currentPiece, -1, 0)) {
            setCurrentPiece((prev) =>
              prev ? { ...prev, x: prev.x - 1 } : null
            );
          }
          break;
        case "d":
        case "arrowright":
          if (!checkCollision(currentPiece, 1, 0)) {
            setCurrentPiece((prev) =>
              prev ? { ...prev, x: prev.x + 1 } : null
            );
          }
          break;
        case "s":
        case "arrowdown":
          moveDown();
          break;
        case "w":
        case "arrowup":
        case " ": // spacebar
          // Rotate piece
          const rotatedShape = rotatePiece(currentPiece);
          const rotatedPiece = { ...currentPiece, shape: rotatedShape };

          // Check if rotation is valid
          if (!checkCollision(rotatedPiece)) {
            setCurrentPiece(rotatedPiece);
          } else {
            // Try wall kicks (move left/right to accommodate rotation)
            const wallKicks = [-1, 1, -2, 2];
            let rotationSuccessful = false;

            for (const kick of wallKicks) {
              const kickedPiece = {
                ...rotatedPiece,
                x: rotatedPiece.x + kick,
              };

              if (!checkCollision(kickedPiece)) {
                setCurrentPiece(kickedPiece);
                rotationSuccessful = true;
                break;
              }
            }

            // If wall kicks don't work, don't rotate
            if (!rotationSuccessful) {
              // Rotation blocked, keep original piece
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isActive, currentPiece, checkCollision, moveDown, rotatePiece]);

  // Update level
  useEffect(() => {
    setLevel(Math.floor(lines / 10) + 1);
  }, [lines]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row]);

    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (
              boardY >= 0 &&
              boardY < BOARD_HEIGHT &&
              boardX >= 0 &&
              boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  return (
    <div className="bg-gray-900/80 p-4 rounded border border-cyan-500/50 backdrop-blur my-2">
      <div className="flex justify-between items-center mb-3">
        <div className="text-cyan-400 text-sm font-mono">
          🎮 NEURAL TETRIS | Score: {score} | Level: {level} | Lines: {lines}
        </div>
        {gameOver && (
          <div className="text-red-400 text-sm font-mono animate-pulse">
            GAME OVER
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <div
          className="grid gap-px bg-gray-800 p-2 rounded border border-cyan-500/30"
          style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${CELL_SIZE}px)`,
          }}
        >
          {renderBoard().map((row, y) =>
            row.map((cell, x) => (
              <motion.div
                key={`${x}-${y}`}
                className="border border-gray-700/30"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: cell || "#1a1a1a",
                }}
                animate={{
                  boxShadow: cell ? `0 0 10px ${cell}` : "none",
                }}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-cyan-600 font-mono text-center">
        A/D: Move • S: Drop • W/Space: Rotate • Clear lines to level up!
      </div>
    </div>
  );
};
