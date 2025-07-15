const Ajv = require('ajv');

// Load the schema
const schema = require('../../joyfill-schema.json');

// Load the template to test
const template = require('./pageSettingsTemplate.json');

// Initialize Ajv
const ajv = new Ajv({
  allErrors: true,
  strict: false,
  allowUnionTypes: true
});

describe('Page Settings Template Validation', () => {

  test('should validate Page Settings template against schema', () => {

    const validate = ajv.compile(schema);
    const isValid = validate(template);

    if (!isValid) {
      console.log('Validation errors:', validate.errors);
    }

    expect(isValid).toBe(true);
    
  });
});
