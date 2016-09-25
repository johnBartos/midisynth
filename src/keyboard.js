const activeNotes = {};
const history = [];

let attack = 0.05;
let portamento = 0.05;
let release = 0.05;
let waveType = 'sawtooth';
let gain = 0.01;

const noteToFreq = (note) => {
  return 440 * Math.pow(2,(note-69)/12);
}

const onMidiMessage = (context, e) => {
  const note = event.data[1];
  const freq = noteToFreq(note);
  const now = Date.now();

  switch (e.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2]!=0) {
        const voice = createNote(context, freq);
        activeNotes[note] = voice;
        voice.play(now);
      }
      break;

    case 0x80:
      const stoppedVoice = activeNotes[note];
      stoppedVoice.stop(now);
      history.push(stoppedVoice);

      break;
  }
}

const createNote = (context, freq) => {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  let start;
  let end;
  let played = false;

  oscillator.type = waveType;
  oscillator.connect(envelope);
  envelope.connect(context.destination);
  oscillator.start(0);

  return {
    play: (startTime) => {
      oscillator.frequency.cancelScheduledValues(0);
      oscillator.frequency.setTargetAtTime(freq, 0, portamento);
      envelope.gain.cancelScheduledValues(0);
      envelope.gain.setTargetAtTime(gain, 0, attack);
      if (!played) {
        start = startTime;
      }
    },
    stop: (endTime) => {
      envelope.gain.cancelScheduledValues(0);
      envelope.gain.setTargetAtTime(0.0, 0, release);
      if (!played) {
        end = endTime;
        played = true;
      }
    },
    length: () => {
      return end - start;
    }
  };
};

const replay = () => {
  for (const voice of history) {
    console.log(voice.length())
    voice.play();
    setTimeout(() => {
      voice.stop();
    }, voice.length());
  }
}

const createAudioContext = () => {
    return new AudioContext();
}

const success = (midi) => {
   const inputs = midi.inputs.entries();
   const audio = createAudioContext();

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
  wInput.onchange = e => {
    waveType = e.target.value;
  }
}


export function start () {
  render();
  navigator.requestMIDIAccess()
    .then(success, failure);
}
