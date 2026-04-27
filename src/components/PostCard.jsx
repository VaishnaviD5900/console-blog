import { useNavigate } from 'react-router-dom'
import Tag from './Tag'
import styles from './PostCard.module.css'

function CodePreview({ lines }) {
  return (
    <div className={styles.codePreview}>
      {lines.map((line, i) => {
        if (line.type === 'comment')   return <div key={i} className={styles.codeComment}>{line.text}</div>
        if (line.type === 'selector')  return <div key={i} className={styles.codeSelector}>{line.text}</div>
        if (line.type === 'close')     return <div key={i} className={styles.codeSelector}>{line.text}</div>
        if (line.type === 'bad')       return <div key={i}>&nbsp;&nbsp;<span className={styles.codeProp}>{line.prop}</span>: <span className={styles.codeBad}>{line.val}</span>;</div>
        if (line.type === 'good')      return <div key={i}>&nbsp;&nbsp;<span className={styles.codeProp}>{line.prop}</span>: <span className={styles.codeGood}>{line.val}</span>;</div>
        return null
      })}
    </div>
  )
}

export default function PostCard({ post, index }) {
  const navigate = useNavigate()

  return (
    <article
      className={`${styles.card} ${post.featured ? styles.featured : ''}`}
      onClick={() => navigate(`/post/${post.id}`)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.cardBody}>
        <Tag tag={post.tag} />
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.meta}>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
          {post.featured && <span className={styles.trending}>🔥 trending</span>}
        </div>
      </div>
      {post.featured && post.codePreview && (
        <div className={styles.previewCol}>
          <CodePreview lines={post.codePreview} />
        </div>
      )}
    </article>
  )
}
