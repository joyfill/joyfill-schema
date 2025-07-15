const Ajv = require('ajv');

const schema = require('../../joyfill-schema.json');

const template = require('./metadataTemplate.json');

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  allowUnionTypes: true
});

describe('metadataTemplate Validation', () => {

  test('should validate metadata template against schema', () => {
    const validate = ajv.compile(schema);
    const isValid = validate(template);

    if (!isValid) {
      console.log('Validation errors:', validate.errors);
    }

    expect(isValid).toBe(true);
  });
});
