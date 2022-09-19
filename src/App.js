import './App.css';
import {LoopEditor} from './LoopEditor';

function App() {
    return (
        <div className="App">
            <h1>It's a sequencer!</h1>
            <LoopEditor />
            <div>
                <button>Play</button>
                <button>Pause</button>
            </div>
        </div>
    );
}

export default App;
