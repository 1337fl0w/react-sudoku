import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ongoing Game Detected</DialogTitle>
      <DialogContent>
        <p>
          You have an ongoing game. Do you want to continue or start a new game?
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onContinue}>Continue</Button>
        <Button onClick={onStartNew}>Start New Game</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewGameDialog;
