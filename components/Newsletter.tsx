import React, { useState } from 'react';
import classnames from 'classnames';

interface NewsletterFormProps {
  wrapperClassName?: string;
  className?: string;
  background?: 'white' | 'black';
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  wrapperClassName = '',
  className = '',
  background = 'white',
}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const formAction =
    'https://json-schema.us8.list-manage.com/subscribe/post?u=ef8789d5789a6aff8113a701d&amp;id=11103c248b&amp;f_id=00822be0f0';

  return (
    <section
      className={classnames(
        'w-[100vw] mx-auto flex items-center justify-center ',
        background === 'white'
          ? 'bg-white dark:bg-transparent text-black'
          : 'bg-transparent text-white',
        wrapperClassName,
      )}
    >
      <div
        className={classnames(
          'w-full max-w-[1000px] text-center py-9 px-5 relative md:flex block',
          background === 'white'
            ? 'bg-white dark:bg-transparent'
            : 'bg-transparent',
          className,
          'justify-between',
        )}
      >
        <div className='md:w-[48%] w-full'>
          <p className='font-bold text-left tracking-heading mb-4 text-h4 dark:text-slate-50'>
            Subscribe to our newsletter to receive news about Json Schema.
          </p>
          <p className='text-lg text-left mb-8 dark:text-slate-50'>
            We respect your inbox. No spam, promise ✌️
          </p>
        </div>
        <aside className='px-5 py-10 md:w-[48%] w-full border-2 rounded'>
          <p className='uppercase font-bold dark:text-slate-50 text-left mb-5'>
            Join the JSON Schema Weekly mailing list
          </p>
          <form
            action={formAction}
            method='post'
            className='flex flex-col gap-4'
          >
            <input
              type='text'
              name='FNAME'
              placeholder='Name'
              className={classnames(
                'form-input block w-full py-3 text-lg h-[38px] sm:h-[45px] dark:bg-transparent sm:text-lg sm:leading-5 border-2 rounded px-5 text-black dark:text-white',
                background == 'black' ? 'bg-white' : '',
              )}
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
            />
            <input
              type='email'
              name='EMAIL'
              placeholder='Email'
              className={classnames(
                'form-input block w-full py-3 text-lg sm:text-lg border-2 sm:leading-5 h-[38px] dark:bg-transparent sm:h-[45px] rounded px-5 text-black dark:text-white',
                background == 'black' ? 'bg-white' : '',
              )}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <button
              type='submit'
              className=' h-[40px] sm:h-[45px] mx-auto rounded border-2 bg-primary w-full font-semibold md:mt-0 text-white'
              // className='bg-primary-500 hover:bg-primary-400 text-white bg-[#445cf4] transition-all duration-500 ease-in-out rounded-md px-4 py-3 text-md font-semibold tracking-heading w-full md:mt-0 md:flex-1'
            >
              <span className='inline-block'>Subscribe</span>
            </button>
            <div className='display: hidden'>
              <input
                type='text'
                name='b_ef8789d5789a6aff8113a701d_11103c248b'
                value=''
              />
            </div>
          </form>
        </aside>
      </div>
    </section>
  );
};

export default NewsletterForm;
