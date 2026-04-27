import { useState, useEffect } from 'react'
import { getLikes, incrementLikes } from '../utils/likes'
import styles from './LikeButton.module.css'

export default function LikeButton({ postId }) {
  const [count, setCount]       = useState(0)
  const [liked, setLiked]       = useState(false)
  const [loading, setLoading]   = useState(true)
  const [animate, setAnimate]   = useState(false)

  const storageKey = `liked:${postId}`

  useEffect(() => {
    // Check if already liked from localStorage
    const alreadyLiked = localStorage.getItem(storageKey) === 'true'
    setLiked(alreadyLiked)

    // Fetch current count from Upstash
    getLikes(postId).then(n => {
      setCount(n)
      setLoading(false)
    })
  }, [postId])

  const handleLike = async () => {
    if (liked || loading) return

    // Optimistic update
    setCount(c => c + 1)
    setLiked(true)
    setAnimate(true)
    setTimeout(() => setAnimate(false), 600)

    // Persist liked state
    localStorage.setItem(storageKey, 'true')

    // Increment in Upstash
    const newCount = await incrementLikes(postId)
    setCount(newCount)
  }

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.btn} ${liked ? styles.liked : ''} ${animate ? styles.animate : ''}`}
        onClick={handleLike}
        disabled={liked || loading}
        title={liked ? 'You liked this!' : 'Like this post'}
      >
        <span className={styles.heart}>
          {liked ? '❤️' : '🤍'}
        </span>
        <span className={styles.label}>
          {liked ? 'liked!' : 'like this'}
        </span>
      </button>
      <span className={styles.count}>
        {loading ? '...' : `${count} ${count === 1 ? 'like' : 'likes'}`}
      </span>
    </div>
  )
}
