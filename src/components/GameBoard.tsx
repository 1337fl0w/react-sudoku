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
import NumericKeypad from "./NumericKeypad";
import Timer from "./Timer";
import {
  clearGameState,
  loadGameState,
  saveGameState,
} from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

const initialNotes = Array.from({ length: 9 }, () => Array(9).fill([]));

const getInitialElapsedTime = () => {
  const savedState = localStorage.getItem("sudoku-game-state");
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return parsedState.elapsedTime || 0;
  }
  return 0;
};

const countSolutions = (board: string[][]): number => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let solutions = 0;

  const solve = (board: string[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          for (const num of nums) {
            const value = num.toString();
            if (isValidMove(board, row, col, value)) {
              board[row][col] = value;
              if (solve(board)) {
                solutions++;
                if (solutions > 1) return true;
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

  solve(board);
  return solutions;
};

const generatePuzzle = (): string[][] => {
  let solvedBoard: string[][] = [];
  let puzzle: string[][] = [];
  let uniqueSolution = false;

  while (!uniqueSolution) {
    solvedBoard = generateSolvedBoard();
    puzzle = createPuzzle(solvedBoard, 30);
    const puzzleCopy = puzzle.map((row) => row.slice());
    uniqueSolution = countSolutions(puzzleCopy) === 1;
  }

  return puzzle;
};

const calculateMultiplier = (elapsedTime: number): number => {
  const maxTime = 60 * 60;
  const multiplier = Math.max(
    1,
    1000 - Math.floor((999 * elapsedTime) / maxTime)
  );
  return multiplier;
};

export const GameBoard = () => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [notes, setNotes] = useState<string[][][]>(initialNotes);
  const [noteMode, setNoteMode] = useState(false);
  const navigate = useNavigate();
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<
    "ongoing" | "win" | "lose" | "nogame"
  >("ongoing");
  const [mistake, setMistake] = useState<{ row: number; col: number } | null>(
    null
  );
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(getInitialElapsedTime);
  const [points, setPoints] = useState(0);
  const [highlightCompleted, setHighlightCompleted] = useState<{
    row?: number;
    col?: number;
    subgrid?: { startRow: number; startCol: number };
  } | null>(null);

  const { darkMode } = useTheme();

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setBoard(savedState.board || initialBoard);
      setNotes(savedState.notes || initialNotes);
      setIncorrectGuesses(savedState.incorrectGuesses || 0);
      setElapsedTime(savedState.elapsedTime || 0);
      setPoints(savedState.points || 0);
    } else {
      const puzzle = generatePuzzle();
      setBoard(puzzle);
      saveGameState(puzzle, initialNotes, 0, 0, 0);
    }
  }, []);

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
        saveGameState(
          newBoard,
          newNotes,
          incorrectGuesses,
          elapsedTime,
          points
        );
      } else {
        if (value === "" || isValidMove(board, row, col, value)) {
          const multiplier = calculateMultiplier(elapsedTime);
          let newPoints = points + 1 * multiplier;

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

          let completedRow = false;
          if (newBoard[row].every((cell) => cell !== "")) {
            newPoints += 5 * multiplier;
            completedRow = true;
          }

          let completedCol = false;
          if (newBoard.every((r) => r[col] !== "")) {
            newPoints += 5 * multiplier;
            completedCol = true;
          }

          let subgridComplete = true;
          for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
              if (newBoard[i][j] === "") {
                subgridComplete = false;
                break;
              }
            }
          }
          if (subgridComplete) {
            newPoints += 5 * multiplier;
          }

          if (completedRow || completedCol || subgridComplete) {
            setHighlightCompleted({
              row: completedRow ? row : undefined,
              col: completedCol ? col : undefined,
              subgrid: subgridComplete ? { startRow, startCol } : undefined,
            });
            setTimeout(() => {
              setHighlightCompleted(null);
            }, 500);
          }

          setPoints(newPoints);
          setBoard(newBoard);
          setNotes(newNotes);
          saveGameState(
            newBoard,
            newNotes,
            incorrectGuesses,
            elapsedTime,
            newPoints
          );
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
          saveGameState(
            newBoard,
            newNotes,
            incorrectGuesses + 1,
            elapsedTime,
            points
          );
        }
      }
    }
  };

  const handleFocus = (row: number, col: number) => {
    setFocusedCell({ row, col });
    setHighlightedNote(board[row][col]);
  };

  const checkWinCondition = (board: string[][]) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          return false;
        }
      }
    }
    const multiplier = calculateMultiplier(elapsedTime);
    setPoints(points + 10 * multiplier);
    setGameStatus("win");
    return true;
  };

  const handleNewGame = () => {
    clearGameState();
    window.location.reload();
  };

  const handleBackToHome = () => {
    clearGameState();
    setGameStatus("nogame");
    navigate("/react-sudoku");
  };

  const handleNoteModeToggle = (value: boolean) => {
    setNoteMode(value);
  };

  const handleNumberClick = (value: string) => {
    if (focusedCell) {
      handleInputChange(focusedCell.row, focusedCell.col, value);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setElapsedTime(time);
    if (gameStatus === "ongoing") {
      saveGameState(board, notes, incorrectGuesses, time, points);
    }
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
                style={{ padding: "0.25rem 0.5rem", fontSize: "0.8rem" }}
              >
                On
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
          <Col xs="auto">
            <Timer
              isActive={gameStatus === "ongoing"}
              onTimeUpdate={handleTimeUpdate}
              initialTime={elapsedTime}
            />
          </Col>
          <Col xs="auto">
            <p style={{ marginBottom: "0" }}>Points</p>
            <p style={{ marginBottom: "0" }}>{points}</p>
          </Col>
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
              handleBlur={() => {}}
              handleInputChange={handleInputChange}
              highlightedNote={highlightedNote}
              highlightCompleted={highlightCompleted}
            />
          ))
        )}
      </Container>

      <Container className="mt-3" style={{ maxWidth: "500px", margin: "auto" }}>
        <NumericKeypad onNumberClick={handleNumberClick} />
      </Container>

      <Modal
        centered
        show={gameStatus !== "ongoing"}
        style={{ background: darkMode ? "black" : "white" }}
      >
        <Modal.Header
          style={{
            backgroundColor: darkMode ? "gray" : "white",
          }}
        >
          <Modal.Title
            style={{
              color: darkMode ? "white" : "black",
            }}
          >
            {gameStatus === "win" ? "You Win!" : "Game Over"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: darkMode ? "gray" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <p>
            {gameStatus === "win"
              ? "Congratulations! You have completed the Sudoku puzzle."
              : "You have made 3 incorrect guesses. Better luck next time!"}
          </p>
          <p>
            Time Taken:{" "}
            {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
          </p>
          <p>Points: {points}</p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: darkMode ? "gray" : "white",
          }}
        >
          <Button variant="secondary" onClick={handleBackToHome}>
            Back to the Home Screen
          </Button>
          <Button variant="danger" onClick={handleNewGame}>
            Start New Game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
