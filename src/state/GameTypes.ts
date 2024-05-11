import type React from "react";

export type GameState = {
  isListening: boolean;
  isGameOver: boolean;
  score: number;
  timer: number;
  turnList: Turn[];
  message: string;
  winner?: GameOpponent | null;
};

export interface Turn {
  word: string;
  by: GameOpponent;
}

export enum GameOpponent {
  COMPUTER = "Computer",
  PLAYER = "Player",
}

export enum GameAction {
  START_GAME,
  END_GAME,
  ADD_TURN,
  SET_TIMER,
}

export type GameActions = {
  startGame: () => void;
  endGame: () => void;
  computerMove: (lastWord: string) => void;
  playerMove: (word: string) => void;
  setTimer: (remainingTime: number) => void;
};

export type Action =
  | { type: GameAction.START_GAME }
  | {
      type: GameAction.END_GAME;
      payload: { winner: GameOpponent; message: string };
    }
  | { type: GameAction.ADD_TURN; payload: { word: string; by: GameOpponent } }
  | { type: GameAction.SET_TIMER; payload: { remainingTime: number } };

export type GameContextType = {
  state: GameState;
  actions: GameActions;
  dispatch: React.Dispatch<Action>;
};
