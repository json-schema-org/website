import React, { useState, useEffect } from 'react';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Highlight from 'react-syntax-highlighter';

async function fetchData() {
  const response = await fetch('/getting-started-examples.json');
  const data = await response.json();
  return data;
}

const GettingStarted = () => {
  const intitalSchemaData = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://example.com/product.schema.json',
    title: 'Product',
    description: 'A product from Acmes catalog',
    type: 'object',
    properties: {
      productId: {
        description: 'The unique identifier for a product',
        type: 'integer',
      },
      productName: {
        description: 'Name of the product',
        type: 'string',
      },
      price: {
        description: 'The price of the product',
        type: 'number',
        exclusiveMinimum: 0,
      },
      tags: {
        description: 'Tags for the product',
        type: 'array',
        items: {
          type: 'string',
        },
        minItems: 1,
        uniqueItems: true,
      },
      dimensions: {
        type: 'object',
        properties: {
          length: {
            type: 'number',
          },
          width: {
            type: 'number',
          },
          height: {
            type: 'number',
          },
        },
        required: ['length', 'width', 'height'],
      },
      warehouseLocation: {
        description:
          'Coordinates of the warehouse where the product is located.',
        $ref: 'https://example.com/geographical-location.schema.json',
      },
    },
    required: ['productId', 'productName', 'price'],
  };

  const [options, setOptions] = useState([]);
  const [instances, setInstances] = useState([
    {
      name: 'Valid instance',
      default: true,
      valid: true,
      file: '/getting-started-examples/instances/default-ok.json',
      details: 'This is a valid JSON instance for the provided JSON Schema',
    },
    {
      name: 'Invalid instance',
      default: false,
      valid: false,
      file: '/getting-started-examples/instances/default-ko.json',
      details: 'This is an invalid JSON instance for the provided JSON Schema',
    },
  ]);
  const [details, setDetails] = useState([
    'This is a valid JSON instance for the provided JSON Schema',
    true,
  ]);
  const [fetchedSchema, setFetchedSchema] = useState(intitalSchemaData);
  const [fetchedInstance, setFetchedInstance] = useState(instances[0]);

  useEffect(() => {
    fetchData().then((data) => setOptions(data));
  }, []);

  const handleSchemaChange = async (e: any) => {
    const selectedSchema = options.find(
      // @ts-ignore
      (schema) => schema.file === e.target.value,
    );

    if (selectedSchema) {
      // @ts-ignore
      setInstances(selectedSchema.instances);
      const schemaResponse = await fetch(e.target.value);
      const schemaData = await schemaResponse.json();
      setFetchedSchema(schemaData);
    } else {
      setInstances([]);
      setFetchedSchema(null!);
    }
  };

  const handleInstanceChange = async (e: any) => {
    const selectedInstance = instances.find(
      (instance) => instance.file === e.target.value,
    );

    if (selectedInstance) {
      setDetails([selectedInstance.details, selectedInstance.valid]);
      const instanceResponse = await fetch(e.target.value);
      const instanceData = await instanceResponse.json();
      setFetchedInstance(instanceData);
    } else {
      setFetchedInstance(null!);
    }
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex items-center flex-row justify-between mt-5 mb-3 '>
          <h2 className='text-h5 font-semibold'>JSON Schema</h2>
          <select
            name='Select a JSON Schema Validator'
            className='p-2 border dark:border-slate-300 border-slate-800 dark:bg-slate-900 rounded-md max-sm:text-[12px]'
            id='Examples'
            onChange={handleSchemaChange}
          >
            {options.map((option: any, id: number) => (
              <option key={id} value={option.file}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className='overflow-x-auto flex-basis-0 max-w-full min-w-0 shrink lg:max-w-[800px] xl:max-w-[900px]'>
          <Highlight
            wrapLines={true}
            wrapLongLines={true}
            customStyle={{
              borderRadius: 10,
              paddingTop: 15,
              paddingBottom: 10,
              paddingLeft: 10,
              marginBottom: 20,
              maxWidth: '100%',
            }}
            lineNumberStyle={{
              marginRight: 10,
            }}
            style={atomOneDark}
            showLineNumbers
            startingLineNumber={1}
            lineProps={() => {
              const isHighlighted = false;
              return {
                className: `${isHighlighted ? 'bg-code-editor-dark-highlight block ml-10 w-full' : ''} pr-8`,
              };
            }}
            codeTagProps={{
              className: 'mr-8',
            }}
          >
            {JSON.stringify(fetchedSchema, null, 2)}
          </Highlight>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='flex items-center flex-row justify-between mt-5 mb-3 '>
          <h2 className='text-h5 font-semibold'>JSON Instance</h2>
          <select
            name='Select a JSON Schema Validator'
            className='p-2 border dark:border-slate-300 border-slate-800 dark:bg-slate-900 rounded-md max-sm:text-[12px]'
            id='Examples'
            onChange={handleInstanceChange}
          >
            {instances.map((instance: any, id: number) => (
              <option key={id} value={instance.file}>
                {instance.name}
              </option>
            ))}
          </select>
        </div>
        <div className='overflow-x-auto flex-basis-0 max-w-full min-w-0 shrink lg:max-w-[800px] xl:max-w-[900px]'>
          <Highlight
            wrapLines={true}
            wrapLongLines={true}
            customStyle={{
              borderRadius: 10,
              paddingTop: 15,
              paddingBottom: 10,
              paddingLeft: 10,
              marginBottom: 20,
              maxWidth: '100%',
            }}
            lineNumberStyle={{
              marginRight: 10,
            }}
            style={atomOneDark}
            showLineNumbers
            startingLineNumber={1}
            lineProps={() => {
              const isHighlighted = false;
              return {
                className: `${isHighlighted ? 'bg-code-editor-dark-highlight block ml-10 w-full' : ''} pr-8`,
              };
            }}
            codeTagProps={{
              className: 'mr-8',
            }}
          >
            {JSON.stringify(fetchedInstance, null, 2)}
          </Highlight>
        </div>
        <h2 className='text-h5 font-semibold'>Instance Result</h2>
        <div className='flex bg-[#282c34] justify-between items-center text-white font-medium flex-row border p-5 rounded-xl'>
          <p>{details[0]}</p>

          {details[1] ? (
            <img src='/icons/green-tick.svg' alt='green tick' />
          ) : (
            <img src='/icons/red-cross.svg' alt='red cross' />
          )}
        </div>
      </div>
    </>
  );
};

export default GettingStarted;
