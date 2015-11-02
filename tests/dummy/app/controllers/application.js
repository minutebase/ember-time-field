import Ember from 'ember';

export default Ember.Controller.extend({
  time: null,
  hour12: false,

  isInvalid: false,

  actions: {
    timeChanged(time) {
      this.set("isInvalid", false);
      this.set("time", time);
      console.log("time", time);
    },

    invalidTime() {
      this.set("isInvalid", true);
    },

    toggleHour() {
      this.toggleProperty("hour12");
    }
  }
});