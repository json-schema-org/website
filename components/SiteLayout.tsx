import Layout from '../components/Layout'
import React from 'react'

type SiteLayoutProps = {
  children: React.ReactNode
  isDropdown?: boolean
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children }): JSX.Element => {
  return (
    <Layout >
      {children}
    </Layout>
  )
}
  
export const getLayout = (page: React.ReactNode): JSX.Element => {
  return <SiteLayout >{page}</SiteLayout>
}
