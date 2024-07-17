import { Container, Card, Form, Button } from "react-bootstrap";
import { clearGameState } from "../utils/localStorage";
import { useTheme } from "../theme/ThemeContext";

export const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const handleClearGameState = () => {
    clearGameState();
    alert("Sudoku game state cleared from localStorage.");
  };

  return (
    <Container className="mt-4">
      <Card
        className="mb-3 h-100"
        style={{
          backgroundColor: darkMode ? "GrayText" : "white",
        }}
      >
        <Card.Header
          style={{
            color: darkMode ? "white" : "black",
          }}
        >
          Settings
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
              <Form.Label
                style={{
                  color: darkMode ? "white" : "black",
                }}
              >
                Dark Mode
              </Form.Label>
              <Form.Check
                type="switch"
                id="dark-mode-switch"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
            </Form.Group>
            <Card.Footer>
              <Form.Group className="text-center">
                <Button variant="danger" onClick={handleClearGameState}>
                  Clear Game State
                </Button>
              </Form.Group>
            </Card.Footer>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
