import React from 'react';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import PropTypes from 'prop-types';
import Button from './Button';

function BlogCard(props) {
  return (
    <div className='w-full mb-6'>
      <Link href={props.href}>
        <h3 className='mb-5 font-semibold pt-1'>The JSON Schema Blog</h3>
        <img src={props.src} className='w-full h-[232px]  mb-4' />
        <h3 className='mb-4 font-semibold'> {props.h3_1}</h3>
        <div className='mb-4'>
          <TextTruncate element='span' line={4} text={props.text} />
        </div>
        <div className='flex ml-2 mb-2 '>
          <div
            className='bg-slate-50 h-[44px] w-[44px] rounded-full -ml-3 bg-cover bg-center border-2 border-white'
            style={{
              backgroundImage: `url(${props.url})`,
            }}
          />
          <div className='flex flex-col ml-2'>
            <p className='text-sm font-semibold'>{props.author}</p>
            <div className='text-slate-500 text-sm'>
              <span>
                {props.spanPart1} &middot; {props.spanPart2} min read
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className='mx-auto '>
        <Button class={'mt-4'} href={props.href} btnText={'Read more'} />
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  h3_1: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  spanPart1: PropTypes.string.isRequired,
  spanPart2: PropTypes.number.isRequired,
};

export default BlogCard;
