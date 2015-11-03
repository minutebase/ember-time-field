import State from "ember-states/state";

import HoursFocusedState   from './hours-focused';
import MinutesFocusedState from './minutes-focused';
import PeriodFocusedState  from './period-focused';

export default State.create({
  hours:    HoursFocusedState,
  minutes:  MinutesFocusedState,
  period:   PeriodFocusedState,

  focusOut(manager) {
    manager.transitionTo("unfocused");
  },

  refocus(manager) {
    manager.send("focusIn");
  },

  left() {
    // no-op if not handled by child
  },

  right() {
    // no-op if not handled by child
  }
});
