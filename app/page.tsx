const projects = [
  { id: '01', name: 'HYPERLOCAL', type: 'Civic data / Web platform', year: '2026', mark: 'SG:01' },
  { id: '02', name: 'COMMONS', type: 'Community / Digital identity', year: '2025', mark: 'ID:42' },
  { id: '03', name: 'AFTERDARK', type: 'Culture / Experimental archive', year: '2025', mark: '00:00' },
];

const capabilities = [
  ['01', 'Strategy', 'Research, product definition, technical direction.'],
  ['02', 'Design', 'Identity, interfaces, systems, prototypes.'],
  ['03', 'Build', 'Websites, applications, weird internet things.'],
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="logo" href="#top" aria-label="NERDS home">
          <span aria-hidden="true">[</span>NERDS<span aria-hidden="true">]</span>
          <span className="cursor" aria-hidden="true">_</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">WORK</a><a href="#about">ABOUT</a><a href="mailto:hello@nerds.sg">EMAIL ↗</a>
        </nav>
        <div className="status"><span /> SINGAPORE / ONLINE</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-index mono">NERDS.SG® — 001</div>
        <h1>WE MAKE<br /><span>DIGITAL</span> THINGS<br /><em>MAKE SENSE.</em></h1>
        <div className="hero-bottom">
          <p>An independent design &amp; technology practice<br />for ambitious people and useful ideas.</p>
          <a className="round-link" href="#work" aria-label="See selected work"><span>↓</span>VIEW WORK</a>
          <div className="coordinates mono">1.3521° N<br />103.8198° E</div>
        </div>
        <div className="big-glyph" aria-hidden="true">*</div>
      </section>

      <section className="ticker" aria-label="Capabilities"><div>
        DESIGN SYSTEMS <b>✦</b> DIGITAL PRODUCTS <b>✦</b> CREATIVE CODE <b>✦</b> BRAND IDENTITIES <b>✦</b>
        DESIGN SYSTEMS <b>✦</b> DIGITAL PRODUCTS <b>✦</b> CREATIVE CODE <b>✦</b> BRAND IDENTITIES <b>✦</b>
      </div></section>

      <section className="work" id="work">
        <div className="section-label mono">[ SELECTED OUTPUT ]</div>
        <div className="work-list">
          {projects.map((project) => (
            <article className="project" key={project.id}>
              <div className="project-number mono">/{project.id}</div>
              <div className="project-mark" aria-hidden="true"><span>{project.mark}</span><i /></div>
              <div className="project-copy"><h2>{project.name}</h2><p>{project.type}</p></div>
              <div className="project-year mono">{project.year}</div>
              <div className="project-arrow" aria-hidden="true">↗</div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="section-label mono">[ WHAT WE BELIEVE ]</div>
        <p className="statement">THE INTERNET DOESN&apos;T NEED MORE <span>NOISE.</span><br />IT NEEDS BETTER <span>IDEAS,</span> SHARPER<br />THINKING &amp; PEOPLE WHO <span>GIVE A DAMN.</span></p>
        <div className="about-grid">
          <p className="aside-note mono">// NO BLACK BOXES<br />// NO BLOAT<br />// NO BS</p>
          <p className="body-copy">We work at the intersection of design, engineering and culture. Small senior teams, direct collaboration, zero theatre. From first sketch to production code—we stay close to the work.</p>
        </div>
      </section>

      <section className="capabilities">
        {capabilities.map(([id, title, copy]) => <article key={id}><span className="mono">{id} / 03</span><h3>{title}</h3><p>{copy}</p></article>)}
      </section>

      <footer>
        <div className="footer-top"><p className="mono">HAVE A GOOD PROBLEM?</p><a href="mailto:hello@nerds.sg">LET&apos;S TALK<span>↗</span></a></div>
        <div className="footer-bottom mono"><div>© NERDS 2026</div><div>BUILT WITH CURIOSITY<br />AND TOO MUCH COFFEE.</div><div className="footer-logo"><span>[</span>N<span>]</span></div></div>
      </footer>
    </main>
  );
}
