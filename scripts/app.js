function create_granule(ctx) {

  console.log("creating granulator v0");
  granulator = {};

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
    keep = [];
    granulator.granules.forEach((g) => {
      v = g.next_value();
      // distribute data r/l
      buff_l[i] += v.l;
      buff_r[i] += v.r;
      // do we need to keep this one for future iterations?
      if (!v.done) {
        keep.append(g);
      }
    granulator.granules = keep;
    granulator.index = granulator.index + 1;
    })
  }

  return keep;
}

function play_buffer(granulator) {
  fill_buffer();
  source = ctx.createBufferSource();
  source.buffer = granulator.buffer;
  source.connect(ctx.destination)
  source.start();
  // TODO is this the right way to loop?
  source.onended = () => {
    play_buffer();
  }
}

function init() {
  console.log("app startup");
}

export default {
  init
}
