function connect_slider(id, label, param_cb) {
  // TODO - also set slider to current instrument value
  const elt = document.getElementById(id + "_" + label);
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
    connect_slider(id, "hz", note.assign.hz);
    connect_slider(id, "amp", note.assign.amp);
    connect_slider(id, "mod", note.assign.mod);
    connect_slider(id, "depth", note.assign.depth);
  }
}

export default {
  init
}
