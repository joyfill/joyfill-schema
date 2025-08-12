/**
 * BaseField JSON Schema Validation
 * Organized by property type (required, string, boolean, object, array, etc.)
 * to match the structure of File.test.js and Page.test.js
 */
const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

// Helper to create a minimal BaseField object
function makeBaseField(overrides = {}) {
  return {
    _id: 'bf1',
    file: 'file_1',
    type: 'text',
    ...overrides
  };
}

function baseDoc(fields) {
  return { files: [ { _id: 'file_1', pages: [], pageOrder: [] } ], fields };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('BaseField JSON Schema Validation (via TextField)', () => {

  /**
   * IMPORTANT NOTE: Why did we include all the individual property tests in the 
   * individual field tests vs in the BaseField test?
   * 
   * The answer is that we want to test the individual field types in isolation,
   * so that we can be sure that each field type is validated correctly in the
   * JSON Schema.
   * 
   * If we put all the tests in the BaseField test, we would not be able to
   * test the individual field types in isolation thus making the JSON Schema
   * check incomplete.
   */

  describe('general', () => {
    it('Should pass with minimal valid field (required base props only).', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('type', () => {

    it('Should pass when type is a valid string value', () => {
      const validTypes = [
        'image',
        'richText',
        'file',
        'text',
        'textarea',
        'number',
        'dropdown',
        'multiSelect',
        'date',
        'signature',
        'table',
        'chart',
        'collection',
        'block',
        'rte',
        'customType1', // test for custom/unknown types
        'anotherCustomType'
      ];
      for (const type of validTypes) {
        const field = makeBaseField({ type });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when type is missing', () => {
      const { type, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when type is not a string', () => {
      const field = makeBaseField({ type: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

  });

  describe('forward compatibility', () => {
    it('Should pass when unknown properties are present in BaseField', () => {
      const field = makeBaseField({ foo: 'bar', extra: 123 });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

});
