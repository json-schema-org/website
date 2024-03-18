import React from 'react';
import PropTypes from 'prop-types';

function Coloumn(props) {
  return (
    <div data-test-id={props.testId}>
      <a href={props.href}>
        <div
          className={`p-3 cursor-pointer border w-full  shadow-3xl rounded-[5px] p-[20px] ${props.className}`}
        >
          <div className='p-2 rounded-xl bg-transparent text-center w-min text-xs flex justify-between'>
            <span>{props.emoji}</span>
          </div>
          <div>
            <h1 className='text-primary-800 font-heading text-heading-md font-bold tracking-heading '>
              {props.h1}
            </h1>
          </div>
          <div>
            <p>{props.p}</p>
          </div>
          <div className='text-right w-full flex justify-end'>
            <svg className='w-[20px]' viewBox='0 0 32 32'>
              <path d='M25,0H7A7,7,0,0,0,0,7V25a7,7,0,0,0,7,7H25a7,7,0,0,0,7-7V7A7,7,0,0,0,25,0Zm5,25a5,5,0,0,1-5,5H7a5,5,0,0,1-5-5V7A5,5,0,0,1,7,2H25a5,5,0,0,1,5,5Z'></path>
              <path d='M24,7H14V9h7.59L7.29,23.29l1.41,1.41L23,10.41V18h2V8A1,1,0,0,0,24,7Z'></path>
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}

Coloumn.propTypes = {
  testId: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
  emoji: PropTypes.string,
  h1: PropTypes.string,
  p: PropTypes.string,
};

export default Coloumn;
