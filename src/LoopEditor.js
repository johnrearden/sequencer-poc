import React, {useState} from 'react';

import { SingleTrack } from './SingleTrack';
import { LoopPlayer } from './LoopPlayer';
import './LoopEditor.css';

export const LoopEditor = (props) => {

    const [loop, setLoop] = useState(props);

    const handleChildClick = (event) => {
        console.log(loop.drums);
        let instrument = Number(event.target.getAttribute('instrumentindex'));
        let existingNotes = loop.drums[instrument].notes;
        console.log(existingNotes);
        let beat = Number(event.target.getAttribute('beatindex'));
        let newNotes;
        if (existingNotes.includes(beat)) {
            newNotes = existingNotes.filter(note => note !== beat);
        } else {
            existingNotes.push(beat);
            existingNotes.sort((a, b) => a - b);
            newNotes = [...existingNotes];
        }
        console.log(`${instrument} newNotes is : ${newNotes}`);
        let newLoop = Object.assign({}, loop);
        newLoop.drums[instrument].notes = newNotes;
        setLoop(newLoop);
    }

    const tracks = props.drums.map((track, i) => {
        let instrument = track.name;
        let noteList = track.notes;
        let key = `key_${i}`;
        return (
            <div className='track-holder'>
                <SingleTrack passedkey={key}
                    instrument={instrument}
                    instrumentIndex={i}
                    noteList={noteList}
                    loopLength={props.length}
                    handleClick={handleChildClick}
                />
            </div>
        )
    })

    return (
        <React.Fragment>
            <div >
                {tracks}
            </div>
            <div>
                <LoopPlayer drums={props.drums}
                    length={props.length} />
            </div>
        </React.Fragment>
    )
}

export default LoopEditor;