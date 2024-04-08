import React from 'react';
import Heading from './Heading';
import Button from './Button';
import PropTypes from 'prop-types';

export default function Card(props) {
  return (
    <div className='z-40 mt-20 mx-auto bg-white w-full md:h-[520px] rounded-lg shadow-xl md:flex grid grid-cols-1 lg:grid-cols-2 md:justify-between'>
      <div className='p-4 px-8 flex justify-between w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
        <div data-testid='HomeCard-main' className='m-auto'>
          <Heading
            level='h2'
            typeStyle='heading-lg'
            textColor='text-blue-700 text-[2rem]'
            className='text-[2rem]'
          >
            {props.headline}
          </Heading>
          <Heading
            level='h2'
            typeStyle='heading-lg'
            className='mt-10 text-[1.5rem]'
          >
            {props.title}
          </Heading>
          <Heading
            level='h2'
            typeStyle='body-lg'
            textColor='text-gray-700'
            className='text-slate-500 text-sm mt-10'
          >
            {props.description}
          </Heading>
          <div className='mt-10 mx-auto' data-testid='HomeCard-button'>
            <Button href={props.href} btnText={props.btnText} />
          </div>
        </div>
        {/* <div data-testid='HomeCard-title'>
        
        </div> */}
      </div>
      <div
        className={`w-full h-fit-content md:w-3/6  flex rounded-r-lg justify-end bg-cover bg-center ${props.className}`}
      />
    </div>
  );
}

Card.propTypes = {
  headline: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  className: PropTypes.string,
};
