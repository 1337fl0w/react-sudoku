import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTheme } from "../theme/ThemeContext";

interface NewGameDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  onStartNew: () => void;
}

const NewGameDialog: React.FC<NewGameDialogProps> = ({
  open,
  onClose,
  onContinue,
  onStartNew,
}) => {
  const { darkMode } = useTheme();

  return (
    <Modal
      show={open}
      onHide={onClose}
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
          Ongoing Game Detected
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: darkMode ? "gray" : "white",
          color: darkMode ? "white" : "black",
        }}
      >
        <p>
          You have an ongoing game. Do you want to continue or start a new game?
        </p>
      </Modal.Body>
      <Modal.Footer
        style={{
          backgroundColor: darkMode ? "gray" : "white",
        }}
      >
        <Button variant="secondary" onClick={onStartNew}>
          Start New Game
        </Button>
        <Button variant="danger" onClick={onContinue}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewGameDialog;
