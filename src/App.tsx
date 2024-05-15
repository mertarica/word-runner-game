import Game from "./components/game/Game";
import { GameContextProvider } from "./state/GameContext";

export default function App() {
  return (
    <GameContextProvider>
      <Game />
    </GameContextProvider>
  );
}
