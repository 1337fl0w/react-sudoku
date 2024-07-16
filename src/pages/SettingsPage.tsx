import {
  Container,
  Typography,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { clearGameState } from "../utils/localStorage";
import { useTheme } from "../theme/ThemeContext";

export const SettingsPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const handleClearGameState = () => {
    clearGameState();
    alert("Sudoku game state cleared from localStorage.");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label="Dark Mode"
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClearGameState}
        style={{ marginTop: "1rem" }}
      >
        Clear Game State
      </Button>
    </Container>
  );
};
