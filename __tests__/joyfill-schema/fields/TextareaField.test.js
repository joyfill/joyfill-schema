const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function baseDoc(fields) {
  return { files: [ { _id: 'file_1', pages: [], pageOrder: [] } ], fields };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('TextareaField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with minimal valid TextareaField.', () => {
      const fields = [{ _id: 'tx1', file: 'file_1', type: 'textarea' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when value is a string.', () => {
      const fields = [{ _id: 'tx1', file: 'file_1', type: 'textarea', value: 'hello' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(true);
    });
  });

  describe('required properties', () => {
    it('Should fail when required `file` is missing.', () => {
      const fields = [{ _id: 'tx1', type: 'textarea' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });

  describe('property types', () => {
    it('Should fail when value is not a string.', () => {
      const fields = [{ _id: 'tx1', file: 'file_1', type: 'textarea', value: 123 }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });
});
