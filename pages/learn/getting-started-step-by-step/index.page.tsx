import React, { useState, useEffect } from 'react';
import JsonEditor from '~/components/JsonEditor';
import fs from 'fs';

import { getLayout } from '~/components/Sidebar';
import Head from 'next/head';
import { Headline1 } from '~/components/Headlines';
import matter from 'gray-matter';
import StyledMarkdown from '~/components/StyledMarkdown';
import { SectionContext } from '~/context';
import { DocsHelp } from '~/components/DocsHelp';

export async function getStaticProps() {
  const block1 = fs.readFileSync(
    'pages/learn/getting-started-step-by-step/getting-started-step-by-step.md',
    'utf-8',
  );
  const { content: block1Content } = matter(block1);
  return {
    props: {
      blocks: [block1Content],
    },
  };
}

async function fetchData() {
  const response = await fetch('/getting-started-examples.json');
  const data = await response.json();
  return data;
}

export default function StyledValidator({ blocks }: { blocks: any[] }) {
  const newTitle = 'Creating your first schema';

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
  const [fetchedSchema, setFetchedSchema] = useState(intitalSchemaData);
  const [selectedSchema, setSelectedSchema] = useState(
    '/getting-started-examples/schemas/default.json',
  );
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

  useEffect(() => {
    fetchData().then((data) => setOptions(data));
  }, []);

  const handleChange = async (e: any) => {
    setSelectedSchema(e.target.value);
    const selectedSchemaObj = options.find(
      // @ts-ignore
      (schema) => schema.file === e.target.value,
    );

    if (selectedSchemaObj) {
      // @ts-ignore
      setInstances(selectedSchemaObj.instances);
      const schemaResponse = await fetch(selectedSchema);
      const schemaData = await schemaResponse.json();
      setFetchedSchema(schemaData);
    } else {
      setInstances([]);
      setFetchedSchema(null!);
    }
  };

  return (
    <SectionContext.Provider value='docs'>
      <Head>
        <title>{newTitle}</title>
      </Head>
      <Headline1>{newTitle}</Headline1>
      <StyledMarkdown markdown={blocks[0]} />

      <div className='flex flex-col'>
        <div className='flex items-center flex-row justify-between mt-5 mb-3 '>
          <h2 className='text-h5 font-semibold'>JSON Schema</h2>
          <select
            name='Select a JSON Schema Validator'
            className='p-2 border dark:border-slate-300 border-slate-800 dark:bg-slate-900 rounded-md max-sm:text-[12px]'
            id='Examples'
            onChange={handleChange}
          >
            {options.map((option: any, id: number) => (
              <option key={id} value={option.file}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>{selectedSchema}</div>
        <JsonEditor
          initialCode={JSON.stringify(fetchedSchema, null, 2)}
        ></JsonEditor>
      </div>

      <div className='flex flex-col'>
        <div className='flex items-center flex-row justify-between mt-5 mb-3 '>
          <h2 className='text-h5 font-semibold'>JSON Instance</h2>
          <select
            name='Select a JSON Schema Validator'
            className='p-2 border dark:border-slate-300 border-slate-800 dark:bg-slate-900 rounded-md max-sm:text-[12px]'
            id='Examples'
          >
            {instances.map((instance: any, id: number) => (
              <option key={id}>{instance.name}</option>
            ))}
          </select>
        </div>
        <div></div>
      </div>

      <DocsHelp />
    </SectionContext.Provider>
  );
}
StyledValidator.getLayout = getLayout;
