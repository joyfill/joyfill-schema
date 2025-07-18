const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');
const template = require('./canULC-S536 2019.template.json');

describe('can ULC-S536 2019 Template AJV validation', () => {

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
