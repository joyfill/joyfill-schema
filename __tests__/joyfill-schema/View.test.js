const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeView(overrides = {}) {
  return {
    type: 'mobile',
    pageOrder: [],
    pages: [],
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

describe('View JSON Schema Validation', () => {

  describe('general', () => {

    it('Should pass with a minimal valid view.', () => {
      const doc = makeDocWithFile({ views: [makeView()] });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when views is not an array.', () => {
      const doc = makeDocWithFile({ views: 'not-array' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when views contains non view array items.', () => {
      const doc = makeDocWithFile({ views: [123] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  describe('Forward compatibility', () => {
    it('Should pass validation when unknown properties are present.', () => {
      const view = makeView({ foo: 'bar', extra: 123 });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('type property', () => {
    it('Should pass validation when type is "mobile".', () => {
      const view = makeView({ type: 'mobile' });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when type is not present (optional).', () => {
      const view = makeView();
      // Ensure type is not present
      delete view.type;
      const doc = makeDocWithFile({ views: [view] });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when type is not a string.', () => {
      const view = makeView({ type: 123 });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when type is a string but not a valid value.', () => {
      const view = makeView({ type: 'bad' });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // pages property
  describe('pages property', () => {
    it('Should fail validation when pages is missing.', () => {
      const view = makeView();
      delete view.pages;
      const doc = makeDocWithFile({ views: [view] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when pages is not an array.', () => {
      const view = makeView({ pages: 'not-an-array' });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when pages is an array.', () => {
      const view = makeView({ pages: [] });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when pages contains a valid page object.', () => {
      const validPage = {
        _id: 'page_1',
        name: 'Page 1',
        fieldPositions: [],
        width: 100,
        height: 100,
        cols: 4,
        rowHeight: 1,
        layout: 'grid',
        presentation: 'normal'
      };
      const view = makeView({ pages: [validPage] });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when pages contains a non-object value.', () => {
      const view = makeView({ pages: ['not-an-object'] });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid, errors } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // pageOrder property
  describe('pageOrder property', () => {
    it('Should fail validation when pageOrder is missing.', () => {
      const view = makeView();
      delete view.pageOrder;
      const doc = makeDocWithFile({ views: [view] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when pageOrder is not an array.', () => {
      const view = makeView({ pageOrder: 'not-an-array' });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when pageOrder is an array of non-strings.', () => {
      const view = makeView({ pageOrder: [123] });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when pageOrder is an array of strings.', () => {
      const view = makeView({ pageOrder: ['page_1'] });
      const doc = makeDocWithFile({ views: [view] });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
