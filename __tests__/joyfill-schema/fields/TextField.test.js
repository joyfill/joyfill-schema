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

describe('TextField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with minimal valid TextField.', () => {
      const fields = [{ _id: 'f1', file: 'file_1', type: 'text' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('required properties', () => {
    it('Should fail when required `file` is missing.', () => {
      const fields = [{ _id: 'f1', type: 'text' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });
});
