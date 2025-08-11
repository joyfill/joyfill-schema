const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeValidFile(overrides = {}) {
  return {
    _id: 'file_1',
    // name optional
    // styles optional
    pages: [],
    pageOrder: [],
    ...overrides
  };
}

function makeValidJoyDocWithFiles(files) {
  // Minimal valid JoyDoc with required fields and files
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
  // files property
  describe('files property', () => {
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

    it('Should pass validation when files contains a valid file object.', () => {
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

  // Required properties in File
  describe('File required properties', () => {

    it('Should fail validation when _id is missing.', () => {
      const file = makeValidFile();
      delete file._id;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });


    it('Should fail validation when pages is missing.', () => {
      const file = makeValidFile();
      delete file.pages;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when pageOrder is missing.', () => {
      const file = makeValidFile();
      delete file.pageOrder;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // Type checks for properties
  describe('File property types', () => {
    it('Should fail validation when _id is not a string.', () => {
      const file = makeValidFile({ _id: 123 });
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

    it('Should fail validation when name is not a string (when present).', () => {
      const file = makeValidFile({ name: {} });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when styles is not an object (when present).', () => {
      const file = makeValidFile({ styles: 'not-an-object' });
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

    it('Should fail validation when pageOrder is not an array.', () => {
      const file = makeValidFile({ pageOrder: 'not-an-array' });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // Optional properties
  describe('File optional properties', () => {
    it('Should pass validation when optional properties are not present.', () => {
      const file = makeValidFile();
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when name is missing (optional).', () => {
      const file = makeValidFile();
      delete file.name;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when styles is missing (optional).', () => {
      const file = makeValidFile();
      delete file.styles;
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when metadata is present.', () => {
      const file = makeValidFile({ metadata: { foo: 'bar' } });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when header and footer are present.', () => {
      const headerFooter = {
        fieldPositions: [],
        height: 10,
        cols: 1,
        rowHeight: 5,
        layout: 'row'
      };
      const file = makeValidFile({ header: headerFooter, footer: headerFooter });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when views is present.', () => {
      const view = {
        type: 'mobile',
        pageOrder: [],
        pages: []
      };
      const file = makeValidFile({ views: [view] });
      const doc = makeValidJoyDocWithFiles([file]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
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
