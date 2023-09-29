import Layout from '../components/Layout'
import React from 'react'

type SiteLayoutProps = {
  children?: React.ReactNode; // Make children optional
  hideAds?: boolean;
  isDropdown?: boolean;
};

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children, hideAds = false}): JSX.Element => {
  return (
    <Layout hideAds={hideAds}>
      {children}
    </Layout>
  );
}

export const getLayout = (page: React.ReactNode, props?: SiteLayoutProps): JSX.Element => {
  return <SiteLayout {...props}>{page}</SiteLayout>;
}

