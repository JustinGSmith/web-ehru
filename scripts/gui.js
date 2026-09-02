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

function connect_sensors(context) {
  const gyro_elt_x = context.document.getElementById("gyro_sensor_x")
  const gyro_elt_y = context.document.getElementById("gyro_sensor_y")
  const gyro_elt_z = context.document.getElementById("gyro_sensor_z")

  return (sensor_context) => {
    sensor_context.set_gyro_callback((gyroscope, evt) => {
      gyro_elt_x.value = gyroscope.x;
      gyro_elt_y.value = gyroscope.y;
      gyro_elt_z.value = gyroscope.z;
    });
  }
}

function init(context) {
  return {
    connect_sliders: connect_sliders(context),
    connect_sensors: connect_sensors(context)
  }
}

export default {
  init
}
