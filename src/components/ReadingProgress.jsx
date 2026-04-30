import { useState, useEffect } from 'react'
import styles from './ReadingProgress.module.css'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const article = document.querySelector('article')
      if (!article) return

      const { top, height } = article.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrolled = -top
      const total = height - windowHeight

      if (total <= 0) { setProgress(100); return }
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100))
      setProgress(pct)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (progress === 0) return null

  return (
    <div className={styles.bar} style={{ width: `${progress}%` }} />
  )
}
