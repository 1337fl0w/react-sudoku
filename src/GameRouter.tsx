import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { GameView } from "./pages/GameView";
import { SettingsPage } from "./pages/SettingsPage";
import { clearGameState, loadGameState } from "./utils/localStorage";
import NewGameDialog from "./components/NewGameDialog";

const GameRouter = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();

  const handleNewGameClick = () => {
    const savedState = loadGameState();
    if (savedState) {
      setShowPrompt(true);
    } else {
      navigate("/gameview");
    }
  };

  const handleContinueGameClick = () => {
    navigate("/gameview");
  };

  const handleContinueGame = () => {
    setShowPrompt(false);
    navigate("/gameview");
  };

  const handleStartNewGame = () => {
    setShowPrompt(false);
    clearGameState();
    navigate("/gameview");
  };

  return (
    <>
      <Routes>
        <Route
          path="/react-sudoku"
          element={
            <HomePage
              onNewGameClick={handleNewGameClick}
              onContinueGameClick={handleContinueGameClick}
            />
          }
        />
        <Route path="/gameview" element={<GameView />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <NewGameDialog
        open={showPrompt}
        onClose={() => setShowPrompt(false)}
        onContinue={handleContinueGame}
        onStartNew={handleStartNewGame}
      />
    </>
  );
};

export default GameRouter;
