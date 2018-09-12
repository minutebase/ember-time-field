import State, { state } from "../utils/state";

import {
  isNumberCode,
  keyCodeToNumber
} from '../utils/codes';

export default State.extend({
  initialState: "digit1",

  digit1: state(State, {
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

  digit2: state(State, {
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
  },

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
});
