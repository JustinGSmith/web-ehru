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
    var keep = [];
    granulator.granules.forEach((g) => {
      const v = g.next_value();
      // distribute data r/l
      buff_l[i] += v.l;
      buff_r[i] += v.r;
      // do we need to keep this one for future iterations?
      if (!v.done) {
        keep.push(g);
      }
    })
    granulator.granules = keep;
    granulator.index = granulator.index + 1;
  }

  return keep;
}

function init_buffer(granulator) {
}

function play_buffer(granulator) {
  var source = granulator.ctx.createBufferSource();
  source.buffer = granulator.buffer;
  source.connect(granulator.ctx.destination);
  fill_buffer(granulator);
  source.start();
  // TODO is this the right way to loop?
  source.onended = () => {
    play_buffer(granulator);
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
  gran.granules.push(new_granule({
    sr: audioCtx.sampleRate,
    t: 0,
    hz: 1000.0,
    amp: 0.8,
    dur: 200.0,
    pan: 0.0
  }));

  init_buffer(gran);
  play_buffer(gran);

  window.isAppInit = true;
}

export {
  init
}
