import { BrowserRouter as Router } from "react-router-dom";
import AppBarComponent from "./components/AppBar";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import GameRouter from "./GameRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import SplashScreen from "./components/SplashScreen";
import { useState } from "react";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };
  return (
    <ThemeProvider>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <AppWithTheme />
      )}
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
