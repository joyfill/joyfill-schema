const Ajv = require('ajv');
const schema = require('../../joyfill-schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

// --- Condition property type tests ---
// Helper for making a single condition object
function makeCondition(overrides = {}) {
  return {
    file: 'file_1',
    page: 'page_1',
    field: 'fld_1',
    condition: '=',
    value: 'x',
    ...overrides,
  };
}

function makeLogic(overrides = {}) {
  return {
    action: 'show',
    eval: 'and',
    conditions: [
      makeCondition()
    ],
    ...overrides
  };
}

function makeDocWithPageLogic(logic) {
  return {
    files: [
      {
        _id: 'file_1',
        pages: [
          {
            _id: 'page_1',
            name: 'P',
            fieldPositions: [],
            width: 1, height: 1, cols: 1, rowHeight: 1, layout: 'grid', presentation: 'normal',
            logic
          }
        ],
        pageOrder: ['page_1']
      }
    ],
    fields: [{ _id: 'fld_1', file: 'file_1', type: 'text' }]
  };
}

function makeDocWithFieldLogic(logic) {
  return {
    files: [ { _id: 'file_1', pages: [], pageOrder: [] } ],
    fields: [{ _id: 'fld_1', file: 'file_1', type: 'text', logic }]
  };
}

function runValidation(doc) {
  const isValid = validate(doc);
  return { isValid, errors: validate.errors };
}

describe('Logic and Condition JSON Schema Validation', () => {

  describe('page logic', () => {
    it('Should pass with minimal valid Logic on Page.', () => {
      const doc = makeDocWithPageLogic(makeLogic());
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when conditions is not an array.', () => {
      const doc = makeDocWithPageLogic(makeLogic({ conditions: 'bad' }));
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });

  describe('field logic', () => {
    it('Should pass with minimal valid Logic on Field.', () => {
      const doc = makeDocWithFieldLogic(makeLogic());
      const { isValid, errors } = runValidation(doc);
      if (!isValid) console.error(errors);
      expect(isValid).toBe(true);
    });
    it('Should fail when action is not a valid string value.', () => {
      const doc = makeDocWithFieldLogic(makeLogic({ action: 123 }));
      const { isValid } = runValidation(doc);
      expect(isValid).toBe(false);
    });
  });



  // --- Logic property type tests ---
  describe('Logic property types', () => {

    describe('forward compatibility', () => {

      it('Should pass when unknown properties are present.', () => {
        const doc = makeDocWithPageLogic(makeLogic({ foo: 'bar', extra: 123 }));
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

    });

    describe('action (string)', () => {
      it('Should pass when "action" is a valid string', () => {
        const doc = makeDocWithPageLogic(makeLogic({ action: 'hide' }));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "action" is unknown string value', () => {
        const doc = makeDocWithPageLogic(makeLogic({ action: 'futureCustomValue' }));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "action" is not a string', () => {
        const doc = makeDocWithPageLogic(makeLogic({ action: 123 }));
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('eval (string)', () => {
      it('Should pass when "eval" is a valid string', () => {
        const doc = makeDocWithPageLogic(makeLogic({ eval: 'and' }));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "eval" is unknown string value', () => {
        const doc = makeDocWithPageLogic(makeLogic({ eval: 'futureCustomValue' }));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "eval" is not a string', () => {
        const doc = makeDocWithPageLogic(makeLogic({ eval: 123 }));
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('conditions (array)', () => {
      it('Should pass when "conditions" is a valid array', () => {
        const doc = makeDocWithPageLogic(makeLogic({ conditions: [ makeCondition() ] }));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "conditions" is an empty array', () => {
        const doc = makeDocWithPageLogic(makeLogic({ conditions: [] }));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "conditions" is not an array', () => {
        const doc = makeDocWithPageLogic(makeLogic({ conditions: 'not-an-array' }));
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('id (string, optional)', () => {
      it('Should pass when "id" is a string', () => {
        const doc = makeDocWithPageLogic(makeLogic({ id: 'logic_1' }));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "id" is not defined', () => {
        const doc = makeDocWithPageLogic(makeLogic({}));
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "id" is not a string', () => {
        const doc = makeDocWithPageLogic(makeLogic({ _id: 123 }));
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

  });



  describe('Condition property types', () => {

    describe('forward compatibility', () => {

      it('Should pass when unknown properties are present in a condition.', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ someUnknown: 42, anotherExtra: 'bar' }) ] });
        const doc = makeDocWithPageLogic(logic);
        const { isValid, errors } = runValidation(doc);
        if (!isValid) console.error(errors);
        expect(isValid).toBe(true);
      });

    });
    describe('file (string)', () => {
      it('Should pass when "file" is a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition() ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "file" is omitted', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ file: undefined }) ] });
        // Remove the "file" property entirely to simulate omission
        delete logic.conditions[0].file;
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });

      it('Should fail when "file" is not a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ file: 123 }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('page (string)', () => {
      it('Should pass when "page" is a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition() ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "page" is omitted', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ page: undefined }) ] });
        // Remove the "page" property entirely to simulate omission
        delete logic.conditions[0].page;
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });

      it('Should fail when "page" is not a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ page: 123 }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('_id (string, optional)', () => {
      it('Should pass when "_id" is a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ _id: 'cond_1' }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "_id" is omitted', () => {
        const logic = makeLogic({ conditions: [ makeCondition() ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "_id" is not a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ _id: 123 }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('field (string)', () => {
      it('Should pass when "field" is a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition() ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should fail when "field" is omitted', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ field: undefined }) ] });
        // Remove the "field" property entirely to simulate omission
        delete logic.conditions[0].field;
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });

      it('Should fail when "field" is not a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ field: 123 }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('condition (string)', () => {

      it('Should pass when "condition" is a valid string', () => {
        const validConditions = ['*=', 'null=', '=', '!=', '?=', '>', '<', 'futureCustomValue'];
        for (const cond of validConditions) {
          const logic = makeLogic({ conditions: [ makeCondition({ condition: cond }) ] });
          const doc = makeDocWithPageLogic(logic);
          expect(runValidation(doc).isValid).toBe(true);
        }
      });

      it('Should fail when "condition" is omitted', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ condition: undefined }) ] });
        // Remove the "condition" property entirely to simulate omission
        delete logic.conditions[0].condition;
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });

      it('Should fail when "condition" is not a string', () => {
        const logic = makeLogic({
          conditions: [
            makeCondition({ condition: 123 })
          ]
        });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(false);
      });
    });

    describe('value (any type)', () => {
      it('Should pass when "value" is a string', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ value: 'someValue' }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "value" is a number', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ value: 42 }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "value" is a boolean', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ value: true }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "value" is null', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ value: null }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "value" is an array', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ condition: 'in', value: [1, 2, 3] }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "value" is an object', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ value: { a: 1 } }) ] });
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });

      it('Should pass when "value" is omitted', () => {
        const logic = makeLogic({ conditions: [ makeCondition({ value: undefined }) ] });
        // Remove the "value" property entirely to simulate omission
        delete logic.conditions[0].value;
        const doc = makeDocWithPageLogic(logic);
        expect(runValidation(doc).isValid).toBe(true);
      });
    });
  });
});
