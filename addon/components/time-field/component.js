import Ember from 'ember';

const {
  Component,
  isNone,
  computed
} = Ember;

import pad from '../../utils/pad';

const KEY_CODES = {
  UP:    38,
  DOWN:  40,
  LEFT:  37,
  RIGHT: 39,
  TAB:   9
};

const RANGES = {
  HOUR:   { START: 0, END: 2 },
  MINUTE: { START: 3, END: 5 },
  PERIOD: { START: 6, END: 8 }
};

// wrapping mod
function mod(n, m) {
  return ((n % m) + m) % m;
}

import EventManager from '../../states/manager';

export default Component.extend({
  classNames: 'time-field',

  tagName: 'input',
  type: 'text',
  autocomplete: false,
  attributeBindings: ['type', 'placeholder', 'name', 'autocomplete'],

  hour12: false,

  hours:   null,
  minutes: null,
  period:  'am',

  init() {
    this._super();
    this.set("stateManager", EventManager.create({
      input: this
    }));
  },

  hoursInRange: Ember.computed("hour12", {
    get() {
      return this.get("hour12") ? 12 : 24;
    }
  }),

  _value: computed("hours", "minutes", "period", "hour12", {
    get() {
      const { hours, minutes, period, hour12 } = this.getProperties("hours", "minutes", "period", "hour12");
      const hoursValue   = isNone(hours)   ? '--' : pad(hours);
      const minutesValue = isNone(minutes) ? '--' : pad(minutes);

      let str = `${hoursValue}:${minutesValue}`;
      if (hour12) {
        const periodValue = isNone(period) ? '--' : period; // format?
        str = `${str} ${periodValue}`;
      }
      return str;
    }
  }),

  input() {
    this._handleChangeEvent();
  },

  change() {
    this._handleChangeEvent();
  },

  triggerStateEvent(name) {
    this.get("stateManager").send(name);
  },

  // for now just ignore tab
  shouldHandleKey(code) {
    return code !== KEY_CODES.TAB;
  },

  keyUp(e) {
    if (!this.shouldHandleKey(e.keyCode)) {
      return;
    }

    e.preventDefault();
  },

  keyDown(e) {
    if (!this.shouldHandleKey(e.keyCode)) {
      return;
    }

    e.preventDefault();

    switch (e.keyCode) {
    case KEY_CODES.LEFT:
      this.get("stateManager").send("left");
      break;

    case KEY_CODES.RIGHT:
      this.get("stateManager").send("right");
      break;

    case KEY_CODES.UP:
      this.get("stateManager").send("up");
      break;

    case KEY_CODES.DOWN:
      this.get("stateManager").send("down");
      break;

    default:
      this.get("stateManager").send("key", e.keyCode);
      break;
    }
  },

  focusIn() {
    // ignore if part of click otherwise we move focus too early
    if (!this._handlingClick) {
      this.get("stateManager").send("focusIn");
    }
  },

  focusOut() {
    this.get("stateManager").send("focusOut");
  },

  mouseDown() {
    this._handlingClick = true;
  },

  mouseUp() {
    this._handlingClick = false;

    const el = this.get("element");
    const cursor = el.selectionStart;

    if (cursor >= RANGES.HOUR.START && cursor <= RANGES.HOUR.END) {
      this.get("stateManager").transitionTo("focused.hours");
    } else if (cursor >= RANGES.MINUTE.START && cursor <= RANGES.MINUTE.END) {
      this.get("stateManager").transitionTo("focused.minutes");
    } else if (cursor >= RANGES.PERIOD.START && cursor <= RANGES.PERIOD.END) {
      this.get("stateManager").transitionTo("focused.period");
    }
  },

  // [--]:-- --
  selectHours() {
    this.get("element").setSelectionRange(RANGES.HOUR.START, RANGES.HOUR.END);
  },

  // --:[--] --
  selectMinutes() {
    this.get("element").setSelectionRange(RANGES.MINUTE.START, RANGES.MINUTE.END);
  },

  // --:-- [--]
  selectPeriod() {
    this.get("element").setSelectionRange(RANGES.PERIOD.START, RANGES.PERIOD.END);
  },

  incrementHours(amnt=1) {
    const hours = this.get("hours");
    if (isNone(hours)) {
      this.set("hours", 0);
    } else {
      this.set("hours", this.modHourForRange(hours + amnt));
    }

    this.valueChanged();
  },

  modHourForRange(hour) {
    if (isNone(hour)) {
      return;
    }
    return mod(hour, this.get("hoursInRange"));
  },

  decrementHours() {
    this.incrementHours(-1);
  },

  setHours(hours) {
    this.set("hours", hours);
    this.valueChanged();
  },

  setHoursDigit2(hours) {
    const current = this.get("hours");
    if (isNone(current)) {
      this.set("hours", hours);
    } else {
      this.set("hours", Math.min(current * 10 + hours, this.get("hoursInRange") - 1));
    }

    this.valueChanged();
  },

  incrementMinutes(amnt=1) {
    const minutes = this.get("minutes");
    if (isNone(minutes)) {
      this.set("minutes", 0);
    } else {
      this.set("minutes", mod(minutes + amnt, 60));
    }

    this.valueChanged();
  },

  decrementMinutes() {
    this.incrementMinutes(-1);
  },

  setMinutes(minutes) {
    this.set("minutes", minutes);
    this.valueChanged();
  },

  setMinutesDigit2(minutes) {
    const current = this.get("minutes");
    if (isNone(current)) {
      this.set("minutes", minutes);
    } else {
      this.set("minutes", current * 10 + minutes);
    }

    this.valueChanged();
  },

  togglePeriod() {
    const period = this.get("period");
    this.changePeriod(period === "am" ? "pm" : "am");
  },

  changePeriod(period) {
    this.set("period", period);
    this.valueChanged();
  },

  // translates 24 hour to 12 hour if necessary
  // TODO - store everything internally as 24 hour so we don't need to do this here
  didReceiveAttrs() {
    this._super();

    const value = this.get("value");
    let hours   = null;
    let minutes = null;

    if (value) {
      hours   = this.modHourForRange(Ember.get(value, "hours"));
      minutes = Ember.get(value, "minutes");
    }

    this.setProperties({
      hours, minutes
    });
  },

  didRender() {
    this.updateDOMValue();
    this.get("stateManager").send("refocus");
  },

  // TODO - could use attribute binding but we want to re-focus
  //        and if we do that in run.next or afterRender we still get a cursor change
  valueChanged() {
    this.updateDOMValue();
    this.get("stateManager").send("focusIn");

    let { hours, minutes, period, hour12 } = this.getProperties("hours", "minutes", "period", "hour12");

    if (hour12 && period === 'pm' && !isNone(hours)) {
      hours = hours + 12;
    }

    this.sendAction("on-change", {
      hours, minutes
    });
  },

  updateDOMValue() {
    const value = this.get("_value");
    this.get("element").value = value;
  }

});