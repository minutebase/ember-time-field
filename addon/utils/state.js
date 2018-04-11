import EmberObject, { computed } from '@ember/object';

export function state(klass, attrs={}) {
  return computed({
    get() {
      let manager = this.get('manager') || this;
      let parent = this;
      return klass.create(Object.assign(attrs, { manager, parent }));
    }
  });
}

export default EmberObject.extend({

  send(name, ...args) {
    if (this[name]) {
      this[name].apply(this, [this.get('manager'), ...args]);
    } else if (this.get('parent')) {
      this.get('parent').send(name, ...args);
    } else {
      throw new Error(`Unhandled event ${name}`);
    }
  }

})
