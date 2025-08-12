
const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeBaseField(overrides = {}) {
  return {
    _id: 'cf1',
    file: 'file_1',
    type: 'collection',
    schema: {
      s1: { root: true, tableColumns: [{ _id: 'c1', type: 'text' }] }
    },
    value: [{ _id: 'item1' }],
    ...overrides
  };
}


function baseDoc(fields) {
  return { files: [ { _id: 'file_1', pages: [], pageOrder: [] } ], fields };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('CollectionField JSON Schema Validation (via CollectionField)', () => {

  describe('general', () => {
    it('Should pass with minimal valid field (required base props only).', () => {
      const { isValid, errors } = runValidation(baseDoc([makeBaseField()]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('forward compatibility', () => {
    it('Should pass when unknown properties are present in BaseField', () => {
      const field = makeBaseField({ foo: 'bar', extra: 123 });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('type', () => {
    it('Should pass when type is collection', () => {
      const field = makeBaseField({ type: 'collection' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('schema', () => {

    it('Should pass when schema is an object with required properties', () => {
      const field = makeBaseField({ 
        schema: { 
          root: { root: true, tableColumns: [{ _id: 'c1', type: 'text' }], children: ['s1'] },
          s1: { tableColumns: [{ _id: 'c2', type: 'text' }] }
        } 
      });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when schema is not an object', () => {
      const field = makeBaseField({ schema: 'not-an-object' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when schema is missing required properties', () => {
      const field = makeBaseField({ schema: { root: { root: true } } });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when schema definition is not an object', () => {
      const field = makeBaseField({ schema: 'not-an-object' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    //See additional SchemaDefinition tests below.

  });

  describe('value', () => {
    it('Should pass when value is an array of objects with required properties', () => {
      const field = makeBaseField({ 
        value: [
          { _id: 'r1', cells: { c1: 'Hello, world!' } }, 
          { _id: 'r2', cells: { c1: 'Hello, world!' } }
        ] 
      });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when value is an empty array', () => {
      const field = makeBaseField({ value: [] });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when value is omitted', () => {
      const field = makeBaseField();
      delete field.value;
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when value is not an array', () => {
      const field = makeBaseField({ value: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it("Should fail when value array doesn't have valid objects", () => {
      // value contains a string instead of an object
      const field1 = makeBaseField({ value: ['not-an-object'] });
      const result1 = runValidation(baseDoc([field1]));
      expect(result1.isValid).toBe(false);
    });

    it('Should fail when value is not an array of objects with required properties', () => {
      const field1 = makeBaseField({ value: [{ cells: { c1: 'Hello, world!' } }] });
      const result1 = runValidation(baseDoc([field1]));
      expect(result1.isValid).toBe(false);
    });

    describe('CollectionItem', () => {

      describe('forward compatibility', () => {
        it('Should pass when unknown properties are present', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', cells: { c1: 'Hello, world!' }, unknownProperty: 'unknownValue' }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(true);
        });
      });

      describe('_id property', () => {

        it('Should pass when _id is a string', () => {
          const field = makeBaseField({ value: [{ _id: 'r1' }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(true);
        });

        it('Should fail when _id is missing', () => {
          const field = makeBaseField({ value: [{ cells: { c1: 'Hello, world!' } }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(false);
        });

        it('Should fail when _id is empty', () => {
          const field = makeBaseField({ value: [{ _id: '' }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(false);
        });

        it('Should fail when _id is not a string', () => {
          const field = makeBaseField({ value: [{ _id: 123 }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(false);
        });

      });

      describe('cells property', () => {

        it('Should pass when cells is an object', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', cells: { c1: 'Hello, world!' } }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(true);
        });

        it('Should fail when cells is not an object', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', cells: 'not-an-object' }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(false);
        });

        it('Should pass when cells is an empty object', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', cells: {} }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(true);
        });

      });

      describe('children property', () => {
        it('Should pass when children is an object with a value property that is an array', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', children: { s1: { value: [{ _id: 'r2' }] } } }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(true);
        });

        it('Should fail when children is not an object', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', children: 'not-an-object' }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(false);
        });

        it('Should pass when children is an empty object', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', children: {} }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(true);
        });

        it('Should fail when children is an object with an invalid value property', () => {
          const field = makeBaseField({ value: [{ _id: 'r1', children: { s1: { value: [{ }] } } }] });
          const result = runValidation(baseDoc([field]));
          expect(result.isValid).toBe(false);
        });
      });

    });
  });

  describe('_id', () => {
    it('Should pass when _id is a string', () => {
      const field = makeBaseField({ _id: 'fld_123' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when _id is missing', () => {
      const { _id, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is empty', () => {
      const field = makeBaseField({ _id: '' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is not a string', () => {
      const field = makeBaseField({ _id: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is not a string', () => {
      const field = makeBaseField({ _id: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('file', () => {
    it('Should pass when file is a string', () => {
      const field = makeBaseField({ file: 'file_1' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when file is missing', () => {
      const { file, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when file is not a string', () => {
      const field = makeBaseField({ file: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('identifier', () => {
    it('Should pass when identifier is missing (optional)', () => {
      const { identifier, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when identifier is a string', () => {
      const field = makeBaseField({ identifier: 'my_identifier' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when identifier is not a string', () => {
      const field = makeBaseField({ identifier: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('title', () => {
    it('Should pass when title is missing (optional)', () => {
      const { title, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when title is a string', () => {
      const field = makeBaseField({ title: 'My Field Title' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when title is not a string', () => {
      const field = makeBaseField({ title: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('description', () => {
    it('Should pass when description is missing (optional)', () => {
      const { description, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when description is a string', () => {
      const field = makeBaseField({ description: 'A description' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when description is not a string', () => {
      const field = makeBaseField({ description: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('required', () => {
    it('Should pass when required is missing (optional)', () => {
      const { required, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when required is true', () => {
      const field = makeBaseField({ required: true });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when required is false', () => {
      const field = makeBaseField({ required: false });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when required is not a boolean', () => {
      const field = makeBaseField({ required: 'yes' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('tipTitle', () => {
    it('Should pass when tipTitle is missing (optional)', () => {
      const { tipTitle, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tipTitle is a string', () => {
      const field = makeBaseField({ tipTitle: 'Tip Title' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when tipTitle is not a string', () => {
      const field = makeBaseField({ tipTitle: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('tipDescription', () => {
    it('Should pass when tipDescription is missing (optional)', () => {
      const { tipDescription, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tipDescription is a string', () => {
      const field = makeBaseField({ tipDescription: 'Tip Description' });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when tipDescription is not a string', () => {
      const field = makeBaseField({ tipDescription: 123 });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('tipVisible', () => {
    it('Should pass when tipVisible is missing (optional)', () => {
      const { tipVisible, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tipVisible is true', () => {
      const field = makeBaseField({ tipVisible: true });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tipVisible is false', () => {
      const field = makeBaseField({ tipVisible: false });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when tipVisible is not a boolean', () => {
      const field = makeBaseField({ tipVisible: 'yes' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('metadata', () => {
    it('Should pass when metadata is missing (optional)', () => {
      const { metadata, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when metadata is an object', () => {
      const field = makeBaseField({ metadata: { foo: 'bar', count: 2, isActive: true, isArray: [1, 2, 3] } });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when metadata is an empty object', () => {
      const field = makeBaseField({ metadata: {} });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when metadata is not an object', () => {
      const field = makeBaseField({ metadata: 'not-an-object' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('logic', () => {
    it('Should pass when logic is missing (optional)', () => {
      const { logic, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when logic is a valid object (with action, eval, and conditions)', () => {
      const field = makeBaseField({ logic: { action: 'show', eval: 'and', conditions: [{ file: 'file_1', page: 'page_1', field: 'field_1', condition: '=', value: 'value_1' }] } });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when logic is not a valid object', () => {
      const field = makeBaseField({ logic: { conditions: [] } });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when logic is not an object', () => {
      const field = makeBaseField({ logic: 'not-an-object' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('hidden', () => {
    it('Should pass when hidden is missing (optional)', () => {
      const { hidden, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when hidden is true', () => {
      const field = makeBaseField({ hidden: true });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when hidden is false', () => {
      const field = makeBaseField({ hidden: false });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when hidden is not a boolean', () => {
      const field = makeBaseField({ hidden: 'yes' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('disabled', () => {
    it('Should pass when disabled is missing (optional)', () => {
      const { disabled, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when disabled is true', () => {
      const field = makeBaseField({ disabled: true });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when disabled is false', () => {
      const field = makeBaseField({ disabled: false });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when disabled is not a boolean', () => {
      const field = makeBaseField({ disabled: 'no' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });
  });

  describe('formulas', () => {

    it('Should pass when formulas is missing (optional)', () => {
      const { formulas, ...rest } = makeBaseField();
      const field = { ...rest };
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when formulas is an array of objects', () => {
      const formulas = [
        { _id: 'f1', key: 'value', formula: 'formula_id' },
        { _id: 'f2', key: 'value', formula: 'formula_id_2' }
      ];
      const field = makeBaseField({ formulas });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when formulas is an empty array', () => {
      const field = makeBaseField({ formulas: [] });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when formulas is not an array', () => {
      const field = makeBaseField({ formulas: 'not-an-array' });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should fail when formulas contains a non-object', () => {
      const field = makeBaseField({ formulas: [{ _id: 'f1', key: 'value', formula: 'formula_id' }, 'not-an-object'] });
      const { isValid } = runValidation(baseDoc([field]));
      expect(isValid).toBe(false);
    });

    it('Should pass when unknown properties are present in formulas', () => {
      const field = makeBaseField({ formulas: [{ _id: 'f1', key: 'value', formula: 'formula_id', unknownProperty: 'unknownValue' }] });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when key is a valid string', () => {
      const field = makeBaseField({ formulas: [{ _id: 'f1', key: 'futureCustomKey', formula: 'formula_id', unknownProperty: 'unknownValue' }] });
      const { isValid, errors } = runValidation(baseDoc([field]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('SchemaDefinition', () => {
    describe('forward compatibility', () => {
      it('Should pass when unknown properties are present in SchemaDefinition', () => {
        const field = makeBaseField({ schema: { schemaOne: { unknownProperty: 'unknownValue', tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });
    });

    describe('root property', () => {

      it('Should pass if root boolean property is omitted', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should pass when root is true', () => {
        const field = makeBaseField({ schema: { schemaOne: { root: true, tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should fail when root is not a boolean', () => {
        const field = makeBaseField({ schema: { schemaOne: { root: 'yes', tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });

    });

    describe('title property', () => {
      it('Should pass when title is omitted (optional)', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should pass when title is a string', () => {
        const field = makeBaseField({ schema: { schemaOne: { title: 'Schema One', tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should fail when title is not a string', () => {
        const field = makeBaseField({ schema: { schemaOne: { title: 123, tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });
    });

    describe('identifier property', () => {
      it('Should pass when identifier is omitted (optional)', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should pass when identifier is a string', () => {
        const field = makeBaseField({ schema: { schemaOne: { identifier: 'schemaOne', tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should fail when identifier is not a string', () => {
        const field = makeBaseField({ schema: { schemaOne: { identifier: 123, tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });
    });

    describe('tableColumns property', () => {
      it('Should pass when tableColumns is an array of objects with required properties', () => {
        const field = makeBaseField({ 
          schema: { 
            schemaOne: { 
              tableColumns: [
                { _id: 'c1', type: 'text' }, 
                { _id: 'c2', type: 'number' },
                { _id: 'c3', type: 'date' },
                { _id: 'c4', type: 'image' },
                { _id: 'c5', type: 'signature' },
                { _id: 'c6', type: 'multiSelect' },
                { _id: 'c7', type: 'dropdown' },
                { _id: 'c8', type: 'block' },
                { _id: 'c9', type: 'barcode' },
                { _id: 'c10', type: 'custom' }
              ] 
            } 
          } 
        });

        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should pass when tableColumns is an empty array', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: [] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should fail when tableColumns is not an array', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: 'not-an-array' } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });

      it('Should fail when tableColumns contains a non-object', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: ['not-an-object'] } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });
    });

    describe('children property', () => {
      it('Should pass when children is omitted (optional)', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should pass when children is an empty array', () => {
        const field = makeBaseField({ schema: { schemaOne: { children: [], tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }); 

      it('Should pass when children is an array of strings', () => {
        const field = makeBaseField({ schema: { schemaOne: { children: ['s1'], tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should fail when children is not an array', () => {
        const field = makeBaseField({ schema: { schemaOne: { children: 'not-an-array', tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });

      it('Should fail when children contains a non-string', () => {
        const field = makeBaseField({ schema: { schemaOne: { children: [123], tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });

    });

    describe('logic property', () => {

      it('Should pass when logic is omitted (optional)', () => {
        const field = makeBaseField({ schema: { schemaOne: { tableColumns: [{ _id: 'c1', type: 'text' }] } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should pass when logic is a valid object (with action, eval, and conditions)', () => {
        const field = makeBaseField({ 
          schema: { schemaOne: { 
            logic: { action: 'show', eval: 'and', conditions: [{ schema: 's1', column: 'c1', condition: '=', value: 'value_1' }] },
            tableColumns: [{ _id: 'c1', type: 'text' }]
          } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      ['show', 'hide', 'futureAction'].forEach(action => {
        it(`Should pass when logic action is '${action}'`, () => {
          const field = makeBaseField({ schema: {
             schemaOne: { 
              logic: { action, eval: 'and', conditions: [{ schema: 's1', column: 'c1', condition: '=', value: 'value_1' }] },
              tableColumns: [{ _id: 'c1', type: 'text' }]
            } } });
          const { isValid, errors } = runValidation(baseDoc([field]));
          if (!isValid) console.error(errors);
          expect(isValid).toBe(true);
        });
      });

      ['and', 'or', 'futureEval'].forEach(evalOption => {
        it(`Should pass when logic eval is '${evalOption}'`, () => {
          const field = makeBaseField({ schema: { 
            schemaOne: { 
              logic: { action: 'show', eval: evalOption, conditions: [{ schema: 's1', column: 'c1', condition: '=', value: 'value_1' }] },
              tableColumns: [{ _id: 'c1', type: 'text' }]
            } } });
          const { isValid, errors } = runValidation(baseDoc([field]));
          if (!isValid) console.error(errors);
          expect(isValid).toBe(true);
        });
      });

      it('Should fail when logic condition is missing required properties', () => {
        const field = makeBaseField({ schema: { schemaOne: { 
          logic: { action: 'show', eval: 'and', conditions: [{ schema: 's1', column: 'c1' }] },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(false);
      });

      it('Should fail when any logic condition is missing required properties', () => {
        // Missing 'schema'
        let field = makeBaseField({ schema: { schemaOne: { 
          logic: { action: 'show', eval: 'and', conditions: [{ column: 'c1', condition: '=', value: 'value_1' }] },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        let { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);

        // Missing 'column'
        field = makeBaseField({ schema: { schemaOne: { 
          logic: { action: 'show', eval: 'and', conditions: [{ schema: 's1', condition: '=', value: 'value_1' }] },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        isValid = runValidation(baseDoc([field])).isValid;
        expect(isValid).toBe(false);

        // Missing 'condition'
        field = makeBaseField({ schema: { schemaOne: { 
          logic: { action: 'show', eval: 'and', conditions: [{ schema: 's1', column: 'c1', value: 'value_1' }] },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        isValid = runValidation(baseDoc([field])).isValid;
        expect(isValid).toBe(false);

        // All required present, should pass
        field = makeBaseField({ schema: { schemaOne: { 
          logic: { action: 'show', eval: 'and', conditions: [{ schema: 's1', column: 'c1', condition: '=', value: 'value_1' }] },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        isValid = runValidation(baseDoc([field])).isValid;
        expect(isValid).toBe(true);
      });

      it('Should pass when each logic.conditions[x].condition is a valid string', () => {
        const validConditions = [
          { schema: 's1', column: 'c1', condition: '=', value: 'value_1' },
          { schema: 's2', column: 'c2', condition: '!=', value: 'value_2' },
          { schema: 's3', column: 'c3', condition: 'futureCondition', value: 'value_3' }
        ];
        const field = makeBaseField({ schema: { schemaOne: { 
          logic: { action: 'show', eval: 'and', conditions: validConditions },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        const { isValid, errors } = runValidation(baseDoc([field]));
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

      it('Should pass when any logic.conditions[x].condition is valid string', () => {
        const validConditions = [
          { schema: 's1', column: 'c1', condition: '=', value: 'value_1' },
          { schema: 's2', column: 'c2', condition: 'futureCondition', value: 'value_2' }, 
          { schema: 's3', column: 'c3', condition: '!=', value: 'value_3' }
        ];
        const field = makeBaseField({ schema: { schemaOne: { 
          logic: { action: 'show', eval: 'and', conditions: validConditions },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(true);
      });

      it('Should fail if any condition in logic.conditions array is missing required properties (loop test)', () => {
        // Array with one valid and one invalid condition
        const field = makeBaseField({ schema: { schemaOne: { logic: { action: 'show', eval: 'and', conditions: [
          { schema: 's1', column: 'c1', condition: '=', value: 'value_1' },
          { schema: 's2', column: 'c2' } // missing 'condition'
        ] },
        tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });

      it('Should fail when logic is not a valid object', () => {
        const field = makeBaseField({ schema: { schemaOne: { logic: { conditions: [] },
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });

      it('Should fail when logic is not an object', () => {
        const field = makeBaseField({ schema: { schemaOne: { logic: 'not-an-object',
          tableColumns: [{ _id: 'c1', type: 'text' }]
        } } });
        const { isValid } = runValidation(baseDoc([field]));
        expect(isValid).toBe(false);
      });

    });
  });

});