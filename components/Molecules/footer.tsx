import React from 'react'
import classnames from 'classnames'

interface FooterProps{
    
}
const Footer: React.FC<FooterProps> = () => (
  <footer className={classnames('z-10 md:h-[300px]  bg-gradient-to-r from-startBlue from-1.95% to-endBlue clip-bottom mb-12')}>
    <div className='max-w-[1400px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 md:w-1/2 lg:w-1/3 justify-center '>
      <div className=' my-6 m-auto md:mt-16'>
        <img src='/img/logos/logo-white.svg' className='w-[150px] mb-6' />
        <div className='flex flex-col text-center sm:text-left'>
          <a href='https://opencollective.com/json-schema' className='text-white mb-2'>Open Collective</a>
        </div>        
        <div className='flex flex-col text-center sm:text-left'>
          <a target='_blank' rel='noopener noreferrer' href='https://github.com/json-schema-org/.github/blob/main/CODE_OF_CONDUCT.md' className='text-white mb-2'>Code of Conduct</a>
        </div>
      </div>
      <div className='grid grid-cols-3 md:grid-cols-1 mx-auto md:mt-8 mb-4 md:mb-0 lg:ml-12'>
        <div className='mr-4 mb-4'>
          <a href='https://json-schema.org/slack' className='flex items-center text-white'><img src='/img/logos/slack_logo_small-white.svg' className='w-4 h-4 mr-2' />
              Slack</a>
        </div>
        <div className='mb-4 mr-4'>
          <a href='https://twitter.com/jsonschema' className='flex items-center text-white'><img src='/img/logos/twitter_logo-white.svg' className='w-4 h-4 mr-2' />
              Twitter</a>
        </div>
        <div className='mr-4 mb-4'>
          <a href='https://linkedin.com/company/jsonschema/' className='flex items-center text-white'><img src='/img/logos/icons8-linkedin-2.svg' className='w-4 h-4 mr-2' />
              LinkedIn</a>
        </div>
        <div className='mr-4 mb-4'>
          <a href='https://www.youtube.com/@JSONSchemaOrgOfficial' className='flex items-center text-white'><img src='/img/logos/icons8-youtube.svg' className='w-4 h-4 mr-2' />
              Youtube</a>
        </div>
        <div className=''>
          <a href='https://github.com/json-schema-org' className='flex items-center text-white'><img src='/img/logos/github_logo-white.svg' className='w-4 h-4 mr-2' />
              GitHub</a>
        </div>
      </div>
  
    </div>
  </footer>
)
export default Footer