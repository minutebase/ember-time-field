import State from "ember-states/state";
import {
  isNumberCode,
  keyCodeToNumber
} from '../utils/codes';

export default State.create({
  initialState: "digit1",

  digit1: State.create({
    key(manager, code) {
      if (!isNumberCode(code)) {
        return; // no-op
      }

      const num = keyCodeToNumber(code);
      manager.get("input").setMinutes(num);

      if (num <= 5) {
        manager.transitionTo("digit2");
      } else if (manager.get("input.hour12")) {
        manager.transitionTo("period");
      }
    }
  }),

  digit2: State.create({
    key(manager, code) {
      if (!isNumberCode(code)) {
        return; // no-op
      }

      const num = keyCodeToNumber(code);
      manager.get("input").setMinutesDigit2(num);

      if (manager.get("input.hour12")) {
        manager.transitionTo("period");
      } else {
        manager.transitionTo("digit1");
      }
    }
  }),

  enter(manager) {
    this.focusIn(manager);
  },

  focusIn(manager) {
    manager.get("input").selectMinutes();
  },

  left(manager) {
    manager.transitionTo("hours");
  },

  right(manager) {

    // TODO - better way to guard this, or not have the period state at all unless hour12 is true?
    if (manager.get("input.hour12")) {
      manager.transitionTo("period");
    }
  },

  up(manager) {
    manager.get("input").incrementMinutes();
  },

  down(manager) {
    manager.get("input").decrementMinutes();
  }
});