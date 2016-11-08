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

	var _graphics = __webpack_require__(4);

	var _graphics2 = _interopRequireDefault(_graphics);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	(0, _graphics2.default)(document.querySelector('.graphics'));

	keyboard.start();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.start = start;

	var _note = __webpack_require__(2);

	var _note2 = _interopRequireDefault(_note);

	var _recorder = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var activeNotes = {};

	var attack = 0.05;
	var portamento = 0.05;
	var release = 0.05;
	var waveType = 'sawtooth';
	var gain = 0.01;

	var keyToFreq = function keyToFreq(note) {
	  return 440 * Math.pow(2, (note - 69) / 12);
	};

	var onMidiMessage = function onMidiMessage(context, e) {
	  var midiKey = event.data[1];
	  var freq = keyToFreq(midiKey);
	  var now = Date.now();

	  switch (e.data[0] & 0xf0) {
	    case 0x90:
	      if (event.data[2] != 0) {
	        var activeNote = (0, _note2.default)(context, freq, attack, portamento, release, waveType, gain);
	        activeNotes[midiKey] = activeNote;
	        activeNote.play(now);
	      }
	      break;

	    case 0x80:
	      var stoppedNote = activeNotes[midiKey];
	      stoppedNote.stop(now);
	      (0, _recorder.record)(stoppedNote, stoppedNote.start, now);
	      break;
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

	  var replay = document.getElementById('replay');
	  replay.onClick = function () {
	    replay();
	  };
	};

	function start() {
	  render();
	  navigator.requestMIDIAccess().then(success, failure);
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = note;
	function note(context, freq, attack, portamento, release, waveType, gain) {
	  var oscillator = context.createOscillator();
	  var envelope = context.createGain();
	  var start = null;
	  var end = null;

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
	      if (!start) {
	        start = startTime;
	      }
	    },
	    stop: function stop(endTime) {
	      envelope.gain.cancelScheduledValues(0);
	      envelope.gain.setTargetAtTime(0.0, 0, release);
	      if (!end) {
	        end = endTime;
	      }
	    }
	  };
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.record = record;
	exports.replay = replay;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var _marked = [replayGenerator].map(regeneratorRuntime.mark);

	var startNotes = {};
	var endNotes = {};
	var startTime = null;

	function replayGenerator() {
	  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, note;

	  return regeneratorRuntime.wrap(function replayGenerator$(_context) {
	    while (1) {
	      switch (_context.prev = _context.next) {
	        case 0:
	          _iteratorNormalCompletion = true;
	          _didIteratorError = false;
	          _iteratorError = undefined;
	          _context.prev = 3;
	          _iterator = notes[Symbol.iterator]();

	        case 5:
	          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	            _context.next = 12;
	            break;
	          }

	          note = _step.value;
	          _context.next = 9;
	          return note;

	        case 9:
	          _iteratorNormalCompletion = true;
	          _context.next = 5;
	          break;

	        case 12:
	          _context.next = 18;
	          break;

	        case 14:
	          _context.prev = 14;
	          _context.t0 = _context["catch"](3);
	          _didIteratorError = true;
	          _iteratorError = _context.t0;

	        case 18:
	          _context.prev = 18;
	          _context.prev = 19;

	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }

	        case 21:
	          _context.prev = 21;

	          if (!_didIteratorError) {
	            _context.next = 24;
	            break;
	          }

	          throw _iteratorError;

	        case 24:
	          return _context.finish(21);

	        case 25:
	          return _context.finish(18);

	        case 26:
	        case "end":
	          return _context.stop();
	      }
	    }
	  }, _marked[0], this, [[3, 14, 18, 26], [19,, 21, 25]]);
	}

	function record(note, start, end) {
	  var noteMeta = {
	    note: note,
	    start: start,
	    end: end
	  };

	  if (startNotes === {}) {
	    startTime = start;
	  }

	  startNotes[start] = [].concat(_toConsumableArray(startNotes[start]), [noteMeta]);
	  endNotes[end] = [].concat(_toConsumableArray(endNotes[end]), [noteMeta]);
	}

	function replay() {
	  conductor(startTime);
	}

	function conductor(startTime) {
	  var play = function play(tick) {
	    var notesToStart = startNotes[tick] || [];
	    var notesToEnd = endNotes[tick] || [];

	    notesToStart.forEach(function (note) {
	      return note.play();
	    });
	    notesToEnd.forEach(function (note) {
	      return note.stop();
	    });
	  };

	  var tick = startTime;
	  setTimeout(function () {
	    play(tick);
	    tick += 1;
	  }, 1);
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;
	// White: 18.4mm x 79mm, 19 keys
	// Black: 8.85mm x 47.06mm, 13 keys

	var params = {
	  width: 1000,
	  height: 1000
	};

	var white = {
	  width: 20,
	  height: 80
	};

	var black = {
	  width: 10,
	  height: 70
	};

	var whiteKey = function whiteKey(ctx, x, y) {
	  ctx.strokeStyle = 'black';
	  ctx.strokeRect(x, y, white.width, white.height);
	};

	var blackKey = function blackKey(ctx, x, y) {
	  ctx.fillStyle = 'black';
	  ctx.fillRect(x, y, black.width, black.height);
	};

	var keyGroup = function keyGroup(ctx, amount, offset) {
	  var keys = [];
	  var key = void 0;
	  var x = offset;

	  for (var i = 0; i < amount; i += 1) {
	    if (i % 2) {
	      key = blackKey(ctx, x, 0);
	      x += black.width;
	    } else {
	      key = whiteKey(ctx, x, 0);
	      x += white.width;
	    }
	  }

	  return x;
	};

	var octave = function octave(ctx, offset) {
	  var size = offset;
	  size = keyGroup(ctx, 5, size);
	  size = keyGroup(ctx, 7, size);
	  return size;
	};

	var keyboard = function keyboard(ctx, offset) {
	  var size = 100;

	  size = keyGroup(ctx, 7, size);
	  size = octave(ctx, size);
	  size = octave(ctx, size);
	  size = keyGroup(ctx, 1, size);

	  return offset;
	};

	function render(canvas) {
	  var ctx = canvas.getContext('2d');
	  ctx.scale(2, 2);
	  keyboard(ctx);
	}

/***/ }
/******/ ]);