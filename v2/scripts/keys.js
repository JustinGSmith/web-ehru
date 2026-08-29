function init(context) {
  var keys = {};

  function bind(ui, instrument) {
    console.log("binding", ui, ui.key)
    keys[ui.key] = instrument;
  }

  function on_key(k, f) {
    const target = keys[k]
    if (target) {
      f(target);
    } else {
      console.log("no key binding", k, "in", keys);
    }
  }

  context.addEventListener(
    'keydown',
    (evt) => {
      if (evt.repeat) {
        return;
      }
      on_key(evt.key, (target) => {
          target.control.play();
        }
      );
    }
  );

  context.addEventListener(
    'keyup',
    (evt) => {
      on_key(evt.key, (target) => {
          target.control.pause();
        }
      );
    }
  );

  return bind;
}

export default {
  init
}
