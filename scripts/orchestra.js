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
      'amp': 0.4,
      'modulation_frequency': 47.59,
      'depth': 26.205,
      'carrier': 73.795
    }
  },
  {
    'ui': {
      'element_prefix': "note2",
      'key': "s"
    },
    'params': {
      'amp': 0.6,
      'modulation_frequency': 220,
      'depth': 40,
      'carrier': 260
    }
  },
  {
    'ui': {
      'element_prefix': "note3",
      'key': "d"
    },
    'params': {
      'amp': 0.5,
      'modulation_frequency': 413,
      'depth': 49,
      'carrier': 462
    }
  },
  {
    'ui': {
      'element_prefix': "note4",
      'key': "f"
    },
    'params': {
      'amp': 0.6,
      'modulation_frequency': 20,
      'depth': 338.165,
      'carrier': 358.165
    }
  },
  {
    'ui': {
      'element_prefix': "note5",
      'key': "w"
    },
    'params': {
      'amp': 0.3,
      'modulation_frequency': 1000,
      'depth': 100,
      'carrier': 1100
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

if (typeof onload != "undefined") {
  onload = (evt) => {
    const run_button = document.getElementById("run");
    run_button.onclick = () => {
      if (!init) {
        init = true;
        create_orchestra();
      }
    }
  };
}

// > orc = await import('./scripts/orchestra.js')
export default {
  orchestra_data
}
