function connect_slider(context) {
  return (id, label, param_cb, param_value) => {
    const elt = context.document.getElementById(id + "_" + label);
    elt.value = param_value()
    elt.addEventListener(
      "change",
      (evt) => {
        const setting = parseFloat(evt.target.value);
        param_cb(setting);
      });
  }
}

function connect_sliders (context) {
  const slider = connect_slider(context);
  return (ui, note) => {
    const id = ui.element_prefix;
    slider(id, "hz", note.assign.hz, note.read.hz);
    slider(id, "amp", note.assign.amp, note.read.amp);
    slider(id, "mod", note.assign.mod, note.read.mod);
    slider(id, "depth", note.assign.depth, note.read.depth);
  }
}

function header_row() {
  const row = document.createElement("tr");
  const topic_header = document.createElement("th");
  topic_header.append("topic")
  row.append(topic_header);
  const message_header = document.createElement("th");
  message_header.append("message");
  row.append(message_header);
  return row;
}

function connect_debug_region(context) {
  const debug_div = context.document.getElementById("log")
  function embed_on (log_object, place) {
    const target = place || debug_div;
    Array.from(target.children).forEach(c => c.remove());
    target.append(header_row());
    for (const [topic, contents] of Object.entries(log_object)) {
      const row = document.createElement("tr");
      const topic_data = document.createElement("td");
      topic_data.append(topic)
      row.append(topic_data);
      const message_data = document.createElement("td")
      if (typeof(contents) === 'string') {
        message_data.append(contents);
      } else {
        embed_on(contents, message_data);
      }
      row.append(message_data);
      target.append(row);
    }
  }
  return embed_on;
}

function init(context) {
  return {
    connect_sliders: connect_sliders(context),
    debug: connect_debug_region(context)
  }
}

export default {
  init
}
