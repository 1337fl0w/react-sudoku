import React from "react";
import { useTheme } from "../theme/ThemeContext";
import "./styles/Throbber.css";

const Throbber: React.FC = () => {
  const { darkMode } = useTheme();

  const circleColor = darkMode ? "white" : "black";

  return (
    <div
      className="throbber-container"
      style={{
        backgroundColor: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      <div
        className="inner-circle"
        style={{ borderTopColor: circleColor }}
      ></div>
      <div
        className="outer-circle"
        style={{ borderTopColor: circleColor }}
      ></div>
      <div className="throbber-text">SUDOKU</div>
    </div>
  );
};

export default Throbber;
