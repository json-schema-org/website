/* eslint-disable linebreak-style */
import { useState } from 'react';
import Ajv from 'ajv';
import Editor from '@monaco-editor/react';

interface ValidationResult {
  valid: boolean;
  errors?: { message: string; path?: string }[];
}

export default function SchemaValidator() {
  const [schema, setSchema] = useState<string>(
    JSON.stringify(
      {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' },
        },
        required: ['name'],
      },
      null,
      2,
    ),
  );
  const [jsonData, setJsonData] = useState<string>(
    JSON.stringify(
      {
        name: 'John Doe',
        age: 30,
      },
      null,
      2,
    ),
  );
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateSchema = () => {
    console.log('Validate button clicked');
    setIsValidating(true);

    try {
      const schemaObj = JSON.parse(schema);
      const dataObj = JSON.parse(jsonData);

      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schemaObj);
      const valid = validate(dataObj);

      if (valid) {
        setResult({ valid: true });
      } else {
        setResult({
          valid: false,
          errors:
            validate.errors?.map((err) => ({
              message: err.message || 'Unknown error',
              path: err.instancePath || '/',
            })) || [],
        });
      }
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        valid: false,
        errors: [
          { message: error instanceof Error ? error.message : 'Unknown error' },
        ],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetValidator = () => {
    setResult(null);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Schema Editor */}
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold mb-2 text-slate-900 dark:text-white'>
            JSON Schema
          </h3>
          <div className='border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden'>
            <Editor
              height='350px'
              defaultLanguage='json'
              value={schema}
              onChange={(value) => {
                setSchema(value || '');
                resetValidator();
              }}
              theme='vs-dark'
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* JSON Data Editor */}
        <div className='flex flex-col'>
          <h3 className='text-lg font-semibold mb-2 text-slate-900 dark:text-white'>
            JSON Data
          </h3>
          <div className='border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden'>
            <Editor
              height='350px'
              defaultLanguage='json'
              value={jsonData}
              onChange={(value) => {
                setJsonData(value || '');
                resetValidator();
              }}
              theme='vs-dark'
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* Validate Button */}
      <div className='flex justify-center'>
        <button
          type='button'
          onClick={validateSchema}
          disabled={isValidating}
          className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed'
        >
          {isValidating ? 'Validating...' : 'Validate'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className='mt-4'>
          {result.valid ? (
            <div className='p-4 bg-green-50 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg'>
              <div className='flex items-center gap-2'>
                <span className='text-2xl text-green-600'>✓</span>
                <span className='text-green-700 dark:text-green-300 font-semibold text-lg'>
                  Valid! Data matches schema.
                </span>
              </div>
            </div>
          ) : (
            <div className='p-4 bg-red-50 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-2xl text-red-600'>✗</span>
                <span className='text-red-700 dark:text-red-300 font-semibold text-lg'>
                  Invalid! Errors found:
                </span>
              </div>
              <ul className='list-disc list-inside space-y-1'>
                {result.errors?.map((err, index) => (
                  <li
                    key={index}
                    className='text-red-600 dark:text-red-400 font-mono text-sm'
                  >
                    {err.path && (
                      <span className='font-semibold'>{err.path}: </span>
                    )}
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
