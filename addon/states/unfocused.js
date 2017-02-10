import State from "ember-states/state";

export default State.create({
  focusIn(manager) {
    manager.transitionTo("focused.hours");
  },
  refocus() {
    // no-op
  },
  focusOut() {
    // no-op
  }
});
