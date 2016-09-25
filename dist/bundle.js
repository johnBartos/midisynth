/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _keyboard = __webpack_require__(1);

	var keyboard = _interopRequireWildcard(_keyboard);

	var _interface = __webpack_require__(2);

	var _interface2 = _interopRequireDefault(_interface);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	keyboard.start();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.start = start;
	var activeNotes = {};
	var history = [];

	var attack = 0.05;
	var portamento = 0.05;
	var release = 0.05;
	var waveType = 'sawtooth';
	var gain = 0.01;

	var noteToFreq = function noteToFreq(note) {
	  return 440 * Math.pow(2, (note - 69) / 12);
	};

	var onMidiMessage = function onMidiMessage(context, e) {
	  var note = event.data[1];
	  var freq = noteToFreq(note);
	  var now = Date.now();

	  switch (e.data[0] & 0xf0) {
	    case 0x90:
	      if (event.data[2] != 0) {
	        var voice = createNote(context, freq);
	        activeNotes[note] = voice;
	        voice.play(now);
	      }
	      break;

	    case 0x80:
	      var stoppedVoice = activeNotes[note];
	      stoppedVoice.stop(now);
	      history.push(stoppedVoice);

	      break;
	  }
	};

	var createNote = function createNote(context, freq) {
	  var oscillator = context.createOscillator();
	  var envelope = context.createGain();
	  var start = void 0;
	  var end = void 0;
	  var played = false;

	  oscillator.type = waveType;
	  oscillator.connect(envelope);
	  envelope.connect(context.destination);
	  oscillator.start(0);

	  return {
	    play: function play(startTime) {
	      oscillator.frequency.cancelScheduledValues(0);
	      oscillator.frequency.setTargetAtTime(freq, 0, portamento);
	      envelope.gain.cancelScheduledValues(0);
	      envelope.gain.setTargetAtTime(gain, 0, attack);
	      if (!played) {
	        start = startTime;
	      }
	    },
	    stop: function stop(endTime) {
	      envelope.gain.cancelScheduledValues(0);
	      envelope.gain.setTargetAtTime(0.0, 0, release);
	      if (!played) {
	        end = endTime;
	        played = true;
	      }
	    },
	    length: function length() {
	      return end - start;
	    }
	  };
	};

	var replay = function replay() {
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    var _loop = function _loop() {
	      var voice = _step.value;

	      console.log(voice.length());
	      voice.play();
	      setTimeout(function () {
	        voice.stop();
	      }, voice.length());
	    };

	    for (var _iterator = history[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      _loop();
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }
	};

	var createAudioContext = function createAudioContext() {
	  return new AudioContext();
	};

	var success = function success(midi) {
	  var inputs = midi.inputs.entries();
	  var audio = createAudioContext();

	  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
	    console.log(input);
	    input.value[1].onmidimessage = onMidiMessage.bind(null, audio);
	  }
	};

	var failure = function failure() {
	  console.log('no midi access :^(');
	};

	var render = function render() {
	  var pInput = document.getElementById('portamento');
	  pInput.value = portamento;
	  pInput.oninput = function (e) {
	    portamento = e.target.value;
	  };

	  var aInput = document.getElementById('attack');
	  aInput.value = attack;
	  aInput.oninput = function (e) {
	    attack = e.target.value;
	  };

	  var rInput = document.getElementById('release');
	  rInput.value = release;
	  rInput.oninput = function (e) {
	    release = e.target.value;
	  };

	  var gInput = document.getElementById('gain');
	  gInput.value = gain;
	  gInput.oninput = function (e) {
	    gain = e.target.value;
	  };

	  var wInput = document.getElementById('wavetype');
	  wInput.value = waveType;
	  wInput.onchange = function (e) {
	    waveType = e.target.value;
	  };
	};

	function start() {
	  render();
	  navigator.requestMIDIAccess().then(success, failure);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _two = __webpack_require__(3);

	var _two2 = _interopRequireDefault(_two);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	console.log(_two2.default);

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = Two;

/***/ }
/******/ ]);