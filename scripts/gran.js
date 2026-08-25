import { new_granule  } from './pure.js';

function create_granulator(ctx) {

  console.log("creating granulator v1");
  var granulator = {};

  granulator.ctx = ctx;
  granulator.granules = [];
  granulator.index = 0;

  return granulator;
}

// TODO: lift most of this logic into a pure function
function fill_buffer(granule) {
  // This gives us the actual array that contains the data
  const buff_l = granule.buffer.getChannelData(0);
  const buff_r = granule.buffer.getChannelData(1);

  for (let i = 0; i < buff_l.length; i++) {
    buff_l[i] = 0;
    buff_r[i] = 0;
    const v = granule.next_value();
    // distribute data r/l
    buff_l[i] += v.l;
    buff_r[i] += v.r;
      // do we need to keep this one for future iterations?
  }
}

function play_granule(granulator, granule) {
  var source = granulator.ctx.createBufferSource();
  source.buffer = granule.buffer;
  source.connect(granulator.ctx.destination);
  fill_buffer(granule);
  source.start();
}

function granule_source(params) {
  var granule = new_granule(params);
  granule.buffer = new AudioBuffer({
    numberOfChannels: 2,
    length: granule.dur,
    sampleRate: granule.sr
  });
  return granule;
}

function rnd(low, high) {
  return low + ((high - low) * Math.random())
}

function demo_fill(gran) {
  const density = 1000;
  const gain = 15 / density
  for(let i = 0; i < density; i++) {
    gran.granules.push(granule_source({
      sr: gran.ctx.sampleRate,
      t: rnd(0, 15.0),
      hz: rnd(100, 1000.0),
      amp: rnd(0.3 * gain, 0.8 * gain),
      dur: rnd(0.3, 20.0),
      pan: rnd(-1, 1)
    }));
  }
}

function gran_demo(audioCtx) {
  var gran = create_granulator(audioCtx);
  demo_fill(gran);
  gran.granules.forEach( (granule) => {
    setTimeout(
      () => {
        play_granule(gran, granule);
      },
      gran.t
    );
  });
}

