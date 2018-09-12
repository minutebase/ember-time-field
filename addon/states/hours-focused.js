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
      manager.get("input").setHours(num);

      if (num <= 2) {
        manager.transitionTo("digit2");
      } else {
        manager.transitionTo("minutes");
      }
    }
  }),

  digit2: state(State, {
    key(manager, code) {
      if (!isNumberCode(code)) {
        return; // no-op
      }

      const num = keyCodeToNumber(code);
      manager.get("input").setHoursDigit2(num);
      manager.transitionTo("minutes");
    }
  }),

  enter(manager) {
    this.focusIn(manager);
  },

  focusIn(manager) {
    manager.get("input").selectHours();
  },

  right(manager) {
    manager.transitionTo("minutes");
  },

  up(manager) {
    manager.get("input").incrementHours();
  },

  down(manager) {
    manager.get("input").decrementHours();
  },
  
  key(manager, code) {
    if (!isNumberCode(code)) {
      return; // no-op
    }

    const num = keyCodeToNumber(code);
    manager.get("input").setHours(num);

    if (num <= 2) {
      manager.transitionTo("digit2");
    } else {
      manager.transitionTo("minutes");
    }
  }

});
