const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeDocWithStyles(styles) {
  return {
    files: [
      {
        _id: 'file_1',
        styles,
        pages: [],
        pageOrder: []
      }
    ],
    fields: []
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('CoreStyles JSON Schema Validation (via File.styles)', () => {

  describe('general', () => {

    it('Should pass when styles is an empty object on File.styles.', () => {
      const doc = makeDocWithStyles({});
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail when styles is not an object on File.styles.', () => {
      const doc = makeDocWithStyles('not-an-object');
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when CoreStyles are defined on a FieldPosition', () => {
      // CoreStyles properties to test
      const coreStylesProps = {
        titleFontSize: 16,
        titleFontColor: '#123456',
        titleFontStyle: 'italic',
        titleFontWeight: 'bold',
        titleTextAlign: 'center',
        titleTextTransform: 'uppercase',
        titleTextDecoration: 'underline',
        fontSize: 16,
        fontColor: '#123456',
        fontStyle: 'italic',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        textDecoration: 'underline',
        textOverflow: 'ellipsis',
        padding: 8,
        margin: 10,
        borderColor: '#000000',
        borderWidth: 2, 
        borderRadius: 4,
        backgroundColor: '#abcdef',
      };

      const doc = {
        files: [
          {
            _id: 'file_1',
            pages: [
              {
                _id: 'page_1',
                name: 'page_1',
                fieldPositions: [
                  {
                    type: 'text',
                    field: 'field_1',
                    displayType: 'text',
                    width: 100,
                    height: 100,
                    x: 0,
                    y: 0,
                    _id: 'fp_1',
                    ...coreStylesProps
                  }
                ],
                width: 100,
                height: 100,
                cols: 4,
                rowHeight: 1,
                layout: 'grid',
                presentation: 'normal'
              }
            ],
            pageOrder: []
          }
        ],
        fields: []
      };

      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

  });

  // Forward compatibility unknowns
  describe('forward compatibility', () => {
    it('Should pass when styles includes unknown properties.', () => {
      const styles = { customProp: { a: 1 }, another: true };
      const doc = makeDocWithStyles(styles);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // titleFontSize
  describe('titleFontSize', () => {
    it('Should pass when titleFontSize is a number', () => {
      const doc = makeDocWithStyles({ titleFontSize: 16 });
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when titleFontSize is not a number', () => {
      const doc = makeDocWithStyles({ titleFontSize: '16' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // titleFontColor
  describe('titleFontColor', () => {
    it('Should pass when titleFontColor is a string', () => {
      const doc = makeDocWithStyles({ titleFontColor: '#000' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when titleFontColor is not a string', () => {
      const doc = makeDocWithStyles({ titleFontColor: 0 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // titleFontStyle
  describe('titleFontStyle', () => {

    it('Should pass when titleFontStyle is "normal"', () => {
      const doc = makeDocWithStyles({ titleFontStyle: 'normal' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass when titleFontStyle is "italic"', () => {
      const doc = makeDocWithStyles({ titleFontStyle: 'italic' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass when titleFontStyle is unknown string value', () => {
      const doc = makeDocWithStyles({ titleFontStyle: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // titleFontWeight
  describe('titleFontWeight', () => {

    it('Should pass when titleFontWeight is a bold', () => {
      const doc = makeDocWithStyles({ titleFontWeight: 'bold' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should pass when titleFontWeight is unknown string value', () => {
      const doc = makeDocWithStyles({ titleFontWeight: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });

    it('Should fail when titleFontWeight is not a string', () => {
      const doc = makeDocWithStyles({ titleFontWeight: 600 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // titleTextAlign
  describe('titleTextAlign', () => {
    it('Should pass when titleTextAlign is "left"', () => {
      const doc = makeDocWithStyles({ titleTextAlign: 'left' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when titleTextAlign is "center"', () => {
      const doc = makeDocWithStyles({ titleTextAlign: 'center' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when titleTextAlign is "right"', () => {
      const doc = makeDocWithStyles({ titleTextAlign: 'right' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when titleTextAlign is unknown string value', () => {
      const doc = makeDocWithStyles({ titleTextAlign: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // titleTextTransform
  describe('titleTextTransform', () => {
    it('Should pass when titleTextTransform is "none"', () => {
      const doc = makeDocWithStyles({ titleTextTransform: 'none' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when titleTextTransform is "uppercase"', () => {
      const doc = makeDocWithStyles({ titleTextTransform: 'uppercase' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when titleTextTransform is unknown string value', () => {
      const doc = makeDocWithStyles({ titleTextTransform: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // titleTextDecoration
  describe('titleTextDecoration', () => {
    it('Should pass when titleTextDecoration is "none"', () => {
      const doc = makeDocWithStyles({ titleTextDecoration: 'none' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when titleTextDecoration is "underline"', () => {
      const doc = makeDocWithStyles({ titleTextDecoration: 'underline' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when titleTextDecoration is unknown string value', () => {
      const doc = makeDocWithStyles({ titleTextDecoration: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // fontSize
  describe('fontSize', () => {
    it('Should pass when fontSize is a number', () => {
      const doc = makeDocWithStyles({ fontSize: 14 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when fontSize is not a number', () => {
      const doc = makeDocWithStyles({ fontSize: '14' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // fontStyle
  describe('fontStyle', () => {
    it('Should pass when fontStyle is "normal" or "italic"', () => {
      const doc1 = makeDocWithStyles({ fontStyle: 'normal' });
      const doc2 = makeDocWithStyles({ fontStyle: 'italic' });
      expect(runValidation(doc1).isValid).toBe(true);
      expect(runValidation(doc2).isValid).toBe(true);
    });
    it('Should pass when fontStyle is unknown string value', () => {
      const doc = makeDocWithStyles({ fontStyle: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // fontWeight
  describe('fontWeight', () => {
    it('Should pass when fontWeight is a string', () => {
      const doc = makeDocWithStyles({ fontWeight: 'bold' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when fontWeight is unknown string value', () => {
      const doc = makeDocWithStyles({ fontWeight: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // textAlign
  describe('textAlign', () => {
    it('Should pass when textAlign is "left"|"center"|"right"', () => {
      const d1 = makeDocWithStyles({ textAlign: 'left' });
      const d2 = makeDocWithStyles({ textAlign: 'center' });
      const d3 = makeDocWithStyles({ textAlign: 'right' });
      expect(runValidation(d1).isValid).toBe(true);
      expect(runValidation(d2).isValid).toBe(true);
      expect(runValidation(d3).isValid).toBe(true);
    });
    it('Should pass when textAlign is unknown string value', () => {
      const doc = makeDocWithStyles({ textAlign: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // textTransform
  describe('textTransform', () => {
    it('Should pass when textTransform is "none"|"uppercase"', () => {
      const d1 = makeDocWithStyles({ textTransform: 'none' });
      const d2 = makeDocWithStyles({ textTransform: 'uppercase' });
      expect(runValidation(d1).isValid).toBe(true);
      expect(runValidation(d2).isValid).toBe(true);
    });
    it('Should pass when textTransform is unknown string value', () => {
      const doc = makeDocWithStyles({ textTransform: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // textDecoration
  describe('textDecoration', () => {
    it('Should pass when textDecoration is "none"|"underline"', () => {
      const d1 = makeDocWithStyles({ textDecoration: 'none' });
      const d2 = makeDocWithStyles({ textDecoration: 'underline' });
      expect(runValidation(d1).isValid).toBe(true);
      expect(runValidation(d2).isValid).toBe(true);
    });
    it('Should pass when textDecoration is unknown string value', () => {
      const doc = makeDocWithStyles({ textDecoration: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // textOverflow
  describe('textOverflow', () => {
    it('Should pass when textOverflow is empty string', () => {
      const doc = makeDocWithStyles({ textOverflow: '' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when textOverflow is "ellipsis"', () => {
      const doc = makeDocWithStyles({ textOverflow: 'ellipsis' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should pass when textOverflow is unknown string value', () => {
      const doc = makeDocWithStyles({ textOverflow: 'futureCustomValue' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  // padding
  describe('padding', () => {
    it('Should pass when padding is a number', () => {
      const doc = makeDocWithStyles({ padding: 8 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when padding is not a number', () => {
      const doc = makeDocWithStyles({ padding: '8' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // margin
  describe('margin', () => {
    it('Should pass when margin is a number', () => {
      const doc = makeDocWithStyles({ margin: 4 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when margin is not a number', () => {
      const doc = makeDocWithStyles({ margin: '4' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // borderColor
  describe('borderColor', () => {
    it('Should pass when borderColor is a string', () => {
      const doc = makeDocWithStyles({ borderColor: '#000' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when borderColor is not a string', () => {
      const doc = makeDocWithStyles({ borderColor: 123 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // borderRadius
  describe('borderRadius', () => {
    it('Should pass when borderRadius is a number', () => {
      const doc = makeDocWithStyles({ borderRadius: 2 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when borderRadius is not a number', () => {
      const doc = makeDocWithStyles({ borderRadius: '2' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // borderWidth
  describe('borderWidth', () => {
    it('Should pass when borderWidth is a number', () => {
      const doc = makeDocWithStyles({ borderWidth: 1 });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when borderWidth is not a number', () => {
      const doc = makeDocWithStyles({ borderWidth: '1' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // backgroundColor
  describe('backgroundColor', () => {
    it('Should pass when backgroundColor is a string', () => {
      const doc = makeDocWithStyles({ backgroundColor: '#fff' });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
    it('Should fail when backgroundColor is not a string', () => {
      const doc = makeDocWithStyles({ backgroundColor: false });
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });


});
