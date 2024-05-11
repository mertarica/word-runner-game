import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";

import { useGameContext } from "../../state/GameContext";

import { TURN_DURATION } from "../../utils/constant";

const Game: React.FC = () => {
  const {
    state: { isListening, isGameOver, message, turnList, score, timer },
    actions: gameActions,
  } = useGameContext();
  const [playerWord, setPlayerWord] = useState("");

  useEffect(() => {
    if (timer > 0 && isListening) {
      const interval = setInterval(() => {
        gameActions.setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && isListening) {
      gameActions.endGame();
    }
  }, [timer, isListening]);

  const handleInput = () => {
    gameActions.playerMove(playerWord);
    setPlayerWord("");
  };

  return (
    <Container className="game mt-5">
      <h1>Word Runner Game</h1>
      <p>
        Try to come up with a word that starts with the last letter of the given
        word within {TURN_DURATION} seconds.
      </p>
      <Button
        variant="success"
        className="mx-2"
        onClick={() => gameActions.startGame()}
      >
        {isListening || isGameOver ? "Restart Game" : "Start Game"}
      </Button>
      {isListening && (
        <div className="mt-4">
          <Row>
            <Col sm={9}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon3">Your Word:</InputGroup.Text>
                <Form.Control
                  value={playerWord}
                  onChange={(e) => setPlayerWord(e.target.value)}
                  aria-describedby="basic-addon3"
                />
              </InputGroup>
            </Col>
            <Col sm={3}>
              <Button
                type="submit"
                variant="primary"
                className="mx-2"
                disabled={isGameOver}
                onClick={handleInput}
              >
                Enter
              </Button>
            </Col>
          </Row>
          <h5>Time Remaining: {timer} seconds</h5>
        </div>
      )}
      <div className="game-turn-list">
        <h3>Word List</h3>
        <ul>
          {turnList.map((turn, index) => (
            <li key={index}>
              <strong>{turn.word}</strong>
              <br />
              <small>by {turn.by}</small>
            </li>
          ))}
        </ul>
      </div>
      {isGameOver && (
        <Alert variant="danger" className="mt-4">
          {message}
          <p>Your Score: {Math.max(score - 1, 0)}</p>
        </Alert>
      )}
    </Container>
  );
};

export default Game;
