const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeTableFieldWithColumns(columns) {
  return {
    _id: 'tbl_1',
    file: 'file_1',
    type: 'table',
    value: [{ _id: 'row_1' }],
    rowOrder: ['row_1'],
    tableColumns: columns,
    tableColumnOrder: columns.map(c => c._id)
  };
}

function baseDoc(columns) {
  return {
    files: [ { _id: 'file_1', pages: [], pageOrder: [] } ],
    fields: [ makeTableFieldWithColumns(columns) ]
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('TableColumn JSON Schema Validation', () => {

  describe('forward compatibility', () => {
    it('Should pass when type is an unknown string', (  ) => {
      const cols = [{ _id: 'c1', type: 'futureType' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass when unknown properties are present', () => {
      const cols = [{ _id: 'c1', type: 'text', unknownProperty: 'unknownValue' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
  });

  describe('TextColumn', () => {
    it('Should pass with minimal valid TextColumn.', () => {
      const cols = [{ _id: 'c1', type: 'text' }];
      const { isValid, errors } = runValidation(baseDoc(cols));
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when _id is missing.', () => {
      const cols = [{ type: 'text' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
    it('Should pass when value is a string.', () => {
      const cols = [{ _id: 'c1', type: 'text', value: 'abc' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should fail when value is not a string.', () => {
      const cols = [{ _id: 'c1', type: 'text', value: 1 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
  });

  describe('DropdownColumn', () => {
    it('Should pass with minimal valid DropdownColumn.', () => {
      const cols = [{ _id: 'c1', type: 'dropdown' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass with options and string value.', () => {
      const cols = [{ _id: 'c1', type: 'dropdown', options: [{ _id: 'o1', value: 'A' }], value: 'A' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should fail if options are missing required properties', () => {
      // Missing _id
      let cols = [{ _id: 'c1', type: 'dropdown', options: [{ value: 'A' }] }];
      let { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);

      // Missing value
      cols = [{ _id: 'c1', type: 'dropdown', options: [{ _id: 'o1' }] }];
      ({ isValid } = runValidation(baseDoc(cols)));
      expect(isValid).toBe(false);

      // Both _id and value missing
      cols = [{ _id: 'c1', type: 'dropdown', options: [{}] }];
      ({ isValid } = runValidation(baseDoc(cols)));
      expect(isValid).toBe(false);
    });
    it('Should fail when value is not a string.', () => {
      const cols = [{ _id: 'c1', type: 'dropdown', value: 1 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
    it('Should fail when value is not a string.', () => {
      const cols = [{ _id: 'c1', type: 'dropdown', value: 1 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
  });

  describe('MultiSelectColumn', () => {
    it('Should pass with minimal valid MultiSelectColumn.', () => {
      const cols = [{ _id: 'c1', type: 'multiSelect' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass with options and string[] value.', () => {
      const cols = [{ _id: 'c1', type: 'multiSelect', options: [{ _id: 'o1', value: 'A' }], value: ['A'] }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should fail if options are missing required properties', () => {
      // Missing _id
      let cols = [{ _id: 'c1', type: 'multiSelect', options: [{ value: 'A' }] }];
      let { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);

      // Missing value
      cols = [{ _id: 'c1', type: 'multiSelect', options: [{ _id: 'o1' }] }];
      ({ isValid } = runValidation(baseDoc(cols)));
      expect(isValid).toBe(false);

      // Both _id and value missing
      cols = [{ _id: 'c1', type: 'multiSelect', options: [{}] }];
      ({ isValid } = runValidation(baseDoc(cols)));
      expect(isValid).toBe(false);
    });
    it('Should fail when value is not an array of strings.', () => {
      const cols = [{ _id: 'c1', type: 'multiSelect', value: 'A' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
  });

  describe('ImageColumn', () => {
    it('Should pass with minimal valid ImageColumn.', () => {
      const cols = [{ _id: 'c1', type: 'image' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass with maxImageWidth/Height numbers.', () => {
      const cols = [{ _id: 'c1', type: 'image', maxImageWidth: 100, maxImageHeight: 50 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass with multi: true', () => {
      const cols = [{ _id: 'c1', type: 'image', multi: true }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass with multi: false', () => {
      const cols = [{ _id: 'c1', type: 'image', multi: false }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });

  });

  describe('NumberColumn', () => {
    it('Should pass with minimal valid NumberColumn.', () => {
      const cols = [{ _id: 'c1', type: 'number' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass when value is a number.', () => {
      const cols = [{ _id: 'c1', type: 'number', value: 3 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should fail when value is not a number.', () => {
      const cols = [{ _id: 'c1', type: 'number', value: '3' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
    it('Should fail when value is not a number.', () => {
      const cols = [{ _id: 'c1', type: 'number', value: '3' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
  });

  describe('DateColumn', () => {
    it('Should pass with minimal valid DateColumn.', () => {
      const cols = [{ _id: 'c1', type: 'date' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass when value is a number.', () => {
      const cols = [{ _id: 'c1', type: 'date', value: 1720900000000 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should fail when value is not a number.', () => {
      const cols = [{ _id: 'c1', type: 'date', value: '1720900000000' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
    it('Should fail when value is not a number.', () => {
      const cols = [{ _id: 'c1', type: 'date', value: '1720900000000' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
  });

  describe('BlockColumn', () => {
    it('Should pass with minimal valid BlockColumn.', () => {
      const cols = [{ _id: 'c1', type: 'block' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass when value is a string.', () => {
      const cols = [{ _id: 'c1', type: 'block', value: 'text' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should fail when value is not a string.', () => {
      const cols = [{ _id: 'c1', type: 'block', value: 1 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
    it('Should fail when value is not a string.', () => {
      const cols = [{ _id: 'c1', type: 'block', value: 1 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
  });

  describe('BarcodeColumn', () => {
    it('Should pass with minimal valid BarcodeColumn.', () => {
      const cols = [{ _id: 'c1', type: 'barcode' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass when value is a string.', () => {
      const cols = [{ _id: 'c1', type: 'barcode', value: '12345' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should fail when value is not a string.', () => {
      const cols = [{ _id: 'c1', type: 'barcode', value: 12345 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(false);
    });
  });

  describe('SignatureColumn', () => {
    it('Should pass with minimal valid SignatureColumn.', () => {
      const cols = [{ _id: 'c1', type: 'signature' }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
    it('Should pass with maxImage dimensions.', () => {
      const cols = [{ _id: 'c1', type: 'signature', maxImageWidth: 100, maxImageHeight: 50 }];
      const { isValid } = runValidation(baseDoc(cols));
      expect(isValid).toBe(true);
    });
  });
});
