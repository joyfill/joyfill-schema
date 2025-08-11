const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeChartField(overrides = {}) {
  return {
    _id: 'ch1',
    file: 'file_1',
    type: 'chart',
    value: [{ _id: 's1', points: [{ _id: 'p1', x: 0, y: 0 }] }],
    yTitle: 'Y', yMax: 10, yMin: 0,
    xTitle: 'X', xMax: 10, xMin: 0,
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

describe('ChartField JSON Schema Validation', () => {
  describe('general', () => {
    it('Should pass with minimal valid ChartField.', () => {
      const { isValid, errors } = runValidation(baseDoc([makeChartField()]));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('required properties', () => {
    const required = ['xTitle', 'xMax', 'xMin', 'yTitle', 'yMax', 'yMin'];
    for (const prop of required) {
      it(`Should fail when ${prop} is missing.`, () => {
        const ch = makeChartField();
        delete ch[prop];
        const { isValid } = runValidation(baseDoc([ch]));
        expect(isValid).toBe(false);
      });
    }
  });
});
