const Ajv = require('ajv');

const schema = require('../../joyfill-schema.json');

const template = require('./PageSettingsTemplate.json');

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  allowUnionTypes: true
});

describe('pageSettingsTemplate Validation', () => {

  test('should validate Page Settings template against schema', () => {

    const validate = ajv.compile(schema);
    const isValid = validate(template);

    if (!isValid) {
      console.log('Validation errors:', validate.errors);
    }

    expect(isValid).toBe(true);
    
  });
});
