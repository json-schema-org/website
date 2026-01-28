import React from 'react';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';
import Image from 'next/image';
import { Card as ShadcnCard } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import sanitizeHtml from 'sanitize-html';

export interface CardProps {
  title: string;
  body: string;
  icon?: string;
  link?: string;
  image?: string;
  extended?: boolean;
  headerSize?: 'small' | 'medium' | 'large';
  bodyTextSize?: 'small' | 'medium' | 'large';
}

const CardBody = ({
  title,
  body,
  icon,
  link,
  image,
  extended,
  headerSize = 'medium',
  bodyTextSize = 'medium',
}: CardProps) => {
  const headerSizeClasses = {
    small: 'text-[0.9rem]',
    medium: 'text-[1.3rem]',
    large: 'text-[2rem]',
  };

  const bodyTextSizeClasses = {
    small: 'text-[0.85rem]',
    medium: 'text-[1rem]',
    large: 'text-[1.5rem]',
  };

  return (
    <ShadcnCard className='group relative h-full w-full rounded-lg border border-gray-200 bg-white p-6 px-12 shadow-3xl dark:shadow-2xl dark:shadow-slate-900 transition-colors ease-in-out hover:bg-slate-100 dark:bg-slate-800 hover:dark:bg-slate-900/30'>
      {image && (
        <div className='flex justify-center '>
          <Image
            src={image}
            alt={title}
            width={384}
            height={128}
            className='h-32 p-2 object-contain'
            data-test='card-image'
          />
        </div>
      )}

      <div className='flex flex-row items-start '>
        {icon && (
          <span className='mr-6 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border bg-blue-200 px-3 text-gray-900 dark:text-white'>
            <Image
              src={icon}
              alt={title}
              width={56}
              height={56}
              className='h-full w-full'
              data-test='card-icon'
            />
          </span>
        )}
        <p
          className={cn(
            'mb-1 mt-1 items-center font-bold text-gray-900 dark:text-white',
            headerSizeClasses[headerSize],
          )}
          data-test='card-title'
        >
          {title}
        </p>
      </div>

      <Separator className='bg-gray-400' />

      <p
        className={cn(
          'mb-8 text-black mt-5 dark:text-white ',
          bodyTextSizeClasses[bodyTextSize],
        )}
        data-test='card-body'
      >
        {extended ? (
          <span
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(body, {
                allowedTags: [
                  'p',
                  'br',
                  'strong',
                  'em',
                  'u',
                  'i',
                  'b',
                  'a',
                  'ul',
                  'ol',
                  'li',
                  'code',
                  'pre',
                ],
                allowedAttributes: {
                  a: ['href', 'title', 'target'],
                  code: ['class'],
                  pre: ['class'],
                },
                allowedSchemes: ['http', 'https', 'mailto'],
                allowedSchemesAppliedToAttributes: ['href'],
                transformTags: {
                  a: (tagName, attribs) => {
                    if (
                      attribs.href &&
                      (attribs.href.startsWith('http') ||
                        attribs.href.startsWith('https'))
                    ) {
                      return {
                        tagName: 'a',
                        attribs: {
                          ...attribs,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                      };
                    }
                    return { tagName, attribs };
                  },
                },
              }),
            }}
          />
        ) : (
          <TextTruncate element='span' line={3} text={body} />
        )}
      </p>

      {link && (
        <p
          className='absolute bottom-3 right-5 font-medium opacity-0 transition-opacity delay-150 ease-in-out group-hover:opacity-100 text-black dark:text-white'
          data-test='card-read-more'
        >
          Read More
        </p>
      )}
    </ShadcnCard>
  );
};

const Card: React.FC<CardProps> = ({ link, ...props }) => {
  return link ? (
    <Link href={link} data-test='card-link'>
      <CardBody link={link} {...props} />
    </Link>
  ) : (
    <CardBody {...props} />
  );
};

export default Card;
