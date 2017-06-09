import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import UserValidations from 'dummy/validations/user';

moduleForComponent('validated-form', 'Integration | Component | validated form', {
  integration: true
});

test('it renders simple inputs', function(assert) {
  this.render(hbs`
    {{#validated-form as |f|}}
      {{f.input label="First name"}}
    {{/validated-form}}
  `);

  assert.equal(this.$('form label').text().trim(), 'First name');
  assert.equal(this.$('form input').attr('type'), 'text');
});

test('it renders textareas', function(assert) {
  this.render(hbs`
    {{#validated-form as |f|}}
      {{f.input type="textarea" label="my label"}}
    {{/validated-form}}
  `);

  assert.equal(this.$('form label').text().trim(), 'my label');
  assert.equal(this.$('form textarea').length, 1);
});

test('it renders a radio group', function(assert) {
  this.set('buttonGroupData', {
    options: [
      { key: '1', label: 'Option 1'},
      { key: '2', label: 'Option 2'},
      { key: '3', label: 'Option 3'},
    ]
  });

  this.render(hbs`
    {{#validated-form as |f|}}
      {{f.input type='radioGroup' label='Options' name='testOptions' options=buttonGroupData.options}}
    {{/validated-form}}
  `);

  assert.equal(this.$('input[type="radio"]').length, 3);
  assert.equal(this.$('label').eq(0).text().trim(), 'Options');
  assert.equal(this.$('label').eq(1).text().trim(), 'Option 1');
  assert.equal(this.$('label').eq(2).text().trim(), 'Option 2');
  assert.equal(this.$('label').eq(3).text().trim(), 'Option 3');
});

test('it renders a radio group with block form', function(assert) {
  this.set('buttonGroupData', {
    options: [
      { key: '1', label: 'Option 1'},
      { key: '2', label: 'Option 2'},
      { key: '3', label: 'Option 3'},
    ]
  });

  this.render(hbs`
    {{#validated-form as |f|}}
      {{#f.input type='radioGroup' label='Options' name='testOptions' options=buttonGroupData.options as |option|}}
        {{option.label}} - block form
      {{/f.input}}
    {{/validated-form}}
  `);

  assert.equal(this.$('input[type="radio"]').length, 3);
  assert.equal(this.$('label').eq(0).text().trim(), 'Options');
  assert.equal(this.$('label').eq(1).text().trim(), 'Option 1 - block form');
  assert.equal(this.$('label').eq(2).text().trim(), 'Option 2 - block form');
  assert.equal(this.$('label').eq(3).text().trim(), 'Option 3 - block form');
  assert.equal(this.$('.radio').hasClass('selected'), false);
});

test('it renders a radio group with block form and i18n support', function(assert) {
  this.container.registry.registrations['helper:t'] = Ember.Helper.helper(function(arg){
    const key = arg[0];
    switch(key) {
      case 'label.foo':
        return 'Option One';        
      case 'label.bar':
        return 'Option Two';
      case 'label.baz':
        return 'Option Three';  
      default:
        return false;   
    } 
  });

  this.set('buttonGroupData', {
    options: [
      { key: '1', label: 'label.foo'},
      { key: '2', label: 'label.bar'},
      { key: '3', label: 'label.baz'},
    ]
  });

  this.render(hbs`
    {{#validated-form as |f|}}
      {{#f.input type='radioGroup' label='Options' name='testOptions' options=buttonGroupData.options as |option|}}
        {{t option.label}} - block form
      {{/f.input}}
    {{/validated-form}}
  `);

  assert.equal(this.$('input[type="radio"]').length, 3);
  assert.equal(this.$('label').eq(0).text().trim(), 'Options');
  assert.equal(this.$('label').eq(1).text().trim(), 'Option One - block form');
  assert.equal(this.$('label').eq(2).text().trim(), 'Option Two - block form');
  assert.equal(this.$('label').eq(3).text().trim(), 'Option Three - block form');

  this.container.registry.registrations['helper:t'] = null;
});

