import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.prompt}>&gt;_</span>
        <span> console.blog</span>
        <span className={styles.cursor} />
      </Link>
      <div className={styles.links}>
        <Link to="/" className={pathname === '/' ? styles.active : ''}>articles</Link>
        <Link to="/about" className={pathname === '/about' ? styles.active : ''}>about</Link>
        <span className={styles.badge}>// frontend</span>
      </div>
    </nav>
  )
}
