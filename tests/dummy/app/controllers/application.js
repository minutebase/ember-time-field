import Ember from 'ember';

import pad from 'ember-time-field/utils/pad';

function timePart(property) {
  return Ember.computed(property, {
    get() {
      const value = this.get(property);
      if (Ember.isNone(value)) {
        return '--';
      }

      return pad(value);
    }
  });
}

export default Ember.Controller.extend({
  time: null,
  hour12: false,

  hours:   timePart("time.hours"),
  minutes: timePart("time.minutes"),

  actions: {
    timeChanged(time) {
      this.set("time", time);
    },

    toggleHour() {
      this.toggleProperty("hour12");
    }
  }
});