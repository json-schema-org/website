import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'

const MainNavLink = ({ uri, label, className }: { uri: string, label: string, isActive: boolean, className?: string }) => {
  const router = useRouter()
  return (
    <Link href={uri} className={classnames(className, 'font-semibold p-2 md:p-4', `${router.asPath === uri ? 'text-primary hover:text-primary' : 'text-slate-600 hover:text-primary'
    }`
    )}
    >{label}
    </Link>
  )
}
  

export default MainNavLink