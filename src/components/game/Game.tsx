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

import { useGameContext } from "../../hooks/useGameContext";

import { GameOpponent } from "../../state/GameTypes";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

const Game: React.FC = () => {
  const {
    state: { isListening, isGameOver, message, winner, turnList, score, timer },
    actions: gameActions,
  } = useGameContext();
  const [playerWord, setPlayerWord] = useState("");

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

  return (
    <Container className="game mt-5">
      <h1>Word Runner Game</h1>
      <p id="game-description" className="text-center">
        Try to come up with a word that starts with the last letter of the given
        word within a specified time limit. Be careful not to repeat words that
        have already been used. The game will provide you with a timer
        indicating the remaining time to come up with a word. Once the timer
        reaches zero, the game will end. You can restart the game by clicking
        the 'Restart Game' button.
      </p>
      <Button
        id="start-game-button"
        variant="success"
        className="mx-2"
        onClick={() => {
          gameActions.startGame();
          setPlayerWord("");
        }}
      >
        {isListening || isGameOver ? "Restart Game" : "Start Game"}
      </Button>
      {isListening && (
        <div className="mt-4">
          <Row>
            <Col sm={9}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="input-label">Your Word:</InputGroup.Text>
                <Form.Control
                  id="player-word-input"
                  value={playerWord}
                  onChange={(e) => setPlayerWord(e.target.value)}
                  disabled
                />
              </InputGroup>
            </Col>
            <Col sm={3}>
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
          <h5>Time Remaining: {timer} seconds</h5>
        </div>
      )}
      <div className="game-turn-list mt-3">
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
        <Alert
          variant={winner === GameOpponent.COMPUTER ? "danger" : "success"}
          className="mt-4 text-center"
          id="game-over-alert"
        >
          {message}
          <h5>Your Score: {score}</h5>
        </Alert>
      )}
    </Container>
  );
};

export default Game;
