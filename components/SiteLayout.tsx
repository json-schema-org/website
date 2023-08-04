import Layout from '../components/Layout'
import React from 'react'

export const SiteLayout = ({ children }: { children: React.ReactNode}): JSX.Element => {
  return (
    <div>
      <Layout>
        {children}
      </Layout>
    </div>
  )
}
  
export const getLayout = (page: React.ReactNode): JSX.Element => {
  return <SiteLayout >{page}</SiteLayout>
}
