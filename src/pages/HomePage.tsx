import { Container, Typography, Button } from "@mui/material";

interface HomePageProps {
  onNewGameClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNewGameClick }) => {
  const handleStartGame = () => {
    onNewGameClick();
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem", textAlign: "center" }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Sudoku
      </Typography>
      <Typography variant="h5" paragraph>
        Enjoy a challenging game of Sudoku. Click below to start playing!
      </Typography>
      <Button variant="contained" color="primary" onClick={handleStartGame}>
        Start Game
      </Button>
    </Container>
  );
};
