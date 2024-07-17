const saveGameState = (board: string[][]) => {
  localStorage.setItem("sudoku-game-state", JSON.stringify(board));
};

const loadGameState = (): string[][] | null => {
  const savedState = localStorage.getItem("sudoku-game-state");
  return savedState ? JSON.parse(savedState) : null;
};

const clearGameState = () => {
  localStorage.removeItem("sudoku-game-state");
};

export { saveGameState, loadGameState, clearGameState };
