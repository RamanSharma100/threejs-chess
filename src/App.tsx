import './App.css';
import { ChessBoard } from './components/Chess';
import SelectedPiece from './components/Chess/SelectedPiece';

const App = () => {
  return (
    <div className="chess-app w-screen h-screen bg-background-dark">
      <SelectedPiece />
      <ChessBoard />
    </div>
  );
};

export default App;
