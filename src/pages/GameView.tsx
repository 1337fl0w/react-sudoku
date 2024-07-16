import { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { GameBoard } from "../components/GameBoard";
import NewGameDialog from "../components/NewGameDialog";
import { clearGameState } from "../utils/localStorage";

export const GameView = () => {
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);

  const handleNewGame = () => {
    setShowNewGameDialog(true);
  };

  const handleContinueGame = () => {
    setShowNewGameDialog(false);
  };

  const handleStartNewGame = () => {
    setShowNewGameDialog(false);
    clearGameState();
    window.location.reload(); // Reload the page to reset the game state
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Sudoku Game
      </Typography>
      <GameBoard />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "1rem" }}
        onClick={handleNewGame}
      >
        New Game
      </Button>
      <NewGameDialog
        open={showNewGameDialog}
        onClose={() => setShowNewGameDialog(false)}
        onContinue={handleContinueGame}
        onStartNew={handleStartNewGame}
      />
    </Container>
  );
};
