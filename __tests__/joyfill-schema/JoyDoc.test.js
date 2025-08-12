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

describe('JoyDoc (Root) JSON Schema Validation', () => {
   // general
  describe('general', () => {
    it('Should pass validation with only required properties defined on JoyDoc object.', () => {
      const doc = makeValidJoyDoc();
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

  });

  describe('Forward compatibility', () => {
    it('Should allow additional properties at the top level.', () => {
      const doc = makeValidJoyDoc({ customProp: { foo: 'bar' }, customProp2: 123, customProp3: true });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // files property
  describe('files property', () => {
    it('Should fail validation when files property is missing.', () => {
      const doc = makeValidJoyDoc();
      delete doc.files;
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when files is not an array.', () => {
      const doc = makeValidJoyDoc({ files: 'not-an-array' });
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

    it('Should pass validation when exactly one valid file exists.', () => {
      const doc = makeValidJoyDoc();
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // fields property
  describe('fields property', () => {
    it('Should fail validation when fields property is missing.', () => {
      const doc = makeValidJoyDoc();
      delete doc.fields;
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when fields is not an array.', () => {
      const doc = makeValidJoyDoc({ fields: 'not-an-array' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when valid fields exist in the array.', () => {
      const fields = [
        { _id: 'fld_1', file: 'file_1', type: 'text' },
        { _id: 'fld_2', file: 'file_1', type: 'text' }
      ];
      const doc = makeValidJoyDoc({ fields });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // _id property
  describe('_id property', () => {
    it("Should pass validation when property doesn’t exist.", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when defined and value is a string.', () => {
      const doc = makeValidJoyDoc({ _id: 'joydoc_1' });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when defined but value is not a string.', () => {
      const doc = makeValidJoyDoc({ _id: 123 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // type property
  describe('type property', () => {
    it("Should pass validation when property doesn’t exist.", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when defined and value is a string.', () => {
      const doc = makeValidJoyDoc({ type: 'document' });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when defined but value is not a string.', () => {
      const doc = makeValidJoyDoc({ type: 456 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // identifier property
  describe('identifier property', () => {
    it("Should pass validation when property doesn’t exist.", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when defined and value is a string.', () => {
      const doc = makeValidJoyDoc({ identifier: 'doc-123' });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when defined but value is not a string.', () => {
      const doc = makeValidJoyDoc({ identifier: {} });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // name property
  describe('name property', () => {
    it("Should pass validation when property doesn’t exist.", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when defined and value is a string.', () => {
      const doc = makeValidJoyDoc({ name: 'Test Doc' });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when defined but value is not a string.', () => {
      const doc = makeValidJoyDoc({ name: [] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // createdOn property
  describe('createdOn property', () => {
    it("Should pass validation when property doesn’t exist.", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when defined and value is a number.', () => {
      const doc = makeValidJoyDoc({ createdOn: Date.now() });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when defined but value is not a number.', () => {
      const doc = makeValidJoyDoc({ createdOn: 'not-a-number' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // deleted property
  describe('deleted property', () => {
    it("Should pass validation when property doesn’t exist.", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when defined and value is proper type.', () => {
      const doc = makeValidJoyDoc({ deleted: false });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when defined but value is not proper type.', () => {
      const doc = makeValidJoyDoc({ deleted: 'nope' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // metadata property
  describe('metadata property', () => {
    it("Should pass validation when property doesnt exist", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when an object with any number of properties and values are used.', () => {
      const doc = makeValidJoyDoc({ metadata: { a: 1, b: 'x', nested: { k: true } } });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when metadata is empty.', () => {
      const doc = makeValidJoyDoc({ metadata: {} });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when non object data structure is used.', () => {
      const doc = makeValidJoyDoc({ metadata: 'string' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // formulas property
  describe('formulas property', () => {
    it("Should pass validation when property doesn’t exist", () => {
      const doc = makeValidJoyDoc();
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when property exists and it’s not a valid type.', () => {
      const doc = makeValidJoyDoc({ formulas: 'bad' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when property exists and it has proper type.', () => {
      const formulas = [{ _id: 'f1', desc: 'sum', type: 'calc', scope: 'global', expression: '1+1' }];
      const doc = makeValidJoyDoc({ formulas });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });


});

