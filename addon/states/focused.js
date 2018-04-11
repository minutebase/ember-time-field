import State, { state } from "../utils/state";

import HoursFocusedState   from './hours-focused';
import MinutesFocusedState from './minutes-focused';
import PeriodFocusedState  from './period-focused';

export default State.extend({
  hours:    state(HoursFocusedState),
  minutes:  state(MinutesFocusedState),
  period:   state(PeriodFocusedState),

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
