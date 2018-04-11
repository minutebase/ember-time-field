import StateManager from "../utils/state-manager";
import { state } from "../utils/state";

import UnfocusedState from './unfocused';
import FocusedState from './focused';

export default StateManager.extend({
  initialState: 'unfocused',
  unfocused: state(UnfocusedState),
  focused:  state(FocusedState)
});
