import React, { useState, useEffect } from 'react';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Highlight from 'react-syntax-highlighter';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function fetchData() {
  const response = await fetch('/data/getting-started-examples.json');
  const data = await response.json();

  const defaultSchemaData = data.find((data: any) => data.default === true);

  const schemaResp = await fetch(defaultSchemaData.file);
  const schemaData = await schemaResp.json();

  const defaultInstanceData = defaultSchemaData.instances.find(
    (instance: any) => instance.default === true,
  );

  const instanceResp = await fetch(defaultInstanceData.file);
  const instanceData = await instanceResp.json();

  return {
    data,
    schemaData,
    instanceData,
    initialInstance: defaultSchemaData.instances,
    initialDetails: [defaultInstanceData.details, defaultInstanceData.valid],
  };
}

interface SchemaOption {
  file: string;
  instances: InstanceOption[];
}

interface InstanceOption {
  file: string;
  details: string;
  valid: string;
}

const GettingStarted = () => {
  useEffect(() => {
    fetchData()
      .then(
        ({
          data,
          schemaData,
          instanceData,
          initialInstance,
          initialDetails,
        }) => {
          setOptions(data);
          setFetchedSchema(schemaData);
          setFetchedInstance(instanceData);
          setInstances(initialInstance);
          setDetails(initialDetails);
        },
      )
      .catch((e) => console.log('Error: ', e));
  }, []);

  const [options, setOptions] = useState<SchemaOption[]>([]);
  const [instances, setInstances] = useState<InstanceOption[]>([]);
  const [details, setDetails] = useState<string[]>(['', '']);
  const [fetchedSchema, setFetchedSchema] = useState();
  const [fetchedInstance, setFetchedInstance] = useState();

  const handleSchemaChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedSchema = options.find(
      (schema) => schema.file === e.target.value,
    );

    if (selectedSchema) {
      const schemaResponse = await fetch(e.target.value);
      const schData = await schemaResponse.json();

      setFetchedSchema(schData);
      setInstances(selectedSchema.instances);

      const instResp = await fetch(selectedSchema.instances[0].file);
      const instData = await instResp.json();
      setFetchedInstance(instData);
    } else {
      setInstances([]);
      setFetchedSchema(null!);
    }
  };

  const handleInstanceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedInstance = instances.find(
      (instance) => instance.file === e.target.value,
    ) as InstanceOption;

    if (selectedInstance) {
      const instanceResponse = await fetch(e.target.value);
      const instanceData = await instanceResponse.json();

      setFetchedInstance(instanceData);
      setDetails([selectedInstance.details, selectedInstance.valid]);
    } else {
      setFetchedInstance(undefined);
    }
  };

  const createZip = async () => {
    try {
      const zip = new JSZip();
      zip.file('schema.json', JSON.stringify(fetchedSchema, null, 2));
      zip.file('instance.json', JSON.stringify(fetchedInstance, null, 2));

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'getting-started-examples.zip');
      });
    } catch (e) {
      console.log('Error zipping files', e);
    }
  };

  return (
    <>
      <div className='relative'>
        <div className='flex flex-col'>
          <div className='flex items-end flex-row justify-between mt-5 mb-3 '>
            <h2 className='text-h6 font-semibold mb-1'>JSON Schema</h2>
            <div className='select-wrap'>
              <label className='mr-2 max-sm:text-[12px]'>
                Select a Schema:
              </label>
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
          <div className='flex items-end flex-row justify-between mt-5 mb-3 '>
            <h2 className='text-h6 font-semibold mb-1'>JSON Instance</h2>
            <div className='select-wrap'>
              <label className='mr-2 max-sm:text-[12px]'>
                Select an Instance:
              </label>
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
          <h2 className='text-h6 font-semibold'>Validation Result</h2>
          <div className='flex bg-[#282c34] justify-between items-center text-white font-medium flex-row border p-5 rounded-xl'>
            <p>{details[0]}</p>

            {details[1] ? (
              <img src='/icons/green-tick.svg' alt='green tick' />
            ) : (
              <img src='/icons/red-cross.svg' alt='red cross' />
            )}
          </div>
        </div>

        <button
          className='absolute right-0 my-4 text-[17px] bg-startBlue text-white px-3 py-1 rounded'
          onClick={createZip}
        >
          Download
        </button>
      </div>
    </>
  );
};

export default GettingStarted;
