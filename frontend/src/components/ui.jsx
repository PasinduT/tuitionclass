import { cn } from '../lib/utils'

export function Button({ className, variant = 'primary', size = 'default', children, ...props }) {
  const variants = {
    primary: 'bg-leaf-600 text-white hover:bg-leaf-700 shadow-lift',
    secondary: 'bg-white text-ink border border-black/10 hover:border-leaf-500/40 hover:bg-leaf-50',
    ghost: 'text-slate-600 hover:bg-black/[0.04] hover:text-ink',
    dark: 'bg-ink text-white hover:bg-slate-800',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100',
  }
  const sizes = { sm: 'h-9 px-3 text-sm rounded-xl', default: 'h-11 px-5 rounded-2xl', lg: 'h-13 px-6 rounded-2xl text-base' }
  return <button className={cn('inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50', variants[variant], sizes[size], className)} {...props}>{children}</button>
}

export function Card({ className, children, ...props }) {
  return <section className={cn('rounded-3xl border border-black/[0.06] bg-white shadow-soft', className)} {...props}>{children}</section>
}

export function Badge({ className, tone = 'green', children }) {
  const tones = { green: 'bg-leaf-50 text-leaf-700', yellow: 'bg-amber-50 text-amber-700', red: 'bg-red-50 text-red-700', blue: 'bg-sky-50 text-sky-700', gray: 'bg-slate-100 text-slate-600', purple: 'bg-violet-50 text-violet-700' }
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold', tones[tone], className)}>{children}</span>
}

export function Progress({ value, className, indicatorClassName, ...props }) {
  return <div className={cn('h-2 overflow-hidden rounded-full bg-slate-100', className)} {...props}><div className={cn('h-full rounded-full bg-leaf-500 transition-all', indicatorClassName)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
}

export function Avatar({ initials = 'AK', className }) {
  return <div className={cn('grid h-10 w-10 place-items-center rounded-full bg-[#dff3d6] font-display text-sm font-extrabold text-leaf-700 ring-2 ring-white', className)}>{initials}</div>
}

export function Select({ className, children, ...props }) {
  return <select className={cn('h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-ink outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10', className)} {...props}>{children}</select>
}
