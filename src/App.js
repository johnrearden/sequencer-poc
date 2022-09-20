import React, {useState} from 'react';
import './App.css';
import { LoopEditor } from './LoopEditor';
import { DrumLoop } from './drum_loop';

function App() {

    const [loop, setLoop] = useState(DrumLoop);

    const handleClick = (event) => {

    }

    return (
        <div className="App">
            <h1>It's a sequencer!</h1>
            <LoopEditor drums={DrumLoop.drums}
                length={DrumLoop.length} 
                handleClick={handleClick}/>

        </div>
    );
}

export default App;
