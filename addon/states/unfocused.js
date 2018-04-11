import State from "../utils/state";

export default State.extend({
  focusIn(manager) {
    manager.transitionTo("focused.hours");
  },

  // it's possible to receive events after losing focus, due to runloop shenanigans
  // just swallow them as no-ops
  refocus() {},
  focusOut() {},
  up() {},
  down() {},
  left() {},
  right() {},
  key() {}
});
