import React from 'react';

export const Remember = () => {
  return (
    <div className='flex mt-7 flex-col rounded-md shadow-md border border-gray-200 p-4 mt-2'>
      <h3 className='flex text-h5mobile md:text-h5 font-semibold border-b pb-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          fill='currentColor'
          className='bi bi-info-circle-fill mr-3'
          viewBox='0 0 16 16'
        >
          <path d='M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z' />
        </svg>{' '}
        Remember
      </h3>
      <span className='inline-block mt-2 ml-2 font-medium antialiased font-semibold'>
        Contribute to the JSON Schema Docs
      </span>
      <div className='mt-2 mb-2'>
        Code isn't the only way to contribute to OSS; Docs are extremely import
        for the JSON Schema Ecosystem. At JSON Schema, We value Docs
        contributions as much as every other type of contribution!
      </div>
      <span className='inline-block mt-3 ml-2 font-medium antialiased font-semibold'>
        To get started as a Docs contributor:
      </span>
      <div className='mt-2 mb-2'>
        <ol className='list-decimal mt-2 mb-4 ml-5'>
          <li className='mt-1 leading-7'>
            Familiarize yourself with our project's{' '}
            <a
              className='underline'
              rel='noreferrer'
              href='https://github.com/json-schema-org/community/blob/main/CONTRIBUTING.md'
            >
              Contribution Guide
            </a>{' '}
            and our{' '}
            <a
              className='underline'
              rel='noreferrer'
              href='https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md'
            >
              Code of Conduct
            </a>
            .
          </li>
          <li className='mt-1 leading-7'>
            Head over to our{' '}
            <a
              className='underline'
              rel='noreferrer'
              href='https://github.com/orgs/json-schema-org/projects/16'
            >
              JSON Schema Docs Board
            </a>
            .
          </li>
          <li className='mt-1 leading-7'>
            Pick an issue you would like to contribute to and leave a comment
            introducing yourself. This is also the perfect place to leave any
            questions you may have on how to get started.
          </li>
          <li className='mt-1 leading-7'>
            If there is no work done in that Docs issue yet, feel free to open a
            PR and get started!
          </li>
        </ol>
      </div>
      <span className='inline-block ml-2 font-medium antialiased font-semibold'>
        Docs contributor questions?
      </span>
      <div className='mt-2 mb-2'>
        Do you have a documentation contributor question? Please leave a comment
        in the issue or PR or join the <code>#contribute</code> or{' '}
        <code>#documentation</code> channels on{' '}
        <a
          className='underline'
          rel='noreferrer'
          href='https://json-schema.org/slack'
        >
          Slack
        </a>{' '}
        and leave a message.
      </div>
    </div>
  );
};
