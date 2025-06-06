import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
const linkProps = { className: 'underline', rel: 'noreferrer' };

export const Remember = () => (
  <Card className='mt-7'>
    <CardHeader className='flex flex-row items-center space-x-3 pb-3 border-b'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='32'
        height='32'
        fill='currentColor'
        className='bi bi-info-circle-fill'
        viewBox='0 0 16 16'
      >
        <path d='M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z' />
      </svg>
      <CardTitle
        className='text-h5mobile md:text-h5'
        data-test='remember-heading'
      >
        Remember
      </CardTitle>
    </CardHeader>
    <CardContent className='space-y-6'>
      <div className='space-y-2'>
        <span
          className='antialiased font-semibold'
          data-test='contribute-docs-span'
        >
          Contribute to the JSON Schema Docs
        </span>
        <p data-test='contribute-docs-div'>
          Code isn't the only way to contribute to OSS; Docs are extremely
          import for the JSON Schema Ecosystem. At JSON Schema, We value Docs
          contributions as much as every other type of contribution!
        </p>
      </div>

      <div className='space-y-2'>
        <span
          className='antialiased font-semibold'
          data-test='get-started-span'
        >
          To get started as a Docs contributor:
        </span>
        <ol className='list-decimal ml-5 space-y-2'>
          <li className='leading-7'>
            Familiarize yourself with our project's{' '}
            <a
              {...linkProps}
              href='https://github.com/json-schema-org/community/blob/main/CONTRIBUTING.md'
            >
              Contribution Guide
            </a>{' '}
            and our{' '}
            <a
              {...linkProps}
              href='https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md'
            >
              Code of Conduct
            </a>
            .
          </li>
          <li className='leading-7'>
            Head over to our{' '}
            <a
              {...linkProps}
              href='https://github.com/orgs/json-schema-org/projects/16'
            >
              JSON Schema Docs Board
            </a>
            .
          </li>
          <li className='leading-7'>
            Pick an issue you would like to contribute to and leave a comment
            introducing yourself. This is also the perfect place to leave any
            questions you may have on how to get started.
          </li>
          <li className='leading-7'>
            If there is no work done in that Docs issue yet, feel free to open a
            PR and get started!
          </li>
        </ol>
      </div>

      <div className='space-y-2'>
        <span
          className='antialiased font-semibold'
          data-test='contribute-docs-questions-span'
        >
          Docs contributor questions?
        </span>
        <p data-test='contribute-docs-questions-div'>
          Do you have a documentation contributor question? Please leave a
          comment in the issue or PR or join the <code>#contribute</code> or{' '}
          <code>#documentation</code> channels on{' '}
          <a {...linkProps} href='https://json-schema.org/slack'>
            Slack
          </a>{' '}
          and leave a message.
        </p>
      </div>
    </CardContent>
  </Card>
);
