import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let targetX = window.innerWidth  / 2
    let targetY = window.innerHeight / 2
    let dotX    = targetX
    let dotY    = targetY
    let rafId   = null

    const onMouseMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const animate = () => {
      dotX = lerp(dotX, targetX, 0.15)
      dotY = lerp(dotY, targetY, 0.15)
      dot.style.transform = `translate(${dotX}px, ${dotY}px)`
      rafId = requestAnimationFrame(animate)
    }

    animate()
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return <div ref={dotRef} className={styles.dot} />
}
