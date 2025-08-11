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

describe('NumberField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass when value is a number.', () => {
      const fields = [{ _id: 'f2', file: 'file_1', type: 'number', value: 10 }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(true);
    });
    it('Should pass when value is empty string.', () => {
      const fields = [{ _id: 'f2', file: 'file_1', type: 'number', value: '' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(true);
    });
  });
});
