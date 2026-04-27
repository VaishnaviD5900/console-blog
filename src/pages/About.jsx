import Blobs from '../components/Blobs'
import styles from './About.module.css'

export default function About() {
  return (
    <>
      <Blobs />
      <section className={styles.about}>
        <div className={styles.label}>// about.me</div>
        <h1 className={styles.title}>
          A frontend dev who got<br />
          tired of suffering <span className={styles.highlight}>alone.</span>
        </h1>
        <div className={styles.body}>
          <p>
            console.blog is where I dump all the CSS pain, debugging horror stories,
            and "I can't believe that's how it works" moments from my day-to-day as a frontend developer.
          </p>
          <p>
            The goal isn't to be a textbook. It's to be the friend who says
            <span className={styles.quote}> "bro I had the exact same issue, here's what it was"</span> — and
            actually explains it well enough that you don't forget it next time.
          </p>
          <p>
            Every post comes from something that actually broke, confused, or surprised me.
            No made-up examples. Just real frontend life.
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.stack}>
          <div className={styles.stackLabel}>// tech_stack</div>
          <div className={styles.tags}>
            {['Javascript', 'React', 'TypeScript', 'Vue.js', 'Vuetify', 'Material UI', 'ShadCN', 'Next.js', 'Zustand', 'Angular', 'Tailwind', 'Figma', 'Docker', 'PostgreSQL', 'Core Java', 'Python'].map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.links}>
          <div className={styles.stackLabel}>// find_me</div>
          <div className={styles.linkList}>
            <a href="https://www.linkedin.com/in/vaishnavi-p-deshpande/" target="_blank" rel="noreferrer" className={styles.link}>
              <span className={styles.linkArrow}>→</span> linkedin
            </a>
            <a href="mailto:vaishnavipd59@gmail.com" className={styles.link}>
              <span className={styles.linkArrow}>→</span> vaishnavipd59@gmail.com
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
