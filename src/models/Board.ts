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

export { initialBoard, isValidMove, generateSolvedBoard, createPuzzle };
