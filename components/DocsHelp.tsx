import React from 'react'

export const DocsHelp = () => {
  return (
    <div className='flex flex-col rounded-md shadow-md border border-gray-200 p-4 mt-10 mb-3'>
      <h3 className='flex text-h5mobile md:text-h5 border-b font-semibold pb-3'>
        <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' className='bi bi-info-circle-fill mr-3' viewBox='0 0 16 16'>
          <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z' />
        </svg> Need help?
      </h3>
      <div className='mt-2 mb-2'>
        Learning JSON Schema is often confusing, but don't worry, we are here to help! You can start a thread on <a target='_blank' className='underline' rel='noreferrer' href='https://github.com/orgs/json-schema-org/discussions/new?category=q-a'>GitHub Discussions</a>, connect with us on <a target='_blank' rel='noreferrer' className='underline' href='https://json-schema.org/slack'>Slack</a>, or join our live <a target='_blank' rel='noreferrer' className='underline' href='https://github.com/json-schema-org/community/discussions/34'>Office Hours</a>.
      </div>
      <div className='mt-1 mb-2'>
        We'd love to help!! ❤️
      </div>
    </div>
  )
}
