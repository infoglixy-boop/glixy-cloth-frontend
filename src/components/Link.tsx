import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate, withBase } from '../router'

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

export default function Link({ to, onClick, target, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || target) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={withBase(to)} target={target} onClick={handle} {...rest} />
}

