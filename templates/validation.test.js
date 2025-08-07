const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
// Load the schema
const schemaPath = path.join(__dirname, '..', 'joyfill-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({
  allErrors: true,
  strict: false,
  allowUnionTypes: true
});


const dropdownTemplate = {
  "_id": "688a502a04deca5f1d0cd9dc",
  "type": "document",
  "stage": "draft",
  "source": "template_6889cdae0f9d59c08748fe0e",
  "metadata": {},
  "identifier": "doc_688a502a04deca5f1d0cd9dc",
  "name": "New Template",
  "createdOn": 1753894954222,
  "files": [
    {
      "_id": "6889cdae8a0d0b43c4a1ef27",
      "metadata": {},
      "name": "New File",
      "version": 1,
      "styles": {
        "margin": 4
      },
      "pages": [
        {
          "name": "New Page",
          "fieldPositions": [
            {
              "_id": "689324db353b6b4ee0684569",
              "type": "dropdown",
              "displayType": "original",
              "targetValue": "689324c75000966ad1de9033",
              "x": 2,
              "y": 0,
              "width": 4,
              "height": 8,
              "field": "dropdown1"
            }
          ],
          "metadata": {},
          "hidden": false,
          "width": 816,
          "height": 1056,
          "cols": 8,
          "rowHeight": 8,
          "layout": "grid",
          "presentation": "normal",
          "margin": 0,
          "padding": 24,
          "borderWidth": 0,
          "_id": "6889cdae7553c92c7db50284"
        }
      ],
      "pageOrder": [
        "6889cdae7553c92c7db50284"
      ],
      "views": []
    }
  ],
  "fields": [
    {
      "file": "6889cdae8a0d0b43c4a1ef27",
      "_id": "dropdown1",
      "type": "dropdown",
      "title": "Dropdown",
      "options": [
        {
          "value": "Yes",
          "deleted": false
        },
        {
          "_id": "689324c7c21489b0ba635b62",
          "value": "No",
          "deleted": false
        },
        {
          "_id": "689324c735e2e17275c6b9e9",
          "value": "N/A",
          "deleted": false
        }
      ],
      "identifier": "field_dropdown1"
    }
  ],
  "deleted": false
}

describe("Option validation", () => {

  it("should pass validation when all options have _id", async () => {

    const validateSchema = ajv.compile(schema);


    const isValid = validateSchema(dropdownTemplate);

    // This removes 'if/then' errors from AJV,
    // because they just repeat the real validation error.
    // We only want to show the actual useful errors.
    const relevantErrors = validateSchema.errors.filter(
      e => !(e.keyword === 'if' && e.params?.failingKeyword === 'then')
    );


    expect(isValid).toBe(false);
  });

});

describe('File validation', () => {

  let nextTemplate;

  beforeEach(() => {
    nextTemplate = { ...dropdownTemplate };
    nextTemplate.fields[0].options[0]._id = '689324c7c21489b0ba635b62';
  });

  it('should fail when files is missing', () => {
    const invalidTemplate = { ...nextTemplate };
    delete invalidTemplate.files;

    const validateSchema = ajv.compile(schema);
    const isValid = validateSchema(invalidTemplate);

    expect(isValid).toBe(false);
    expect(validateSchema.errors).toBeDefined();
    expect(validateSchema.errors.length).toBeGreaterThan(0);
  });

  it('should fail when files is not an array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files = {};

    const validateSchema = ajv.compile(schema);
    const isValid = validateSchema(invalidTemplate);

    expect(isValid).toBe(false);
    expect(validateSchema.errors).toBeDefined();
    expect(validateSchema.errors.length).toBeGreaterThan(0);
  });

  it('should fail when files is an empty array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files = [];

    const validateSchema = ajv.compile(schema);
    const isValid = validateSchema(invalidTemplate);

    expect(isValid).toBe(false);
    expect(validateSchema.errors).toBeDefined();
    expect(validateSchema.errors.length).toBeGreaterThan(0);
  });


});

describe('Pages validation', () => {

  let nextTemplate;

  beforeEach(() => {
    nextTemplate = { ...dropdownTemplate };
    nextTemplate.fields[0].options[0]._id = '689324c7c21489b0ba635b62';
  });

  it('should fail when pages is missing from a file', () => {
    const invalidTemplate = { ...nextTemplate };
    delete invalidTemplate.files[0].pages;

    const validateSchema = ajv.compile(schema);
    const isValid = validateSchema(invalidTemplate);

    expect(isValid).toBe(false);
    expect(validateSchema.errors).toBeDefined();
    expect(validateSchema.errors.length).toBeGreaterThan(0);
  });

  it('should fail when pages is not an array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files[0].pages = {};

    const validateSchema = ajv.compile(schema);
    const isValid = validateSchema(invalidTemplate);

    expect(isValid).toBe(false);
    expect(validateSchema.errors).toBeDefined();
    expect(validateSchema.errors.length).toBeGreaterThan(0);
  });

  it('should fail when pages is an empty array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files[0].pages = [];

    const validateSchema = ajv.compile(schema);
    const isValid = validateSchema(invalidTemplate);

    expect(isValid).toBe(false);
    expect(validateSchema.errors).toBeDefined();
    expect(validateSchema.errors.length).toBeGreaterThan(0);
  });

});


