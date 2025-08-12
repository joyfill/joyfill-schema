const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeFieldPosition(overrides = {}) {
  return {
    _id: 'fp_1',
    field: 'fld_1',
    displayType: 'original',
    width: 100,
    height: 20,
    x: 0,
    y: 0,
    type: 'text',
    ...overrides
  };
}

function makePageWithFieldPositions(fieldPositions) {
  return {
    _id: 'page_1',
    name: 'Page 1',
    fieldPositions,
    width: 800,
    height: 600,
    cols: 8,
    rowHeight: 8,
    layout: 'grid',
    presentation: 'normal'
  };
}

function makeDoc(fieldPositions) {
  return {
    files: [
      {
        _id: 'file_1',
        pages: [makePageWithFieldPositions(fieldPositions)],
        pageOrder: ['page_1']
      }
    ],
    fields: [{ _id: 'fld_1', file: 'file_1', type: 'text' }]
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('FieldPosition JSON Schema Validation', () => {

  describe('general', () => {

    it('Should pass with a minimal valid FieldPosition.', () => {
      const doc = makeDoc([makeFieldPosition()]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when fieldPositions is not an array.', () => {
      const doc = makeDoc('not-an-array');
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when fieldPositions contains a non-object value.', () => {
      const doc = makeDoc(['not-an-object']);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  describe('Forward compatibility', () => {

    it('Should pass validation when unknown properties are present.', () => {
      const fp = makeFieldPosition({ foo: 'bar', extra: 123 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when new displayType is added.', () => {
      const fp = makeFieldPosition({ displayType: 'futureCustomType' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when new columnTitleFontStyle is added.', () => {
      const fp = makeFieldPosition({ columnTitleFontStyle: 'futureCustomStyle' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when new columnTitleFontWeight is added.', () => {
      const fp = makeFieldPosition({ columnTitleFontWeight: 'futureCustomWeight' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when new columnTitleTextAlign is added.', () => {
      const fp = makeFieldPosition({ columnTitleTextAlign: 'futureCustomAlign' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when new columnTitleTextTransform is added.', () => {
      const fp = makeFieldPosition({ columnTitleTextTransform: 'futureCustomTransform' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when new columnTitleTextDecoration is added.', () => {
      const fp = makeFieldPosition({ columnTitleTextDecoration: 'futureCustomDecoration' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when new titleDisplay is added.', () => {
      const fp = makeFieldPosition({ titleDisplay: 'futureCustomDisplay' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

  });

  // Tests for each FieldPosition property
  describe('_id', () => {
    it('Should pass when _id is a string', () => {
      const fp = makeFieldPosition({ _id: 'fp_1' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when _id is empty string', () => {
      const fp = makeFieldPosition({ _id: '' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is missing', () => {
      const { _id, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is not a string', () => {
      const fp = makeFieldPosition({ _id: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('field', () => {
    it('Should pass when field is a string', () => {
      const fp = makeFieldPosition({ field: 'fld_1' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when field is empty string', () => {
      const fp = makeFieldPosition({ field: '' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when field is missing', () => {
      const { field, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when field is not a string', () => {
      const fp = makeFieldPosition({ field: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('displayType', () => {

    it('Should pass when displayType is a valid enum value', () => {
      const validTypes = [
        'original', 'horizontal', 'text', 'circle', 'square', 'check', 'radio', 'inputGroup', 'futureCustomType'
      ];
      for (const type of validTypes) {
        const fp = makeFieldPosition({ displayType: type });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when displayType is missing', () => {
      const { displayType, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when displayType is not a string', () => {
      const fp = makeFieldPosition({ displayType: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('width', () => {
    it('Should pass when width is a number', () => {
      const fp = makeFieldPosition({ width: 100 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when width is missing', () => {
      const { width, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when width is not a number', () => {
      const fp = makeFieldPosition({ width: '100' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('height', () => {
    it('Should pass when height is a number', () => {
      const fp = makeFieldPosition({ height: 50 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when height is missing', () => {
      const { height, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when height is not a number', () => {
      const fp = makeFieldPosition({ height: '50' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('x', () => {
    it('Should pass when x is a number', () => {
      const fp = makeFieldPosition({ x: 10 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when x is missing', () => {
      const { x, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when x is not a number', () => {
      const fp = makeFieldPosition({ x: '10' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('y', () => {
    it('Should pass when y is a number', () => {
      const fp = makeFieldPosition({ y: 20 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when y is missing', () => {
      const { y, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when y is not a number', () => {
      const fp = makeFieldPosition({ y: '20' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('type', () => {
    it('Should pass when type is a valid string value', () => {
      const validTypes = [
        'image',
        'richText',
        'file',
        'text',
        'textarea',
        'number',
        'dropdown',
        'multiSelect',
        'date',
        'signature',
        'table',
        'chart',
        'collection',
        'block',
        'rte',
        'customType1', // test for custom/unknown types
        'anotherCustomType'
      ];
      for (const type of validTypes) {
        const fp = makeFieldPosition({ type });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when type is missing', () => {
      const { type, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when type is not a string', () => {
      const fp = makeFieldPosition({ type: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  describe('schema', () => {

    it('Should pass when schema is missing', () => {
      const { schema, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when schema is a valid object', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: {
                format: 'mm/dd/yyyy',
                hidden: true
              },
              col2: {
                format: 'date',
                hidden: false
              }
            }
          },
          schemaId2: {
            tableColumns: {
              col1: {
                format: 'mm/dd/yyyy',
                hidden: true
              }
            }
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when schema is a valid object with additional properties for fowards compatability', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: {
                format: 'currency',
                hidden: false,
                foo: 'bar',
                bar: 123,
                baz: true,
                qux: [1, 2, 3]
              }
            },
            extraProp: {
              foo: 'bar'
            }
          },
          schemaId2: {
            foo: 'bar',
            bar: 123,
            baz: true,
            qux: [1, 2, 3]
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when schema is an empty object', () => {
      const fp = makeFieldPosition({
        schema: {}
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when schema.tableColumns is an empty object', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {}
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when schema.tableColumns column is an empty object', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: {},
              col2: {}
            }
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when schema.tableColumns column object has only format', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: {
                format: 'percent'
              }
            }
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when schema.tableColumns column object has only hidden', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: {
                hidden: true
              }
            }
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when schema is not an object', () => {
      const fp = makeFieldPosition({
        schema: 'not-an-object'
      });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when schema[schemaId].tableColumns is not an object', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: 'not-an-object'
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when schema[schemaId].tableColumns column is not an object', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: 'not-an-object'
            }
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when schema[schemaId].tableColumns column.format is not a string', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: {
                format: 123
              }
            }
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when schema[schemaId].tableColumns column.hidden is not a boolean', () => {
      const fp = makeFieldPosition({
        schema: {
          schemaId1: {
            tableColumns: {
              col1: {
                hidden: 'not-a-boolean'
              }
            }
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when schema is missing', () => {
      const { schema, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  describe('tableColumns', () => {

    it('Should pass when tableColumns is missing', () => {
      const { tableColumns, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);

      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tableColumns is a valid object', () => {
      const fp = makeFieldPosition({
        tableColumns: {
          col1: {
            format: 'mm/dd/yyyy',
            hidden: true
          },
          col2: {
            format: 'date',
            hidden: false
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tableColumns is a valid object with additional properties for fowards compatability', () => {
      const fp = makeFieldPosition({
        tableColumns: {
          col1: {
            format: 'currency',
            hidden: false,
            foo: 'bar',
            bar: 123,
            baz: true,
            qux: [1, 2, 3]
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tableColumns is an empty object', () => {
      const fp = makeFieldPosition({
        tableColumns: {}
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tableColumns is an object with only format', () => {
      const fp = makeFieldPosition({
        tableColumns: {
          col1: {
            format: 'mm/dd/yyyy'
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when tableColumns is an object with only hidden', () => {
      const fp = makeFieldPosition({
        tableColumns: {
          col1: {
            hidden: true
          }
        }
      });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when tableColumns is not an object', () => {
      const fp = makeFieldPosition({
        tableColumns: 'not-an-object'
      });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('primaryMaxWidth', () => {
    it('Should pass when primaryMaxWidth is missing', () => {
      const { primaryMaxWidth, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when primaryMaxWidth is a number', () => {
      const fp = makeFieldPosition({ primaryMaxWidth: 250 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when primaryMaxWidth is not a number', () => {
      const fp = makeFieldPosition({ primaryMaxWidth: 'not-a-number' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('primaryMaxHeight', () => {
    it('Should pass when primaryMaxHeight is missing', () => {
      const { primaryMaxHeight, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when primaryMaxHeight is a number', () => {
      const fp = makeFieldPosition({ primaryMaxHeight: 250 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when primaryMaxHeight is not a number', () => {
      const fp = makeFieldPosition({ primaryMaxHeight: 'not-a-number' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  }); 

  describe('format', () => {

    it('Should pass when format is missing', () => {
      const { format, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when format is a string', () => {
      const fp = makeFieldPosition({ format: 'mm/dd/yyyy' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when format is not a string', () => {
      const fp = makeFieldPosition({ format: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  describe('targetValue', () => {
    it('Should pass when targetValue is missing', () => {
      const { targetValue, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when targetValue is a string', () => {
      const fp = makeFieldPosition({ targetValue: '123' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when targetValue is not a string', () => {
      const fp = makeFieldPosition({ targetValue: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('lineHeight', () => {
    it('Should pass when lineHeight is missing', () => {
      const { lineHeight, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when lineHeight is a number', () => {
      const fp = makeFieldPosition({ lineHeight: 1.5 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when lineHeight is not a number', () => {
      const fp = makeFieldPosition({ lineHeight: 'not-a-number' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('zIndex', () => {
    it('Should pass when zIndex is missing', () => {
      const { zIndex, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when zIndex is a number', () => {
      const fp = makeFieldPosition({ zIndex: 10 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when zIndex is not a number', () => {
      const fp = makeFieldPosition({ zIndex: 'not-a-number' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });


  describe('columnTitleFontSize', () => {
    it('Should pass when columnTitleFontSize is missing', () => {
      const { columnTitleFontSize, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleFontSize is a number', () => {
      const fp = makeFieldPosition({ columnTitleFontSize: 14 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when columnTitleFontSize is not a number', () => {
      const fp = makeFieldPosition({ columnTitleFontSize: 'large' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnTitleFontColor', () => {
    it('Should pass when columnTitleFontColor is missing', () => {
      const { columnTitleFontColor, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleFontColor is a string', () => {
      const fp = makeFieldPosition({ columnTitleFontColor: '#FF0000' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when columnTitleFontColor is not a string', () => {
      const fp = makeFieldPosition({ columnTitleFontColor: 12345 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnTitleFontStyle', () => {
    it('Should pass when columnTitleFontStyle is missing', () => {
      const { columnTitleFontStyle, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleFontStyle is a string', () => {
      const validStyles = ['italic', 'normal', 'futureCustomStyle'];
      for (const style of validStyles) {
        const fp = makeFieldPosition({ columnTitleFontStyle: style });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when columnTitleFontStyle is not a string', () => {
      const fp = makeFieldPosition({ columnTitleFontStyle: false });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

  });

  describe('columnTitleFontWeight', () => {

    it('Should pass when columnTitleFontWeight is missing', () => {
      const { columnTitleFontWeight, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleFontWeight is a valid string', () => {
      const allowedFontWeights = ['normal', 'bold', 'futureCustomWeight'];
      for (const weight of allowedFontWeights) {
        const fp = makeFieldPosition({ columnTitleFontWeight: weight });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when columnTitleFontWeight is not a string', () => {
      const fp = makeFieldPosition({ columnTitleFontWeight: 700 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnTitleTextAlign', () => {
    it('Should pass when columnTitleTextAlign is missing', () => {
      const { columnTitleTextAlign, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleTextAlign is a string', () => {
      const validAligns = ['left', 'center', 'right', 'futureCustomAlign'];
      for (const align of validAligns) {
        const fp = makeFieldPosition({ columnTitleTextAlign: align });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when columnTitleTextAlign is not a string', () => {
      const fp = makeFieldPosition({ columnTitleTextAlign: null });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnTitleTextTransform', () => {
    it('Should pass when columnTitleTextTransform is missing', () => {
      const { columnTitleTextTransform, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleTextTransform is a string', () => {
      const validTransforms = ['uppercase', 'none', 'futureCustomTransform'];
      for (const transform of validTransforms) {
        const fp = makeFieldPosition({ columnTitleTextTransform: transform });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when columnTitleTextTransform is not a string', () => {
      const fp = makeFieldPosition({ columnTitleTextTransform: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnTitleTextDecoration', () => {
    it('Should pass when columnTitleTextDecoration is missing', () => {
      const { columnTitleTextDecoration, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleTextDecoration is a string', () => {
      const validDecorations = ['underline', 'none', 'futureCustomDecoration'];
      for (const decoration of validDecorations) {
        const fp = makeFieldPosition({ columnTitleTextDecoration: decoration });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when columnTitleTextDecoration is not a string', () => {
      const fp = makeFieldPosition({ columnTitleTextDecoration: {} });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnTitleBackgroundColor', () => {
    it('Should pass when columnTitleBackgroundColor is missing', () => {
      const { columnTitleBackgroundColor, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitleBackgroundColor is a string', () => {
      const fp = makeFieldPosition({ columnTitleBackgroundColor: '#00FF00' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when columnTitleBackgroundColor is not a string', () => {
      const fp = makeFieldPosition({ columnTitleBackgroundColor: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnTitlePadding', () => {
    it('Should pass when columnTitlePadding is missing', () => {
      const { columnTitlePadding, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnTitlePadding is a number', () => {
      const fp = makeFieldPosition({ columnTitlePadding: 6 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when columnTitlePadding is not a number', () => {
      const fp = makeFieldPosition({ columnTitlePadding: 'not-a-number' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('titleDisplay', () => {
    it('Should pass when titleDisplay is missing', () => {
      const { titleDisplay, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when titleDisplay is a valid string', () => {
      const validDisplays = ['inline', 'none', 'futureCustomDisplay'];
      for (const display of validDisplays) {
        const fp = makeFieldPosition({ titleDisplay: display });
        const doc = makeDoc([fp]);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      }
    });

    it('Should fail when titleDisplay is not a string', () => {
      const fp = makeFieldPosition({ titleDisplay: 1 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('rowIndex', () => {
    it('Should pass when rowIndex is missing', () => {
      const { rowIndex, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when rowIndex is a number', () => {
      const fp = makeFieldPosition({ rowIndex: 2 });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when rowIndex is not a number', () => {
      const fp = makeFieldPosition({ rowIndex: 'not-a-number' });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('column', () => {
    it('Should pass when column is missing', () => {
      const { column, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when column is a string', () => {
      const fp = makeFieldPosition({ column: 'col1' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when column is not a string', () => {
      const fp = makeFieldPosition({ column: 123 });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('columnType', () => {
    it('Should pass when columnType is missing', () => {
      const { columnType, ...rest } = makeFieldPosition();
      const fp = { ...rest };
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when columnType is a string', () => {
      const fp = makeFieldPosition({ columnType: 'text' });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when columnType is not a string', () => {
      const fp = makeFieldPosition({ columnType: false });
      const doc = makeDoc([fp]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('Extends CoreStyles', () => {
    it('Should pass when any CoreStyles are deffined', () => {
      // Test that all CoreStyles properties used on FieldPosition are accepted
      const coreStylesProps = {
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#123456',
        backgroundColor: '#abcdef',
        borderColor: '#000000',
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 4,
        padding: 8,
        margin: 10,
        opacity: 0.8,
        boxShadow: '2px 2px 4px #000000',
        lineHeight: 1.5,
        letterSpacing: 1.2,
        textDecoration: 'underline',
        zIndex: 5,
      };

      const fp = makeFieldPosition({ ...coreStylesProps });
      const doc = makeDoc([fp]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

  });


});
