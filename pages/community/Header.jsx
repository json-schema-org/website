import React from 'react';
import Heading from './Heading';

export default function Header() {
  return (
    <div
      className='text-center flex justify-center flex-col items-center mt-10 md:mt-0 w-fit h-fit'
      data-testid='Header-hero-heading'
    >
      <Heading
        className='bg-gradient-to-r from-startBlue from-1.95% to-endBlue bg-gradient-to-r from-startBlue to-endBlue text-transparent bg-clip-text font-bold'
        level='h6'
        typeStyle='heading-xs'
      >
        JSON Schema Community
      </Heading>
      <div className='mt-8' data-testid='Header-heading-1'>
        <Heading level='h1' typeStyle='heading-xl' className=''>
          <span className='title  block md:-mt-1 leading-[3rem] md:leading-[3.5rem] '>
            Welcome to the
            <br /> JSON Schema Community
          </span>
        </Heading>
      </div>
      <div className='mt-5 w-5/6' data-testid='Header-heading-2'>
        <Heading
          level='h2'
          typeStyle='body-md'
          textColor='text-gray-700'
          className='text-slate-500 text-sm'
        >
          With over 60 million weekly downloads, JSON Schema has a large and
          active developer community across the world. Join the Community to
          learn, share ideas, ask questions, develop JSON Schema tooling and
          build new connections. sharing ideas, and building connections.
        </Heading>
      </div>
      <div className='mt-8'>
        <button
          className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none'
          onClick={() =>
            window.open(
              'https://github.com/orgs/json-schema-org/discussions',
              '_self',
            )
          }
        >
          Join Discussions
        </button>
      </div>
    </div>
  );
}
