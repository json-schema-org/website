import React from 'react';
import Heading from '../typography/Heading';
import Button from './Button';
import PropTypes from 'prop-types';

export default function Card(props) {
  return (
    <div className='z-40 mt-20 bg-white w-full md:h-[520px] rounded-lg shadow-xl md:flex grid grid-cols-2 md:justify-between'>
      <div className='p-10 flex justify-between w-full md:w-2/5 h-auto flex-col text-center md:text-left'>
        <div data-testid='HomeCard-main'>
          <Heading
            level='h2'
            typeStyle='heading-md'
            textColor='text-purple-300'
          >
            {props.headline}
          </Heading>
        </div>
        <div data-testid='HomeCard-title'>
          <Heading level='h2' typeStyle='heading-lg' className='mt-10'>
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
          <div className='mt-10' data-testid='HomeCard-button'>
            <Button href={props.href} btnText={props.btnText} />
          </div>
        </div>
      </div>
      <div
        className={`w-full h-fit-content md:w-3/5  flex rounded-r-lg justify-end bg-cover bg-center ${props.className}`}
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
