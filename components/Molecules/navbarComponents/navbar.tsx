import React from 'react'
// import footer from './footer'
import Logo from '../../Atoms/logo'
import classnames from 'classnames'
import MainHeaderNavigation from './mainHeaderNavigation'

const Navbar = () => {
  return (
    <header className={classnames('w-full bg-white fixed top-0 z-[170] shadow-xl drop-shadow-lg')}>
      <div className='flex md:justify-between items-center ml-8 2xl:px-12 py-4'>
        <Logo />
        <MainHeaderNavigation />
      </div>
    </header> )
}

export default Navbar