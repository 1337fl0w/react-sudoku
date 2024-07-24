const saveGameState = (
  board: string[][],
  notes: string[][][],
  incorrectGuesses: number,
  elapsedTime: number
) => {
  const gameState = { board, notes, incorrectGuesses, elapsedTime };
  localStorage.setItem("sudoku-game-state", JSON.stringify(gameState));
};

const loadGameState = (): {
  board: string[][];
  notes: string[][][];
  incorrectGuesses: number;
  elapsedTime: number;
} | null => {
  const savedState = localStorage.getItem("sudoku-game-state");
  return savedState ? JSON.parse(savedState) : null;
};

const clearGameState = () => {
  localStorage.removeItem("sudoku-game-state");
};

const isGameSaved = (): boolean => {
  const savedState = localStorage.getItem("sudoku-game-state");
  return savedState !== null;
};

export { saveGameState, loadGameState, clearGameState, isGameSaved };
