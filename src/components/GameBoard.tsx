import { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "../theme/ThemeContext";
import { saveGameState, loadGameState } from "../models/utils";
import {
  generateSolvedBoard,
  createPuzzle,
  isValidMove,
  initialBoard,
} from "../models/Board";
import SudokuCell from "./SudokuCell";
import MistakesCounter from "./MistakesCounter";

const initialNotes = Array.from({ length: 9 }, () => Array(9).fill([]));

export const GameBoard = () => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [notes, setNotes] = useState<string[][][]>(initialNotes);
  const [noteMode, setNoteMode] = useState(false);
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<"ongoing" | "win" | "lose">(
    "ongoing"
  );
  const [mistake, setMistake] = useState<{ row: number; col: number } | null>(
    null
  );
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);

  const { darkMode } = useTheme();

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setBoard(savedState.board || initialBoard);
      setNotes(savedState.notes || initialNotes);
    } else {
      generatePuzzle();
    }
  }, []);

  const generatePuzzle = () => {
    const solvedBoard = generateSolvedBoard();
    const puzzle = createPuzzle(solvedBoard, 30);
    setBoard(puzzle);
    saveGameState(puzzle, initialNotes);
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    if (gameStatus !== "ongoing") return;
    const newBoard = board.map((row) => [...row]);
    const newNotes = notes.map((row) => row.map((cell) => [...cell]));
    if (/^[1-9]?$/.test(value)) {
      if (noteMode) {
        if (value === "") {
          newNotes[row][col] = [];
        } else if (!newNotes[row][col].includes(value)) {
          newNotes[row][col] = [...newNotes[row][col], value];
        } else {
          newNotes[row][col] = newNotes[row][col].filter(
            (note) => note !== value
          );
        }
        setNotes(newNotes);
        saveGameState(newBoard, newNotes); // Save notes to local storage
      } else {
        if (value === "" || isValidMove(board, row, col, value)) {
          newBoard[row][col] = value;
          newNotes[row][col] = []; // Clear notes when correct number is placed

          // Remove the same value from notes in the same row, column, and subgrid
          for (let i = 0; i < 9; i++) {
            if (i !== col)
              newNotes[row][i] = newNotes[row][i].filter(
                (note) => note !== value
              );
            if (i !== row)
              newNotes[i][col] = newNotes[i][col].filter(
                (note) => note !== value
              );
          }
          const startRow = Math.floor(row / 3) * 3;
          const startCol = Math.floor(col / 3) * 3;
          for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
              if (i !== row && j !== col) {
                newNotes[i][j] = newNotes[i][j].filter(
                  (note) => note !== value
                );
              }
            }
          }

          setBoard(newBoard);
          setNotes(newNotes);
          saveGameState(newBoard, newNotes);
          checkWinCondition(newBoard);
          setMistake(null);
        } else {
          setIncorrectGuesses((prev) => prev + 1);
          setMistake({ row, col });
          setTimeout(() => {
            setMistake(null);
          }, 500); // Reset mistake after 500ms
          if (incorrectGuesses + 1 >= 3) {
            setGameStatus("lose");
          }
        }
      }
    }
  };

  const handleFocus = (row: number, col: number) => {
    setFocusedCell({ row, col });
    setHighlightedNote(board[row][col]);
  };

  const handleBlur = () => {
    setFocusedCell(null);
    setHighlightedNote(null);
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
    setMistake(null); // Clear mistake on new game
    generatePuzzle();
  };

  const handleNoteModeToggle = () => {
    setNoteMode((prev) => !prev);
  };

  return (
    <>
      <FormControlLabel
        control={<Switch checked={noteMode} onChange={handleNoteModeToggle} />}
        label="Note Mode"
        sx={{ display: "block", textAlign: "center", marginBottom: "1rem" }}
      />
      <MistakesCounter mistakes={incorrectGuesses} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          maxWidth: "500px",
          maxHeight: "500px",
          margin: "auto",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              rowIndex={rowIndex}
              colIndex={colIndex}
              value={cell}
              notes={notes[rowIndex][colIndex]}
              noteMode={noteMode}
              focusedCell={focusedCell}
              mistake={mistake}
              darkMode={darkMode}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
              handleInputChange={handleInputChange}
              highlightedNote={highlightedNote}
            />
          ))
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
