function gyro_read_error(evt) {
  if (evt.error.name === "NotAllowedError") {
    console.log("TODO request gyroscope permissions", evt);
  } else if (evt.error.name === "NotReadableError") {
    console.log("Cannot connect to the gyroscope.", evt);
  } else {
    console.log("Misc gyroscope read error", evt);
  }
}

function gyro_access_error(error) {
  if (error.name === "SecurityError") {
    console.log("gyro access blocked by policy", error);
  } else if (error.name === "ReferenceError") {
    console.log("gyro not supported by user agent", error);
  } else {
    throw error;
  }
}

function gyro_read(gyro_context) {
  return (evt) => {
    gyro_context.callback(gyro_context.gyroscope, evt);
  }
}

function init(context) {
  let gyro_context = {
    gyroscope: null,
    callback: (arg) => { console.log("gyro callback unbound", arg); }
  }

  const set_gyro_callback = (cb) => { gyro_context.callback = cb; }

  try {
    const gyroscope = new context.Gyroscope({ frequency: 60 });
    gyro_context.gyroscope = gyroscope;
    gyroscope.start();

    console.log("gyroscope available", gyroscope);

    gyroscope.addEventListener("error", gyro_read_error);
    gyroscope.addEventListener("reading", gyro_read(gyro_context));
  } catch (error) {
    gyro_access_error(error);
  }

  return { set_gyro_callback };
}

export default {
  init
}
