import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Matter from 'matter-js'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import * as THREE from 'three'
import {
  ArrowUpRight, Code2, Facebook, Github, Instagram, Linkedin, Mail,
  MapPin, MessageCircle, Move3D, Send, X
} from 'lucide-react'

type Project = {
  id: string
  title: string
  type: string
  description: string
  tags: string[]
  accent: string
  image: string
}

const socials = [
  ['LinkedIn', 'https://www.linkedin.com/in/muhammad-ikram-02873428a/', Linkedin],
  ['GitHub', 'https://github.com/muhammadikramnazir?tab=repositories', Github],
  ['Instagram', 'https://www.instagram.com/_ikram_prince?stkn=MWVsM2VsN25mYTZ2YQ==', Instagram],
  ['Facebook', 'https://www.facebook.com/ikram.mayo.1865', Facebook],
  ['WhatsApp', 'https://wa.me/message/WHW57KL6ZAIJP1', MessageCircle],
] as const

const projects: Project[] = [
  { id: '03.01', title: 'E-VOTING SYSTEM', type: 'FINAL YEAR PROJECT', description: 'A full-stack voting platform with member authentication, elections, positions, candidates, secure voting workflows and results.', tags: ['React', 'Node.js', 'Express', 'MySQL', 'JWT'], accent: '#00f0ff', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85' },
  { id: '03.02', title: 'LIKESHOPIFY', type: 'E-COMMERCE PLATFORM', description: 'A modern shopping experience with product discovery, authentication, cart, wishlist and order-oriented flows.', tags: ['React', 'Node.js', 'REST API', 'MySQL'], accent: '#9d00ff', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85' },
  { id: '03.03', title: 'LUXÉ STORE', type: 'PREMIUM STORE', description: 'A luxury storefront concept focused on cinematic product presentation and a scalable React architecture.', tags: ['React', 'Express', 'UI/UX', 'CSS'], accent: '#61e8ff', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85' },
]

const skills = [['React', 95], ['JavaScript', 91], ['TypeScript', 82], ['Node.js', 88], ['Express.js', 87], ['MySQL', 82], ['HTML / CSS', 96], ['Tailwind CSS', 88], ['Git / GitHub', 90], ['UI / UX', 78]]

function SpaceBackground() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => { const p = new Float32Array(1800); for (let i = 0; i < p.length; i++)p[i] = (Math.random() - .5) * 40; return p }, [])
  useFrame(({ clock }) => { if (ref.current) { ref.current.rotation.y = clock.elapsedTime * .006; ref.current.rotation.x = Math.sin(clock.elapsedTime * .04) * .025 } })
  return <>
    <ambientLight intensity={.25} />
    <pointLight position={[5, 2, 5]} color="#00f0ff" intensity={12} />
    <pointLight position={[-5, -3, 2]} color="#9d00ff" intensity={10} />
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#bdefff"
        size={0.018}
        transparent
        opacity={0.65}
      />
    </points>
    <Sparkles count={220} scale={[20, 12, 20]} size={1.2} speed={.25} color="#a8dcff" opacity={.45} />
    <Float speed={.6} rotationIntensity={.15} floatIntensity={.3}>
      <mesh position={[5, 1, -5]}><icosahedronGeometry args={[1.45, 1]} /><meshBasicMaterial color="#00f0ff" wireframe transparent opacity={.15} /></mesh>
    </Float>
  </>
}

function GlassCard({ children, className = '', style, onClick }: { children: ReactNode; className?: string; style?: CSSProperties; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5; const y = (e.clientY - r.top) / r.height - .5; el.style.setProperty('--rx', `${-y * 7}deg`); el.style.setProperty('--ry', `${x * 9}deg`); el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`) }
    const leave = () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.style.setProperty('--mx', '50%'); el.style.setProperty('--my', '50%') }
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [])
  return <div ref={ref} className={`glass-card ${className}`} style={style} onClick={onClick}>{children}</div>
}

function PhysicsDots() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!host.current) return; const engine = Matter.Engine.create({ gravity: { x: 0, y: .12, scale: .001 } }); const bodies = Array.from({ length: 12 }, (_, i) => Matter.Bodies.circle(20 + i * 34, 20 + (i % 4) * 30, 3 + Math.random() * 3, { restitution: .9, frictionAir: .02 })); Matter.Composite.add(engine.world, bodies); const runner = Matter.Runner.create(); Matter.Runner.run(runner, engine); let raf = 0; const tick = () => { bodies.forEach((b, i) => { const el = host.current?.children[i] as HTMLElement | null; if (el) el.style.transform = `translate3d(${b.position.x}px,${b.position.y}px,0)` }); raf = requestAnimationFrame(tick) }; tick(); return () => { cancelAnimationFrame(raf); Matter.Runner.stop(runner); Matter.Engine.clear(engine) } }, [])
  return <div ref={host} className="physics-dots">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
}

function Preview({ project }: { project: Project }) {
  return <div className="preview" style={{ '--accent': project.accent } as CSSProperties}>
    <img src={project.image} alt="" loading="lazy" />
    <div className="preview-overlay" />
    <div className="preview-ui"><span>PROJECT PREVIEW</span><b>LIVE CONCEPT</b></div>
    <div className="preview-orb" />
  </div>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 55, scale: .96, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} viewport={{ once: true, amount: .16 }} transition={{ duration: .8, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}

function App() {
  const [active, setActive] = useState<Project | null>(null)
  const [menu, setMenu] = useState(false)
  const [intro, setIntro] = useState(true)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15 })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    const timer = setTimeout(() => setIntro(false), 900)
    const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact']
    const observers = sections.map(id => { const el = document.getElementById(id); if (!el) return null; const ob = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveSection(id) }, { rootMargin: '-35% 0px -55%' }); ob.observe(el); return ob })
    return () => { cancelAnimationFrame(raf); lenis.destroy(); clearTimeout(timer); observers.forEach(o => o?.disconnect()) }
  }, [])

  const nav = [['home', 'HOME'], ['about', 'ABOUT'], ['experience', 'EXPERIENCE'], ['projects', 'PROJECTS'], ['skills', 'SKILLS'], ['contact', 'CONTACT']]

  return <div className="site">
    <div className="backdrop"><Canvas camera={{ position: [0, 0, 10], fov: 52 }}><SpaceBackground /></Canvas><div className="glow cyan" /><div className="glow purple" /><PhysicsDots /></div>
    <AnimatePresence>{intro && <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="intro-mark">MI</div><span>MUHAMMAD IKRAM / SPATIAL PORTFOLIO</span></motion.div>}</AnimatePresence>

    <header className="header">
      <a className="brand" href="#home"><span className="brand-symbol">MI</span><span>MUHAMMAD IKRAM</span></a>
      <nav className={menu ? 'open' : ''}>
        {nav.map(([id, label]) => <a className={activeSection === id ? 'active' : ''} key={id} href={`#${id}`} onClick={() => setMenu(false)}><span>{label}</span></a>)}
      </nav>
      <button className="menu" aria-label="Toggle menu" onClick={() => setMenu(v => !v)}>{menu ? <X size={18} /> : <Move3D size={18} />}</button>
    </header>

    <main id="home" className="deck">
      <section className="hero-deck">
        <motion.div className="hero-brand" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .15 }}>
          <div className="hero-photo-wrap"><img src="/profile.jpg" alt="Muhammad Ikram" /><span /></div>
          {/* <div className="monogram">MI</div> */}
          <div><div className="eyebrow">FULL STACK DEVELOPER · LAHORE</div><h1>MUHAMMAD<br /><span>IKRAM</span></h1><p>React · Node.js · Express · MySQL · UI/UX</p></div>
        </motion.div>

        <GlassCard className="experience-card" style={{ transform: 'rotateY(var(--ry)) rotateX(var(--rx)) rotateZ(-1.4deg)' }}>
          <div className="card-title"><span>EXPERIENCE</span><small>02</small></div>
          <div className="role"><strong>Web Development Intern</strong><span>Corvit Systems Lahore · 3 Months</span></div>
          <p>Practical web development training in Gulberg III, Lahore — building responsive interfaces, JavaScript applications and real-world project workflows.</p>
          <div className="company-list"><div><b className="logo-dot cyan-dot">C</b><span>Corvit Systems Lahore</span><em>Internship</em></div><div><b className="logo-dot">R</b><span>React / Frontend</span><em>Training</em></div><div><b className="logo-dot purple-dot">N</b><span>Node / API</span><em>Training</em></div></div>
          <div className="depth-label">DEPTH FIELD / GLASS PLANE</div>
        </GlassCard>

        <div className="project-cluster" id="projects">
          <div className="cluster-glow" />
          {projects.map((p, i) => <motion.div key={p.id} className={`project-float p${i + 1}`} initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 + i * .12, duration: .8 }}>
            <GlassCard className="project-card" onClick={() => setActive(p)}>
              <div className="card-title"><span>PROJECT</span><small>{p.id}</small></div>
              <Preview project={p} />
              <div className="project-caption"><strong>{p.title}</strong><span>{p.type}</span></div>
              <div className="card-arrow"><ArrowUpRight size={17} /></div>
            </GlassCard>
          </motion.div>)}
          <div className="project-floor">SPATIAL PROJECT DECK / 2026</div>
        </div>

        <div className="right-stack">
          <GlassCard className="contact-mini" style={{ transform: 'rotateY(var(--ry)) rotateX(var(--rx))' }}>
            <div className="card-title"><span>CONTACT</span><small>06</small></div><p>Let&apos;s build something<br />that feels different.</p>
            <a className="mail-button" href="mailto:ikrammayo151@gmail.com"><Mail size={17} /></a>
            <div className="social-mini">{socials.slice(0, 4).map(([name, href, Icon]) => <a aria-label={name} key={name} href={href} target="_blank" rel="noreferrer"><Icon size={14} /></a>)}</div>
          </GlassCard>
          <GlassCard className="skills-mini"><div className="card-title"><span>SKILLS</span><small>05</small></div>{skills.slice(0, 5).map(([name, val]) => <div className="skill-row" key={name}><span>{name}</span><b>{val}%</b><i><em style={{ width: `${val}%` }} /></i></div>)}</GlassCard>
        </div>
      </section>

      <section id="about" className="deep-section">
        <div className="section-kicker">ABOUT / 01</div>
        <div className="deep-grid">
          <Reveal><GlassCard className="large-info"><div className="card-title"><span>ABOUT THE DEVELOPER</span><small>01</small></div><h2>Engineering with a <span>visual edge.</span></h2><p>I&apos;m Muhammad Ikram, a full stack developer from Raiwind, Lahore. I build modern React interfaces, Node.js APIs, database-driven products and polished user experiences.</p><div className="meta-grid"><span><MapPin size={14} /> Raiwind, Lahore</span><span><Code2 size={14} /> React / Node</span><span><Mail size={14} /> ikrammayo151@gmail.com</span></div></GlassCard></Reveal>
          <Reveal delay={.12}><GlassCard className="photo-panel"><img src="/profile.jpg" alt="Muhammad Ikram" /><div><b>MUHAMMAD IKRAM</b><span>FULL STACK DEVELOPER</span></div></GlassCard></Reveal>
        </div>
      </section>

      <section id="experience" className="deep-section experience-section">
        <div className="section-kicker">EXPERIENCE / 02</div>
        <Reveal><GlassCard className="timeline-card"><div className="timeline-line" /><div className="timeline-item"><div className="timeline-dot" /><div><small>3 MONTHS · GULBERG III, LAHORE</small><h3>Web Development Intern</h3><p>Corvit Systems Lahore</p><span>Responsive web interfaces · JavaScript · React fundamentals · API workflows · practical project development</span></div></div></GlassCard></Reveal>
      </section>

      <section className="deep-section project-section">
        <div className="section-kicker">PROJECTS / 03</div>
        <div className="project-grid-large">{projects.map((p, i) => <Reveal key={p.id} delay={i * .08}><GlassCard className="large-project-card" onClick={() => setActive(p)}><div className="card-title"><span>{p.type}</span><small>{p.id}</small></div><Preview project={p} /><h3>{p.title}</h3><p>{p.description}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div></GlassCard></Reveal>)}</div>
      </section>

      <section id="skills" className="deep-section skills-section">
        <div className="section-kicker">SKILLS / 05</div>
        <Reveal><GlassCard className="skills-deck"><div className="card-title"><span>TECHNICAL STACK</span><small>05</small></div><div className="skills-grid">{skills.map(([name, val], i) => <div className="big-skill" key={name}><div><span>{name}</span><b>{val}%</b></div><i><em style={{ width: `${val}%`, transitionDelay: `${i * 60}ms` }} /></i></div>)}</div></GlassCard></Reveal>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-kicker">CONTACT / 06</div>
        <Reveal><GlassCard className="contact-deck"><div><div className="card-title"><span>LET&apos;S CONNECT</span><small>06</small></div><h2>Build the next <span>experience.</span></h2><p>Available for web development, product interfaces and creative frontend work.</p></div><div className="contact-links">{socials.map(([name, href, Icon]) => <a key={name} href={href} target="_blank" rel="noreferrer"><Icon size={15} /><span>{name}</span><ArrowUpRight size={13} /></a>)}<a href="mailto:ikrammayo151@gmail.com"><Mail size={15} /><span>ikrammayo151@gmail.com</span><Send size={13} /></a></div></GlassCard></Reveal>
        <footer><span>MUHAMMAD IKRAM · FULL STACK DEVELOPER</span><span>Raiwind, Lahore · 2026</span></footer>
      </section>
    </main>

    <AnimatePresence>{active && <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}><motion.div className="modal-card glass-card" initial={{ y: 50, scale: .92 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: .92 }} onClick={e => e.stopPropagation()}><button className="close" onClick={() => setActive(null)}><X size={16} /></button><Preview project={active} /><div className="card-title"><span>{active.type}</span><small>{active.id}</small></div><h2>{active.title}</h2><p>{active.description}</p><div className="tags">{active.tags.map(t => <span key={t}>{t}</span>)}</div><a className="modal-link" href="#contact" onClick={() => setActive(null)}>DISCUSS THIS PROJECT <ArrowUpRight size={14} /></a></motion.div></motion.div>}</AnimatePresence>
  </div>
}

export default App
