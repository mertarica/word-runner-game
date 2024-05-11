import { Container, Row, Col } from "react-bootstrap";
import Game from "./components/game/Game";
import { GameContextProvider } from "./state/GameContext";

export default function App() {
  return (
    <GameContextProvider>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <Game />
          </Col>
        </Row>
      </Container>
    </GameContextProvider>
  );
}
