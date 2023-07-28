import * as RiIcons from 'react-icons/ri'
import React from 'react'
export const SidebarData = [
  {
    title: 'Overview',
    path: '/',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'What is JSON Schema?',
        path: '/overview/what-is-jsonschema',

      },
    ]
  },
  {
    title: 'Getting Started',
    path: '/',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'Creating your first schema',
        path: '/learn/getting-started-step-by-step',

      },
      {
        title: 'Examples',
        path: '/',
      },
      {
        title: 'Miscellaneous examples',
        path: '/learn/miscellaneous-examples',

      },
      {
        title: 'Modelling a file system',
        path: '/learn/file-system',

      },
      {
        title: 'Other examples',
        path: '/learn/json-schema-examples',

      }
    ]
  }
]