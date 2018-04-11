import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({

  initialState: null,
  currentState: computed({
    get() {
      let name = this.get('initialState');
      return this.get(name);
    },
    set(_key, val) {
      return val;
    }
  }),

  transitionTo(path) {
    let current = this.get('currentState');
    while (current) {
      let nextState = current.get(path);
      if (nextState) {
        allBetween(current, nextState).forEach(state => state.enter && state.enter(this));
        this.set("currentState", nextState);
        return;
      }
      current = current.get('parent');
    }

    throw new Error(`Can't transition to ${path}`);
  },

  send(name, ...args) {
    let state = this.get('currentState');
    return state.send(name, ...args);
  }

});

function allBetween(start, end) {
  let parent = end.get('parent');
  let intermediate = [end];

  while (parent) {
    intermediate.push(parent);
    parent = parent.get('parent');
    if (parent === start) {
      break;
    }
  }

  return intermediate;
}
