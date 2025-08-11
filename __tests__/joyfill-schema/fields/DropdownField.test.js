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

describe('DropdownField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with options array and string value.', () => {
      const fields = [{ _id: 'f3', file: 'file_1', type: 'dropdown', options: [{ _id: 'o1', value: 'A' }], value: 'A' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
