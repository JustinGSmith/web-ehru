import fm from './fm.js'
import keys from './keys.js'
import gui from './gui.js'

const orchestra_data = [
  {
    'ui': {
      'element_prefix': "note1",
      'key': "a"
    },
    'params': {
      'hz_low': 100,
      'hz_high': 10000,
      'modulation_hz': 6,
      'amp': 0.4,
      'dur': 200,
      'pan': -1
    }
  },
  {
    'ui': {
      'element_prefix': "note2",
      'key': "s"
    },
    'params': {
      'hz_low': 220,
      'hz_high': 300,
      'modulation_hz': 21,
      'amp': 0.6,
      'dur': 200,
      'pan': 1
    }
  },
  {
    'ui': {
      'element_prefix': "note3",
      'key': "d"
    },
    'params': {
      'hz_low': 413,
      'hz_high': 511,
      'modulation_hz': 111.111,
      'amp': 0.5,
      'dur': 200,
      'pan': 0
    }
  },
  {
    'ui': {
      'element_prefix': "note4",
      'key': "f"
    },
    'params': {
      'hz_low': 20,
      'hz_high': 696.33,
      'modulation_hz': 300.111,
      'amp': 0.6,
      'dur': 200,
      'pan': 0
    }
  },
  {
    'ui': {
      'element_prefix': "note5",
      'key': "w"
    },
    'params': {
      'hz_low': 1000,
      'hz_high': 1200,
      'modulation_hz': 202,
      'amp': 0.3,
      'dur': 200,
      'pan': 0
    }
  }
];

function create_orchestra () {
  console.log("initializing orchestra");
  var orchestra = {}

  const audio_context = window.AudioContext || window.webkitAudioContext;
  const voice = fm.init(audio_context);
  const bind_key = keys.init(window);
  const display = gui.init(window);


  orchestra_data.forEach((spec) => {
    const instance = voice(spec.params);
    orchestra[spec.ui.key] = instance;
    bind_key(spec.ui, instance);
    display(spec.ui, instance);
  });

  return orchestra;
}

var init = false;

onload = (evt) => {
  const run_button = document.getElementById("run");
  run_button.onclick = () => {
    if (!init) {
      init = true;
      create_orchestra();
    }
  }
};
