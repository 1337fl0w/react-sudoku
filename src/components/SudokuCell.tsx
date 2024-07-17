import { Form, Container } from "react-bootstrap";

interface SudokuCellProps {
  rowIndex: number;
  colIndex: number;
  value: string;
  notes: string[];
  noteMode: boolean;
  focusedCell: { row: number; col: number } | null;
  mistake: { row: number; col: number } | null;
  darkMode: boolean;
  handleFocus: (row: number, col: number) => void;
  handleBlur: () => void;
  handleInputChange: (row: number, col: number, value: string) => void;
  highlightedNote: string | null;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  rowIndex,
  colIndex,
  value,
  notes,
  noteMode,
  focusedCell,
  mistake,
  darkMode,
  handleFocus,
  handleBlur,
  handleInputChange,
  highlightedNote,
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

  const highlightColor = darkMode ? "yellow" : "purple";

  return (
    <Container
      style={{
        position: "relative",
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
        width: "11.11%",
        paddingTop: "11.11%",
        margin: 0,
        overflow: "hidden",
      }}
    >
      <Form.Control
        type="text"
        value={value}
        onFocus={() => handleFocus(rowIndex, colIndex)}
        onBlur={handleBlur}
        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
        style={{
          textAlign: "center",
          padding: "10px",
          fontSize: "1.2rem",
          color: noteMode ? "lightgrey" : darkMode ? "white" : "black",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
        }}
      />
      <Container
        style={{
          position: "absolute",
          top: 0,
          left: -3,
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gridColumnGap: "2px",
          gridRowGap: "0.1px",
          pointerEvents: "none",
          fontSize: "0.5rem",
        }}
      >
        {Array.from({ length: 9 }).map((_, noteIndex) => (
          <div
            key={noteIndex}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                highlightedNote === (noteIndex + 1).toString()
                  ? highlightColor
                  : noteMode
                  ? darkMode
                    ? "white"
                    : "black"
                  : "lightgrey",
            }}
          >
            {notes.includes((noteIndex + 1).toString()) ? noteIndex + 1 : ""}
          </div>
        ))}
      </Container>
    </Container>
  );
};

export default SudokuCell;
