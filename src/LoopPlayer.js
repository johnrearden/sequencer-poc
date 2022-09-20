import React, { useEffect, useRef} from 'react';
import { DrumSequence, SequenceData } from './objects';

export const LoopPlayer = (props) => {

    /**
     * Utilising useRef here as the updated value is available
     * immediately, unlike with setState, and the rerendering effect
     * of useState is unnecessary in a non-UI component
     */
    const sequencesRef = useRef(null);

    const init = () => {
        const seqData = new SequenceData(130.0, props.length);
        const audioCtx = new AudioContext();
        let drumNames = [];
        for (let drum of props.drums) {
            drumNames.push(drum.name);
        }
        setupSequences(audioCtx, drumNames).then((sequences) => {
            console.log(`sequences: ${sequences}`);
            let seqMap = createSequenceMap(sequences);
            sequencesRef.current = seqMap;
            scheduler(audioCtx, seqData, sequencesRef);
        });
    }

    const createSequenceMap = (sequences) => {
        let seqMap = {};
        for (let seq of sequences) {
            seqMap[seq.drumName] = seq;
        }
        return seqMap;
    }

    /**
     * This component is not rendered, so nothing happens when the
     * props change. This useEffect hook actively listens for a change in
     * the props, and alters the sequences in turn.
     * 
     * TODO - Adding or deleting a note from a sequence throws off the 
     * pointer that the scheduler uses. Need a function to intelligently 
     * decide whether the pointer should be changed based on the change to
     * the sequence and the value of the pointer.
     */
    useEffect(() => {
        console.log(`LoopPlayer: props changed \n${JSON.stringify(props)}`);
        let ref = sequencesRef.current;
        if (ref) {
            for (let drum of props.drums) {
                ref[drum.name].sequence = drum.notes;
            }
        }
    }, [props]);

    const scheduleNote = (audioCtx, sample, noteTime) => {
        const sampleSource = new AudioBufferSourceNode(audioCtx, {
            buffer: sample,
            playbackRate: 1.0,
        });
        sampleSource.connect(audioCtx.destination);
        sampleSource.start(noteTime);
    }

    const scheduler = (audioCtx, seqData, sequencesRef) => {
        let currentTime = audioCtx.currentTime;

        while (seqData.nextBeatTime - currentTime < seqData.scheduleWindow) {

            // Check the currentNote of each instrument to see if it is due 
            // to be played.
            for (let sequence of Object.values(sequencesRef.current)) {
                let nextNoteIndex = sequence.currentNote();
                if (nextNoteIndex === seqData.beatIndex) {
                    scheduleNote(audioCtx, sequence.sample, seqData.nextBeatTime);
                    sequence.advance();
                }
            }

            // Add beatDuration to nextBeatTime, and increment the beatIndex counter
            // (looping back when we hit the end)
            seqData.nextBeatTime += seqData.beatDuration;
            seqData.beatIndex = (seqData.beatIndex + 1) % seqData.loopLength;
        }

        setTimeout(
            scheduler, seqData.lookahead, audioCtx, seqData, sequencesRef);
    }

    const setupSequences = async (audioCtx, drumNames) => {
        let sequences = [];
        for (let i = 0; i < drumNames.length; i++) {
            let drumName = drumNames[i]
            const filepath = `./audio/${drumName}.wav`;
            let sample = await getFile(audioCtx, filepath);
            sequences.push(new DrumSequence(drumName, sample, props.drums[i].notes));
        }
        return sequences;
    }

    const getFile = async (audioContext, filepath) => {
        const response = await fetch(filepath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }

    return (
        <React.Fragment>
            <button onClick={init}>PLAY !</button>
        </React.Fragment>
    )
}