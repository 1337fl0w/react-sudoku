import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTheme } from "../theme/ThemeContext";
import Throbber from "./Throbber";

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { darkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const pulsingAnimation = {
    animation: "pulse 2s infinite",
  };

  const keyframes = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{
        backgroundColor: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      <style>{keyframes}</style>
      <Row>
        <Col className="text-center">
          <div
            style={{
              width: "150px",
              marginBottom: "20px",
              borderRadius: "15px",
              ...pulsingAnimation,
            }}
          >
            <Throbber />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SplashScreen;
