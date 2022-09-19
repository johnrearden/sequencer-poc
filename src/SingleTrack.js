import React, {useState} from 'react';
import {DrumLoop} from './drum_loop';
import './SingleTrack.css'

export const SingleTrack = (props) => {
    const array = Array(props.loopLength).fill(false);
    for (let note of props.noteList) {
        array[note] = true;
    }
    const [beats, setBeats] = useState(array);

    const onClick = (event) => {
        let classList = event.target.classList;
        let isActive = classList.contains('active');
        if (isActive) {
            classList.remove('active');
        } else {
            classList.add('active');
        }
    }
    
    const beatDivs = beats.map((drum, i) => {
        if (beats[i] === false) {
            return (
                <div className='beat' 
                     onClick={(event) => onClick(event)}
                     key={i}></div>
            );
        } else {
            return (
                <div className='beat active' 
                     onClick={(event) => onClick(event)}
                     key={i}></div>
            );
        }
        
    })

    return (
        <React.Fragment>
            <div className='instrument-name'>
                <h3>{props.instrument}</h3>
            </div>
            <div className='track'>
                {beatDivs}
            </div>
            <div className='beat'></div>
        </React.Fragment>
    );
}

export default SingleTrack;