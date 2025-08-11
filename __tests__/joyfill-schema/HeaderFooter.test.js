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
    layout: 'grid',
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

  describe('general header property on File', () => {
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

  describe('generalfooter property on File', () => {
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


  // fieldPositions property
  describe('fieldPositions property', () => {
    it('Should fail when fieldPositions is missing', () => {
      const header = { ...makeHeaderFooter() };
      delete header.fieldPositions;
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when fieldPositions is not an array', () => {
      const header = { ...makeHeaderFooter(), fieldPositions: 'not-an-array' };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when fieldPositions is an empty array', () => {
      const header = { ...makeHeaderFooter(), fieldPositions: [] };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when fieldPositions contains a valid object.', () => {
      const header = { ...makeHeaderFooter(), fieldPositions: [{ _id: 'field_1', field: 'field_1', displayType: 'text', width: 100, height: 100, x: 0, y: 0, type: 'text' }] };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when fieldPositions contains a non-object value.', () => {
      const header = { ...makeHeaderFooter(), fieldPositions: ['not-an-object'] };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // height property
  describe('height property', () => {
    it('Should fail when height is missing', () => {
      const header = { ...makeHeaderFooter() };
      delete header.height;
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when height is not a number', () => {
      const header = { ...makeHeaderFooter(), height: 'not-a-number' };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when height is a number', () => {
      const header = { ...makeHeaderFooter(), height: 42 };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // cols property
  describe('cols property', () => {
    it('Should fail when cols is missing', () => {
      const header = { ...makeHeaderFooter() };
      delete header.cols;
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when cols is not a number', () => {
      const header = { ...makeHeaderFooter(), cols: 'not-a-number' };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when cols is a number', () => {
      const header = { ...makeHeaderFooter(), cols: 2 };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // rowHeight property
  describe('rowHeight property', () => {
    it('Should fail when rowHeight is missing', () => {
      const header = { ...makeHeaderFooter() };
      delete header.rowHeight;
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when rowHeight is not a number', () => {
      const header = { ...makeHeaderFooter(), rowHeight: 'not-a-number' };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when rowHeight is a number', () => {
      const header = { ...makeHeaderFooter(), rowHeight: 1 };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // layout property
  describe('layout property', () => {
    it('Should fail when layout is missing', () => {
      const header = { ...makeHeaderFooter() };
      delete header.layout;
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when layout is not a string', () => {
      const header = { ...makeHeaderFooter(), layout: 123 };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when layout is a string', () => {
      const header = { ...makeHeaderFooter(), layout: 'row' };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // presentation property (optional)
  describe('presentation property', () => {
    it('Should pass when presentation is missing (optional)', () => {
      const header = { ...makeHeaderFooter() };
      delete header.presentation;
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when presentation is not a string', () => {
      const header = { ...makeHeaderFooter(), presentation: 123 };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when presentation is a string', () => {
      const header = { ...makeHeaderFooter(), presentation: 'normal' };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // padding property (optional)
  describe('padding property', () => {
    it('Should pass when padding is missing (optional)', () => {
      const header = { ...makeHeaderFooter() };
      delete header.padding;
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when padding is not a number', () => {
      const header = { ...makeHeaderFooter(), padding: 'not-a-number' };
      const doc = makeDocWithFile({ header });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when padding is a number', () => {
      const header = { ...makeHeaderFooter(), padding: 10 };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // Forward compatibility
  describe('Forward compatibility', () => {
    it('Should pass validation when unknown properties are present in HeaderFooter', () => {
      const header = { ...makeHeaderFooter(), foo: 'bar', extra: 123 };
      const doc = makeDocWithFile({ header });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
