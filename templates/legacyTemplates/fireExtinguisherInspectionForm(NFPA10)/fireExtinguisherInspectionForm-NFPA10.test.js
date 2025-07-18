const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');
const template = require('./fireExtinguisherInspectionForm-NFPA10.template.json');

describe('Fire Extinguisher Inspection Form (NFPA 10) Validation', () => {

  it('should be valid according to joyfill-schema.json', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const valid = validate(template);

    if (!valid) {
      console.error(validate.errors);
    }

    expect(valid).toBe(true);
  });

});
