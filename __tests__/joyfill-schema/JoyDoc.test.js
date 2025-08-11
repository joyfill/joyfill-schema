const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeValidJoyDoc(overrides = {}) {
  return {
    files: [
      {
        _id: 'file_1',
        name: 'Main File',
        styles: {},
        pages: [],
        pageOrder: []
      }
    ],
    fields: [],
    ...overrides
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('JoyDoc JSON Schema Validation', () => {
  // Required properties
  describe('Required properties', () => {
    it('Should fail validation when files property is missing.', () => {
      const doc = makeValidJoyDoc();
      delete doc.files;
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when fields property is missing.', () => {
      const doc = makeValidJoyDoc();
      delete doc.fields;
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when files is not an array.', () => {
      const doc = makeValidJoyDoc({ files: 'not-an-array' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when fields is not an array.', () => {
      const doc = makeValidJoyDoc({ fields: 'not-an-array' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when files is an empty array.', () => {
      const doc = makeValidJoyDoc({ files: [] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when files has more than one valid object.', () => {
      const extraFile = {
        _id: 'file_2',
        name: 'Second File',
        styles: {},
        pages: [],
        pageOrder: []
      };
      const doc = makeValidJoyDoc({ files: [
        {
          _id: 'file_1',
          name: 'Main File',
          styles: {},
          pages: [],
          pageOrder: []
        },
        extraFile
      ]});
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation with minimal valid JoyDoc.', () => {
      const doc = makeValidJoyDoc();
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // Optional properties
  describe('Optional properties', () => {
    it('Should pass validation when _id is present.', () => {
      const doc = makeValidJoyDoc({ _id: 'joydoc_1' });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when type, identifier, name, createdOn, deleted are present.', () => {
      const doc = makeValidJoyDoc({
        type: 'main',
        identifier: 'doc-123',
        name: 'Test Doc',
        createdOn: Date.now(),
        deleted: false
      });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when formulas is present as an array.', () => {
      const doc = makeValidJoyDoc({
        formulas: [
          {
            _id: 'formula_1',
            desc: 'Sum',
            type: 'calc',
            scope: 'global',
            expression: 'A+B'
          }
        ]
      });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when metadata is present.', () => {
      const doc = makeValidJoyDoc({ metadata: { foo: 'bar', bar: 123, baz: true, qux: [1, 2, 3] } });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when unknown properties are present.', () => {
      const doc = makeValidJoyDoc({ foo: 'bar', extra: 123 });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // Type checks for optional properties
  describe('Type checks for optional properties', () => {
    it('Should fail validation when _id is not a string.', () => {
      const doc = makeValidJoyDoc({ _id: 123 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when type is not a string.', () => {
      const doc = makeValidJoyDoc({ type: 456 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when identifier is not a string.', () => {
      const doc = makeValidJoyDoc({ identifier: {} });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when name is not a string.', () => {
      const doc = makeValidJoyDoc({ name: [] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when createdOn is not a number.', () => {
      const doc = makeValidJoyDoc({ createdOn: 'not-a-number' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when deleted is not a boolean.', () => {
      const doc = makeValidJoyDoc({ deleted: 'nope' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when formulas is not an array.', () => {
      const doc = makeValidJoyDoc({ formulas: 'not-an-array' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when metadata is not an object.', () => {
      const doc = makeValidJoyDoc({ metadata: 'not-an-object' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // Forward compatibility
  describe('Forward compatibility', () => {
    it('Should allow additional properties at the top level.', () => {
      const doc = makeValidJoyDoc({ customProp: { foo: 'bar' } });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
