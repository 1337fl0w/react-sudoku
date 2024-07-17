import { TextField } from "@mui/material";

interface SudokuCellProps {
  rowIndex: number;
  colIndex: number;
  value: string;
  focusedCell: { row: number; col: number } | null;
  mistake: { row: number; col: number } | null;
  darkMode: boolean;
  handleFocus: (row: number, col: number) => void;
  handleBlur: () => void;
  handleInputChange: (row: number, col: number, value: string) => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  rowIndex,
  colIndex,
  value,
  focusedCell,
  mistake,
  darkMode,
  handleFocus,
  handleBlur,
  handleInputChange,
}) => {
  const isTopEdge = rowIndex % 3 === 0;
  const isBottomEdge = rowIndex % 3 === 2;
  const isLeftEdge = colIndex % 3 === 0;
  const isRightEdge = colIndex % 3 === 2;

  const isHighlighted =
    focusedCell &&
    (focusedCell.row === rowIndex ||
      focusedCell.col === colIndex ||
      (Math.floor(focusedCell.row / 3) === Math.floor(rowIndex / 3) &&
        Math.floor(focusedCell.col / 3) === Math.floor(colIndex / 3)));

  const isMistake =
    mistake && mistake.row === rowIndex && mistake.col === colIndex;

  return (
    <TextField
      variant="standard"
      inputProps={{
        style: {
          textAlign: "center",
          padding: "10px",
          fontSize: "1.2rem",
          color: darkMode ? "white" : "black",
        },
      }}
      value={value}
      onFocus={() => handleFocus(rowIndex, colIndex)}
      onBlur={handleBlur}
      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
      sx={{
        backgroundColor: isMistake
          ? "red"
          : isHighlighted
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
};

export default SudokuCell;