test('it renders a genericGroup (which works like radioGroup) with arbitrary components', function(assert) {

  this.set('groupedObjects', 
    [
      { key: 1, label: 'Option 1', subObjects: [
        { value: 10, label: 'Suboption 1-1' }, { value: 11, label: 'Suboption 1-2' }, { value: 12, label: 'Suboption 1-3' }
      ]},
      { key: 2, label: 'Option 2', subObjects: [
        { value: 20, label: 'Suboption 2-1' }, { value: 21, label: 'Suboption 2-2' }, { value: 22, label: 'Suboption 2-3' }
      ]},
      { key: 3, label: 'Option 3', subObjects: [
        { value: 30, label: 'Suboption 3-1' }, { value: 31, label: 'Suboption 3-2' }, { value: 32, label: 'Suboption 3-3' }
      ]},
    ]
  );

  this.set('selectedObject', this.get('groupedObjects')[0]);

  // this test uses a one-way-select to represent some arbitrary custom component
  this.render(hbs`
    {{#validated-form as |f| }}
      {{#f.input type='genericGroup' label='Options' name='testOptions' options=groupedObjects as |fi|}}
        <label>
          {{#one-way-select value=selectedObject
            options=fi.option.subObjects
            optionValuePath='value'
            update=fi.update 
            class='one-way-select' as |option|
          }}
            {{option.label}}        
          {{/one-way-select}}
          Select label
        </label>
      {{/f.input}}
    {{/validated-form}}
  `);

  console.log('options:');
  console.log(this.get('groupedObjects'));
  console.log('form:');
  console.log(this.$('.form'));
  console.log(this.$('.one-way-select'));

  assert.equal(this.$('.control-label').text().trim(), 'Options');
  assert.equal(this.$('.generic-group').length, 3);

  assert.equal(this.$('.one-way-select').length, 3);
  assert.equal(this.$('.one-way-select').eq(1)
    .children('option').eq(2).text().trim(), 'Suboption 2-3');
});

test('it renders a radio group with a selected-key passed in, where the option with that key is given the selected class on render', function(assert) {
  this.set('buttonGroupData', {
    options: [
      { key: '1', label: 'Option 1'},
      { key: '2', label: 'Option 2'},
      { key: '3', label: 'Option 3'},
    ],
    selected: '2'
  });

  this.render(hbs`
    {{#validated-form as |f|}}
      {{#f.input type='radioGroup' label='Options' name='testOptions' options=buttonGroupData.options selected-key=buttonGroupData.selected as |option|}}
        {{option.label}} - block form
      {{/f.input}}
    {{/validated-form}}
  `);

  assert.equal(this.$('.radio').length, 3);
  assert.equal(this.$('.radio').eq(0).hasClass('selected'), false);
  assert.equal(this.$('.radio').eq(1).hasClass('selected'), true);
  assert.equal(this.$('.radio').eq(2).hasClass('selected'), false);
});

test('it renders a genericGroup with a selected-key passed in, where the option with that key is given the selected class on render', function(assert) {

  this.set('groupedObjects', 
    [
      { key: 1, label: 'Option 1', subObjects: [
        { value: 10, label: 'Suboption 1-1' }, { value: 11, label: 'Suboption 1-2' }, { value: 12, label: 'Suboption 1-3' }
      ]},
      { key: 2, label: 'Option 2', subObjects: [
        { value: 20, label: 'Suboption 2-1' }, { value: 21, label: 'Suboption 2-2' }, { value: 22, label: 'Suboption 2-3' }
      ]},
      { key: 3, label: 'Option 3', subObjects: [
        { value: 30, label: 'Suboption 3-1' }, { value: 31, label: 'Suboption 3-2' }, { value: 32, label: 'Suboption 3-3' }
      ]},
    ]
  );

  this.set('selectedObject', this.get('groupedObjects')[1]);

  // this test uses a one-way-select to represent some arbitrary custom component
  this.render(hbs`
    {{#validated-form as |f| }}
      {{#f.input type='genericGroup' label='Options' name='testOptions' options=groupedObjects selected-key=selectedObject.key as |fi|}}
        <label>
          {{#one-way-select value=selectedObject
            options=fi.option.subObjects
            optionValuePath='value'
            update=fi.update 
            class='one-way-select' as |option|
          }}
            {{option.label}}        
          {{/one-way-select}}
          Select label
        </label>
      {{/f.input}}
    {{/validated-form}}
  `);

  this.on('update', function(){
    assert.equal(this.$('.generic-group').eq(1).hasClass('selected'), false);
    assert.equal(this.$('.generic-group').eq(2).hasClass('selected'), true);
  });

  assert.equal(this.$('.generic-group').length, 3);
  assert.equal(this.$('.generic-group').eq(0).hasClass('selected'), false);
  assert.equal(this.$('.generic-group').eq(1).hasClass('selected'), true);
  assert.equal(this.$('.generic-group').eq(2).hasClass('selected'), false);

  this.$('.generic-group').eq(2).children('.one-way-select').prop('selectedIndex', 2);

});

