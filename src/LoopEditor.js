import React from 'react';
import {DrumLoop} from './drum_loop';
import {SingleTrack} from './SingleTrack';
import './LoopEditor.css';

export const LoopEditor = (props) => {
    const tracks = DrumLoop.drums.map((track) => {
        let instrument = Object.keys(track)[0];
        let noteList = track[instrument];
        return (
            <div className='track-holder'>
                <SingleTrack instrument={instrument}
                             noteList={noteList}
                             loopLength={DrumLoop.length}
                />
            </div>
        )
    })

    return (
        <div >
            {tracks}
        </div>
    )
}

export default LoopEditor;