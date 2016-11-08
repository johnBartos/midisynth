export default function note(context, freq, attack, portamento, release, waveType, gain) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = waveType;
  oscillator.connect(envelope);
  envelope.connect(context.destination);
  oscillator.start(0);

  return {
    play: (startTime) => {
      // oscillator.frequency.cancelScheduledValues(0);
      // oscillator.frequency.setTargetAtTime(freq, 0, portamento);
      // envelope.gain.cancelScheduledValues(0);
      // envelope.gain.setTargetAtTime(gain, 0, attack);
      oscillator.frequency.value = freq;
      envelope.gain.value = gain;
    },
    stop: () => {
      // envelope.gain.cancelScheduledValues(0);
      // envelope.gain.setTargetAtTime(0.0, 0, release);
      envelope.gain.value = 0;
    },
    connect: (dest) => {
        oscillator.connect(dest);
    },
    disconnect: (dest) => {
      oscillator.disconnect
    }
  };
};
