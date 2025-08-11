const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeTableField(overrides = {}) {
  return {
    _id: 'tf1',
    file: 'file_1',
    type: 'table',
    value: [{ _id: 'r1' }],
    rowOrder: ['r1'],
    tableColumns: [{ _id: 'c1', type: 'text' }],
    tableColumnOrder: ['c1'],
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

describe('TableField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with minimal valid TableField.', () => {
      const { isValid, errors } = runValidation(baseDoc([makeTableField()]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('required properties', () => {
    const required = ['value', 'rowOrder', 'tableColumns', 'tableColumnOrder'];
    for (const prop of required) {
      it(`Should fail when ${prop} is missing.`, () => {
        const tf = makeTableField();
        delete tf[prop];
        const { isValid } = runValidation(baseDoc([tf]));
        expect(isValid).toBe(false);
      });
    }
  });

  describe('columns', () => {
    it('Should pass with NumberColumn.', () => {
      const tf = makeTableField({ tableColumns: [{ _id: 'c1', type: 'number' }] });
      const { isValid } = runValidation(baseDoc([tf]));
      expect(isValid).toBe(true);
    });
    it('Should pass with DropdownColumn and options.', () => {
      const tf = makeTableField({ tableColumns: [{ _id: 'c1', type: 'dropdown', options: [{ _id: 'o1', value: 'A' }] }] });
      const { isValid } = runValidation(baseDoc([tf]));
      expect(isValid).toBe(true);
    });
    it('Should fail with invalid column type.', () => {
      const tf = makeTableField({ tableColumns: [{ _id: 'c1', type: 'bad' }] });
      const { isValid } = runValidation(baseDoc([tf]));
      expect(isValid).toBe(false);
    });
  });
});
