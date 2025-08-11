const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeHeaderFooter(overrides = {}) {
  return {
    fieldPositions: [],
    height: 50,
    cols: 1,
    rowHeight: 10,
    layout: 'row',
    ...overrides
  };
}

function makeDocWithFile(overridesFile = {}) {
  return {
    files: [
      {
        _id: 'file_1',
        pages: [],
        pageOrder: [],
        ...overridesFile
      }
    ],
    fields: []
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('Header and Footer JSON Schema Validation', () => {
  describe('header property on File', () => {
    it('Should pass when header is a valid HeaderFooter object.', () => {
      const doc = makeDocWithFile({ header: makeHeaderFooter() });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should pass when header is null.', () => {
      const doc = makeDocWithFile({ header: null });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when header is not an object or null.', () => {
      const doc = makeDocWithFile({ header: 123 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('footer property on File', () => {
    it('Should pass when footer is a valid HeaderFooter object.', () => {
      const doc = makeDocWithFile({ footer: makeHeaderFooter() });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should pass when footer is null.', () => {
      const doc = makeDocWithFile({ footer: null });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when footer is not an object or null.', () => {
      const doc = makeDocWithFile({ footer: 'nope' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });
});
