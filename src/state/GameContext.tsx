import React, { createContext, useMemo, useReducer } from "react";
import type { Dispatch } from "react";
import {
  GameState,
  Action,
  GameAction,
  GameActions,
  GameContextType,
  GameOpponent,
  Turn,
} from "./GameTypes";
import names from "../../names.json";
import { TURN_DURATION, MISTAKE_RATE } from "../utils/constant";

const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

const checkAnswer = (word: string, list: Turn[]): boolean => {
  const isWordUsedBefore = list.some(
    (turn) => turn.word.toLowerCase() === word.toLowerCase()
  );
  const isLastCharMatch =
    word.charAt(0).toLowerCase() ===
    list[list.length - 1].word.slice(-1).toLowerCase();
  return !isWordUsedBefore && isLastCharMatch;
};

const GameContextActions = (
  state: GameState,
  dispatch: Dispatch<Action>
): GameActions => ({
  startGame() {
    dispatch({ type: GameAction.START_GAME });
  },
  endGame() {
    dispatch({
      type: GameAction.END_GAME,
      payload: {
        winner: GameOpponent.COMPUTER,
        message: "You ran out of time! Computer won the game.",
      },
    });
  },
  computerMove(lastWord: string) {
    let computerWord = getRandomWord();
    const isMistake = Math.random() < MISTAKE_RATE;
    if (isMistake) {
      dispatch({
        type: GameAction.END_GAME,
        payload: {
          winner: GameOpponent.PLAYER,
          message: "Computer made a mistake! You won the game.",
        },
      });
      return;
    }
    while (
      !checkAnswer(computerWord, [
        ...state.turnList,
        { word: lastWord, by: GameOpponent.PLAYER },
      ])
    ) {
      computerWord = getRandomWord();
    }
    dispatch({
      type: GameAction.ADD_TURN,
      payload: { word: computerWord, by: GameOpponent.COMPUTER },
    });
  },
  playerMove(word: string) {
    dispatch({
      type: GameAction.ADD_TURN,
      payload: { word, by: GameOpponent.PLAYER },
    });
    if (checkAnswer(word, state.turnList)) {
      this.computerMove(word);
    } else {
      dispatch({
        type: GameAction.END_GAME,
        payload: {
          winner: GameOpponent.COMPUTER,
          message: "You made a mistake! Computer won the game.",
        },
      });
    }
  },
  setTimer(remainingTime: number) {
    dispatch({ type: GameAction.SET_TIMER, payload: { remainingTime } });
  },
});

const GameContextReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case GameAction.START_GAME: {
      return {
        ...state,
        isListening: true,
        isGameOver: false,
        message: "",
        winner: null,
        score: 0,
        timer: TURN_DURATION,
        turnList: [{ word: getRandomWord(), by: GameOpponent.COMPUTER }],
      };
    }
    case GameAction.ADD_TURN: {
      const { word, by } = action.payload;
      return {
        ...state,
        score: state.score++,

        timer: TURN_DURATION,
        turnList: [...state.turnList, { word, by }],
      };
    }
    case GameAction.END_GAME: {
      const { message, winner } = action.payload;
      return {
        ...state,
        isListening: false,
        isGameOver: true,
        message,
        winner,
      };
    }
    case GameAction.SET_TIMER: {
      const { remainingTime } = action.payload;
      return {
        ...state,
        timer: remainingTime,
      };
    }
    default:
      return state;
  }
};

const createInitialContext = (): GameContextType => {
  return {
    state: {
      isListening: false,
      isGameOver: false,
      timer: TURN_DURATION,
      score: 0,
      turnList: [],
      message: "",
      winner: null,
    },
    actions: {} as GameActions,
    dispatch: () => Object,
  };
};

interface ProviderProps {
  children: React.ReactNode;
}
const initialContext: GameContextType = createInitialContext();
const GameContext = createContext<GameContextType | null>(initialContext);

function GameContextProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(GameContextReducer, {
    ...initialContext.state,
  });

  const contextValue: GameContextType = useMemo(() => {
    return {
      state,
      actions: GameContextActions(state, dispatch),
      dispatch,
    };
  }, [state]);

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

export {
  GameContextActions,
  GameContextReducer,
  GameContextProvider,
  GameContext,
};
