const Ajv = require("ajv");
const schema = require('../../joyfill-schema.json')
const template = require('./defaultEmptyTemplate.json'); 

const ajv = new Ajv( { allErrors: true, strict: false });

describe('defaultEmptyTemplate Validation', () => {

  it('should be a valid template', () => {

    const validate = ajv.compile(schema);
  
    const isValid = validate(template);
    
    expect(isValid).toBe(true);
  
  });

  
});
