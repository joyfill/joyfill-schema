const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeValidPage(overrides = {}) {
  return {
    _id: 'page_1',
    name: 'Page 1',
    fieldPositions: [],
    width: 800,
    height: 600,
    cols: 8,
    rowHeight: 8,
    layout: 'grid',
    presentation: 'normal',
    ...overrides
  };
}

function makeDocWithPages(pages) {
  return {
    files: [
      {
        _id: 'file_1',
        pages: pages,
        pageOrder: pages.map(p => p._id)
      }
    ],
    fields: []
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('Page JSON Schema Validation', () => {
  // general
  describe('general', () => {
    it('Should pass with a minimal valid page.', () => {
      const doc = makeDocWithPages([makeValidPage()]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // required properties
  describe('required properties', () => {
    const requiredProps = ['_id', 'name', 'fieldPositions', 'width', 'height', 'cols', 'rowHeight', 'layout', 'presentation'];
    for (const prop of requiredProps) {
      it(`Should fail when ${prop} is missing.`, () => {
        const page = makeValidPage();
        delete page[prop];
        const doc = makeDocWithPages([page]);
        const { isValid } = runValidation(doc);
        expect(isValid).toBe(false);
      });
    }
  });

  // type checks
  describe('property types', () => {
    it('Should fail when width is not a number.', () => {
      const page = makeValidPage({ width: '800' });
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
    it('Should fail when height is not a number.', () => {
      const page = makeValidPage({ height: '600' });
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
    it('Should fail when fieldPositions is not an array.', () => {
      const page = makeValidPage({ fieldPositions: 'not-array' });
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });
});
