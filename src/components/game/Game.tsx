import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";

import { useGameContext } from "../../hooks/useGameContext";

import { GameOpponent } from "../../state/GameTypes";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

const Game: React.FC = () => {
  const {
    state: { isListening, isGameOver, message, winner, turnList, score, timer },
    actions: gameActions,
  } = useGameContext();
  const [playerWord, setPlayerWord] = useState("");
  const gameList = useRef<HTMLUListElement>(null);

  const { listening, startListening, stopListening, transcript } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setPlayerWord(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (timer > 0 && isListening) {
      const interval = setInterval(() => {
        gameActions.setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && isListening) {
      gameActions.endGame();
    }
  }, [gameActions, timer, isListening]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (playerWord) {
        gameActions.playerMove(playerWord);
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [playerWord]);

  useEffect(() => {
    if (gameList.current) {
      gameList.current.scrollTop = gameList.current.scrollHeight;
    }
  }, [turnList]);

  return (
    <Container className="game">
      <div className="game-header">
        <h1>Word Runner Game</h1>
        <p id="game-description" className="text-center d-none d-sm-block" >
          Try to think of a word starting with the last letter of the given word
          within a time limit. Avoid repeating words. The game has a timer; when
          it reaches zero, the game ends. Click 'Restart Game' to start over.
        </p>
        <Button
          id="start-game-button"
          variant="success"
          onClick={() => {
            gameActions.startGame();
            setPlayerWord("");
          }}
        >
          {isListening || isGameOver ? "Restart Game" : "Start Game"}
        </Button>
      </div>
      {isListening && (
        <div className="game-controllers">
          <Row>
            <Col xs={9}>
              <InputGroup>
                <InputGroup.Text id="input-label">Your Word:</InputGroup.Text>
                <Form.Control
                  id="player-word-input"
                  value={playerWord}
                  onChange={(e) => setPlayerWord(e.target.value)}
                  disabled
                />
              </InputGroup>
            </Col>
            <Col xs={3}>
              <div className="translate-input-tools">
                <Button
                  variant="primary"
                  onClick={() => {
                    listening ? stopListening() : startListening("tr-TR");
                  }}
                >
                  {listening ? "Stop" : "Speak"}
                </Button>
              </div>
            </Col>
          </Row>
          <h5 className="mt-3">Time Remaining: {timer} seconds</h5>
        </div>
      )}
      {isGameOver && (
        <div className="game-result">
          <Alert
            variant={winner === GameOpponent.COMPUTER ? "danger" : "success"}
            className="text-center"
            id="game-over-alert"
          >
            {message}
            <h5>Your Score: {score}</h5>
          </Alert>
        </div>
      )}
      {turnList.length > 0 && (
        <div className="game-turn-list">
          <h3>Word List</h3>
          <ul ref={gameList}>
            {turnList.map((turn, index) => (
              <li key={index}>
                <strong>{turn.word}</strong>
                <br />
                <small>by {turn.by}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default Game;
