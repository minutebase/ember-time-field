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

  module('with required attribute', function() {
    test('it renders input without required attribute', async function(assert) {
      await render(hbs`{{time-field required=false}}`);
      assert.strictEqual(this.element.querySelector('input').getAttribute('required'), null);
    });

    test('it renders input with required attribute', async function(assert) {
      await render(hbs`{{time-field required=true}}`);
      assert.strictEqual(this.element.querySelector('input').getAttribute('required'), '');
    });
  });

  module('with disabled attribute', function() {
    test('it renders input without disabled attribute', async function(assert) {
      await render(hbs`{{time-field disabled=false}}`);
      assert.strictEqual(this.element.querySelector('input').getAttribute('disabled'), null);
    });

    test('it renders input with disabled attribute', async function(assert) {
      await render(hbs`{{time-field disabled=true}}`);
      assert.strictEqual(this.element.querySelector('input').getAttribute('disabled'), '');
    });
  });

});
