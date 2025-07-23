const Ajv = require('ajv');
const schema = require('../../../joyfill-schema.json');
const template = require('./collectionFieldWithFutureProperties.template.json');

describe('collectionFieldWithFutureProperties.template.json AJV validation', () => {

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
