export class DrumSequence {
    constructor(drumName, sample, sequence) {
        this.drumName = drumName;
        this.sample = sample;
        this.sequence = sequence;

        this.pointer = 0;
        console.log(`name: ${this.drumName}, sequence: ${this.sequence}`);
    }

    advance() {
        this.pointer = (this.pointer + 1) % this.sequence.length;
    }

    currentNote() {
        return this.sequence[this.pointer];
    }
}

export class SequenceData {
    constructor(tempo, loopLength) {
        this.tempo = tempo;
        this.beatIndex = 0;
        this.lookahead = 25.0;
        this.scheduleWindow = 0.1;
        this.loopLength = loopLength;
        this.nextBeatTime = 0;

        let beatsPerSec = tempo / 60 * 8;
        this.beatDuration = 1 / beatsPerSec;
        console.log(`tempo = ${this.tempo}`);
        console.log(`loopLength = ${this.loopLength}`);
    }

    setTempo(tempo) {
        this.tempo = tempo;
        let beatsPerSec = tempo / 60 * 8;
        this.beatDuration = 1 / beatsPerSec;
    }
}