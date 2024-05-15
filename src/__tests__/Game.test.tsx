import { fireEvent, render, screen } from "@testing-library/react";

import Game from "../components/game/Game";

import { GameContextProvider } from "../state/GameContext";

describe("Game component", () => {
  beforeEach(() => {
    render(
      <GameContextProvider>
        <Game />
      </GameContextProvider>
    );
  });

  describe("renders game instructions", () => {
    test("renders game instructions", () => {
      const instructionsElement = screen.getByText(/Word Runner Game/i);
      expect(instructionsElement).toBeInTheDocument();
    });

    test("renders start game button", () => {
      const startGameButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      expect(startGameButton).toBeInTheDocument();
    });
  });

  describe("game actions", () => {
    test("clicking start game button changes button text to 'Restart Game'", () => {
      const startGameButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      fireEvent.click(startGameButton);

      const restartGameButton = screen.getByRole("button", {
        name: /Restart Game/i,
      });
      expect(restartGameButton).toBeInTheDocument();
    });

    test("clicking restart game button changes button text to 'Start Game'", () => {
      const startGameButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      fireEvent.click(startGameButton);

      const restartGameButton = screen.getByRole("button", {
        name: /Restart Game/i,
      });
      fireEvent.click(restartGameButton);

      const newStartGameButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      expect(newStartGameButton).toBeInTheDocument();
    });

    test("clicking start game button renders input field", () => {
      const startGameButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      fireEvent.click(startGameButton);

      const inputField = screen.getByRole("textbox");
      expect(inputField).toBeInTheDocument();
    });

    test("clicking start game button renders timer", () => {
      const startGameButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      fireEvent.click(startGameButton);

      const timerElement = screen.getByText(/Time Remaining/i);
      expect(timerElement).toBeInTheDocument();
    });

    test("clicking start game button renders word list", () => {
      const startGameButton = screen.getByRole("button", {
        name: /Start Game/i,
      });
      fireEvent.click(startGameButton);

      const wordListElement = screen.getByText(/Word List/i);
      expect(wordListElement).toBeInTheDocument();
    });
  });
});
