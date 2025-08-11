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

  // _id property
  describe('_id property', () => {
    it('Should fail when _id is missing', () => {
      const page = { ...makeValidPage() };
      delete page._id;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is not a string', () => {
      const page = { ...makeValidPage(), _id: 123 };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is an empty string', () => {
      const page = { ...makeValidPage(), _id: '' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when _id is a string', () => {
      const page = { ...makeValidPage(), _id: 'page_abc' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // name property
  describe('name property', () => {
    it('Should fail when name is missing', () => {
      const page = { ...makeValidPage() };
      delete page.name;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when name is not a string', () => {
      const page = { ...makeValidPage(), name: 123 };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when name is a string', () => {
      const page = { ...makeValidPage(), name: 'My Page' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // fieldPositions property
  describe('fieldPositions property', () => {
    it('Should fail when fieldPositions is missing', () => {
      const page = { ...makeValidPage() };
      delete page.fieldPositions;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when fieldPositions is not an array', () => {
      const page = { ...makeValidPage(), fieldPositions: 'not-an-array' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when fieldPositions is an empty array', () => {
      const page = { ...makeValidPage(), fieldPositions: [] };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when fieldPositions contains a valid object', () => {
      const page = { 
        ...makeValidPage(), 
        fieldPositions: [{ _id: 'field_1', field: 'field_1', displayType: 'text', width: 100, height: 100, x: 0, y: 0, type: 'text' }]
      };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when fieldPositions contains a non-object', () => {
      const page = { ...makeValidPage(), fieldPositions: ['not-an-object'] };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // width property
  describe('width property', () => {
    it('Should fail when width is missing', () => {
      const page = { ...makeValidPage() };
      delete page.width;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when width is not a number', () => {
      const page = { ...makeValidPage(), width: 'not-a-number' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when width is a number', () => {
      const page = { ...makeValidPage(), width: 1024 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // height property
  describe('height property', () => {
    it('Should fail when height is missing', () => {
      const page = { ...makeValidPage() };
      delete page.height;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when height is not a number', () => {
      const page = { ...makeValidPage(), height: 'not-a-number' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when height is a number', () => {
      const page = { ...makeValidPage(), height: 768 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // cols property
  describe('cols property', () => {
    it('Should fail when cols is missing', () => {
      const page = { ...makeValidPage() };
      delete page.cols;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when cols is not a number', () => {
      const page = { ...makeValidPage(), cols: 'not-a-number' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when cols is a number', () => {
      const page = { ...makeValidPage(), cols: 12 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // rowHeight property
  describe('rowHeight property', () => {
    it('Should fail when rowHeight is missing', () => {
      const page = { ...makeValidPage() };
      delete page.rowHeight;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when rowHeight is not a number', () => {
      const page = { ...makeValidPage(), rowHeight: 'not-a-number' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when rowHeight is a number', () => {
      const page = { ...makeValidPage(), rowHeight: 16 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // layout property
  describe('layout property', () => {
    it('Should fail when layout is missing', () => {
      const page = { ...makeValidPage() };
      delete page.layout;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when layout is not a string', () => {
      const page = { ...makeValidPage(), layout: 123 };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when layout is "grid"', () => {
      const page = { ...makeValidPage(), layout: 'grid' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when layout is "float"', () => {
      const page = { ...makeValidPage(), layout: 'float' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when layout is an invalid string', () => {
      const page = { ...makeValidPage(), layout: 'invalid' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // presentation property (optional)
  describe('presentation property', () => {
    it('Should fail when presentation is missing', () => {
      const page = { ...makeValidPage() };
      delete page.presentation;
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when presentation is not a string', () => {
      const page = { ...makeValidPage(), presentation: 123 };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when presentation is a string', () => {
      const page = { ...makeValidPage(), presentation: 'normal' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // padding property (optional)
  describe('padding property', () => {
    it('Should pass when padding is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.padding;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when padding is not a number', () => {
      const page = { ...makeValidPage(), padding: 'not-a-number' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when padding is a number', () => {
      const page = { ...makeValidPage(), padding: 10 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
  // hidden property (optional)
  describe('hidden property', () => {
    it('Should pass when hidden is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.hidden;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when hidden is not a boolean', () => {
      const page = { ...makeValidPage(), hidden: 'not-a-boolean' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when hidden is true', () => {
      const page = { ...makeValidPage(), hidden: true };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when hidden is false', () => {
      const page = { ...makeValidPage(), hidden: false };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });


  // margin property (optional)
  describe('margin property', () => {
    it('Should pass when margin is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.margin;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when margin is not a number', () => {
      const page = { ...makeValidPage(), margin: 'not-a-number' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when margin is a number', () => {
      const page = { ...makeValidPage(), margin: 20 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // borderWidth property (optional)
  describe('borderWidth property', () => {
    it('Should pass when borderWidth is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.borderWidth;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when borderWidth is not a number', () => {
      const page = { ...makeValidPage(), borderWidth: 'not-a-number' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when borderWidth is a number', () => {
      const page = { ...makeValidPage(), borderWidth: 2 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // backgroundImage property (optional)
  describe('backgroundImage property', () => {
    it('Should pass when backgroundImage is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.backgroundImage;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when backgroundImage is not a string', () => {
      const page = { ...makeValidPage(), backgroundImage: 123 };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when backgroundImage is a string', () => {
      const page = { ...makeValidPage(), backgroundImage: 'image.png' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // backgroundSize property (optional)
  describe('backgroundSize property', () => {
    it('Should pass when backgroundSize is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.backgroundSize;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when backgroundSize is not a string', () => {
      const page = { ...makeValidPage(), backgroundSize: 123 };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when backgroundSize is an empty string', () => {
      const page = { ...makeValidPage(), backgroundSize: '' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when backgroundSize is "100% 100%"', () => {
      const page = { ...makeValidPage(), backgroundSize: '100% 100%' };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when backgroundSize is an invalid string', () => {
      const page = { ...makeValidPage(), backgroundSize: 'invalid' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // metadata property (optional)
  describe('metadata property', () => {
    it('Should pass when metadata is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.metadata;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when metadata is not an object', () => {
      const page = { ...makeValidPage(), metadata: 'not-an-object' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when metadata is an object', () => {
      const page = { ...makeValidPage(), metadata: { foo: 'bar', bar: 123, baz: true, qux: [1, 2, 3] } };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // logic property (optional)
  describe('logic property', () => {
    it('Should pass when logic is missing (optional)', () => {
      const page = { ...makeValidPage() };
      delete page.logic;
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when logic is not an object', () => {
      const page = { ...makeValidPage(), logic: 'not-an-object' };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when logic is an object (empty)', () => {
      const page = { ...makeValidPage(), logic: {} };
      const doc = makeDocWithPages([page]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when logic is a valid object (with action, eval, and conditions)', () => {
      const page = { ...makeValidPage(), logic: { action: 'show', eval: 'and', conditions: [{ file: 'file_1', page: 'page_1', field: 'field_1', condition: '=', value: 'value_1' }] } };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

  });

  // Forward compatibility
  describe('Forward compatibility', () => {
    it('Should pass validation when unknown properties are present in Page', () => {
      const page = { ...makeValidPage(), foo: 'bar', extra: 123 };
      const doc = makeDocWithPages([page]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

});
