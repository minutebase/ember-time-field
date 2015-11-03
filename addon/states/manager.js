import StateManager from "ember-states/state-manager";

import UnfocusedState from './unfocused';
import FocusedState from './focused';

export default StateManager.extend({
  // enableLogging: true,
  initialState: 'unfocused',
  unfocused:    UnfocusedState,
  focused:      FocusedState
});