import { useContext } from "react";
import { GameContext } from "../state/GameContext";

const useGameContext = () => {
  const context = useContext(GameContext);
  if (context == null) {
    throw new Error("useGameContext must be used within a GameContextProvider");
  }
  return context;
};

export { useGameContext };
