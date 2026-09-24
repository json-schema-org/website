import React, { useEffect } from 'react';

export default function SlackRedirect() {
  useEffect(() => {
    window.location.href = 'https://json-schema.org/slack';
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-5'>
      <p className='text-lg'>Redirecting to JSON Schema Slack workspace...</p>
      <p className='text-lg'>
        If you are not redirected automatically,{' '}
        <a
          href='https://json-schema.org/slack'
          className='text-blue-600 underline hover:text-blue-800'
        >
          click here
        </a>
      </p>
    </div>
  );
}
