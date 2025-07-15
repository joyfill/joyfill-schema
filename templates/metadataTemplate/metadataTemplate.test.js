const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

// Load the schema
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../../joyfill-schema.json'), 'utf8'));

// Load the template to test
const template = JSON.parse(fs.readFileSync(path.join(__dirname, 'metadataTemplate.json'), 'utf8'));

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
