const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function baseDoc(fields) {
  return { files: [ { _id: 'file_1', pages: [], pageOrder: [] } ], fields };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('Option and TableRow JSON Schema Validation', () => {
  describe('Option via DropdownField', () => {
    it('Should pass with valid Option objects.', () => {
      const fields = [{ _id: 'f1', file: 'file_1', type: 'dropdown', options: [{ _id: 'o1', value: 'A' }], value: 'A' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when Option is missing required properties.', () => {
      const fields = [{ _id: 'f1', file: 'file_1', type: 'dropdown', options: [{ value: 'A' }], value: 'A' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });

  describe('TableRow via TableField', () => {
    it('Should pass with valid TableRow objects.', () => {
      const fields = [{ _id: 't1', file: 'file_1', type: 'table', value: [{ _id: 'r1' }], rowOrder: ['r1'], tableColumns: [{ _id: 'c1', type: 'text' }], tableColumnOrder: ['c1'] }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(true);
    });
    it('Should fail when TableRow is missing _id.', () => {
      const fields = [{ _id: 't1', file: 'file_1', type: 'table', value: [{ }], rowOrder: ['r1'], tableColumns: [{ _id: 'c1', type: 'text' }], tableColumnOrder: ['c1'] }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });
});
