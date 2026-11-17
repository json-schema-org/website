import React, { type ReactNode } from 'react';
import classnames from 'classnames';

import {
  BOWTIE_ADD_IMPLEMENTATION_URL,
  getBowtieImplementationUrl,
  type BowtieResult,
  type ToolBowtieInfo,
} from '../lib/bowtie';

const NEUTRAL = '#64748b';

const toCssColor = (color: string) =>
  /^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? `#${color}` : color;

const draftLabel = (draft: string) => `Draft ${draft}`;

const Pill = ({
  href,
  title,
  label,
  message,
  color = NEUTRAL,
  testId,
}: {
  href: string;
  title: string;
  label?: string;
  message: ReactNode;
  color?: string;
  testId: string;
}) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    title={title}
    data-test={testId}
    onClick={(event) => event.stopPropagation()}
    className='inline-flex overflow-hidden rounded text-[12px] font-medium leading-5 whitespace-nowrap text-white no-underline hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
  >
    {label && <span className='bg-slate-700 px-1.5'>{label}</span>}
    <span className='px-1.5' style={{ backgroundColor: color }}>
      {message}
    </span>
  </a>
);

/**
 * A single Bowtie result, as a badge which links to the implementation's
 * report on Bowtie.
 */
export const BowtieResultBadge = ({ result }: { result: BowtieResult }) => {
  const { implementation, draft, badge } = result;
  const label = draftLabel(draft);
  const href = getBowtieImplementationUrl(implementation);

  if (badge === undefined) {
    return (
      <Pill
        href={href}
        label={label}
        message={<span className='animate-pulse'>loading…</span>}
        title={`${implementation.id}: see the report on Bowtie`}
        testId='bowtie-badge-loading'
      />
    );
  }

  if (badge === null) {
    return (
      <Pill
        href={href}
        label={label}
        message='see report'
        title={`${implementation.id}: see the report on Bowtie`}
        testId='bowtie-badge-unavailable'
      />
    );
  }

  return (
    <Pill
      href={href}
      label={label}
      message={badge.message}
      color={toCssColor(badge.color)}
      title={`${implementation.id}: ${badge.message} for ${label}. See the report on Bowtie.`}
      testId='bowtie-badge-result'
    />
  );
};

/**
 * What Bowtie has to say about a tool: a compliance badge linking to its
 * report, or a badge saying that it is not on Bowtie.
 */
export default function BowtieBadge({
  info,
  isLoading = false,
  className,
}: {
  info: ToolBowtieInfo;
  isLoading?: boolean;
  className?: string;
}) {
  const wrapperClassName = classnames('inline-flex items-center', className);

  if (isLoading) {
    return (
      <span
        className={classnames(
          wrapperClassName,
          'h-5 w-28 animate-pulse rounded bg-gray-300 dark:bg-slate-600',
        )}
        data-test='bowtie-badge-skeleton'
        aria-label='Loading Bowtie results'
      />
    );
  }

  if (info.kind === 'unknown' || info.kind === 'not-applicable') {
    const isUnknown = info.kind === 'unknown';

    return (
      <span
        className={classnames(wrapperClassName, 'text-slate-400')}
        title={
          isUnknown
            ? 'Bowtie results are not available at the moment'
            : 'Bowtie tests validators, which this tool is not'
        }
        data-test={`bowtie-badge-${info.kind}`}
      >
        <span aria-hidden='true'>—</span>
        <span className='sr-only'>
          {isUnknown ? 'Not available' : 'Not applicable'}
        </span>
      </span>
    );
  }

  if (!info.implementation) {
    return (
      <span className={wrapperClassName}>
        <Pill
          href={BOWTIE_ADD_IMPLEMENTATION_URL}
          message='not on Bowtie'
          title='Bowtie does not test this implementation yet. Find out how to add it.'
          testId='bowtie-badge-not-on-bowtie'
        />
      </span>
    );
  }

  if (!info.result) {
    return (
      <span className={wrapperClassName}>
        <Pill
          href={getBowtieImplementationUrl(info.implementation)}
          label={info.draft && draftLabel(info.draft)}
          message='not tested'
          title={`${info.implementation.id}: Bowtie does not test this implementation against this dialect. See the report on Bowtie.`}
          testId='bowtie-badge-untested'
        />
      </span>
    );
  }

  return (
    <span className={wrapperClassName}>
      <BowtieResultBadge result={info.result} />
    </span>
  );
}
