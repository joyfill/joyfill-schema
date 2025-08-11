const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeFieldPosition(overrides = {}) {
  return {
    _id: 'fp_1',
    field: 'fld_1',
    displayType: 'original',
    width: 100,
    height: 20,
    x: 0,
    y: 0,
    type: 'text',
    ...overrides
  };
}

function makePageWithFieldPositions(fieldPositions) {
  return {
    _id: 'page_1',
    name: 'Page 1',
    fieldPositions,
    width: 800,
    height: 600,
    cols: 8,
    rowHeight: 8,
    layout: 'grid',
    presentation: 'normal'
  };
}

function makeDoc(fieldPositions) {
  return {
    files: [
      {
        _id: 'file_1',
        pages: [makePageWithFieldPositions(fieldPositions)],
        pageOrder: ['page_1']
      }
    ],
    fields: [{ _id: 'fld_1', file: 'file_1', type: 'text' }]
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('FieldPosition JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with a minimal valid FieldPosition.', () => {
      const doc = makeDoc([makeFieldPosition()]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('required properties', () => {
    const required = ['_id', 'field', 'displayType', 'width', 'height', 'x', 'y', 'type'];
    for (const prop of required) {
      it(`Should fail when ${prop} is missing.`, () => {
        const fp = makeFieldPosition();
        delete fp[prop];
        const doc = makeDoc([fp]);
        const { isValid } = runValidation(doc);
        expect(isValid).toBe(false);
      });
    }
  });

  describe('types', () => {
    it('Should fail when width is not a number.', () => {
      const fp = makeFieldPosition({ width: '100' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
    it('Should fail when displayType is not a valid enum.', () => {
      const fp = makeFieldPosition({ displayType: 'bad' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });
});
