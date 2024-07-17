import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  Row,
  Col,
} from "react-bootstrap";
import { useTheme } from "../theme/ThemeContext";
import {
  generateSolvedBoard,
  createPuzzle,
  isValidMove,
  initialBoard,
} from "../models/Board";
import SudokuCell from "./SudokuCell";
import { loadGameState, saveGameState } from "../utils/localStorage";

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
      setIncorrectGuesses(savedState.incorrectGuesses || 0);
    } else {
      generatePuzzle();
    }
  }, []);

  const generatePuzzle = () => {
    const solvedBoard = generateSolvedBoard();
    const puzzle = createPuzzle(solvedBoard, 30);
    setBoard(puzzle);
    saveGameState(puzzle, initialNotes, 0); // Initialize with 0 mistakes
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
        saveGameState(newBoard, newNotes, incorrectGuesses);
      } else {
        if (value === "" || isValidMove(board, row, col, value)) {
          newBoard[row][col] = value;
          newNotes[row][col] = [];

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
          saveGameState(newBoard, newNotes, incorrectGuesses);
          checkWinCondition(newBoard);
          setMistake(null);
        } else {
          setIncorrectGuesses((prev) => prev + 1);
          setMistake({ row, col });
          setTimeout(() => {
            setMistake(null);
          }, 500);
          if (incorrectGuesses + 1 >= 3) {
            setGameStatus("lose");
          }
          saveGameState(newBoard, newNotes, incorrectGuesses + 1);
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
    setMistake(null);
    generatePuzzle();
  };

  const handleNoteModeToggle = (value: boolean) => {
    setNoteMode(value);
  };

  return (
    <>
      <Container className="mb-3">
        <Row className="align-items-center">
          <Col xs="auto">
            <p style={{ marginBottom: "0" }}>Notes</p>
            <ToggleButtonGroup
              type="radio"
              name="noteMode"
              value={noteMode ? 1 : 0}
              onChange={(val) => handleNoteModeToggle(!!val)}
            >
              <ToggleButton
                value={0}
                variant="outline-primary"
                id={"toggle-normal-mode"}
              >
                Off
              </ToggleButton>
              <ToggleButton
                value={1}
                variant="outline-secondary"
                id={"toggle-note-mode"}
              >
                On
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
          <Col></Col>
          <Col className="text-end">
            <p style={{ marginBottom: "0" }}>Mistakes</p>
            <p style={{ marginBottom: "0" }}>{incorrectGuesses} / 3</p>
          </Col>
        </Row>
      </Container>
      <Container
        className="d-flex flex-wrap"
        style={{ maxWidth: "500px", margin: "auto" }}
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
      </Container>

      <Modal show={gameStatus !== "ongoing"} onHide={handleCloseEndGameDialog}>
        <Modal.Header closeButton>
          <Modal.Title>
            {gameStatus === "win" ? "You Win!" : "Game Over"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {gameStatus === "win"
              ? "Congratulations! You have completed the Sudoku puzzle."
              : "You have made 3 incorrect guesses. Better luck next time!"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseEndGameDialog}>
            Start New Game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
