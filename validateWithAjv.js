// utils/validateWithAjv.js
function validateWithAjv(ajv, schema, data) {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  const filteredErrors = (validate.errors || []).filter(
    e => !(e.keyword === 'if' && e.params?.failingKeyword === 'then')
  );

  return { isValid, errors: filteredErrors };
}

module.exports = { validateWithAjv };