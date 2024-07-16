import { BrowserRouter as Router } from "react-router-dom";
import AppBarComponent from "./components/AppBar";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, useTheme } from "./theme/ThemeContext"; // Import the ThemeProvider and custom hook
import GameRouter from "./GameRouter";

const App = () => {
  // TODO
  /* 
  # Fail condition
  # Win condition
  # Timer
  # Point system
  */
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
};

const AppWithTheme = () => {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBarComponent />
        <GameRouter />
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
