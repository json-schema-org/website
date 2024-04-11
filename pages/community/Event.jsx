import React from 'react';
import Heading from './Heading';
import Button from './Button';
import PropTypes from 'prop-types';

export default function Event(props) {
  return (
    <div className='z-40 mt-20 bg-white w-full md:h-[520px] rounded-lg shadow-xl md:flex grid grid-cols-1 lg:grid-cols-2 justify-between'>
      <div className='p-4 px-8 grid items-center w-full md:w-3/6 h-auto flex-col text-center md:text-left'>
        <div data-testid='HomeCard-main'>
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
          <div className='mt-10' data-testid='HomeCard-button'>
            <Button
              class={props.btn1Class}
              href={props.href}
              btnText={props.btnText}
            />
            <br />
            <Button
              class={props.btn2Class}
              href={props.href2}
              btnText={props.btnText2}
            />
          </div>
        </div>
      </div>
      <div
        className={`w-fit-content h-fit-content md:w-3/6 flex rounded-r-lg justify-end bg-cover bg-center ${props.className}`}
      ></div>
    </div>
  );
}

Event.propTypes = {
  headline: PropTypes.string, // Add PropTypes for each prop
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  btn1Class: PropTypes.string, // Add PropTypes for each prop
  href2: PropTypes.string.isRequired,
  btnText2: PropTypes.string.isRequired,
  btn2Class: PropTypes.string, // Add PropTypes for each prop
  className: PropTypes.string, // Add PropTypes for each prop
};