test('it renders submit buttons', function(assert) {
  this.on('stub', function() {});

  this.render(hbs`
    {{#validated-form
      on-submit=(action "stub")
      as |f|}}
      {{f.input label="First name"}}
      {{f.submit label="Save!"}}
    {{/validated-form}}
  `);

  assert.equal(this.$('form button').attr('type'), 'submit');
  assert.equal(this.$('form button').text().trim(), 'Save!');
});

test('it renders a hint using a different class from the help block', function(assert){
  /* this test depends on having 'help' and 'hint' set to different
     class names in config/environment.js. I can't figure out how to
     mock that file... */
  this.render(hbs`
    {{#validated-form as |f|}}
      {{f.input label="First name" hint="Not your middle name!"}}
    {{/validated-form}}
  `);

  assert.equal(this.$('.help-block').length, 0);
  assert.equal(this.$('.hint').length, 1);
  assert.equal(this.$('.hint').text().trim(), 'Not your middle name!');
});

test('does not render a <p> tag for buttons if no callbacks were passed', function(assert) {
  this.render(hbs`
    {{#validated-form as |f|}}
      {{f.input label="First name"}}
    {{/validated-form}}
  `);

  assert.equal(this.$('form > p').length, 0);
});

test('it supports default button labels with i18n support', function(assert) {
  this.on('stub', function() {});

  this.registry.register('service:i18n', Ember.Object.extend({
    t(key) {
      return key === 'label.save' ? 'Speichern' : '';
    }
  }));

  this.render(hbs`
    {{#validated-form
      on-submit=(action "stub")
      as |f|}}
      {{f.submit}}
    {{/validated-form}}
  `);

  assert.equal(this.$('form button').first().text().trim(), 'Speichern');
});

test('it supports default button labels without i18n support', function(assert) {
  this.on('stub', function() {});

  this.render(hbs`
    {{#validated-form
      on-submit=(action "stub")
      as |f|}}
      {{f.submit}}
    {{/validated-form}}
  `);

  assert.equal(this.$('form button').first().text().trim(), 'label.save');
});

test('it performs basic validations on submit', function(assert) {
  this.on('submit', function() {});
  this.set('UserValidations', UserValidations);

  const store = this.container.lookup('service:store');
  Ember.run(() => {
    this.set('model', store.createRecord('user', {
      firstName: 'x'
    }));
  });

  this.render(hbs`
    {{#validated-form
      model=(changeset model UserValidations)
      on-submit=(action "submit")
      as |f|}}
      {{f.input label="First name" name="firstName"}}
      {{f.submit}}
    {{/validated-form}}
  `);
  assert.equal(this.$('span.help-block').length, 0);
  this.$('button').click();
  assert.equal(this.$('input').val(), 'x');
  assert.equal(this.$('span.help-block').length, 1);
  assert.equal(this.$('span.help-block').text(),
    'First name must be between 3 and 40 characters');
});

test('it performs basic validations on focus out', function(assert) {
  this.on('submit', function() {});
  this.set('UserValidations', UserValidations);

  const store = this.container.lookup('service:store');
  Ember.run(() => {
    this.set('model', store.createRecord('user'));
  });

  this.render(hbs`
    {{#validated-form
      model=(changeset model UserValidations)
      on-submit=(action "submit")
      as |f|}}
      {{f.input label="First name" name="firstName"}}
    {{/validated-form}}
  `);
  assert.equal(this.$('span.help-block').length, 0);
  this.$('input').blur();

  assert.equal(this.$('span.help-block').length, 1);
  assert.equal(this.$('span.help-block').text(),
    'First name can\'t be blank');
});
