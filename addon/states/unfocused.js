import State from "ember-states/state";

export default State.create({
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
