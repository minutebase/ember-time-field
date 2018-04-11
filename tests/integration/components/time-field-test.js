import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | time-field', function(hooks) {
  setupRenderingTest(hooks);

  module('without a value', function() {
    test('it renders a placeholder for 24 hour', async function(assert) {
      await render(hbs`{{time-field}}`);
      assert.equal(this.element.querySelector('input').value, '--:--');
    });

    test('it renders a placeholder, defaulting to am for 12 hour', async function(assert) {
      await render(hbs`{{time-field hour12=true}}`);
      assert.equal(this.element.querySelector('input').value, '--:-- am');
    });
  });

  module('with a value', function() {
    test('it renders 24 hour by default', async function(assert) {
      this.set('time', { hours: 14, minutes: 45 });
      await render(hbs`{{time-field value=time}}`);
      assert.equal(this.element.querySelector('input').value, '14:45');
    });

    test('it renders 12 hour', async function(assert) {
      this.set('time', { hours: 14, minutes: 45 });
      await render(hbs`{{time-field value=time hour12=true}}`);
      assert.equal(this.element.querySelector('input').value, '02:45 pm');
    });
  });

});
