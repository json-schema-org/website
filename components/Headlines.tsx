import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import slugifyMarkdownHeadline from '~/lib/slugifyMarkdownHeadline';
import { useRouter } from 'next/router';
import { HOST } from '~/lib/config';

type HeadlineProps = {
  children: string | React.ReactNode[];
  attributes?: Record<string, any>;
};

export const Headline1 = ({ children, attributes }: HeadlineProps) => (
  <Headline Tag={Headline1Tag} attributes={attributes}>
    {children}
  </Headline>
);
export const Headline2 = ({ children, attributes }: HeadlineProps) => (
  <Headline Tag={Headline2Tag} attributes={attributes}>
    {children}
  </Headline>
);
export const Headline3 = ({ children, attributes }: HeadlineProps) => (
  <Headline Tag={Headline3Tag} attributes={attributes}>
    {children}
  </Headline>
);
export const Headline4 = ({ children, attributes }: HeadlineProps) => (
  <Headline Tag={Headline4Tag} attributes={attributes}>
    {children}
  </Headline>
);

const Headline = ({
  children,
  Tag,
  attributes: propAttributes,
}: {
  children: string | React.ReactNode[];
  Tag: React.FunctionComponent<TagProps>;
  attributes?: Record<string, any>;
}) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState<boolean>(false);
  const asPath = router.asPath;
  const slug = slugifyMarkdownHeadline(children as any[]);

  useEffect(() => {
    const hashIndex = asPath.indexOf('#');
    const slugFromPath = hashIndex !== -1 ? asPath.slice(hashIndex + 1) : null;

    setIsActive(slug === slugFromPath);
  }, [router.asPath]);

  const handleHeadingClick = () => {
    const url = new URL(asPath, HOST);
    const newHash = `#${slug}`;
    url.hash = newHash;

    const urlString = url.toString().substr(HOST.length, Infinity);
    router.push(urlString, undefined, { shallow: true });
    setIsActive(true);
  };

  const attributes = {
    ...propAttributes,
    id: propAttributes?.slug || slug,
    className: classnames(
      'group cursor-pointer hover:underline',
      { 'text-startBlue dark:text-endBlue': isActive },
      propAttributes?.className,
    ),
    onClick: handleHeadingClick,
    'data-test': 'headline',
  };
  const childredWithoutFragment = filterFragment(children);
  return (
    <Tag attributes={attributes}>
      {childredWithoutFragment}
      {isActive && (
        <span className={'text-startBlue dark:text-endBlue inline-block ml-2'}>
          ¶
        </span>
      )}
    </Tag>
  );
};

const filterFragment = (children: string | React.ReactNode[]) => {
  return (typeof children === 'string' ? [children] : children).map((child) => {
    if (typeof child !== 'string') return child;
    return child.replace(/\[#(\w|-|_)*\]/g, '');
  });
};

type TagProps = { children: React.ReactNode; attributes: Record<string, any> };

const Headline1Tag = ({ children, attributes }: TagProps) => (
  <h1
    {...attributes}
    className={classnames(
      attributes?.className,
      'text-h1mobile md:text-h1 dark:text-slate-200  font-bold pt-10 mb-6',
    )}
  >
    {children}
  </h1>
);
const Headline2Tag = ({ children, attributes }: TagProps) => (
  <h2
    {...attributes}
    className={classnames(
      attributes?.className,
      'text-h2mobile md:text-h2 dark:text-slate-200 font-semibold mt-10 mb-4',
    )}
  >
    {children}
  </h2>
);
const Headline3Tag = ({ children, attributes }: TagProps) => (
  <h3
    {...attributes}
    className={classnames(
      attributes?.className,
      'text-h3mobile dark:text-slate-200 md:text-h3 font-semibold mt-6 mb-3',
    )}
  >
    {children}
  </h3>
);
const Headline4Tag = ({ children, attributes }: TagProps) => (
  <h4
    {...attributes}
    className={classnames(
      attributes?.className,
      'text-h4mobile dark:text-slate-200 md:text-h4 font-semibold mt-4 mb-2',
    )}
  >
    {children}
  </h4>
);
