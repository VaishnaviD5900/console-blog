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

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? posts
    : posts.filter(p => p.tag === activeFilter)

  return (
    <>
      <Blobs />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Where CSS <span className={styles.highlight}>breaks</span>
          <br />and bugs get<br />explained.
        </h1>
        <p className={styles.heroSub}>
          <span className={styles.key}>const</span> blog = &#123;<br />
          &nbsp;&nbsp;<span className={styles.fn}>topics</span>: [
          <span className={styles.str}>"epic fails"</span>,{' '}
          <span className={styles.str}>"best practices"</span>,{' '}
          <span className={styles.str}>"debugging"</span>],<br />
          &nbsp;&nbsp;<span className={styles.fn}>vibe</span>:{' '}
          <span className={styles.str}>"funny but you'll actually learn something"</span><br />
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
        {filtered.length === 0 ? (
          <p className={styles.empty}>// no posts found yet</p>
        ) : (
          filtered.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))
        )}
      </div>
    </>
  )
}
