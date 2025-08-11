const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

function makeValidFormula(overrides = {}) {
  return {
    _id: 'formula_1',
    desc: 'Sum of A and B',
    type: 'calc',
    scope: 'global',
    expression: 'A+B',
    ...overrides
  };
}

function makeValidJoyDocWithFormulas(formulas) {
  // Minimal valid JoyDoc with required fields and files
  return {
    files: [
      {
        _id: 'file_1',
        name: 'Main',
        styles: {},
        pages: [],
        pageOrder: []
      }
    ],
    fields: [],
    formulas
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('Formula JSON Schema Validation', () => {
  // formulas property
  describe('formulas property', () => {
    it('Should pass validation when formulas property does not exist.', () => {
      const doc = makeValidJoyDocWithFormulas(undefined);
      delete doc.formulas;
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when formulas is an empty array.', () => {
      const doc = makeValidJoyDocWithFormulas([]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when formulas contains a valid formula object.', () => {
      const formulas = [makeValidFormula()];
      const doc = makeValidJoyDocWithFormulas(formulas);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when formulas contains multiple valid formula objects.', () => {
      const formulas = [
        makeValidFormula(),
        makeValidFormula({ _id: 'formula_2', desc: 'Product', expression: 'A*B' })
      ];
      const doc = makeValidJoyDocWithFormulas(formulas);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should fail validation when formulas is not an array.', () => {
      const doc = makeValidJoyDocWithFormulas('not-an-array');
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when formulas contains a non-object.', () => {
      const doc = makeValidJoyDocWithFormulas([123]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // Required properties in Formula
  describe('Formula required properties', () => {
    it('Should fail validation when _id is missing.', () => {
      const formula = makeValidFormula();
      delete formula._id;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when desc is missing.', () => {
      const formula = makeValidFormula();
      delete formula.desc;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when type is missing.', () => {
      const formula = makeValidFormula();
      delete formula.type;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when scope is missing.', () => {
      const formula = makeValidFormula();
      delete formula.scope;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when expression is missing.', () => {
      const formula = makeValidFormula();
      delete formula.expression;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // Type checks for required properties
  describe('Formula property types', () => {
    it('Should fail validation when _id is not a string.', () => {
      const formula = makeValidFormula({ _id: 123 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when desc is not a string.', () => {
      const formula = makeValidFormula({ desc: 456 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when type is not a string.', () => {
      const formula = makeValidFormula({ type: {} });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when scope is not a string.', () => {
      const formula = makeValidFormula({ scope: [] });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail validation when expression is not a string.', () => {
      const formula = makeValidFormula({ expression: 789 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  // Optional properties
  describe('Formula optional properties', () => {
    it('Should pass validation when optional properties are not present.', () => {
      const formula = makeValidFormula();
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(true);
    });
  });

  describe('Forward compatibility', () => {
    it('Should pass validation when unknown properties are present.', () => {
      const formula = makeValidFormula({ foo: 'bar', extra: 123 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

});
