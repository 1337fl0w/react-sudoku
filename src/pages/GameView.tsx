import { useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import { GameBoard } from "../components/GameBoard";
import { clearGameState } from "../utils/localStorage";
import { useTheme } from "../theme/ThemeContext";

export const GameView = () => {
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const { darkMode } = useTheme();

  const handleNewGame = () => {
    setShowNewGameDialog(true);
  };

  const handleContinueGame = () => {
    setShowNewGameDialog(false);
  };

  const handleStartNewGame = () => {
    setShowNewGameDialog(false);
    clearGameState();
    window.location.reload();
  };

  return (
    <Container className="mt-4 text-center">
      <GameBoard />
      <Button variant="primary" className="mt-3" onClick={handleNewGame}>
        New Game
      </Button>
      <Modal
        show={showNewGameDialog}
        onHide={() => setShowNewGameDialog(false)}
        centered
        style={{ background: darkMode ? "black" : "white" }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: darkMode ? "gray" : "white",
          }}
        >
          <Modal.Title
            style={{
              color: darkMode ? "white" : "black",
            }}
          >
            Start New Game?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: darkMode ? "gray" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <p>Are you sure you want to start a new Game?</p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: darkMode ? "gray" : "white",
          }}
        >
          <Button variant="secondary" onClick={handleStartNewGame}>
            Start New
          </Button>
          <Button variant="danger" onClick={handleContinueGame}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
