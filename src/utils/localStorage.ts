export const saveGameState = (board: string[][]) => {
  localStorage.setItem("sudokuGameState", JSON.stringify(board));
};

export const loadGameState = (): string[][] | null => {
  const savedState = localStorage.getItem("sudokuGameState");
  return savedState ? JSON.parse(savedState) : null;
};

export const clearGameState = () => {
  localStorage.removeItem("sudokuGameState");
};
