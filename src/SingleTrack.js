import React, { useState } from 'react';
import './SingleTrack.css'

export const SingleTrack = (props) => {
    const array = Array(props.loopLength - 1).fill(false);
    for (let note of props.noteList) {
        array[note] = true;
    }

    const onClick = (event) => {
        props.handleClick(event);
        /* let classList = event.target.classList;
        let isActive = classList.contains('active');
        if (isActive) {
            classList.remove('active');
        } else {
            classList.add('active');
        } */
    }

    const beatDivs = array.map((beat, i) => {
        if (beat === false) {
            return (
                <div className='beat'
                    beatindex={i}
                    instrumentindex={props.instrumentIndex}
                    onClick={(event) => onClick(event)}
                    key={i}></div>
            );
        } else {
            return (
                <div className='beat active'
                    beatindex={i}
                    instrumentindex={props.instrumentIndex}
                    onClick={(event) => onClick(event)}
                    key={i}></div>
            );
        }

    })

    console.log(`Rerendering ${props.instrumentIndex}`);

    return (
        <React.Fragment key={props.passedkey}>
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