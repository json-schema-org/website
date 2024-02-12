import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

declare global {
  interface Window {
    _carbonads: {
      refresh: () => void
      reload: (where: string, force_serve: boolean) => void
      remove: (el: HTMLElement) => void
      srv: () => void
    }
  }
}

type Props = {
  className?: string
  variant?: 'default'
}

function CarbonAds({ className, variant = 'default' }: Props) {
  const router = useRouter()

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)')
    if (!mobileMediaQuery.matches) {
      const hasCarbonAds = document.querySelector('#carbonads')

      if (hasCarbonAds) {
        window._carbonads.refresh()
        return
      } else {
        const carbonAdsScript = document.createElement('script')
        carbonAdsScript.id = '_carbonads_js'
        carbonAdsScript.type = 'text/javascript'
        carbonAdsScript.async = true
        carbonAdsScript.src = `//cdn.carbonads.com/carbon.js?serve=CE7I627Y&placement=json-schemaorg&rnd=${Math.random()}`
        document.querySelector('#carbonads-container')?.appendChild(carbonAdsScript)
      }
    }

    const existingStyleSheet = document.querySelector('#_carbonads_css')
    if (existingStyleSheet) {
      existingStyleSheet.innerHTML = CarbonAds.stylesheet[variant]
    } else {
      const carbonAdsStyleSheet = document.createElement('style')
      carbonAdsStyleSheet.id = '_carbonads_css'
      carbonAdsStyleSheet.innerHTML = CarbonAds.stylesheet[variant]
      document.querySelector('#carbonads-container')?.appendChild(carbonAdsStyleSheet)
    }
  }, [router.asPath])


  return <aside id='carbonads-container' className={className}>
  </aside>
}

CarbonAds.stylesheet = {
  default: `
#carbonads {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
		Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial,
		sans-serif;
	font-size: 12px;
	line-height: 1.45;
	background-color: #f9f9f9;
	border: 1px dashed;
	border-color: #cacaca;
	position: fixed;
	right: 0;
	bottom: 0;
	box-sizing: border-box;
	float: right;
	max-width: 300px;
	text-align: left !important;
	margin: 0;
	z-index: 1000;
	border-top-left-radius: 10px;
}

@media (min-width: 775px) and (max-device-width: 1068px) {
	#carbonads {
		top: 140px;
	}
}

@media (max-width: 775px) {
	#carbonads {
		display: none;
	}
}

.separation-line {
	border-bottom: 1px solid white; /* Adjust the border style as needed */
}

#carbonads > span {
	position: relative;
	display: block;
	padding: 10px;
	border-radius: 4px;
}

#carbonads .carbon-wrap {
	display: flex;
}

#carbonads .carbon-img {
	margin-right: 10px;
	line-height: 1;
}

#carbonads .carbon-text {
	margin-bottom: 12px;
	color: #637381;
	text-decoration: none;
}

#carbonads .carbon-poweredby {
	position: absolute;
	bottom: 10px;
	left: 152px;
	color: #c5cdd0;
	text-decoration: none;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-weight: 500;
	font-size: 10px;
	line-height: 1;
}

#carbonads .carbon-poweredby:hover {
	color: #637381;
}

@media only screen and (min-width: 320px) and (max-width: 759px) {
	.carbon-text {
		font-size: 14px;
	}
}
`
}

export default CarbonAds