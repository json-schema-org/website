import React from 'react';
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
  return <SiteLayout {...props}>{page}</SiteLayout>;
};
