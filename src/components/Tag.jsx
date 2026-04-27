import { tagMeta } from '../data/posts'

export default function Tag({ tag }) {
  const meta = tagMeta[tag] || tagMeta.css
  return (
    <span style={{
      fontFamily: 'var(--mono)',
      fontSize: '0.62rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '3px 10px',
      borderRadius: '20px',
      display: 'inline-block',
      background: meta.bg,
      color: meta.color,
      border: `1px solid ${meta.border}`,
    }}>
      {meta.label}
    </span>
  )
}
