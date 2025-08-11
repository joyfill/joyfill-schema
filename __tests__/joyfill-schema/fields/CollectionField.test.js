const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeCollectionField(overrides = {}) {
  return {
    _id: 'cf1',
    file: 'file_1',
    type: 'collection',
    schema: {
      root: { root: true, tableColumns: [{ _id: 'c1', type: 'text' }] }
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

describe('CollectionField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with minimal valid CollectionField.', () => {
      const { isValid, errors } = runValidation(baseDoc([makeCollectionField()]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('schema and value', () => {
    it('Should fail when schema is missing.', () => {
      const cf = makeCollectionField();
      delete cf.schema;
      const { isValid } = runValidation(baseDoc([cf]));
      expect(isValid).toBe(false);
    });
    it('Should fail when value is missing.', () => {
      const cf = makeCollectionField();
      delete cf.value;
      const { isValid } = runValidation(baseDoc([cf]));
      expect(isValid).toBe(false);
    });
  });

  describe('schema logic', () => {
    it('Should pass with SchemaLogic and conditions.', () => {
      const cf = makeCollectionField({
        schema: {
          root: {
            root: true,
            tableColumns: [{ _id: 'c1', type: 'text' }],
            logic: {
              action: 'show',
              eval: 'and',
              conditions: [
                { schema: 'root', column: 'c1', condition: '=', value: 'x' }
              ]
            }
          }
        }
      });
      const { isValid, errors } = runValidation(baseDoc([cf]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
