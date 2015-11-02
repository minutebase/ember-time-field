import Ember from 'ember';

const {
  Component,
  isNone,
  computed
} = Ember;

// TODO - manually seet the raw value and maintain cursor position etc
// TODO - set cursor selection on date parts and move along as you type
// TODO - skip over the : when typing so can just do 1145 for 11:45

export default Component.extend({
  tagName: 'input',
  type: 'text',
  attributeBindings: ['type', '_value:value', 'placeholder', 'name', 'autocomplete'],

  hours:   null,
  minutes: null,

  _sanitizedValue: '', // cached value to check changes

  _value: computed("hours", "minutes", {
    get() {
      const { hours, minutes } = this.getProperties("hours", "minutes");
      const hoursValue   = isNone(hours)   ? '--' : hours;
      const minutesValue = isNone(minutes) ? '--' : minutes;
      return `${hoursValue}:${minutesValue}`;
    }
  }),

  input() {
    this._handleChangeEvent();
  },

  change() {
    this._handleChangeEvent();
  },

  keyUp(e) {
    e.preventDefault();
    console.log("keyUp", e);
  },

  keyDown(e) {
    e.preventDefault();
    console.log("keyDown", e);
  },

  focusIn() {
    console.log("focus in");
    this._selectSection();
  },

  focusOut() {
    console.log("focus out");
  },

  click() {
    this._selectSection();
  },

  _selectSection() {
    this._selectHours();
  },

  _selectHours() {
    this.get("element").setSelectionRange(0, 2);
  },

  _selectMinutes() {
    this.get("element").setSelectionRange(3, 5);
  },

  _selectPeriod() {
    // TODO - for AM/PM
  },

  _handleChangeEvent() {
    this._processNewValue(this.readDOMAttr('value'));
  },

  _processNewValue(rawValue) {
    const value = this.sanitizeInput(rawValue);

    if (this._sanitizedValue !== value) {
      this._sanitizedValue = value;

      const match = value.match(/^(\d{1,2}):(\d{2})\W*(am|pm)?$/);
      if (match) {
        const hours   = Number(match[1]);
        const minutes = Number(match[2]);

        this.sendAction("on-change", {
          hours,
          minutes
        });
      } else {
        this.sendAction("on-invalid", value);
      }
    }
  },

  _setFromValue(value) {
    if (value) {
      this.setProperties(value);
    } else {
      this.setProperties({ hours: null, minutes: null });
    }
  },

  sanitizeInput(input) {
    return input || '';
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this._setFromValue(this.get('value'));
  }
});