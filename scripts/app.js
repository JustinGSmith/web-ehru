import { new_granule  } from './pure.js';

function create_granulator(ctx) {

  console.log("creating granulator v0");
  var granulator = {};

  granulator.ctx = ctx
  granulator.buffer = new AudioBuffer({
    numberOfChannels: 2,
    length: ctx.sampleRate * 2.0,
    sampleRate: ctx.sampleRate
  });

  granulator.granules = [];
  granulator.index = 0;

  return granulator;
}

// TODO: lift most of this logic into a pure function
function fill_buffer(granulator) {
  // This gives us the actual array that contains the data
  const buff_l = granulator.buffer.getChannelData(0);
  const buff_r = granulator.buffer.getChannelData(1);

  for (let i = 0; i < buff_l.length; i++) {
    buff_l[i] = 0;
    buff_r[i] = 0;
    var keep = [];
    granulator.granules.forEach((g) => {
      const v = g.next_value();
      // distribute data r/l
      buff_l[i] += v.l;
      buff_r[i] += v.r;
      // do we need to keep this one for future iterations?
      if (v.done != true) {
        keep.push(g);
      }
    })
    granulator.granules = keep;
    granulator.index = granulator.index + 1;
  }

  return keep;
}

function play_buffer(granulator) {
  var source = granulator.ctx.createBufferSource();
  source.buffer = granulator.buffer;
  source.connect(granulator.ctx.destination);
  fill_buffer(granulator);
  // TODO is this the right way to loop?
  source.onended = () => {
    // console.log("re-init");
    play_buffer(granulator);
  }
  source.start();
}

function rnd(low, high) {
  return low + ((high - low) * Math.random())
}

function demo_fill(gran) {
  const density = 100 // 10000;
  for(let i = 0; i < density; i++) {
    gran.granules.push(new_granule({
      sr: gran.ctx.sampleRate,
      t: rnd(0, 115.0),
      hz: rnd(100, 1000.0),
      amp: rnd(0.3 / density, 0.8 / density),
      dur: rnd(0.3, 20.0),
      pan: rnd(-1, 1)
    }));
  }
}

function init() {
  if (window.isAppInit) {
    return;
  }

  window.appContents.style.display = "block";
  document.body.removeChild(startMessage);

  // create web audio api context
  const audioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  var gran = create_granulator(audioCtx);
  demo_fill(gran);

  play_buffer(gran);

  window.isAppInit = true;
}

export {
  init
}
