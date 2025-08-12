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
  // Minimal valid JoyDoc with required fields and one valid file
  return {
    files: [
      {
        _id: 'file_1',
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
  // general
  describe('general', () => {
    it('Should pass when formulas is an empty array.', () => {
      const doc = makeValidJoyDocWithFormulas([]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when formulas contains a single valid formula.', () => {
      const doc = makeValidJoyDocWithFormulas([makeValidFormula()]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when formulas contains multiple valid formulas.', () => {
      const doc = makeValidJoyDocWithFormulas([
        makeValidFormula(),
        makeValidFormula({ _id: 'formula_2', desc: 'Product', expression: 'A*B' })
      ]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass validation when formulas property does not exist.', () => {
      const doc = makeValidJoyDocWithFormulas(undefined);
      delete doc.formulas;
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

  // Forward compatibility
  describe('Forward compatibility', () => {
    it('Should pass when unknown properties are present.', () => {
      const formula = makeValidFormula({ foo: 'bar', extra: 123 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when new type is added.', () => {
      const formula = makeValidFormula({ type: 'futureCustomType' });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

    it('Should pass when new scope is added.', () => {
      const formula = makeValidFormula({ scope: 'futureCustomScope' });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });

  });

  // _id property
  describe('_id property', () => {
    it('Should fail when _id is missing.', () => {
      const formula = makeValidFormula();
      delete formula._id;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is not a string.', () => {
      const formula = makeValidFormula({ _id: 123 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when _id is an empty string.', () => {
      const formula = makeValidFormula({ _id: '' });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when _id is a valid string.', () => {
      const formula = makeValidFormula({ _id: 'ok' });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // desc property
  describe('desc property', () => {
    it('Should fail when desc is missing.', () => {
      const formula = makeValidFormula();
      delete formula.desc;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when desc is not a string.', () => {
      const formula = makeValidFormula({ desc: 456 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when desc is a valid string.', () => {
      const formula = makeValidFormula({ desc: 'Any description' });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // type property
  describe('type property', () => {
    it('Should fail when type is missing.', () => {
      const formula = makeValidFormula();
      delete formula.type;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when type is not a string.', () => {
      const formula = makeValidFormula({ type: {} });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when type is a valid string.', () => {
      const formula = makeValidFormula({ type: 'calc' });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });

  // scope property
  describe('scope property', () => {
    it('Should fail when scope is missing.', () => {
      const formula = makeValidFormula();
      delete formula.scope;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when scope is not a string.', () => {
      const formula = makeValidFormula({ scope: [] });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when scope is a valid string.', () => {
      // Test for 'global'
      const formulaGlobal = makeValidFormula({ scope: 'global' });
      const docGlobal = makeValidJoyDocWithFormulas([formulaGlobal]);
      const { isValid: isValidGlobal, errors: errorsGlobal } = runValidation(docGlobal);
      if (!isValidGlobal) console.error(errorsGlobal);
      expect(isValidGlobal).toBe(true);

      // Test for 'private'
      const formulaPrivate = makeValidFormula({ scope: 'private' });
      const docPrivate = makeValidJoyDocWithFormulas([formulaPrivate]);
      const { isValid: isValidPrivate, errors: errorsPrivate } = runValidation(docPrivate);
      if (!isValidPrivate) console.error(errorsPrivate);
      expect(isValidPrivate).toBe(true);
    });
  });

  // expression property
  describe('expression property', () => {
    it('Should fail when expression is missing.', () => {
      const formula = makeValidFormula();
      delete formula.expression;
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should fail when expression is not a string.', () => {
      const formula = makeValidFormula({ expression: 789 });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });

    it('Should pass when expression is a valid string.', () => {
      const formula = makeValidFormula({ expression: 'A-B' });
      const doc = makeValidJoyDocWithFormulas([formula]);
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
  });


});
