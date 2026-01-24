/* eslint-disable linebreak-style */
import React, { useState, useRef, useCallback } from 'react';
import Ajv from 'ajv';
import Editor, { OnMount } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

interface ValidationResult {
  valid: boolean;
  errors?: { message: string; path?: string }[];
}

const DEFAULT_SCHEMA = `{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" }
  },
  "required": ["name"]
}`;

const DEFAULT_DATA = `{
  "name": "John Doe",
  "age": 30
}`;

export default function SchemaValidator() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Use refs to get current editor values
  const schemaEditorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const dataEditorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );

  const handleSchemaMount: OnMount = (editor) => {
    schemaEditorRef.current = editor;
  };

  const handleDataMount: OnMount = (editor) => {
    dataEditorRef.current = editor;
  };

  const validateSchema = useCallback(() => {
    console.log('Validate button clicked!');
    setIsValidating(true);
    setResult(null);

    // Get values directly from editors
    const schemaValue = schemaEditorRef.current?.getValue() || DEFAULT_SCHEMA;
    const dataValue = dataEditorRef.current?.getValue() || DEFAULT_DATA;

    console.log('Schema:', schemaValue);
    console.log('Data:', dataValue);

    try {
      const schemaObj = JSON.parse(schemaValue);
      const dataObj = JSON.parse(dataValue);

      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schemaObj);
      const valid = validate(dataObj);

      console.log('Validation result:', valid);

      if (valid) {
        setResult({ valid: true });
      } else {
        const errors =
          validate.errors?.map((err) => ({
            message: err.message || 'Unknown error',
            path: err.instancePath || '/',
          })) || [];
        console.log('Validation errors:', errors);
        setResult({ valid: false, errors });
      }
    } catch (error) {
      console.error('Parse/Validation error:', error);
      setResult({
        valid: false,
        errors: [
          {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        ],
      });
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleEditorChange = useCallback(() => {
    setResult(null);
  }, []);

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
              defaultValue={DEFAULT_SCHEMA}
              onMount={handleSchemaMount}
              onChange={handleEditorChange}
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
              defaultValue={DEFAULT_DATA}
              onMount={handleDataMount}
              onChange={handleEditorChange}
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
