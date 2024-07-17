import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

interface NumericKeypadProps {
  onNumberClick: (value: string) => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onNumberClick }) => {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <Container>
      <Row>
        {numbers.map((number) => (
          <Col key={number} xs={4} className="p-1">
            <Button
              variant="primary"
              className="w-100"
              onClick={() => onNumberClick(number)}
            >
              {number}
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default NumericKeypad;
