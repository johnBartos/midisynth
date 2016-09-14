const activeNotes = {};
const count = 0;


const noteToFreq = (note) => {
  return 440 * Math.pow(2,(note-69)/12);
}

const onMidiMessage = (context, e) => {
  const note = event.data[1];
  const freq = noteToFreq(note);
  switch (e.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2]!=0) {
        const voice = createNote(context, freq);
        activeNotes[note] = voice;
        voice.play();
      }
      break;

    case 0x80:
      activeNotes[note].stop();
      break;
  }
}

const createNote = (context, freq) => {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.connect(envelope);
  envelope.connect(context.destination);

  return {
    play: () => {
      oscillator.frequency.value = freq;
      envelope.gain.value = 1;
      oscillator.start(0);
      console.log('play')
    },
    stop: () => {
      envelope.gain.value = 0;
      console.log('stop')
    }
  };
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

navigator.requestMIDIAccess()
  .then(success, failure);
