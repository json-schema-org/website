/* eslint-disable linebreak-style */

import React from 'react';
import classnames from 'classnames';
import { parseTabsFromMarkdown } from '~/lib/markdownUtils';

interface TabsGroupProps {
  markdown: string;
  StyledMarkdownBlock: React.ComponentType<{ markdown: string }>;
}

export const TabsGroup = ({
  markdown,
  StyledMarkdownBlock,
}: TabsGroupProps) => {
  const { groupLabel, tabs } = parseTabsFromMarkdown(markdown);
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const activeTab = tabs[activeTabIndex];

  return (
    <div>
      <div className='flex flex-col sm:flex-row items-start sm:items-end mt-4'>
        {groupLabel && (
          <div className='p-2 sm:p-4 text-slate-400 mb-2 sm:mb-0 sm:mr-4 text-sm'>
            {groupLabel}:
          </div>
        )}
        <div
          className='flex flex-row overflow-x-auto w-full sm:w-auto'
          role='tablist'
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeTabIndex;
            return (
              <button
                key={index}
                type='button'
                role='tab'
                aria-selected={isActive}
                onClick={() => setActiveTabIndex(index)}
                className={classnames(
                  'p-2 sm:p-4 px-3 sm:px-6 text-slate-700 font-medium border-b-2 rounded-t-lg whitespace-nowrap text-sm sm:text-base',
                  {
                    'border-blue-400 text-blue-500 bg-blue-50 dark:bg-slate-900 dark:text-white':
                      isActive,
                    'border-white/0 cursor-pointer dark:text-white text-slate-700 hover:border-blue-50  hover:bg-blue-50/20':
                      !isActive,
                  },
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className='border-slate-100 mb-4 p-3 sm:p-6 from-slate-50/50 to-slate-50/100 rounded-xl bg-gradient-to-b dark:from-slate-700/50 dark:to-slate-900/50'
        role='tabpanel'
      >
        <StyledMarkdownBlock markdown={activeTab.markdown} />
      </div>
    </div>
  );
};
