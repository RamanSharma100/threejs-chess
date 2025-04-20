import './App.css';
import { ChessBoard } from './components/Chess';

const App = () => {
  return (
    <div className="chess-app w-screen h-screen bg-background-dark">
      <ChessBoard />
    </div>
  );
};

export default App;
