import React, { createContext, useContext, useMemo, useReducer } from "react";
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

class ContextActions implements GameActions {
  constructor(
    private readonly state: GameState,
    private readonly dispatch: Dispatch<Action>
  ) {}

  startGame() {
    this.dispatch({ type: GameAction.START_GAME });
  }
  endGame() {
    this.dispatch({
      type: GameAction.END_GAME,
      payload: {
        winner: GameOpponent.COMPUTER,
        message: "You ran out of time! Computer won the game.",
      },
    });
  }
  computerMove(lastWord: string) {
    let computerWord = getRandomWord();
    const isMistake = Math.random() < MISTAKE_RATE;
    if (isMistake) {
      this.dispatch({
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
        ...this.state.turnList,
        { word: lastWord, by: GameOpponent.PLAYER },
      ])
    ) {
      computerWord = getRandomWord();
    }
    this.dispatch({
      type: GameAction.ADD_TURN,
      payload: { word: computerWord, by: GameOpponent.COMPUTER },
    });
  }
  playerMove(word: string) {
    this.dispatch({
      type: GameAction.ADD_TURN,
      payload: { word, by: GameOpponent.PLAYER },
    });
    if (checkAnswer(word, this.state.turnList)) {
      this.computerMove(word);
    } else {
      this.dispatch({
        type: GameAction.END_GAME,
        payload: {
          winner: GameOpponent.COMPUTER,
          message: "You made a mistake! Computer won the game.",
        },
      });
    }
  }
  setTimer(remainingTime: number) {
    this.dispatch({ type: GameAction.SET_TIMER, payload: { remainingTime } });
  }
}

const reducer = (state: GameState, action: Action): GameState => {
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
    actions: {} as ContextActions,
    dispatch: () => Object,
  };
};

interface ProviderProps {
  children: React.ReactNode;
}
const initialContext: GameContextType = createInitialContext();
const Context = createContext<GameContextType | null>(initialContext);

function GameContextProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(reducer, { ...initialContext.state });

  const contextValue: GameContextType = useMemo(() => {
    return {
      state,
      actions: new ContextActions(state, dispatch),
      dispatch,
    };
  }, [state]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

const useGameContext = () => {
  const context = useContext(Context);
  if (context == null) {
    throw new Error(
      "usePaymentContext must be used within a PaymentContextProvider"
    );
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { GameContextProvider, useGameContext };
