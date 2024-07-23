import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { isGameSaved } from "../utils/localStorage";
import { useTheme } from "../theme/ThemeContext";

const AppBarComponent = () => {
  const [show, setShow] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    setGameSaved(isGameSaved());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("sudoku-game-state")]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <>
      <Navbar
        bg="transparent"
        expand={false}
        style={{ backgroundColor: "transparent" }}
      >
        <Container
          fluid
          className="d-flex justify-content-center align-items-center"
        >
          <Navbar.Brand
            className="mx-auto"
            onClick={handleShow}
            style={{
              color: darkMode ? "white" : "black",
              cursor: "pointer",
              width: "100%",
              textAlign: "center",
              fontSize: "2rem",
            }}
          >
            Sudoku
          </Navbar.Brand>
        </Container>
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
          show={show}
          onHide={handleClose}
          style={{ textAlign: "center" }}
        >
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body
            className="d-flex flex-column justify-content-start align-items-center"
            style={{ paddingTop: "10rem" }}
          >
            <Nav className="flex-column">
              <Nav.Link
                onClick={() => handleNavigation("/react-sudoku")}
                style={{ fontSize: "1.25rem", marginBottom: "1rem" }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                onClick={() => handleNavigation("/gameview")}
                disabled={!gameSaved}
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                  color: gameSaved ? "black" : "lightgrey",
                }}
              >
                Continue Game
              </Nav.Link>
              <Nav.Link
                onClick={() => handleNavigation("/settings")}
                style={{ fontSize: "1.25rem", marginBottom: "1rem" }}
              >
                Settings
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Navbar>
    </>
  );
};

export default AppBarComponent;
