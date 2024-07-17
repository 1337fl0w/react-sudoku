const saveGameState = (board: string[][], notes: string[][][]) => {
  const gameState = { board, notes };
  localStorage.setItem("sudoku-game-state", JSON.stringify(gameState));
};

const loadGameState = (): { board: string[][]; notes: string[][][] } | null => {
  const savedState = localStorage.getItem("sudoku-game-state");
  return savedState ? JSON.parse(savedState) : null;
};

const clearGameState = () => {
  localStorage.removeItem("sudoku-game-state");
};

export { saveGameState, loadGameState, clearGameState };
