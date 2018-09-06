import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupThemeTest from "dummy/tests/helpers/setup-theme-test";

module(
  "Integration | Component | validated-button/-themes/bootstrap/button",
  function(hooks) {
    setupRenderingTest(hooks);
    setupThemeTest(hooks, "bootstrap");

    test("it renders", async function(assert) {
      await render(
        hbs`{{validated-button/-themes/bootstrap/button label='Test'}}`
      );

      assert.dom("button").hasText("Test");
      assert.dom("button").hasClass("btn");
      assert.dom("button").hasClass("btn-default");
    });

    test("it renders in block style", async function(assert) {
      await render(hbs`
        {{#validated-button/-themes/bootstrap/button}}Test{{/validated-button/-themes/bootstrap/button}}
      `);

      assert.dom("button").hasText("Test");
    });

    test("it renders a primary button for submit buttons", async function(assert) {
      await render(
        hbs`{{validated-button/-themes/bootstrap/button label='Test' type='submit'}}`
      );

      assert.dom("button").hasClass("btn-primary");
    });
  }
);