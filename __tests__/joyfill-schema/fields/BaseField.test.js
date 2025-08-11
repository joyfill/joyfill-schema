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

describe('BaseField JSON Schema Validation (via TextField)', () => {
  describe('general', () => {
    it('Should pass with minimal valid field (required base props only).', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text' }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('required properties', () => {
    it('Should fail when _id is missing.', () => {
      const fields = [{ file: 'file_1', type: 'text' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
    it('Should fail when file is missing.', () => {
      const fields = [{ _id: 'bf1', type: 'text' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
    it('Should fail when type is missing.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });

  describe('optional properties (valid types)', () => {
    it('Should pass with all common optional properties present and valid.', () => {
      const fields = [{
        _id: 'bf1', file: 'file_1', type: 'text',
        identifier: 'id-1',
        title: 'Title',
        description: 'Desc',
        required: true,
        tipTitle: 'Tip',
        tipDescription: 'Tip desc',
        tipVisible: true,
        metadata: { a: 1 },
        hidden: false,
        disabled: false,
        logic: {
          action: 'show',
          eval: 'and',
          conditions: [{ file: 'file_1', page: 'p1', field: 'bf1', condition: '=', value: 'x' }]
        },
        formulas: [{ _id: 'fm1', key: 'value', formula: '1+1' }]
      }];
      // Add the referenced page to avoid missing refs for logic conditions
      const doc = {
        files: [ { _id: 'file_1', pages: [ { _id: 'p1', name: 'P', fieldPositions: [], width: 1, height: 1, cols: 1, rowHeight: 1, layout: 'g', presentation: 'n' } ], pageOrder: ['p1'] } ],
        fields
      };
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('optional properties (invalid types)', () => {
    it('Should fail when identifier is not a string.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text', identifier: {} }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
    it('Should fail when required is not a boolean.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text', required: 'yes' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
    it('Should fail when metadata is not an object.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text', metadata: 'nope' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
    it('Should fail when hidden is not a boolean.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text', hidden: 'nope' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
    it('Should fail when disabled is not a boolean.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text', disabled: 'nope' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
    it('Should fail when formulas is not an array.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text', formulas: 'expr' }];
      const { isValid } = runValidation(baseDoc(fields));
      expect(isValid).toBe(false);
    });
  });

  describe('Forward compatibility', () => {
    it('Should pass with unknown properties present.', () => {
      const fields = [{ _id: 'bf1', file: 'file_1', type: 'text', foo: { bar: 1 } }];
      const { isValid, errors } = runValidation(baseDoc(fields));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
