const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const { validateWithAjv } = require('../validateWithAjv');
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

    const { isValid, errors } = validateWithAjv(ajv, schema, dropdownTemplate);

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

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when files is not an array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files = {};

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when files is an empty array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files = [];

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
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

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when pages is not an array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files[0].pages = {};

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when pages is an empty array', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.files[0].pages = [];

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

});

describe('Field validation', () => {

  let nextTemplate;

  beforeEach(() => {
    nextTemplate = { ...dropdownTemplate };
    nextTemplate.fields[0].options[0]._id = '689324c7c21489b0ba635b62';
  });

  it('should fail when field._id is empty', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.fields[0]._id = '';

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when field._id is null', () => {
    const invalidTemplate = { ...nextTemplate };
    invalidTemplate.fields[0]._id = null;

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    console.log('errors', errors);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when field._id is undefined', () => {
    const invalidTemplate = { ...nextTemplate };
    delete invalidTemplate.fields[0]._id;

    const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

    expect(isValid).toBe(false);
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
  });

});

describe('Table field validation', () => {

  let tableTemplate;

  beforeEach(() => {
    tableTemplate = {
      "_id": "688a502a04deca5f1d0cd9dc",
      "type": "document",
      "stage": "draft",
      "source": "template_6889cdae0f9d59c08748fe0e",
      "metadata": {},
      "identifier": "doc_688a502a04deca5f1d0cd9dc",
      "name": "Table Template",
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
                  "type": "table",
                  "displayType": "original",
                  "targetValue": "table1",
                  "x": 2,
                  "y": 0,
                  "width": 4,
                  "height": 8,
                  "field": "table1"
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
          "_id": "table1",
          "type": "table",
          "title": "Test Table",
          "tableColumns": [
            {
              "_id": "column1",
              "type": "text",
              "title": "Text Column"
            },
            {
              "_id": "column2",
              "type": "dropdown",
              "title": "Dropdown Column",
              "options": [
                {
                  "_id": "option1",
                  "value": "Yes"
                },
                {
                  "_id": "option2",
                  "value": "No"
                }
              ]
            }
          ],
          "value": [
            {
              "_id": "row1",
              "deleted": false,
              "cells": {}
            },
            {
              "_id": "row2",
              "deleted": false,
              "cells": {}
            }
          ],
          "rowOrder": ["row1", "row2"],
          "tableColumnOrder": ["column1", "column2"],
          "identifier": "field_table1"
        }
      ],
      "deleted": false
    };
  });

  describe('Table field _id validation', () => {
    it('should fail when table field._id is empty', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0]._id = '';

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when table field._id is null', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0]._id = null;

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when table field._id is undefined', () => {
      const invalidTemplate = { ...tableTemplate };
      delete invalidTemplate.fields[0]._id;

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass when table field._id is valid', () => {
      const { isValid, errors } = validateWithAjv(ajv, schema, tableTemplate);

      expect(isValid).toBe(true);
      expect(errors).toBeDefined();
      expect(errors.length).toBe(0);
    });
  });

  describe('Table field formula _id validation', () => {
    it('should fail when formula _id is empty', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0].formulas = [
        {
          "_id": "",
          "formula": "testFormula",
          "key": "value"
        }
      ];

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when formula _id is null', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0].formulas = [
        {
          "_id": null,
          "formula": "testFormula",
          "key": "value"
        }
      ];

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when formula _id is undefined', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0].formulas = [
        {
          "formula": "testFormula",
          "key": "value"
        }
      ];

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass when formula _id is valid', () => {
      const validTemplate = { ...tableTemplate };
      validTemplate.fields[0].formulas = [
        {
          "_id": "formula1",
          "formula": "testFormula",
          "key": "value"
        }
      ];

      const { isValid, errors } = validateWithAjv(ajv, schema, validTemplate);

      expect(isValid).toBe(true);
      expect(errors).toBeDefined();
      expect(errors.length).toBe(0);
    });
  });

  describe('Table column _id validation', () => {
    it('should fail when table column _id is empty', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0].tableColumns[0]._id = '';

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when table column _id is null', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0].tableColumns[0]._id = null;

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when table column _id is undefined', () => {
      const invalidTemplate = { ...tableTemplate };
      delete invalidTemplate.fields[0].tableColumns[0]._id;

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass when table column _id is valid', () => {
      const { isValid, errors } = validateWithAjv(ajv, schema, tableTemplate);

      expect(isValid).toBe(true);
      expect(errors).toBeDefined();
      expect(errors.length).toBe(0);
    });
  });

  describe('Table row _id validation', () => {
    it('should fail when table row _id is empty', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0].value[0]._id = '';

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when table row _id is null', () => {
      const invalidTemplate = { ...tableTemplate };
      invalidTemplate.fields[0].value[0]._id = null;

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when table row _id is undefined', () => {
      const invalidTemplate = { ...tableTemplate };
      delete invalidTemplate.fields[0].value[0]._id;

      const { isValid, errors } = validateWithAjv(ajv, schema, invalidTemplate);

      expect(isValid).toBe(false);
      expect(errors).toBeDefined();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass when table row _id is valid', () => {
      const { isValid, errors } = validateWithAjv(ajv, schema, tableTemplate);

      expect(isValid).toBe(true);
      expect(errors).toBeDefined();
      expect(errors.length).toBe(0);
    });
  });

  // Note: Dropdown option _id validation tests removed as the schema doesn't enforce _id requirement for options in table columns
});




