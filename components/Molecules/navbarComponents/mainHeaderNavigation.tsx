import React, { useContext } from 'react'
import useStore from '~/store'
import { SectionContext } from '~/context'
import MainNavLink from './mainNavLink'
import { Search } from '../../Layout'



const MainHeaderNavigation = () => {
  const section = useContext(SectionContext)
  const showMobileNav = useStore((s: any) => s.overlayNavigation === 'docs')
    
  return (
    <div className='flex justify-end mr-8 w-full justify-end'>
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/specification'
        label='Specification'
        isActive={section === 'specification'}
          
      />
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/learn/getting-started-step-by-step'
        label='Docs'
        isActive={section === 'docs'}
          
      />
  
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/implementations'
        label='Implementations'
        isActive={section === 'implementations'}
          
      />
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/blog'
        label='Blog'
        isActive={section === 'blog'}
         
      />
      <MainNavLink
        className='hidden lg:block hover:underline'
        uri='/#community'
        label='Community'
        isActive={section === 'community'}
          
      />
      <div className='flex items-center gap-12 md:gap-4'>
        <div className='rounded border-2 border-gray-100 ml-0 w-2/5 md:w-full'>
          <Search />
        </div>
        {showMobileNav === false ? (
          <div
            onClick={() => useStore.setState({ overlayNavigation: 'docs' })}
          >
            <div className='block lg:hidden space-y-2  items-center'>
              <div className='w-6 h-1 bg-black rounded'></div>
              <div className='w-6 h-1 bg-black rounded'></div>
              <div className='w-6 h-1 bg-black rounded'></div>
            </div>
  
          </div>
        ) : <div
          style={{ backgroundImage: 'url("/icons/cancel.svg")' }}
          className='h-6 w-6 bg-center bg-[length:22px_22px] bg-no-repeat  transition-all cursor-pointer'
          onClick={() => useStore.setState({ overlayNavigation: null })}
        />
        }
      </div>
    </div>
  )
}

export default MainHeaderNavigation