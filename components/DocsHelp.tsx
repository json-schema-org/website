import React from 'react'

export const DocsHelp = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-12 rounded-md shadow-md border border-gray-200 p-6 mt-10 mb-3'>

      <div>
        <form className='flex flex-col'>
          <h3 className='font-bold mb-4 text-[18px]'>Did you find these docs helpful?</h3>
          <div className='mb-4'>
            <input className='hidden peer/feedback-survery-yes' type='radio' name='feedback-vote' id='feedback-survey-yes' aria-label='yes' value='Y'></input>
            <label className='px-[16px] py-[5px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md mx-1 peer-checked/feedback-survery-yes:bg-[#1f6feb] peer-checked/feedback-survery-yes:text-white' htmlFor='feedback-survey-yes'>
              <svg className='inline-block select-none overflow-visible' aria-hidden='true' focusable='false' role='img' viewBox='0 0 16 16' width='16' height='16' fill='currentColor'><path d='M8.834.066c.763.087 1.5.295 2.01.884.505.581.656 1.378.656 2.3 0 .467-.087 1.119-.157 1.637L11.328 5h1.422c.603 0 1.174.085 1.668.333.508.254.911.679 1.137 1.2.453.998.438 2.447.188 4.316l-.04.306c-.105.79-.195 1.473-.313 2.033-.131.63-.315 1.209-.668 1.672C13.97 15.847 12.706 16 11 16c-1.848 0-3.234-.333-4.388-.653-.165-.045-.323-.09-.475-.133-.658-.186-1.2-.34-1.725-.415A1.75 1.75 0 0 1 2.75 16h-1A1.75 1.75 0 0 1 0 14.25v-7.5C0 5.784.784 5 1.75 5h1a1.75 1.75 0 0 1 1.514.872c.258-.105.59-.268.918-.508C5.853 4.874 6.5 4.079 6.5 2.75v-.5c0-1.202.994-2.337 2.334-2.184ZM4.5 13.3c.705.088 1.39.284 2.072.478l.441.125c1.096.305 2.334.598 3.987.598 1.794 0 2.28-.223 2.528-.549.147-.193.276-.505.394-1.07.105-.502.188-1.124.295-1.93l.04-.3c.25-1.882.189-2.933-.068-3.497a.921.921 0 0 0-.442-.48c-.208-.104-.52-.174-.997-.174H11c-.686 0-1.295-.577-1.206-1.336.023-.192.05-.39.076-.586.065-.488.13-.97.13-1.328 0-.809-.144-1.15-.288-1.316-.137-.158-.402-.304-1.048-.378C8.357 1.521 8 1.793 8 2.25v.5c0 1.922-.978 3.128-1.933 3.825a5.831 5.831 0 0 1-1.567.81ZM2.75 6.5h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z'></path></svg>
            </label>
            <input className='hidden peer/feedback-survery-no' type='radio' name='feedback-vote' id='feedback-survey-no' aria-label='no' value='N'></input>
            <label className='px-[16px] py-[5px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md mx-1 peer-checked/feedback-survery-no:bg-[#da3633] peer-checked/feedback-survery-no:text-white' htmlFor='feedback-survey-no'>
              <svg className='inline-block select-none overflow-visible' aria-hidden='true' focusable='false' role='img' viewBox='0 0 16 16' width='16' height='16' fill='currentColor'><path d='M7.083 15.986c-.763-.087-1.499-.295-2.011-.884-.504-.581-.655-1.378-.655-2.299 0-.468.087-1.12.157-1.638l.015-.112H3.167c-.603 0-1.174-.086-1.669-.334a2.415 2.415 0 0 1-1.136-1.2c-.454-.998-.438-2.447-.188-4.316l.04-.306C.32 4.108.41 3.424.526 2.864c.132-.63.316-1.209.669-1.672C1.947.205 3.211.053 4.917.053c1.848 0 3.234.332 4.388.652l.474.133c.658.187 1.201.341 1.726.415a1.75 1.75 0 0 1 1.662-1.2h1c.966 0 1.75.784 1.75 1.75v7.5a1.75 1.75 0 0 1-1.75 1.75h-1a1.75 1.75 0 0 1-1.514-.872c-.259.105-.59.268-.919.508-.671.491-1.317 1.285-1.317 2.614v.5c0 1.201-.994 2.336-2.334 2.183Zm4.334-13.232c-.706-.089-1.39-.284-2.072-.479l-.441-.125c-1.096-.304-2.335-.597-3.987-.597-1.794 0-2.28.222-2.529.548-.147.193-.275.505-.393 1.07-.105.502-.188 1.124-.295 1.93l-.04.3c-.25 1.882-.19 2.933.067 3.497a.923.923 0 0 0 .443.48c.208.104.52.175.997.175h1.75c.685 0 1.295.577 1.205 1.335-.022.192-.049.39-.075.586-.066.488-.13.97-.13 1.329 0 .808.144 1.15.288 1.316.137.157.401.303 1.048.377.307.035.664-.237.664-.693v-.5c0-1.922.978-3.127 1.932-3.825a5.878 5.878 0 0 1 1.568-.809Zm1.75 6.798h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25Z'></path></svg>
            </label>
          </div>
          <p className='mb-3'>
            <label className='mb-1 block' htmlFor='feedback-comment'>
              <span className='font-bold text-[16px]'>Let us know what we do well</span>
              <span className='float-right text-[#7d8590] text-[14px]'>Optional</span>
            </label>
            <textarea className='py-2 text-[14px] min-h-[28px] px-[12px] align-middle border border-solid border-[#aaaaaa] rounded-md w-full overflow-hidden' name='feedback-comment' id='feedback-comment'></textarea>
          </p>
          <div className='my-[16px]'>
            <label className='mb-1 text-[12px] block' htmlFor='feedback-email'>
              <span className='font-bold text-[16px]'>If we can contact you with more questions, please enter you email address</span>
              <span className='float-right text-[#7d8590] text-[14px]'>Optional</span>
            </label>
            <input type='email' className='w-full bg-[#f9fafa] min-h-[28px] py-1.5 text-[14px] px-3 align-middle border border-solid border-[#aaaaaa] rounded-md' name='feedback-email' id='feedback-email' placeholder='email@example.com' />
          </div>
          <span className='text-[14px] text-[#7d8590]'>If you need a reply, please contact through community.</span>
          <div className='flex justify-end items-center mt-1 text-[14px]'>
            <button type='button' className='mr-3 px-[12px] py-[4px] cursor-pointer rounded-md hover:bg-gray-200'>Cancel</button>
            <button type='button' className='px-[12px] py-[4px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md hover:bg-gray-200'>Send</button>
          </div>
        </form>
      </div>
      <div>
        <h3 className='flex text-h5mobile md:text-[18px] border-b font-semibold pb-3 items-center'>
          <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' className='bi bi-info-circle-fill mr-3' viewBox='0 0 16 16'>
            <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z' />
          </svg> Need help?
        </h3>
        <p className='my-2 text-base'>
          Learning JSON Schema is often confusing, but don't worry, we are here to help! You can start a thread on <a target='_blank' className='underline' rel='noreferrer' href='https://github.com/orgs/json-schema-org/discussions/new?category=q-a'>GitHub Discussions</a>, connect with us on <a target='_blank' rel='noreferrer' className='underline' href='https://json-schema.org/slack'>Slack</a>, or join our live <a target='_blank' rel='noreferrer' className='underline' href='https://github.com/json-schema-org/community/discussions/34'>Office Hours</a>.
        </p>
        <div className='mt-1 mb-2 text-[15px]'>
          We'd love to help!! ❤️
        </div>
      </div>

    </div>
  )
}

