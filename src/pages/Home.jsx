import { useState } from 'react'
import { posts } from '../data/posts'
import PostCard from '../components/PostCard'
import Blobs from '../components/Blobs'
import styles from './Home.module.css'

const FILTERS = [
  { key: 'all', label: 'all posts' },
  { key: 'debug', label: 'debugging' },
  { key: 'css', label: 'css' },
  { key: 'bestpractice', label: 'best practices' },
  { key: 'epicfail', label: 'epic fails' },
]

function getCountdown(publishDate) {
  const now = new Date()
  const pub = new Date(publishDate)
  const diff = pub - now
  if (diff <= 0) return null
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days === 1) return 'drops tomorrow'
  return 'drops in ' + days + ' days'
}

function formatDate(publishDate) {
  return new Date(publishDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function ScheduledCard({ post }) {
  const countdown = getCountdown(post.publishDate)
  return (
    <div className={styles.scheduledCard}>
      <div className={styles.scheduledBadge}>
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
          <rect x="0.5" y="5.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M2.5 5.5V3.5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        coming soon
      </div>
      <h2 className={styles.scheduledTitle}>{post.title}</h2>
      <p className={styles.scheduledExcerpt}>{post.excerpt}</p>
      <div className={styles.scheduledFooter}>
        {countdown && <span className={styles.countdown}>{countdown}</span>}
        <span className={styles.scheduledDate}>
          {formatDate(post.publishDate)}
        </span>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all')

  const now = new Date()
  const published = posts.filter(p => !p.publishDate || new Date(p.publishDate) <= now)
  const scheduled = posts.filter(p => p.publishDate && new Date(p.publishDate) > now)

  const filtered = activeFilter === 'all'
    ? published
    : published.filter(p => p.tag === activeFilter)

  const filteredScheduled = activeFilter === 'all' ? scheduled : []

  return (
    <>
      <Blobs />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Where developers <span className={styles.highlight}>debug,</span>
          <br />learn and<br />level up.
        </h1>
        <p className={styles.heroSub}>
          <span className={styles.key}>const</span> blog = &#123;<br />
          &nbsp;&nbsp;<span className={styles.fn}>topics</span>: [
          <span className={styles.str}>"frontend"</span>,{' '}
          <span className={styles.str}>"debugging"</span>,{' '}
          <span className={styles.str}>"best practices"</span>,{' '}
          <span className={styles.str}>"career"</span>],<br />
          &nbsp;&nbsp;<span className={styles.fn}>vibe</span>:{' '}
          <span className={styles.str}>"real talk from a real dev"</span><br />
          &#125;
        </p>
        <div className={styles.heroActions}>
          <a
            href="https://www.linkedin.com/in/vaishnavi-p-deshpande/"
            target="_blank"
            rel="noreferrer"
            className={styles.btnPrimary}
          >
            connect on linkedin
          </a>
        </div>
      </section>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerLabel}>// latest_posts</span>
        <div className={styles.dividerLine} />
      </div>

      <div className={styles.filterBar}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`${styles.filterTab} ${activeFilter === f.key ? styles.filterActive : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.grid} id="posts">
        {filtered.length === 0 && filteredScheduled.length === 0 ? (
          <p className={styles.empty}>// no posts found yet</p>
        ) : (
          <>
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
            {filteredScheduled.map((post) => (
              <ScheduledCard key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
    </>
  )
}
