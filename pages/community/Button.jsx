import React from 'react';
import PropTypes from 'prop-types';

function Button(props) {
  return (
    <a
      href={props.href}
      rel='noopener noreferrer'
      className={`bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded block md:inline-block focus:outline-none ${props.class}`}
    >
      {props.btnText}
    </a>
  );
}

// Add prop type validation
Button.propTypes = {
  href: PropTypes.string.isRequired, // href prop should be a string and is required
  class: PropTypes.string, // class prop should be a string (optional)
  btnText: PropTypes.string.isRequired, // btnText prop should be a string and is required
};

export default Button;
