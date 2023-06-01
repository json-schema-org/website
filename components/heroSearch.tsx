/** @jsxImportSource react */
import React, { useState, useCallback, useRef } from 'react'
import '@docsearch/css'


import { createPortal } from 'react-dom'
import * as docSearchReact from '@docsearch/react'


const DocSearchModal =
    docSearchReact.DocSearchModal || (docSearchReact as any).default.DocSearchModal
const useDocSearchKeyboardEvents =
    docSearchReact.useDocSearchKeyboardEvents ||
    (docSearchReact as any).default.useDocSearchKeyboardEvents

export default function HeroSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const [initialQuery, setInitialQuery] = useState('')

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = useCallback(
    (e) => {
      setIsOpen(true)
      setInitialQuery(e.key)
    },
    [setIsOpen, setInitialQuery]
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  return (
    <>
      <button type='button' ref={searchButtonRef} onClick={onOpen} className='search-input'>
        <svg width='24' height='24' fill='none'>
          <path
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>

        <span>Quick Search</span>

      </button>

      {isOpen &&
                createPortal(
                  <DocSearchModal
                    initialQuery={initialQuery}
                    initialScrollY={window.scrollY}
                    onClose={onClose}
                    appId='6ZT4KX2OUI'
                    apiKey='69f76fba13585144f6686622e9c8f2a8'
                    indexName='json-schema'
                    transformItems={(items) => {
                      return items.map((item) => {
                        // We transform the absolute URL into a relative URL to
                        // work better on localhost, preview URLS.
                        const a = document.createElement('a')
                        a.href = item.url
                        const hash = a.hash === '#overview' ? '' : a.hash
                        return {
                          ...item,
                          url: `${a.pathname}${hash}`,
                        }
                      })
                    }}
                  />,
                  document.body
                )}
    </>
  )
}
