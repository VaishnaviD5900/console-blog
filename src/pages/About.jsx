import Blobs from '../components/Blobs'
import styles from './About.module.css'
import {
  SiJavascript, SiReact, SiTypescript, SiVuedotjs, SiVuetify,
  SiMui, SiNextdotjs, SiAngular, SiTailwindcss, SiFigma,
  SiDocker, SiPostgresql, SiPython, SiShadcnui,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'

const AgGridIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="0"  y="4"  width="30" height="13" rx="2" fill="#9E9E9E"/>
    <rect x="18" y="20" width="46" height="13" rx="2" fill="#26C6DA"/>
    <rect x="8"  y="36" width="40" height="13" rx="2" fill="#FFA726"/>
    <rect x="0"  y="52" width="22" height="13" rx="2" fill="#EF5350"/>
  </svg>
)

const techStack = [
  { name: 'JavaScript',   icon: SiJavascript,  color: '#F7DF1E' },
  { name: 'React',        icon: SiReact,        color: '#61DAFB' },
  { name: 'TypeScript',   icon: SiTypescript,   color: '#3178C6' },
  { name: 'Vue.js',       icon: SiVuedotjs,     color: '#4FC08D' },
  { name: 'Vuetify',      icon: SiVuetify,      color: '#1867C0' },
  { name: 'Material UI',  icon: SiMui,          color: '#007FFF' },
  { name: 'ShadCN',       icon: SiShadcnui,     color: '#e8e8f0' },
  { name: 'Next.js',      icon: SiNextdotjs,    color: '#e8e8f0' },
  { name: 'Angular',      icon: SiAngular,      color: '#DD0031' },
  { name: 'Tailwind',     icon: SiTailwindcss,  color: '#06B6D4' },
  { name: 'Figma',        icon: SiFigma,        color: '#F24E1E' },
  { name: 'Docker',       icon: SiDocker,       color: '#2496ED' },
  { name: 'PostgreSQL',   icon: SiPostgresql,   color: '#4169E1' },
  { name: 'Core Java',    icon: FaJava,         color: '#ED8B00' },
  { name: 'Python',       icon: SiPython,       color: '#3776AB' },
  { name: 'AG Grid',      icon: AgGridIcon,     color: null },
]

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
            <span className={styles.quote}> "bro I had the exact same issue, here's what it was"</span> - and
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
            {techStack.map(({ name, icon: Icon, color }) => (
              <span key={name} className={styles.tag}>
                <Icon size={15} style={color ? { color } : undefined} />
                {name}
              </span>
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
