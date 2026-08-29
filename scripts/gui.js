function connect_slider(id, label, param_cb, param_value) {
  // TODO - also set slider to current instrument value
  const elt = document.getElementById(id + "_" + label);
  elt.value = param_value()
  elt.addEventListener(
    "change",
    (evt) => {
      const setting = parseFloat(evt.target.value);
      param_cb(setting);
    });
}

function init(context) {
  return (ui, note) => {
    const id = ui.element_prefix
    // const element = document.getElementById(id);
    connect_slider(id, "hz", note.assign.hz, note.read.hz);
    connect_slider(id, "amp", note.assign.amp, note.read.amp);
    connect_slider(id, "mod", note.assign.mod, note.read.mod);
    connect_slider(id, "depth", note.assign.depth, note.read.depth);
  }
}

export default {
  init
}
