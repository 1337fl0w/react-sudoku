import { useState } from "react";
import { Container, Button, Modal } from "react-bootstrap";
import { GameBoard } from "../components/GameBoard";
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
      >
        <Modal.Header closeButton>
          <Modal.Title>Start New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to start a new game or continue the existing game?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleContinueGame}>
            Continue
          </Button>
          <Button variant="danger" onClick={handleStartNewGame}>
            Start New
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
