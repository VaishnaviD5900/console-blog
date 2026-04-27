import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        &gt;_ console<span className={styles.dot}>.</span>blog
      </div>
      <div className={styles.links}>
        <a href="https://www.linkedin.com/in/vaishnavi-p-deshpande/" target="_blank" rel="noreferrer">linkedin</a>
        <a href="mailto:vaishnavipd59@gmail.com">email</a>
      </div>
    </footer>
  )
}
