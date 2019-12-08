import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { isNone } from '@ember/utils';

import pad from '../utils/pad';
import mod from '../utils/mod';
import StateManager from '../states/manager';
import { KEY_CODES } from '../utils/codes';

const RANGES = {
  HOUR:   { START: 0, END: 2 },
  MINUTE: { START: 3, END: 5 },
  PERIOD: { START: 6, END: 8 }
};

export default Component.extend({
  classNames: 'time-field',

  tagName: 'input',
  type: 'text',
  autocomplete: false,
  disabled: false,
  attributeBindings: ['type', 'placeholder', 'name', 'autocomplete', 'disabled'],

  hour12: false,

  hours:   null, // always 24 hour, so doesn't reflect period
  minutes: null,

  period:  'am',

  init() {
    this._super();
    this.set("stateManager", StateManager.create({
      input: this
    }));
  },

  hoursForRange: computed("hours", "hour12", {
    get() {
      const { hours, hour12 } = this.getProperties("hours", "hour12");
      if (isNone(hours)) {
        return;
      }

      if (hour12) {
        const h = hours % 12;
        return h === 0 ? 12 : h;
      } else {
        return hours;
      }
    }
  }),

  _value: computed("hoursForRange", "minutes", "period", "hour12", {
    get() {
      const { hoursForRange, minutes, period, hour12 } = this.getProperties("hoursForRange", "minutes", "period", "hour12");
      const hoursValue   = isNone(hoursForRange) ? '--' : pad(hoursForRange);
      const minutesValue = isNone(minutes)       ? '--' : pad(minutes);

      let str = `${hoursValue}:${minutesValue}`;
      if (hour12) {
        const periodValue = isNone(period) ? '--' : period; // format?
        str = `${str} ${periodValue}`;
      }
      return str;
    }
  }),

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
      this.set("hours", mod(hours + amnt, 24));
    }

    this.valueChanged();
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
      this.set("hours", Math.min(current * 10 + hours, 24 - 1));
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
    const currentPeriod = this.get("period");
    if (currentPeriod === period) {
      return;
    }

    const currentHours = this.get("hours");
    let hours;
    if (!isNone(currentHours)) {
      if (period === "am") {
        hours = currentHours - 12;
      } else {
        hours = currentHours + 12;
      }
    }

    this.setProperties({
      period, hours
    });

    this.valueChanged();
  },

  // translates 24 hour to 12 hour if necessary
  // TODO - store everything internally as 24 hour so we don't need to do this here
  didReceiveAttrs() {
    this._super();

    const value = this.get("value");
    let hours   = null;
    let minutes = null;
    let period  = "am";

    if (value) {
      hours   = get(value, "hours");
      minutes = get(value, "minutes");
      if (hours >= 12) {
        period = "pm";
      }
    }

    this.setProperties({
      hours, minutes, period
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

    let { hours, minutes } = this.getProperties("hours", "minutes");

    this.get("on-change")({
      hours, minutes
    });
  },

  updateDOMValue() {
    const value = this.get("_value");
    const element = this.get("element");
    element.value = value;

    // trigger standard events in-case anything else is listening
    element.dispatchEvent(new Event("input"));
    element.dispatchEvent(new Event("change"));
  }

});
