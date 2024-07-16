import { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useTheme } from "../theme/ThemeContext";
import { saveGameState, loadGameState } from "../utils/localStorage";

const initialBoard = Array.from({ length: 9 }, () => Array(9).fill(""));

const isValidMove = (
  board: string[][],
  row: number,
  col: number,
  value: string
) => {
  if (board[row].includes(value)) return false;
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === value) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === value) return false;
    }
  }
  return true;
};

const generateSolvedBoard = () => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(""));
  const fillBoard = (board: string[][]): boolean => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          nums.sort(() => Math.random() - 0.5);
          for (const num of nums) {
            const value = num.toString();
            if (isValidMove(board, row, col, value)) {
              board[row][col] = value;
              if (fillBoard(board)) {
                return true;
              }
              board[row][col] = "";
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  fillBoard(board);
  return board;
};

const createPuzzle = (solvedBoard: string[][], clues: number) => {
  const puzzle = solvedBoard.map((row) => row.slice());
  let attempts = 81 - clues;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== "") {
      puzzle[row][col] = "";
      attempts--;
    }
  }
  return puzzle;
};

export const GameBoard = () => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<"ongoing" | "win" | "lose">(
    "ongoing"
  );

  const { darkMode } = useTheme();

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setBoard(savedState);
    } else {
      generatePuzzle();
    }
  }, []);

  const generatePuzzle = () => {
    const solvedBoard = generateSolvedBoard();
    const puzzle = createPuzzle(solvedBoard, 30);
    setBoard(puzzle);
    saveGameState(puzzle);
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (gameStatus !== "ongoing") return;
    const newBoard = [...board];
    if (/^[1-9]?$/.test(value)) {
      if (value === "" || isValidMove(board, row, col, value)) {
        newBoard[row][col] = value;
        setBoard(newBoard);
        saveGameState(newBoard);
        checkWinCondition(newBoard);
      } else {
        setIncorrectGuesses((prev) => prev + 1);
        if (incorrectGuesses + 1 >= 3) {
          setGameStatus("lose");
        }
      }
    }
  };

  const handleFocus = (row: number, col: number) => {
    setFocusedCell({ row, col });
  };

  const handleBlur = () => {
    setFocusedCell(null);
  };

  const checkWinCondition = (board: string[][]) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          return false;
        }
      }
    }
    setGameStatus("win");
    return true;
  };

  const handleCloseEndGameDialog = () => {
    setGameStatus("ongoing");
    setIncorrectGuesses(0);
    generatePuzzle();
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isTopEdge = rowIndex % 3 === 0;
            const isBottomEdge = rowIndex % 3 === 2;
            const isLeftEdge = colIndex % 3 === 0;
            const isRightEdge = colIndex % 3 === 2;

            const isHighlighted =
              focusedCell &&
              (focusedCell.row === rowIndex ||
                focusedCell.col === colIndex ||
                (Math.floor(focusedCell.row / 3) === Math.floor(rowIndex / 3) &&
                  Math.floor(focusedCell.col / 3) ===
                    Math.floor(colIndex / 3)));

            return (
              <TextField
                key={`${rowIndex}-${colIndex}`}
                variant="standard"
                inputProps={{
                  style: {
                    textAlign: "center",
                    padding: "10px",
                    fontSize: "1.2rem",
                    color: darkMode ? "white" : "black",
                  },
                }}
                value={cell}
                onFocus={() => handleFocus(rowIndex, colIndex)}
                onBlur={handleBlur}
                onChange={(e) =>
                  handleInputChange(rowIndex, colIndex, e.target.value)
                }
                sx={{
                  backgroundColor: isHighlighted
                    ? darkMode
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.1)"
                    : darkMode
                    ? "#333"
                    : "white",
                  borderTop: isTopEdge
                    ? darkMode
                      ? "2px solid white"
                      : "2px solid black"
                    : "1px solid grey",
                  borderBottom: isBottomEdge
                    ? darkMode
                      ? "2px solid white"
                      : "2px solid black"
                    : "1px solid grey",
                  borderLeft: isLeftEdge
                    ? darkMode
                      ? "2px solid white"
                      : "2px solid black"
                    : "1px solid grey",
                  borderRight: isRightEdge
                    ? darkMode
                      ? "2px solid white"
                      : "2px solid black"
                    : "1px solid grey",
                }}
              />
            );
          })
        )}
      </Box>

      <Dialog
        open={gameStatus !== "ongoing"}
        onClose={handleCloseEndGameDialog}
      >
        <DialogTitle>
          {gameStatus === "win" ? "You Win!" : "Game Over"}
        </DialogTitle>
        <DialogContent>
          <p>
            {gameStatus === "win"
              ? "Congratulations! You have completed the Sudoku puzzle."
              : "You have made 3 incorrect guesses. Better luck next time!"}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEndGameDialog}>Start New Game</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
