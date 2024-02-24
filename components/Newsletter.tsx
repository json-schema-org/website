import React, { useState } from 'react'
import classnames from 'classnames'

interface NewsletterFormProps {
  wrapperClassName?: string
  className?: string
  background?: 'white' | 'black'
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ wrapperClassName = '', className = '', background = 'white' }) => { 
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const formAction = "https://json-schema.us8.list-manage.com/subscribe/post?u=ef8789d5789a6aff8113a701d&amp;id=11103c248b&amp;f_id=00822be0f0"

  return (
    <section
      className={classnames('w-[100vw]  mx-auto flex items-center justify-center ', background === 'white' ? 'bg-white text-black' : 'bg-transparent text-white', wrapperClassName)}>
      <div className={classnames('w-full max-w-[900px] text-center px-5 py-9 relative', background === 'white' ? 'bg-white' : 'bg-transparent', className)}>
        
        <h3 className=' font-bold tracking-heading mb-4 text-h4 md:text-h3  px-5'>
            Subscribe to our newsletter to receive news about Json Schema.
        </h3>
        <p
          className='text-lg  mb-8'
        >
            We respect your inbox. No spam, promise ✌️
        </p>
        <form action={formAction} method="post" className='flex flex-col md:flex-row gap-4'>
          <input
            type='text'
            name='FNAME'
            placeholder='Your Name'
            className= {classnames('form-input block w-full py-3 text-lg h-[38px] sm:h-[45px]  sm:text-lg sm:leading-5 border-2  md:flex-1 rounded px-5 bg-gray-200 text-black', background == 'black' ? 'bg-white' : '')}
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
          <input
            type='email'
            name='EMAIL'
            placeholder='Your Email'
            className= {classnames('form-input block w-full py-3 text-lg sm:text-lg border-2 sm:leading-5   h-[38px]  sm:h-[45px]  md:flex-1 rounded px-5 bg-gray-200 text-black', background == 'black' ? 'bg-white' : '')}
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <button
            type='submit'
            className=' h-[40px] sm:h-[45px] mx-auto rounded border-2 bg-primary w-full font-semibold md:mt-0 md:flex-1 text-white'
            // className='bg-primary-500 hover:bg-primary-400 text-white bg-[#445cf4] transition-all duration-500 ease-in-out rounded-md px-4 py-3 text-md font-semibold tracking-heading w-full md:mt-0 md:flex-1'
          >
            <span className='inline-block'>Subscribe</span>
          </button>
          <div className="display: hidden">
            <input type="text" name="b_ef8789d5789a6aff8113a701d_11103c248b" value=""/>
          </div>
        </form>
      </div>

    </section>
  )
}

export default NewsletterForm
