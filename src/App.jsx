import { useEffect, useState } from 'react'

const navigation = [
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

const caseStudies = [
  { number: '01', status: 'In review', title: 'Case study in progress' },
  { number: '02', status: 'In review', title: 'Project documentation underway' },
  { number: '03', status: 'In review', title: 'More work being compiled' },
]

const skillGroups = [
  { number: '01', label: 'Web', items: 'HTML, CSS, JavaScript' },
  { number: '02', label: 'Back end & data', items: 'PHP, SQL, Python' },
  { number: '03', label: 'Frameworks', items: 'Laravel, CodeIgniter' },
  { number: '04', label: 'Mobile', items: 'Kotlin' },
]

const timeline = [
  { year: '2023 — 2027', title: 'BSIT–WMA', detail: 'FEU Institute of Technology' },
  { year: '2025', title: 'Technical certifications', detail: 'ITS Python Certification · Cisco Certified Support Technician' },
  { year: '2022 — 2023', title: 'IT work immersion', detail: 'BSPT Construction Co. · IT Department' },
]

const Arrow = ({ diagonal = false }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
    {diagonal ? (
      <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    ) : (
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    )}
  </svg>
)

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    let frame = null

    const updateScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      root.style.setProperty('--page-progress', progress.toString())

      if (!reduceMotion) {
        document.querySelectorAll('[data-parallax]').forEach((element) => {
          const rect = element.getBoundingClientRect()
          const distance = rect.top + rect.height / 2 - window.innerHeight / 2
          const speed = Number(element.dataset.parallax || 0.12)
          const offset = Math.max(-90, Math.min(90, distance * speed * -0.18))
          element.style.setProperty('--parallax-y', `${offset}px`)
        })
      }
      frame = null
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScroll)
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.6] },
    )

    document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element))
    document.querySelectorAll('[data-section]').forEach((section) => sectionObserver.observe(section))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updateScroll()

    return () => {
      revealObserver.disconnect()
      sectionObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const hero = document.querySelector('.hero-section')
    const portrait = document.querySelector('.portrait-panel')
    if (!hero || !portrait || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const handlePointer = (event) => {
      const heroRect = hero.getBoundingClientRect()
      const x = ((event.clientX - heroRect.left) / heroRect.width) * 100
      const y = ((event.clientY - heroRect.top) / heroRect.height) * 100
      hero.style.setProperty('--pointer-x', `${x}%`)
      hero.style.setProperty('--pointer-y', `${y}%`)

      const portraitRect = portrait.getBoundingClientRect()
      const px = (event.clientX - portraitRect.left) / portraitRect.width - 0.5
      const py = (event.clientY - portraitRect.top) / portraitRect.height - 0.5
      portrait.style.setProperty('--tilt-x', `${py * -3}deg`)
      portrait.style.setProperty('--tilt-y', `${px * 3}deg`)
    }

    const resetPortrait = () => {
      portrait.style.setProperty('--tilt-x', '0deg')
      portrait.style.setProperty('--tilt-y', '0deg')
    }

    hero.addEventListener('pointermove', handlePointer)
    hero.addEventListener('pointerleave', resetPortrait)
    return () => {
      hero.removeEventListener('pointermove', handlePointer)
      hero.removeEventListener('pointerleave', resetPortrait)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true"><span /></div>

      <header className="site-header">
        <nav className="container-xl navigation" aria-label="Primary navigation">
          <a className="wordmark" href="#top" onClick={closeMenu} aria-label="John Irish Fermin, home">
            <span>JI</span><i>/</i><span>F</span>
          </a>
          <div className="availability-label"><span aria-hidden="true" /> Available for internship / OJT</div>
          <button
            className="menu-button d-md-none"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          ><span /><span /></button>
          <div id="main-navigation" className={`navigation-links ${menuOpen ? 'is-open' : ''}`}>
            {navigation.map((item) => (
              <a key={item.id} href={item.href} className={activeSection === item.id ? 'is-active' : ''} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="hero-section" id="top" data-section>
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-background-type" data-parallax="0.3" aria-hidden="true">GENERALIST</div>
          <div className="container-xl hero-container">
            <div className="row align-items-center g-5">
              <div className="col-lg-7 hero-copy" data-reveal>
                <div className="section-code"><span>01</span> Introduction</div>
                <h1>Adaptive<br /><span>by design.</span></h1>
                <p className="hero-statement">I don’t pretend to know every answer. I learn fast, connect systems, and stay useful when the problem changes.</p>
                <div className="hero-actions">
                  <a className="primary-link" href="#work">Explore my work <Arrow /></a>
                  <a className="text-link" href="mailto:irishfermin910@gmail.com">Start a conversation <Arrow diagonal /></a>
                </div>
              </div>
              <div className="col-lg-5 hero-portrait-column" data-reveal>
                <div className="portrait-wrap" data-parallax="0.24">
                  <div className="portrait-panel">
                    <img src="./assets/john-irish-fermin.jpg" alt="Portrait of John Irish Fermin" />
                    <div className="portrait-overlay" />
                    <div className="portrait-corner portrait-corner-top" />
                    <div className="portrait-corner portrait-corner-bottom" />
                  </div>
                  <div className="portrait-caption"><span>John Irish Fermin</span><span>IT Student · Developer</span></div>
                </div>
              </div>
            </div>
            <div className="hero-foot">
              <span>BSIT–WMA · FEU Institute of Technology</span>
              <a href="#work">Scroll to continue <i aria-hidden="true">↓</i></a>
            </div>
          </div>
        </section>

        <section className="work-section" id="work" data-section>
          <div className="container-xl">
            <div className="work-layout">
              <div className="work-intro" data-reveal>
                <div className="section-code"><span>02</span> Selected work</div>
                <h2>Work worth<br />explaining.</h2>
                <p>I’m compiling the projects that best represent how I approach a problem—not only how the finished screen looks.</p>
                <div className="archive-key">
                  <span>What each case study will cover</span>
                  <ul><li>Context</li><li>Process</li><li>Result</li></ul>
                </div>
              </div>
              <div className="case-study-list">
                {caseStudies.map((study, index) => (
                  <article className="case-study" key={study.number} data-reveal>
                    <div className="case-visual">
                      <div className="case-grid" aria-hidden="true" />
                      <span className="case-ghost-number" data-parallax="0.1">{study.number}</span>
                      <div className={`case-object case-object-${index + 1}`} aria-hidden="true"><span /><span /><span /></div>
                    </div>
                    <div className="case-info">
                      <span className="case-number">{study.number}</span>
                      <h3>{study.title}</h3>
                      <span className="case-status">{study.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section" id="about" data-section>
          <div className="container-xl">
            <div className="about-opening row g-5 align-items-start">
              <div className="col-lg-4" data-reveal>
                <div className="section-code section-code-dark"><span>03</span> About</div>
                <p className="about-kicker">One discipline is rarely enough to solve the whole problem.</p>
              </div>
              <div className="col-lg-8" data-reveal>
                <h2>I’m building range with <span>purpose.</span></h2>
                <p className="about-lead">I’m an aspiring IT professional studying BSIT–WMA at FEU Institute of Technology. I work across web, software, databases, and mobile development—comfortable learning the missing piece when the work calls for it.</p>
              </div>
            </div>
            <div className="capabilities" data-reveal>
              <div className="content-heading"><span>Capabilities</span><span>Current toolkit</span></div>
              {skillGroups.map((group) => (
                <div className="capability-row" key={group.number}>
                  <span>{group.number}</span><h3>{group.label}</h3><p>{group.items}</p><i aria-hidden="true">↗</i>
                </div>
              ))}
            </div>
            <div className="timeline-wrap row g-5" data-reveal>
              <div className="col-lg-4">
                <div className="content-heading timeline-heading"><span>Foundation</span><span>Education &amp; experience</span></div>
              </div>
              <div className="col-lg-8">
                <div className="timeline-list">
                  {timeline.map((item) => (
                    <div className="timeline-item" key={item.year}>
                      <span>{item.year}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" data-section>
          <div className="contact-grid" aria-hidden="true" />
          <div className="container-xl contact-inner">
            <div data-reveal>
              <div className="section-code"><span>04</span> Contact</div>
              <p className="contact-overline">Open to internship and OJT opportunities</p>
              <h2>Let’s build<br /><span>what’s next.</span></h2>
            </div>
            <div className="contact-bottom" data-reveal>
              <p>If your team has room for someone adaptable, curious, and ready to contribute, I’d like to hear from you.</p>
              <a className="email-link" href="mailto:irishfermin910@gmail.com"><span>irishfermin910@gmail.com</span><Arrow diagonal /></a>
            </div>
            <div className="social-row">
              <span>© 2026 John Irish Fermin</span>
              <div>
                <a href="https://github.com/frishhhdesu" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a>
                <a href="https://www.linkedin.com/in/john-irish-fermin-4a23203ab" target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a>
              </div>
              <a href="#top">Back to top ↑</a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
