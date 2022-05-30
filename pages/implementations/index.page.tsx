import React from 'react'
import Layout from '~/components/Layout'
import fs from 'fs'
import matter from 'gray-matter'
import StyledMarkdown from '~/components/StyledMarkdown'
import yaml from 'js-yaml'
import { Headline1, Headline2, Headline3 } from 'components/Headlines'
import slugify from 'slugify'
import { useRouter } from 'next/router'
import useSetUrlParam from '~/lib/useSetUrlParam'
import classnames from 'classnames'
import zeroFill from 'zero-fill'

const DRAFT_ORDER = [
  '2020-12',
  '2019-09',
  7,
  6,
  5,
  4,
  3,
  2,
  1
]

export async function getStaticProps() {
  const validators = yaml.load(fs.readFileSync('data/validator-libraries-modern.yml', 'utf-8'))
  const hyperLibaries = yaml.load(fs.readFileSync('data/hyper-libraries-modern.yml', 'utf-8'))

  const intro = fs.readFileSync('pages/implementations/intro.md', 'utf-8')
  const main = fs.readFileSync('pages/implementations/main.md', 'utf-8')
  const { content: introContent } = matter(intro)
  const { content: mainContent } = matter(main)
  return {
    props: {
      blocks: {
        intro: introContent,
        main: mainContent
      },
      validators,
      hyperLibaries
    }
  }
}

export default function ContentExample ({ blocks, validators }: { blocks: any, validators: { name: string }[] }) {
  const router = useRouter()
  const setUrlParam = useSetUrlParam()
  return (
    <Layout>
      <Headline1>Implementations</Headline1>
      <StyledMarkdown markdown={blocks.intro} />

      <Headline2>Validators</Headline2>
      <div className='flex flex-row flex-wrap grid-cols-7 grid'>
        {validators.map((validator, index) => {
          const slug = slugify(validator.name, { lower: true, trim: true })
          const isActive = router.query.language === slug
          return (
            <div
              key={index}
              onClick={() => {
                setUrlParam('language', isActive ? null : slug)
              }}
              className={classnames('block text-center text-white rounded p-2 cursor-pointer flex-1 m-1', {
                'bg-blue-800': isActive,
                'bg-blue-500 hover:bg-blue-600': !isActive
              })}
            >
              {validator.name}
            </div>
          )
        })}
      </div>
      <div className='bg-blue-50 rounded-xl py-2 p-6 mt-4 pb-6 pt-0.5'>
        <table>
          <thead>
            <tr>
              <td />
              <td className='pt-6 pl-5 text-sm text-slate-500'>
                About
              </td>
              <td className='pt-6 pl-5 text-sm text-slate-500'>
                Drafts
              </td>
              <td className='pt-6 pl-5 text-sm text-slate-500'>
                License
              </td>
            </tr>
          </thead>
          <tbody>
            {validators.map((validator, index) => {
              const slug = slugify(validator.name, { lower: true, trim: true })
              const isActive = router.query.language === slug
              if (router.query.language && !isActive) return null

              return (
                <React.Fragment
                  key={index}
                >
                  <tr>
                    <td colSpan={3}>
                      <Headline3>{validator.name}</Headline3>
                    </td>
                  </tr>
                  {validator.implementations.map((implementation, index) => {
                    const allDrafts = [
                      ...(implementation['date-draft'] || []),
                      ...(implementation['draft'] || [])
                    ]
                    return (
                      <tr key={index}
                        className='pl-4 list-disc list-inside pl-2'
                      >
                        <td className=''>
                          <a className='text-blue-500' href={implementation.url}>{implementation.name}</a>
                        </td>
                        <td className='pl-6'>
                          {implementation.notes}
                        </td>
                        <td className='pl-6 pb-2'>
                          {allDrafts
                            ?.sort((a, b) => DRAFT_ORDER.indexOf(a) < DRAFT_ORDER.indexOf(b) ? -1 : 1)
                            ?.map((draft: string | number) => (
                              <span className='bg-blue-400 inline-block mr-1 mb-1 text-white rounded px-1' key={draft}>
                                {typeof draft === 'number' ? zeroFill(2, draft) : draft}
                              </span>
                            ))
                          }
                        </td>
                        <td className='pl-6'>
                          {implementation.license}
                        </td>
                      </tr>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>


      <StyledMarkdown markdown={blocks.main} />
    </Layout>
  )
}
