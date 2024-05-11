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
import { GameOpponent } from "../../state/GameTypes";

const Game: React.FC = () => {
  const {
    state: { isListening, isGameOver, message, winner, turnList, score, timer },
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
      <p className="text-center">
      Try to come up with a word that starts with the last letter of the given
      word within a specified time limit. Be careful not to repeat words that
      have already been used. The game will provide you with a timer indicating
      the remaining time to come up with a word. Once the timer reaches zero,
      the game will end. You can restart the game by clicking the 'Restart Game'
      button.
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
      <div className="game-turn-list mt-3">
        <h3>Word List</h3>
        <ul>
          {turnList.slice().reverse().map((turn, index) => (
            <li key={index}>
              <strong>{turn.word}</strong>
              <br />
              <small>by {turn.by}</small>
            </li>
          ))}
        </ul>
      </div>
      {isGameOver && (
        <Alert
          variant={winner === GameOpponent.COMPUTER ? "danger" : "success"}
          className="mt-4 text-center"
        >
          {message}
          <h5>Your Score: {score}</h5>
        </Alert>
      )}
    </Container>
  );
};

export default Game;
