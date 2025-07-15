import fs from 'fs';
import path from 'path';
import { createGenerator } from 'ts-json-schema-generator';

const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));


/**
 * <--------------------NOTICE------------------->
 * JSON Schema Generation Script
 *
 * This script generates a raw JSON schema file (joyfill-schema.json) from the JoyDoc TypeScript type definitions.
 *
 */


// Schema generator configuration
const config = {
  path: path.resolve('./joydoc.types.ts'), 
  tsconfig: path.resolve('tsconfig.json'),
  type: 'Template',
  expose: 'export' as const,
  topRef: false,
  jsDoc: 'extended' as const,
  skipTypeCheck: true,
  additionalProperties: true,
  required: true,
  strictNullChecks: true
};

console.log('Generating schema...');

// Generate schema
const generator = createGenerator(config);
const schema = generator.createSchema(config.type);

if (!schema) {
  console.error('Error generating schema');
  process.exit(1);
}

// Inject version at top-level
(schema as any)['$joyfillSchemaVersion'] = packageJson.version;

// Define output path
const outputFile = path.resolve('joyfill-schema.json');

// Write schema to JSON file
fs.writeFileSync(outputFile, JSON.stringify(schema, null, 2));

console.log(`Schema successfully written to ${outputFile}`);
