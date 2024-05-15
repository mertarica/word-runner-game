import { GameContextActions, GameContextReducer } from "../state/GameContext";
import { GameState, GameAction, GameOpponent } from "../state/GameTypes";

describe("GameContextActions", () => {
  let state: GameState;
  let dispatch: jest.Mock;

  beforeEach(() => {
    state = {
      isListening: false,
      isGameOver: false,
      timer: 60,
      score: 0,
      turnList: [],
      message: "",
      winner: null,
    };
    dispatch = jest.fn();
  });

  test("startGame dispatches START_GAME action", () => {
    const actions = GameContextActions(state, dispatch);
    actions.startGame();
    expect(dispatch).toHaveBeenCalledWith({ type: GameAction.START_GAME });
  });

  test("endGame dispatches END_GAME action with correct payload", () => {
    const actions = GameContextActions(state, dispatch);
    actions.endGame();
    expect(dispatch).toHaveBeenCalledWith({
      type: GameAction.END_GAME,
      payload: {
        winner: GameOpponent.COMPUTER,
        message: "You ran out of time! Computer won the game.",
      },
    });
  });

  test("setTimer dispatches SET_TIMER action with correct payload", () => {
    const actions = GameContextActions(state, dispatch);
    const remainingTime = 30;
    actions.setTimer(remainingTime);
    expect(dispatch).toHaveBeenCalledWith({
      type: GameAction.SET_TIMER,
      payload: { remainingTime },
    });
  });

  test("playerMove dispatches ADD_TURN action with incorrect payload", () => {
    const actions = GameContextActions(
      { ...state, turnList: [{ word: "test", by: GameOpponent.COMPUTER }] },
      dispatch
    );
    const word = "apple";
    actions.playerMove(word);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: GameAction.ADD_TURN,
      payload: { word, by: GameOpponent.PLAYER },
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: GameAction.END_GAME,
      payload: {
        winner: GameOpponent.COMPUTER,
        message: "You made a mistake! Computer won the game.",
      },
    });
  });

  test("computerMove dispatches ADD_TURN action with correct payload", () => {
    const actions = GameContextActions(
      { ...state, turnList: [{ word: "test", by: GameOpponent.PLAYER }] },
      dispatch
    );
    const lastWord = "test";
    actions.computerMove(lastWord);
    expect(dispatch).toHaveBeenCalledWith({
      type: GameAction.ADD_TURN,
      payload: { word: expect.any(String), by: GameOpponent.COMPUTER },
    });
  });
});

describe("reducer", () => {
  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      isListening: false,
      isGameOver: false,
      timer: 60,
      score: 0,
      turnList: [],
      message: "",
      winner: null,
    };
  });

  test("START_GAME action sets game state correctly", () => {
    const newState = GameContextReducer(initialState, {
      type: GameAction.START_GAME,
    });
    expect(newState.isListening).toBe(true);
    expect(newState.isGameOver).toBe(false);
  });

  test("ADD_TURN action adds a turn to the list", () => {
    const word = "apple";
    const newState = GameContextReducer(initialState, {
      type: GameAction.ADD_TURN,
      payload: { word, by: GameOpponent.PLAYER },
    });
    expect(newState.turnList.length).toBe(1);
    expect(newState.turnList[0].word).toBe(word);
    expect(newState.turnList[0].by).toBe(GameOpponent.PLAYER);
  });

  test("END_GAME action sets game state correctly when player wins", () => {
    const newState = GameContextReducer(initialState, {
      type: GameAction.END_GAME,
      payload: {
        winner: GameOpponent.PLAYER,
        message: "Congratulations! You won the game.",
      },
    });
    expect(newState.isListening).toBe(false);
    expect(newState.isGameOver).toBe(true);
    expect(newState.winner).toBe(GameOpponent.PLAYER);
    expect(newState.message).toBe("Congratulations! You won the game.");
  });

  test("END_GAME action sets game state correctly when computer wins", () => {
    const newState = GameContextReducer(initialState, {
      type: GameAction.END_GAME,
      payload: {
        winner: GameOpponent.COMPUTER,
        message: "Computer won the game.",
      },
    });
    expect(newState.isListening).toBe(false);
    expect(newState.isGameOver).toBe(true);
    expect(newState.winner).toBe(GameOpponent.COMPUTER);
    expect(newState.message).toBe("Computer won the game.");
  });

  test("SET_TIMER action sets timer correctly", () => {
    const remainingTime = 30;
    const newState = GameContextReducer(initialState, {
      type: GameAction.SET_TIMER,
      payload: { remainingTime },
    });
    expect(newState.timer).toBe(remainingTime);
  });
});
