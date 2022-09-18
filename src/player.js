
let timerId;

document.querySelector("#start-button").addEventListener('click', () => {
    init();
});

function init() {
    const seqData = new SequenceData(130.0, DrumLoop.length);
    const audioCtx = new AudioContext();
    let drumNames = [];
    for (let drum of DrumLoop.drums) {
        let drumName = Object.keys(drum)[0];
        drumNames.push(drumName);
    }
    setupSequences(audioCtx, drumNames).then((sequences) => {
        scheduler(audioCtx, seqData, sequences);
    });
}

function scheduleNote(audioCtx, sample, noteTime) {
    const sampleSource = new AudioBufferSourceNode(audioCtx, {
        buffer: sample,
        playbackRate: 1.0,
    });
    sampleSource.connect(audioCtx.destination);
    sampleSource.start(noteTime);
}

function scheduler(audioCtx, seqData, sequences) {
    let currentTime = audioCtx.currentTime;

    while (seqData.nextBeatTime - currentTime < seqData.scheduleWindow) {

        // Check the currentNote of each instrument to see if it is due 
        // to be played.
        for (let sequence of sequences) {
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

    timerId = setTimeout(
        scheduler, seqData.lookahead, audioCtx, seqData, sequences);
}

async function setupSequences(audioCtx, drumNames) {
    let sequences = [];
    for (let i = 0; i < drumNames.length; i++) {
        let drumName = drumNames[i]
        const filepath = `audio/${drumName}.wav`;
        sample = await getFile(audioCtx, filepath);
        sequences.push(new DrumSequence(drumName, sample, DrumLoop.drums[i][drumName]));
    }
    return sequences;
}

async function getFile(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

function playSample(audioCtx, audioBuffer, time) {
    const sampleSource = new AudioBufferSourceNode(audioCtx, {
        buffer: audioBuffer,
        playbackRate: 1.0,
    });
    sampleSource.connect(audioCtx.destination);
    sampleSource.start(time);
}

