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

describe('CustomField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with minimal valid CustomField (unknown type).', () => {
      const fields = [{ _id: 'cf1', file: 'file_1', type: 'myCustomType' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass with extra properties for forward compatibility.', () => {
      const fields = [{ _id: 'cf1', file: 'file_1', type: 'myCustomType', someNewProp: { a: 1 } }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(true);
    });
  });

  describe('required properties', () => {
    it('Should fail when required `file` is missing.', () => {
      const fields = [{ _id: 'cf1', type: 'myCustomType' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });

    it('Should fail when type is missing.', () => {
      const fields = [{ _id: 'cf1', file: 'file_1' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });

  describe('property types', () => {
    it('Should fail when type is not a string.', () => {
      const fields = [{ _id: 'cf1', file: 'file_1', type: {} }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });
});
