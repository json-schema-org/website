import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

type Props = {
  className?: string;
  variant?: 'sidebar';
};

function CarbonAds({ className, variant = 'sidebar' }: Props) {
  const carbonRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const hasCarbonAdsScript = document.querySelector('#_carbonads_js');
    if (!hasCarbonAdsScript) {
      const carbonAdsScript = document.createElement('script');
      carbonAdsScript.id = '_carbonads_js';
      carbonAdsScript.type = 'text/javascript';
      carbonAdsScript.async = true;
      document
        .querySelector('#carbonads-container')
        ?.appendChild(carbonAdsScript);
      carbonAdsScript.src = `//cdn.carbonads.com/carbon.js?serve=CE7I627Y&placement=json-schemaorg&rnd=${Math.random()}`;
    }

    const existingStyleSheet = document.querySelector('#_carbonads_css');
    if (existingStyleSheet) {
      existingStyleSheet.innerHTML = CarbonAds.stylesheet[variant];
    } else {
      const carbonAdsStyleSheet = document.createElement('style');
      carbonAdsStyleSheet.id = '_carbonads_css';
      carbonAdsStyleSheet.innerHTML = CarbonAds.stylesheet[variant];
      document
        .querySelector('#carbonads-container')
        ?.appendChild(carbonAdsStyleSheet);
    }
  }, [router.asPath]);

  return (
    <aside
      id='carbonads-container'
      ref={carbonRef}
      className={className}
    ></aside>
  );
}

CarbonAds.stylesheet = {
  sidebar: `
    #carbonads {
      padding: 0.5rem;
      margin: 2rem auto;
      background-color: #f9f9f9;
      border: 1px dashed;
      border-color: #cacaca;
      box-sizing: border-box;
      border-radius: 10px;
      max-width: 300px;
    }

    #carbonads > span {
      width: 100%;
      height: fit-content;
      display: flex;
      flex-direction: column;
    }

    .carbon-wrap {
      flex: 1;
      display: inline-flex;
      flex-direction: row;
    }

    .carbon-img {
      margin: auto;
    }

    .carbon-img > img {
      align-self: stretch;
      margin-right: 0.75rem;
    }

    .carbon-text {
      font-size: 12px;
      font-family: Inter, ui-sans-serif, system-ui;
      color: rgb(100 116 139);
    }

    .carbon-poweredby {
      font-size: 12px;
      margin-top: 4px;
      color: rgb(100 116 139);
    }

    @media (max-width: 1023px) {
      #carbonads-container {
        display: none;
      }
    }
  `,
};

export default CarbonAds;
