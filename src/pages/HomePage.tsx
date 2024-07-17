import { Container, Typography, Button } from "@mui/material";
import { isGameSaved } from "../utils/localStorage";

interface HomePageProps {
  onNewGameClick: () => void;
  onContinueGameClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNewGameClick,
  onContinueGameClick,
}) => {
  const gameSaved = isGameSaved();

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem", textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Sudoku
      </Typography>
      <Typography variant="h5" paragraph>
        Enjoy a challenging game of Sudoku. Click below to start playing!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onNewGameClick}
        style={{ marginRight: "1rem" }}
      >
        Start Game
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onContinueGameClick}
        disabled={!gameSaved}
      >
        Continue Game
      </Button>
    </Container>
  );
};
