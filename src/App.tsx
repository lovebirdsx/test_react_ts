import './App.css';
import { Hello } from './components/Hello';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Hello compiler='TypeScript' framework='React'/>
      </header>
    </div>
  );
}

export default App;
