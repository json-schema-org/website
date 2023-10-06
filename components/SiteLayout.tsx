import React from 'react'
import PlausibleProvider from 'next-plausible'
import Layout from '../components/Layout'


type SiteLayoutProps = {
  children?: React.ReactNode
  hideAds?: boolean
  isDropdown?: boolean
};

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children, hideAds = false }): JSX.Element => {
  return (
    <Layout hideAds={hideAds}>
      {children}
    </Layout>
  )
}

export const getLayout = (page: React.ReactNode, props?: SiteLayoutProps): JSX.Element => {
  return (
    <PlausibleProvider domain='json-schema.org' trackLocalhost={true} trackOutboundLinks={true} >
      <SiteLayout {...props}>{page}</SiteLayout>
    </PlausibleProvider>
  )
}

