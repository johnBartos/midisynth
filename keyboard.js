const activeNotes = {};
const history = [];

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

  oscillator.type = 'triangle';
  oscillator.connect(envelope);
  envelope.connect(context.destination);
  oscillator.start(0);

  return {
    play: (startTime) => {
      oscillator.frequency.value = freq;
      envelope.gain.value = 0.1;
      console.log('play')
      if (!played) {
        start = startTime;
      }
    },
    stop: (endTime) => {
      envelope.gain.value = 0;
      console.log('stop')
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

navigator.requestMIDIAccess()
  .then(success, failure);
