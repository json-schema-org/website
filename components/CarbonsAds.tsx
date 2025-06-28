import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    _carbonads: {
      refresh: () => void;
      reload: (where: string, force_serve: boolean) => void;
      remove: (el: HTMLElement) => void;
      srv: () => void;
    };
  }
}

type Props = {
  className?: string;
  variant?: 'sidebar';
};

function CarbonAds({ className, variant = 'sidebar' }: Props) {
  const carbonRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 1023px)');
    if (!mobileMediaQuery.matches) {
      const hasCarbonAds = document.querySelector('#carbonads');
      // Check if another ad is present to refresh
      if (hasCarbonAds) {
        window._carbonads.refresh();
        return;
      } else {
        // Check if the script is present (ad is not yet present) so that duplicate requests are not made to carbon ads
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
    } else {
      (carbonRef.current as HTMLElement).style.display = 'none';
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
      background-color: #ffffff;
      border: 1px dashed #e5e7eb;
      box-sizing: border-box;
      border-radius: 10px;
      max-width: 300px;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    #carbonads .carbon-wrap {
      background-color: #f9f9f9 !important;
    }

    #carbonads .carbon-text,
    #carbonads .carbon-poweredby {
      background-color: inherit !important;
      color: #374151 !important;
    }

    #carbonads .carbon-text {
      font-size: 12px;
      font-family: Inter, ui-sans-serif, system-ui;
      line-height: 1.4;
    }

    #carbonads .carbon-img {
      text-align: center;
      margin: 0 auto 8px;
    }

    #carbonads .carbon-img img {
      display: inline-block;
      margin: 0 auto;
      filter: brightness(1);
      border: 1px solid #e5e7eb !important;
      background-color: #f9fafb !important;
      border-radius: 4px;
    }

    #carbonads .carbon-poweredby {
      font-size: 11px !important;
      text-align: center !important;
      display: block;
      margin-top: 4px;
      color: #6b7280 !important;
    }

    #carbonads a {
      color: #2563eb !important;
      text-decoration: none !important;
    }

    #carbonads a:hover {
      color: #1d4ed8 !important;
    }

    /* Dark mode overrides */
    .dark #carbonads {
      background-color: rgb(30 41 59) !important;
      border-color: rgb(51 65 85) !important;
    }

    .dark #carbonads .carbon-text,
    .dark #carbonads .carbon-poweredby {
      color: #f1f5f9 !important;
    }

    .dark #carbonads .carbon-poweredby {
      color: #94a3b8 !important;
    }

    .dark #carbonads a {
      color: #7dd3fc !important;
    }

    .dark #carbonads .carbon-wrap {
      background-color: #0f172a !important;
    }

    .dark #carbonads a:hover {
      color: #e2e8f0 !important;
    }

    .dark #carbonads .carbon-img img {
      filter: brightness(0.9) contrast(1.1);
      border-color: rgb(51 65 85) !important;
      background-color: rgb(15 23 42) !important;
    }

    @media (max-width: 1023px) {
      #carbonads-container {
        display: none;
      }
    }
  `,
};

export default CarbonAds;
