import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { posts } from '../data/posts'
import Tag from '../components/Tag'
import Blobs from '../components/Blobs'
import LiveEditor from '../components/LiveEditor'
import LikeButton from '../components/LikeButton'
import styles from './Post.module.css'

function renderContent(content) {
  // Split on code fences FIRST to avoid any line-by-line misparse inside code blocks
  const FENCE_RE = /^```(\w*)\n([\s\S]*?)^```/gm
  const segments = []
  let lastIndex = 0
  let match

  while ((match = FENCE_RE.exec(content)) !== null) {
    // Text before this code block
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    segments.push({ type: 'code', lang: match[1], code: match[2] })
    lastIndex = match.index + match[0].length
  }
  // Remaining text after last code block
  if (lastIndex < content.length) {
    segments.push({ type: 'text', content: content.slice(lastIndex) })
  }

  const elements = []
  let keyCounter = 0

  for (const seg of segments) {
    if (seg.type === 'code') {
      if (seg.lang === 'csshtml') {
        const htmlMatch = seg.code.match(/HTML:\n([\s\S]*?)(?=\nCSS:)/)
        const cssMatch  = seg.code.match(/CSS:\n([\s\S]*)$/)
        const html = htmlMatch ? htmlMatch[1].trim() : ''
        const css  = cssMatch  ? cssMatch[1].trim()  : seg.code
        elements.push(
          <LiveEditor key={keyCounter++} lang="csshtml" initialHtml={html} initialCss={css} />
        )
      } else {
        elements.push(
          <LiveEditor key={keyCounter++} lang={seg.lang} initialCode={seg.code.trimEnd()} />
        )
      }
      continue
    }

    // Process text segment line by line
    const lines = seg.content.split('\n')
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // H2
      if (line.startsWith('## ')) {
        elements.push(<h2 key={keyCounter++} className={styles.h2}>{line.slice(3)}</h2>)
        i++; continue
      }

      // H3
      if (line.startsWith('### ')) {
        elements.push(<h3 key={keyCounter++} className={styles.h3}>{line.slice(4)}</h3>)
        i++; continue
      }

      // Table
      if (line.startsWith('|')) {
        const tableLines = []
        while (i < lines.length && lines[i].startsWith('|')) {
          tableLines.push(lines[i]); i++
        }
        const headers = tableLines[0].split('|').filter(Boolean).map(s => s.trim())
        const rows = tableLines.slice(2).map(row =>
          row.split('|').filter(Boolean).map(s => s.trim())
        )
        elements.push(
          <div key={keyCounter++} className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr>{headers.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      }

      // Bullet list
      if (line.startsWith('- ')) {
        const items = []
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(lines[i].slice(2)); i++
        }
        elements.push(
          <ul key={keyCounter++} className={styles.list}>
            {items.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            ))}
          </ul>
        )
        continue
      }

      // Empty line
      if (line.trim() === '') { i++; continue }

      // Paragraph
      elements.push(
        <p key={keyCounter++} className={styles.para}
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
        />
      )
      i++
    }
  }

  return elements
}

function inlineFormat(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>')
}

export default function Post() {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = posts.find(p => p.id === id)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!post) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
        <p>// post not found</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', color: 'var(--accent1)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)' }}>
          ← back home
        </button>
      </div>
    )
  }

  return (
    <>
      <Blobs />
      <article className={styles.article}>
        <button className={styles.back} onClick={() => navigate(-1)}>← back</button>

        <header className={styles.header}>
          <Tag tag={post.tag} />
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span>{post.date}</span>
            <span className={styles.dot}>·</span>
            <span>{post.readTime}</span>
          </div>
          <p className={styles.lead}>{post.excerpt}</p>
        </header>

        <div className={styles.divider} />

        <div className={styles.content}>
          {renderContent(post.content)}
        </div>

        <div className={styles.divider} />

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <LikeButton postId={post.id} />
          </div>
          <div className={styles.footerRight}>
            <a href="https://www.linkedin.com/in/vaishnavi-p-deshpande/" target="_blank" rel="noreferrer" className={styles.btnOutline}>
              connect on linkedin
            </a>
            <button className={styles.btnOutline} onClick={() => navigate('/')}>
              ← more articles
            </button>
          </div>
        </div>
      </article>
    </>
  )
}
