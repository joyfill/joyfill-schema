const Ajv = require('ajv');

// Load the schema
const schema = require('../../joyfill-schema.json');

// Load the template to test
const template = require('./metadataTemplate.json');

// Initialize Ajv
const ajv = new Ajv({
  allErrors: true,
  strict: false,
  allowUnionTypes: true
});

describe('Metadata Template Validation', () => {

  test('should validate metadata template against schema', () => {
    const validate = ajv.compile(schema);
    const isValid = validate(template);

    if (!isValid) {
      console.log('Validation errors:', validate.errors);
    }

    expect(isValid).toBe(true);
  });
});
