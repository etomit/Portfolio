import { siGithub } from 'simple-icons/icons'

const stroke = {
  className: 'icon',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export const ArrowUpRight = () => <svg {...stroke}><path d="M7 17 17 7M8.5 7H17v8.5" /></svg>
export const ArrowDown = () => <svg {...stroke}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
export const ArrowUp = () => <svg {...stroke}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
export const CloseIcon = () => <svg {...stroke}><path d="M6 6l12 12M18 6 6 18" /></svg>
export const MailIcon = () => <svg {...stroke}><path d="M3.5 6.5h17v11h-17zM4 7l8 6.5L20 7" /></svg>
export const CopyIcon = () => <svg {...stroke}><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M15 9V5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15H9" /></svg>
export const CheckIcon = () => <svg {...stroke}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
export const SunIcon = () => <svg {...stroke}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></svg>
export const MoonIcon = () => <svg {...stroke}><path d="M20 14.8A8.5 8.5 0 0 1 9.2 4 8.5 8.5 0 1 0 20 14.8Z" /></svg>
export const ArrowRight = () => <svg {...stroke}><path d="M4 12h15M13 6l6 6-6 6" /></svg>

export const GithubIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={siGithub.path} />
  </svg>
)

export const LinkedinIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3ZM9.5 9.75h3.8v1.55c.6-1.05 1.9-1.85 3.7-1.85 3.3 0 4.5 2.1 4.5 5.4V21h-4v-5.4c0-1.6-.6-2.6-2-2.6s-2 1-2 2.6V21h-4Z" />
  </svg>
)
