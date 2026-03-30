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

// consider splitting audio api access to a shim, and moving all
// the logic into a testable pure function
function fill_buffer(granulator) {
  // This gives us the actual array that contains the data
  const buff_l = granulator.buffer.getChannelData(0);
  const buff_r = granulator.buffer.getChannelData(1);

  for (let i = 0; i < buff_l.length; i++) {
    keep = [];
    granulator.granules.forEach((g) =>
      // is this one active yet?
      if (g.t <= granulator.index) {
       continue;
      }
      l_r = g.next_value();
      // distribute data r/l
      buff_l[i] += l_r[0];
      buff_r[i] += l_r[1];
      // do we need to keep this one for future iterations?
      if (granulator.index < (g.t + g.dur)) {
        keep.append(g)
      }
    )
    granulator.granules = keep
    granulator.index = granulator.index + 1
  }

  return keep
}

function play_buffer(granulator) {
  fill_buffer();
  source = ctx.createBufferSource();
  source.buffer = granulator.buffer;
  source.connect(ctx.destination)
  source.start();
  source.onended = () => {
    play_buffer();
  }
}
