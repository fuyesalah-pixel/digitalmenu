import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Button({ className, variant = 'default', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' }) {
  return <button className={cn('ui-button', `ui-button-${variant}`, className)} {...props} />
}
