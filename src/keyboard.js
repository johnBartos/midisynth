import note from './note';
import { createRecorder } from './recorder';

const activeNotes = {};

let attack = 0.05;
let portamento = 0.05;
let release = 0.05;
let waveType = 'sawtooth';
let gain = 0.1;

let recorder;

const keyToFreq = (note) => {
  return 440 * Math.pow(2,(note-69)/12);
}

const onMidiMessage = (context, e) => {
  const midiKey = event.data[1];
  const freq = keyToFreq(midiKey);
  const now = Date.now();

  switch (e.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2]!=0) {
        const activeNote = note(context, freq, attack, portamento, release, waveType, gain);
        activeNotes[midiKey] = activeNote;
        recorder.record(activeNote);
        activeNote.play(now);
      }
      break;

    case 0x80:
      const stoppedNote = activeNotes[midiKey];
      stoppedNote.stop(now);
      recorder.disconnect(stoppedNote);
      break;
  }
}

const createAudioContext = () => {
    return new AudioContext();
}

const success = (midi) => {
   const inputs = midi.inputs.entries();
   const audio = createAudioContext();
   recorder = createRecorder('foo', audio);

    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.log(input)
      input.value[1].onmidimessage = onMidiMessage.bind(null, audio);
  }
};

const failure = () => {
  console.log('no midi access :^(');
}

const render = () => {
  const pInput = document.getElementById('portamento');
  pInput.value = portamento;
  pInput.oninput = e => { portamento = e.target.value; }

  const aInput = document.getElementById('attack');
  aInput.value = attack;
  aInput.oninput = e => { attack = e.target.value; }

  const rInput = document.getElementById('release');
  rInput.value = release;
  rInput.oninput = e => { release = e.target.value; }

  const gInput = document.getElementById('gain');
  gInput.value = gain;
  gInput.oninput = e => { gain = e.target.value; }


  const wInput = document.getElementById('wavetype');
  wInput.value = waveType;
  wInput.onchange = e => { waveType = e.target.value; }

  const rButton = document.getElementById('replay');
  rButton.onclick = () => { recorder.stop(); };
}


export function start () {
  render();
  navigator.requestMIDIAccess()
    .then(success, failure);
}
