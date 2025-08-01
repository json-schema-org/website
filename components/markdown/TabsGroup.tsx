import React, { useState } from 'react';
import classnames from 'classnames';
import getFindResultsByGlobalRegExp from '~/lib/getFindResultsByGlobalRegExp';
import { MarkdownRenderer } from './MarkdownRenderer';

const REGEX_TAB_GROUPS =
  /\[tabs-start\s*"(?<label>.*)"\]((?!\[tabs-start).|\n)*\[tabs-end\]/gm;

const TAB_REGEX = /(?<=\[tab )\s*"(?<label>.*)"\](?<markdown>(.|\n)*?)\[tab/gm;

export const TabsGroup = ({ markdown }: { markdown: string }) => {
  const groupLabel: string | null =
    getFindResultsByGlobalRegExp(markdown, REGEX_TAB_GROUPS)?.[0]?.groups?.find(
      (g) => g.name === 'label',
    )?.match || null;

  const tabs = getFindResultsByGlobalRegExp(markdown, TAB_REGEX).map((tab) => {
    const label = tab.groups?.find((g) => g.name === 'label')?.match || '';
    const markdown = (
      tab.groups?.find((g) => g.name === 'markdown')?.match || ''
    ).trim();
    return { label, markdown };
  });

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex];

  return (
    <div>
      <div className='flex flex-row items-end mt-4'>
        {groupLabel && (
          <div className='p-4 text-slate-400 mr-4 text-sm'>{groupLabel}:</div>
        )}
        <div className='flex flex-row'>
          {tabs.map((tab, index) => {
            const isActive = index === activeTabIndex;
            return (
              <div
                key={index}
                onClick={() => setActiveTabIndex(index)}
                className={classnames(
                  'p-4 px-6 text-slate-700 font-medium border-b-2 rounded-t-lg',
                  {
                    'border-blue-400 text-blue-500 bg-blue-50 dark:bg-slate-900 dark:text-white':
                      isActive,
                    'border-white/0 cursor-pointer dark:text-white text-slate-700 hover:border-blue-50  hover:bg-blue-50/20':
                      !isActive,
                  },
                )}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
      </div>
      <div className='border-slate-100 mb-4 p-6 from-slate-50/50 to-slate-50/100 rounded-xl bg-gradient-to-b dark:from-slate-700/50 dark:to-slate-900/50'>
        <MarkdownRenderer markdown={activeTab.markdown} />
      </div>
    </div>
  );
};
