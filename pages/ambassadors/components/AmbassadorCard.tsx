import React, { useState } from 'react';
import Image from 'next/image';

interface Contribution {
  title: string;
  date?: { month: string; year: number };
  link: string;
  type: string;
}

export interface Ambassador {
  img?: string;
  name?: string;
  title?: string;
  bio?: string;
  company?: string;
  country?: string;
  github?: string;
  twitter?: string;
  mastodon?: string;
  linkedin?: string;
  contributions?: Contribution[];
}

type SocialIcons = 'github' | 'twitter' | 'mastodon' | 'linkedin';

// Utility function to generate full URLs for social media
const getSocialMediaUrl = (
  platform: SocialIcons,
  username: string | undefined,
) => {
  const baseUrls: Record<SocialIcons, string> = {
    github: 'https://github.com/',
    twitter: 'https://twitter.com/',
    mastodon: 'https://foostodon.org/',
    linkedin: 'https://www.linkedin.com/in/',
  };
  return username ? baseUrls[platform] + username : undefined;
};

// Social media icon component with proper typing
const SocialIcon = ({ platform }: { platform: SocialIcons }) => {
  const icons: Record<SocialIcons, JSX.Element> = {
    github: (
      <svg
        className='w-7 h-7 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        viewBox='0 0 310 310'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
      >
      <path
          d='M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
		C77.16,101.969,74.922,99.73,72.16,99.73z'
        />
        <path
          d='M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
		c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z'
        />
        <path
          d='M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
		c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
		c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
		C310,145.43,300.549,94.761,230.454,94.761z'
        />
      </svg>
    ),
    twitter: (
      <svg
        className='w-7 h-7 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        viewBox='0 0 24 24'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M23.954 4.569c-.885.389-1.83.654-2.825.775a4.932 4.932 0 0 0 2.163-2.723 9.85 9.85 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.374 4.482A13.936 13.936 0 0 1 1.64 3.161 4.916 4.916 0 0 0 3.195 9.86a4.897 4.897 0 0 1-2.229-.616v.061a4.919 4.919 0 0 0 3.946 4.827 4.897 4.897 0 0 1-2.224.085 4.923 4.923 0 0 0 4.604 3.42A9.869 9.869 0 0 1 .977 19.569a13.94 13.94 0 0 0 7.548 2.211c9.056 0 14.012-7.497 14.012-13.986 0-.213-.005-.425-.015-.636A9.936 9.936 0 0 0 24 4.59a9.94 9.94 0 0 1-2.046.561z' />
      </svg>
    ),
    linkedin: (
      <svg
        className='w-7 h-7 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        viewBox='0 0 24 24'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M22.225 0H1.771C.792 0 0 .775 0 1.729V22.27c0 .955.793 1.729 1.771 1.729h20.451c.978 0 1.778-.775 1.778-1.729V1.729C24 .774 23.203 0 22.225 0zM7.113 20.452H3.56V8.997h3.552v11.455zm-1.78-13.044a2.073 2.073 0 1 1 0-4.145 2.073 2.073 0 0 1 0 4.145zm15.34 13.044h-3.552v-5.697c0-1.357-.027-3.1-1.892-3.1-1.892 0-2.182 1.48-2.182 3.003v5.794H10.84V8.997h3.412v1.568h.049c.474-.896 1.637-1.84 3.37-1.84 3.604 0 4.268 2.371 4.268 5.451v6.276h-.002z' />
      </svg>
    ),
    mastodon: (
      <svg
        className='w-7 h-7 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        viewBox='0 0 24 24'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z' />
      </svg>
    ),
  };
  return icons[platform];
};

const AmbassadorCard = ({ ambassador }: { ambassador: Ambassador }) => {
  const [showContributions, setShowContributions] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    ambassador.img || '/api/placeholder/400/320',
  );

  const {
    name = 'Ambassador',
    title,
    bio,
    company,
    country,
    contributions = [],
  } = ambassador;

  // Available social platforms with proper typing
  const SocialIconss: SocialIcons[] = [
    'github',
    'twitter',
    'mastodon',
    'linkedin',
  ];

  return (
    <div className='relative max-w-sm md:max-w-md lg:max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden my-4 transition-all duration-300 h-fit'>
      {/* Black Borders */}
      <div className='absolute top-0 right-0 w-1 h-20 bg-black dark:bg-gray-400'></div>
      <div className='absolute bottom-100 right-0 w-20 h-1 bg-black dark:bg-gray-400'></div>
      <div className='absolute bottom-0 left-0 w-1 h-20 bg-black dark:bg-gray-400'></div>
      <div className='absolute bottom-0 left-0 w-20 h-1 bg-black dark:bg-gray-400'></div>

      <Image
        className='w-full object-cover p-5 rounded-3xl'
        src={imgSrc}
        alt={`${name} profile`}
        width={400}
        height={320}
        onError={() => setImgSrc(`/img/ambassadors/${name}.jpg`)}
      />

      <div className='p-6'>
        <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
          {name}
        </h3>
        {title && (
          <p className='text-gray-500 dark:text-slate-100 mb-1'>{title}</p>
        )}
        {bio && (
          <p className='text-gray-700 dark:text-slate-100 text-sm mb-4'>
            {bio}
          </p>
        )}
        {(company || country) && (
          <p className='text-gray-500 dark:text-slate-100 mb-4'>
            {company}
            {company && country && ', '}
            {country}
          </p>
        )}

        {/* Social Media Links */}
        <div className='flex justify-center mb-4'>
          {SocialIconss.map((platform) => {
            const username = ambassador[platform];
            return username ? (
              <a
                key={platform}
                href={getSocialMediaUrl(platform, username)}
                target='_blank'
                rel='noopener noreferrer'
                className='transition-colors duration-200 mr-4'
                aria-label={`${name}'s ${platform} profile`}
              >
                <SocialIcon platform={platform} />
              </a>
            ) : null;
          })}
        </div>

        {/* Button to Show/Hide Contributions */}
        {contributions.length > 0 && (
          <button
            onClick={() => setShowContributions(!showContributions)}
            className={`w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white dark:text-slate-100 font-semibold py-2 px-4 rounded transition-all duration-300 transform ${
              showContributions ? 'rotate' : ''
            }`}
          >
            {showContributions ? 'Hide Details' : 'Show Full Details'}
          </button>
        )}

        {/* Contributions Section (Toggled) */}
        {showContributions && contributions.length > 0 && (
          <div className='mt-4'>
            <h4 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white'>
              Contributions
            </h4>
            <ul className='text-gray-600 dark:text-slate-100 text-sm'>
              {contributions.map((contribution, index) => (
                <li key={index} className='mb-2'>
                  <strong>{contribution.title}</strong>
                  {contribution.date &&
                    ` (${contribution.date.month} ${contribution.date.year})`}{' '}
                  -
                  <a
                    href={contribution.link}
                    className='text-blue-600 dark:text-blue-400 ml-1 hover:underline'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {contribution.type}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbassadorCard;
