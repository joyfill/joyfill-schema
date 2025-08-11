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

describe('DateField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass when value is number or null and format is valid.', () => {
      const fields = [{ _id: 'f5', file: 'file_1', type: 'date', value: null, format: 'MM/DD/YYYY' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
