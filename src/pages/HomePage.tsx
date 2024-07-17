import { Container, Button } from "react-bootstrap";
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
    <Container
      className="d-flex flex-column justify-content-center position-relative"
      style={{ height: "100vh" }}
    >
      <Button
        variant="secondary"
        onClick={onContinueGameClick}
        disabled={!gameSaved}
        className="mb-2 w-100"
      >
        Continue Game
      </Button>
      <Button variant="primary" onClick={onNewGameClick} className="w-100">
        New Game
      </Button>
    </Container>
  );
};
