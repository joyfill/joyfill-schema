const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeLogic(overrides = {}) {
  return {
    action: 'show',
    eval: 'and',
    conditions: [
      { file: 'file_1', page: 'page_1', field: 'fld_1', condition: '=', value: 'x' }
    ],
    ...overrides
  };
}

function makeDocWithPageLogic(logic) {
  return {
    files: [
      {
        _id: 'file_1',
        pages: [
          {
            _id: 'page_1',
            name: 'P',
            fieldPositions: [],
            width: 1, height: 1, cols: 1, rowHeight: 1, layout: 'g', presentation: 'n',
            logic
          }
        ],
        pageOrder: ['page_1']
      }
    ],
    fields: [{ _id: 'fld_1', file: 'file_1', type: 'text' }]
  };
}

function makeDocWithFieldLogic(logic) {
  return {
    files: [ { _id: 'file_1', pages: [], pageOrder: [] } ],
    fields: [{ _id: 'fld_1', file: 'file_1', type: 'text', logic }]
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('Logic and Condition JSON Schema Validation', () => {
  describe('page logic', () => {
    it('Should pass with minimal valid Logic on Page.', () => {
      const doc = makeDocWithPageLogic(makeLogic());
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when conditions is not an array.', () => {
      const doc = makeDocWithPageLogic(makeLogic({ conditions: 'bad' }));
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('field logic', () => {
    it('Should pass with minimal valid Logic on Field.', () => {
      const doc = makeDocWithFieldLogic(makeLogic());
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when action is invalid.', () => {
      const doc = makeDocWithFieldLogic(makeLogic({ action: 'hide2' }));
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });
});
