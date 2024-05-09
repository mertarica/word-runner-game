import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col, Alert } from "react-bootstrap";
import { TURN_DURATION } from "../../utils/constant";

interface Turn {
  word: string;
  by: string;
}

const Game: React.FC = () => {
  const [wordList, setWordList] = useState<Turn[]>([
    { word: "test 1", by: "Computer" },
    { word: "test 2", by: "Player" },
    { word: "test 3", by: "Computer" },
    { word: "test 4", by: "Player" },
    { word: "test 5", by: "Computer" },
    { word: "test 6", by: "Player" },
    { word: "test 7", by: "Computer" },
  ]);
  const [timer, setTimer] = useState(TURN_DURATION);

  return (
    <Container className="game mt-5">
      <h1>Word Runner Game</h1>
      <p>
        Try to come up with a word that starts with the last letter of the given
        word within {TURN_DURATION} seconds.
      </p>
      <Button variant="success" className="mx-2" onClick={() => {}}>
        Start Game
      </Button>
      <div className="mt-4">
        <Form onSubmit={(event) => console.log(event)}>
          <Form.Group as={Row} controlId="playerWord">
            <Form.Label column sm={3}>
              Your Word:
            </Form.Label>
            <Col sm={6}>
              <Form.Control type="text" />
            </Col>
            <Col sm={3}>
              <Button type="submit" variant="primary" className="mx-2">
                Speak
              </Button>
            </Col>
          </Form.Group>
        </Form>
        <h5>Time Remaining: {timer} seconds</h5>
      </div>
      <div className="game-turn-list">
        <h3>Word List</h3>
        <ul>
          {wordList.map((turn, index) => (
            <li key={index}>
              <strong>{turn.word}</strong>
              <br />
              <small>by {turn.by}</small>
            </li>
          ))}
        </ul>
      </div>
      <Alert variant="danger" className="mt-4">
        Game Over! <br /> Your score is 0.
      </Alert>
    </Container>
  );
};

export default Game;
