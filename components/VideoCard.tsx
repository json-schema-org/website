/* eslint-disable linebreak-style */
import React from 'react';
import { Card as ShadcnCard } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VideoResource } from '~/lib/videoResources';

export interface VideoCardProps {
  video: VideoResource;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { title, description, url } = video;

  return (
    <ShadcnCard
      className='flex flex-col justify-between h-full w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50'
      data-testid='video-card'
    >
      <div>
        <div className='flex items-start justify-between gap-3 mb-3'>
          <h3
            className='text-xl font-bold text-gray-900 dark:text-white leading-snug'
            data-testid='video-card-title'
          >
            {title}
          </h3>
        </div>

        <Separator className='bg-gray-200 dark:bg-slate-700 mb-4' />

        <p
          className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-line'
          data-testid='video-card-description'
        >
          {description}
        </p>
      </div>

      <div className='mt-6 pt-2'>
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`Watch video: ${title} (opens in a new tab)`}
          className='inline-flex items-center gap-2 font-medium text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-sm'
          data-testid='video-card-link'
        >
          <span>Watch video</span>
          <svg
            className='w-4 h-4'
            aria-hidden='true'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
            />
          </svg>
          <span className='sr-only'>(opens in a new tab)</span>
        </a>
      </div>
    </ShadcnCard>
  );
};

export default VideoCard;
