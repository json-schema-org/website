import { useRouter } from 'next/router';
import React, { FormEvent, useRef, useState } from 'react';

export function DocsHelp() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const feedbackFormRef = useRef<HTMLFormElement>(null);

  async function createFeedbackHandler(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(feedbackFormRef.current!);
    formData.append('page', router.asPath);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://feedback-collector.json-schema.workers.dev/submit',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.ok) {
        console.log('Form submitted successfully!');
        submitFeedbackHandler('feedback');
      } else {
        console.error('Failed to submit form');
        setError('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const createGitHubIssueHandler = () => {
    const formData = new FormData(feedbackFormRef.current!);
    setIsSubmitting(true);
    try {
      const title = encodeURIComponent('Feedback on Documentation');
      const body = encodeURIComponent(`${formData.get('feedback-comment')}`);
      const url = `https://github.com/json-schema-org/website/issues/new?title=${title}&body=${body}`;

      window.open(url, '_blank');
      submitFeedbackHandler('github_issue');
    } catch (error) {
      console.error('Error creating GitHub issue:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitFeedbackHandler = (status: string) => {
    setIsFormOpen(false);
    setFeedbackStatus(status);
    setError('');
    feedbackFormRef.current!.reset();
  };

  return (
    <section className='mt-10 mb-4 text-gray-600'>
      <h2 className='text-[24px] font-semibold'>Need Help?</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-gray-600'>
        <div>
          <h3 className='text-xl font-semibold mb-3'>
            Did you find these docs helpful?
          </h3>

          {!feedbackStatus && (
            <div className='my-6 text-base'>
              <form
                className='flex flex-col'
                onSubmit={createFeedbackHandler}
                ref={feedbackFormRef}
              >
                <div className='mb-6'>
                  <input
                    className='hidden peer/feedback-survery-yes'
                    type='radio'
                    name='feedback-vote'
                    id='feedback-survey-yes'
                    aria-label='yes'
                    value='Y'
                  ></input>
                  <label
                    className='px-[16px] py-[8px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md peer-checked/feedback-survery-yes:bg-[#1f6feb] peer-checked/feedback-survery-yes:text-white hover:bg-gray-200'
                    htmlFor='feedback-survey-yes'
                    onClick={() => {
                      setIsFormOpen(true);
                    }}
                  >
                    <svg
                      className='inline-block select-none overflow-visible'
                      aria-hidden='true'
                      focusable='false'
                      role='img'
                      viewBox='0 0 16 16'
                      width='16'
                      height='16'
                      fill='currentColor'
                    >
                      <path d='M8.834.066c.763.087 1.5.295 2.01.884.505.581.656 1.378.656 2.3 0 .467-.087 1.119-.157 1.637L11.328 5h1.422c.603 0 1.174.085 1.668.333.508.254.911.679 1.137 1.2.453.998.438 2.447.188 4.316l-.04.306c-.105.79-.195 1.473-.313 2.033-.131.63-.315 1.209-.668 1.672C13.97 15.847 12.706 16 11 16c-1.848 0-3.234-.333-4.388-.653-.165-.045-.323-.09-.475-.133-.658-.186-1.2-.34-1.725-.415A1.75 1.75 0 0 1 2.75 16h-1A1.75 1.75 0 0 1 0 14.25v-7.5C0 5.784.784 5 1.75 5h1a1.75 1.75 0 0 1 1.514.872c.258-.105.59-.268.918-.508C5.853 4.874 6.5 4.079 6.5 2.75v-.5c0-1.202.994-2.337 2.334-2.184ZM4.5 13.3c.705.088 1.39.284 2.072.478l.441.125c1.096.305 2.334.598 3.987.598 1.794 0 2.28-.223 2.528-.549.147-.193.276-.505.394-1.07.105-.502.188-1.124.295-1.93l.04-.3c.25-1.882.189-2.933-.068-3.497a.921.921 0 0 0-.442-.48c-.208-.104-.52-.174-.997-.174H11c-.686 0-1.295-.577-1.206-1.336.023-.192.05-.39.076-.586.065-.488.13-.97.13-1.328 0-.809-.144-1.15-.288-1.316-.137-.158-.402-.304-1.048-.378C8.357 1.521 8 1.793 8 2.25v.5c0 1.922-.978 3.128-1.933 3.825a5.831 5.831 0 0 1-1.567.81ZM2.75 6.5h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z' />
                    </svg>
                  </label>
                  <input
                    className='hidden peer/feedback-survery-no'
                    type='radio'
                    name='feedback-vote'
                    id='feedback-survey-no'
                    aria-label='no'
                    value='N'
                  ></input>
                  <label
                    className='px-[16px] py-[8px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md mx-2 peer-checked/feedback-survery-no:bg-[#da3633] peer-checked/feedback-survery-no:text-white hover:bg-gray-200'
                    htmlFor='feedback-survey-no'
                    onClick={() => {
                      setIsFormOpen(true);
                    }}
                  >
                    <svg
                      className='inline-block select-none overflow-visible'
                      aria-hidden='true'
                      focusable='false'
                      role='img'
                      viewBox='0 0 16 16'
                      width='16'
                      height='16'
                      fill='currentColor'
                    >
                      <path d='M7.083 15.986c-.763-.087-1.499-.295-2.011-.884-.504-.581-.655-1.378-.655-2.299 0-.468.087-1.12.157-1.638l.015-.112H3.167c-.603 0-1.174-.086-1.669-.334a2.415 2.415 0 0 1-1.136-1.2c-.454-.998-.438-2.447-.188-4.316l.04-.306C.32 4.108.41 3.424.526 2.864c.132-.63.316-1.209.669-1.672C1.947.205 3.211.053 4.917.053c1.848 0 3.234.332 4.388.652l.474.133c.658.187 1.201.341 1.726.415a1.75 1.75 0 0 1 1.662-1.2h1c.966 0 1.75.784 1.75 1.75v7.5a1.75 1.75 0 0 1-1.75 1.75h-1a1.75 1.75 0 0 1-1.514-.872c-.259.105-.59.268-.919.508-.671.491-1.317 1.285-1.317 2.614v.5c0 1.201-.994 2.336-2.334 2.183Zm4.334-13.232c-.706-.089-1.39-.284-2.072-.479l-.441-.125c-1.096-.304-2.335-.597-3.987-.597-1.794 0-2.28.222-2.529.548-.147.193-.275.505-.393 1.07-.105.502-.188 1.124-.295 1.93l-.04.3c-.25 1.882-.19 2.933.067 3.497a.923.923 0 0 0 .443.48c.208.104.52.175.997.175h1.75c.685 0 1.295.577 1.205 1.335-.022.192-.049.39-.075.586-.066.488-.13.97-.13 1.329 0 .808.144 1.15.288 1.316.137.157.401.303 1.048.377.307.035.664-.237.664-.693v-.5c0-1.922.978-3.127 1.932-3.825a5.878 5.878 0 0 1 1.568-.809Zm1.75 6.798h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25Z' />
                    </svg>
                  </label>
                </div>

                {isFormOpen && (
                  <div>
                    <div className='mb-4'>
                      <p>
                        <label
                          className='mb-1 block'
                          htmlFor='feedback-comment'
                        >
                          <span className='font-bold text-[14px] block'>
                            Let us know your Feedback
                          </span>
                          <span className='float-right text-[#7d8590] text-[14px] block'>
                            Optional
                          </span>
                        </label>
                      </p>
                      <textarea
                        className='py-2 text-[14px] min-h-[28px] px-[12px] align-middle border border-solid border-[#aaaaaa] rounded-md w-full overflow-hidden'
                        name='feedback-comment'
                        id='feedback-comment'
                      />
                    </div>

                    <div className='flex justify-start items-center mt-1 text-[14px]'>
                      <button
                        type='submit'
                        className={`px-[16px] py-[7px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
                        disabled={isSubmitting}
                      >
                        <svg
                          className='inline-block select-none align-text-bottom mr-1'
                          aria-hidden='true'
                          role='img'
                          viewBox='0 0 16 16'
                          width='16'
                          height='16'
                          fill='currentColor'
                        >
                          <path d='M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2' />
                          <path d='m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2' />
                        </svg>
                        Submit Feedback
                      </button>
                      <span className='mx-2'>or</span>
                    </div>
                    <div className='flex justify-start items-center mt-1 text-[14px]'>
                      <button
                        type='button'
                        className={`px-[16px] py-[7px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200'}`}
                        disabled={isSubmitting}
                        onClick={createGitHubIssueHandler}
                      >
                        <svg
                          className='inline-block select-none align-text-bottom mr-1'
                          aria-hidden='true'
                          role='img'
                          viewBox='0 0 16 16'
                          width='16'
                          height='16'
                          fill='currentColor'
                        >
                          <path d='M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' />
                          <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z' />
                        </svg>
                        Create an issue
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {feedbackStatus === 'feedback' && (
            <div className='my-6 text-[14px]'>
              <p>Thank you! We received your feedback.</p>
            </div>
          )}

          {feedbackStatus === 'github_issue' && (
            <div className='my-6 text-[14px]'>
              <p>
                Thanks for creating an issue! Let's continue the discussion
                there!
              </p>
            </div>
          )}

          {error && (
            <div className='my-6 text-[14px]'>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className='text-xl font-semibold mb-3'>
            Help us make our docs great!
          </h3>

          <div className='my-6 text-[14px]'>
            <p>
              At JSON Schema, we value docs contributions as much as every other
              type of contribution!
            </p>
          </div>
          <div className='my-4 text-[14px]'>
            <a
              target='_blank'
              rel='noreferrer'
              className='px-[16px] py-[8px] cursor-pointer border-solid border-[#aaaaaa] border rounded-md hover:bg-gray-200'
              href='https://github.com/orgs/json-schema-org/projects/16'
            >
              <svg
                className='inline-block select-none align-text-bottom mr-1'
                aria-hidden='true'
                role='img'
                viewBox='0 0 16 16'
                width='16'
                height='16'
                fill='currentColor'
              >
                <path d='M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z' />
              </svg>
              Make a contribution
            </a>
          </div>
          <div className='my-2 text-[14px]'>
            <a
              target='_blank'
              rel='noreferrer'
              className='underline'
              href='https://github.com/json-schema-org/website/blob/main/CONTRIBUTING.md'
            >
              <svg
                className='inline-block select-none align-text-bottom mr-1'
                aria-hidden='true'
                role='img'
                viewBox='0 0 16 16'
                width='16'
                height='16'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 5 7h2.5V6A1.5 1.5 0 0 1 6 4.5zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5zM3 11.5A1.5 1.5 0 0 1 4.5 10h1A1.5 1.5 0 0 1 7 11.5v1A1.5 1.5 0 0 1 5.5 14h-1A1.5 1.5 0 0 1 3 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 9 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z'
                />
              </svg>
              Learn how to contribute
            </a>
          </div>
        </div>

        <div>
          <h3 className='text-xl font-semibold mb-3'>Still Need Help?</h3>

          <div className='my-6 text-[14px]'>
            <p>
              Learning JSON Schema is often confusing, but don't worry, we are
              here to help!.
            </p>
          </div>
          <div className='my-2 text-[14px]'>
            <a
              target='_blank'
              rel='noreferrer'
              className='underline'
              href='https://github.com/orgs/json-schema-org/discussions/new?category=q-a'
            >
              <svg
                className='inline-block select-none align-text-bottom mr-1'
                aria-hidden='true'
                role='img'
                viewBox='0 0 16 16'
                width='16'
                height='16'
                fill='currentColor'
              >
                <path d='M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z' />
              </svg>
              Ask the community on GitHub
            </a>
          </div>
          <div className='my-2 text-[14px]'>
            <a
              target='_blank'
              rel='noreferrer'
              className='underline'
              href='https://json-schema.org/slack'
            >
              <svg
                className='inline-block select-none align-text-bottom mr-1'
                aria-hidden='true'
                role='img'
                viewBox='0 0 16 16'
                width='16'
                height='16'
                fill='currentColor'
              >
                <path d='M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z' />
              </svg>
              Ask the community on Slack
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
