const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeValidFile(overrides = {}) {
  // Minimal valid TemplateFile: _id, pages, pageOrder. name/styles are optional.
  return {
    _id: 'file_1',
    pages: [],
    pageOrder: [],
    ...overrides
  };
}

function makeValidJoyDocWithFiles(files) {
  return {
    files,
    fields: []
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('File JSON Schema Validation', () => {
  // general
  describe('general', () => {
    it('Should pass with minimal valid file object in JoyDoc.', () => {
      const doc = makeValidJoyDocWithFiles([makeValidFile()]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when files property does not exist.', () => {
      const doc = makeValidJoyDocWithFiles(undefined);
      delete doc.files;
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when files is not an array.', () => {
      const doc = makeValidJoyDocWithFiles('not-an-array');
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when files is an empty array.', () => {
      const doc = makeValidJoyDocWithFiles([]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when files contains a single valid file.', () => {
      const files = [makeValidFile()];
      const doc = makeValidJoyDocWithFiles(files);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when files contains multiple valid file objects.', () => {
      const files = [
        makeValidFile(),
        makeValidFile({ _id: 'file_2' })
      ];
      const doc = makeValidJoyDocWithFiles(files);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when files contains a non-object.', () => {
      const doc = makeValidJoyDocWithFiles([123]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // _id property
  describe('_id property', () => {
    it('Should fail validation when _id is missing.', () => {
      const file = makeValidFile();
      delete file._id;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when _id is empty string.', () => {
      const file = makeValidFile({ _id: '' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when _id is not a string.', () => {
      const file = makeValidFile({ _id: 123 });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when _id is a valid string.', () => {
      const file = makeValidFile({ _id: 'valid_id' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // name property (optional)
  describe('name property', () => {
    it('Should pass validation when name is missing.', () => {
      const file = makeValidFile();
      delete file.name;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when name is not a string.', () => {
      const file = makeValidFile({ name: {} });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when name is a string.', () => {
      const file = makeValidFile({ name: 'Main File' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // styles property (optional)
  describe('styles property', () => {
    it('Should pass validation when styles is missing.', () => {
      const file = makeValidFile();
      delete file.styles;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when styles is not an object.', () => {
      const file = makeValidFile({ styles: 'not-an-object' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when styles is an object.', () => {
      const file = makeValidFile({ styles: {} });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when styles is a populated object.', () => {
      const stylesObj = {
        color: 'red',
        fontSize: 14,
        nested: { margin: 10 }
      };
      const file = makeValidFile({ styles: stylesObj });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // pages property
  describe('pages property', () => {
    it('Should fail validation when pages is missing.', () => {
      const file = makeValidFile();
      delete file.pages;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when pages is not an array.', () => {
      const file = makeValidFile({ pages: 'not-an-array' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when pages is an array.', () => {
      const file = makeValidFile({ pages: [] });
      const doc = makeValidJoyDocWithFiles([file]);
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
      const file = makeValidFile({ pages: [validPage] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when pages contains a non-object value.', () => {
      const file = makeValidFile({ pages: ['not-an-object'] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  // pageOrder property
  describe('pageOrder property', () => {
    it('Should fail validation when pageOrder is missing.', () => {
      const file = makeValidFile();
      delete file.pageOrder;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when pageOrder is not an array.', () => {
      const file = makeValidFile({ pageOrder: 'not-an-array' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when pageOrder is an array of non-strings.', () => {
      const file = makeValidFile({ pageOrder: [123] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass validation when pageOrder is an array of strings.', () => {
      const file = makeValidFile({ pageOrder: [] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // views property
  describe('views property', () => {
    it('Should pass validation when views is present with a minimal view.', () => {
      const view = { type: 'mobile', pageOrder: [], pages: [] };
      const file = makeValidFile({ views: [view] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation if views is an empty array', () => {
      const file = makeValidFile({ views: [] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation if views is not defined', () => {
      const file = makeValidFile();
      // Ensure views is not present at all
      delete file.views;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation if views is not an array', () => {
      const file = makeValidFile({ views: 'not-an-array' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation if views array contains invalid view objects', () => {
      // Missing required properties in the view object
      const invalidView = { foo: 'bar' };
      const file = makeValidFile({ views: [invalidView] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      expect(isValid).toBe(false);

      // View with wrong type for pageOrder
      const invalidView2 = { type: 'mobile', pageOrder: 'not-an-array', pages: [] };
      const file2 = makeValidFile({ views: [invalidView2] });
      const doc2 = makeValidJoyDocWithFiles([file2]);
      const { isValid: isValid2, errors: errors2 } = runValidation(doc2);
      expect(isValid2).toBe(false);

      // View with non-object in array
      const file3 = makeValidFile({ views: ['not-an-object'] });
      const doc3 = makeValidJoyDocWithFiles([file3]);
      const { isValid: isValid3, errors: errors3 } = runValidation(doc3);
      expect(isValid3).toBe(false);
    });
  });

  // metadata property
  describe('metadata property', () => {
    it('Should pass validation when metadata is present.', () => {
      const file = makeValidFile({ metadata: { foo: 'bar', bar: 123, baz: true, qux: [1, 2, 3] } });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when metadata is not an object.', () => {
      const file = makeValidFile({ metadata: 'not-an-object' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('header property', () => {

    it('Should pass validation when header is a valid HeaderFooter object.', () => {
      const header = {
        fieldPositions: [],
        height: 50,
        cols: 1,
        rowHeight: 1,
        layout: 'row',
        presentation: 'normal'
      };

      const file = makeValidFile({ header });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when header is null', () => {
      const header = null;

      const file = makeValidFile({ header });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);

    });

    it('Should fail validation when header is not an object.', () => {
      const file = makeValidFile({ header: 'not-an-object' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when header is missing required properties.', () => {
      const header = {
        height: 40,
      };
      const file = makeValidFile({ header });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  describe('footer property', () => {

    it('Should pass validation when footer is a valid HeaderFooter object.', () => {
      const footer = {
        fieldPositions: [],
        height: 50,
        cols: 1,
        rowHeight: 1,
        layout: 'row',
        presentation: 'normal'
      };

      const file = makeValidFile({ footer });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when footer is null', () => {
      const footer = null;

      const file = makeValidFile({ footer });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);

    });

    it('Should fail validation when footer is not an object.', () => {
      const file = makeValidFile({ footer: 'not-an-object' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when footer is missing required properties.', () => {
      const footer = {
        height: 40,
      };
      const file = makeValidFile({ footer });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  // Forward compatibility
  describe('Forward compatibility', () => {
    it('Should pass validation when unknown properties are present.', () => {
      const file = makeValidFile({ foo: 'bar', extra: 123 });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });
});
