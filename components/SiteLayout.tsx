import React from 'react';
import PlausibleProvider from 'next-plausible';
import Layout from '../components/Layout';

type SiteLayoutProps = {
  children?: React.ReactNode;
  isDropdown?: boolean;
};

export const SiteLayout: React.FC<SiteLayoutProps> = ({
  children,
}): JSX.Element => {
  return <Layout>{children}</Layout>;
};

export const getLayout = (
  page: React.ReactNode,
  props?: SiteLayoutProps,
): JSX.Element => {
  return (
    <PlausibleProvider
      domain='json-schema.org'
      trackLocalhost={true}
      trackOutboundLinks={true}
    >
      <SiteLayout {...props}>{page}</SiteLayout>
    </PlausibleProvider>
  );
};
