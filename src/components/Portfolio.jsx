import { FiArrowUpRight } from 'react-icons/fi'

const projects = [
  {
    projectNum: 'PROJECT 01',
    title: 'Premium Dental Clinic Website',
    category: 'Healthcare • Brand • Local Business',
    text: 'BrightSmile Dental — a premium modern dental clinic concept for Austin, Texas. (Concept project by Craftivo)',
    className: 'project-dental',
    label: 'BrightSmile Dental',
    url: '/work/dental-clinic',
    internal: true,
  },
  {
    projectNum: 'PROJECT 02',
    title: 'Ridgeline Roofing Co.',
    category: 'Roofing • Residential • Local Business',
    text: 'A premium conversion-focused website concept designed for a modern U.S. roofing company.',
    className: 'project-roofing',
    label: 'Ridgeline Roofing',
    url: '/work/ridgeline-roofing',
    internal: true,
  },
  { title: 'Banking AI Tutor', category: 'AI / EdTech / Web App', text: 'An AI-powered learning platform designed to help users understand banking concepts through interactive and intelligent assistance.', className: 'project-banking', label: 'Banking AI Tutor', url: 'https://banking-ai-tutor.vercel.app/' },
  { title: 'Northstar Finance', category: 'Fintech / Product design', text: 'A calm, confident finance platform for a new generation of investors.', className: 'project-northstar', label: 'Northstar' },
  { title: 'Sonder Health', category: 'Healthcare / Web platform', text: 'Making access to better healthcare feel more human and less complicated.', className: 'project-sonder', label: 'sonder' },
  { title: 'Arc Athletics', category: 'Commerce / Brand experience', text: 'A high-energy storefront for a performance brand on the rise.', className: 'project-arc', label: 'ARC' },
]

function navigateInternal(url, e) {
  e.preventDefault()
  history.pushState(null, '', url)
  window.dispatchEvent(new Event('popstate'))
}

function ProjectVisual({ project }) {
  return (
    <div className={`project-visual ${project.className}`}>
      <div className="visual-shape shape-a" />
      <div className="visual-shape shape-b" />
      <div className="visual-ui"><span>{project.label}</span><b aria-hidden="true">↗</b></div>
      {project.className === 'project-banking' && (
        <div className="banking-preview">
          <span className="banking-preview-mark">✦</span>
          <strong>Learn smarter.</strong>
          <small>Banking AI Tutor</small>
          <i /><i /><i />
        </div>
      )}
      {project.className === 'project-dental' && (
        <div className="dental-preview">
          <strong>BrightSmile</strong>
          <small>Dental • Austin, TX</small>
        </div>
      )}
      {project.className === 'project-roofing' && (
        <div className="roofing-preview">
          <strong>RIDGELINE</strong>
          <small>Roofing • Columbus, OH</small>
        </div>
      )}
    </div>
  )
}

function ProjectLink({ project }) {
  if (!project.url) {
    return (
      <a href="#contact" aria-label={`Discuss a project like ${project.title}`}>
        <FiArrowUpRight />
      </a>
    )
  }

  if (project.internal) {
    return (
      <a
        className="project-cta-link"
        href={project.url}
        onClick={(e) => navigateInternal(project.url, e)}
        aria-label={`View ${project.title} project`}
      >
        <span className="project-cta-label">View Project</span>
        <FiArrowUpRight />
      </a>
    )
  }

  return (
    <a
      className="project-cta-link"
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${project.title} project (opens in a new tab)`}
    >
      <span className="project-cta-label">View Project</span>
      <FiArrowUpRight />
    </a>
  )
}

function Portfolio() {
  return (
    <section className="section portfolio-section" id="work">
      <div className="container">
        <div className="section-heading">
          <p className="section-kicker">Selected work</p>
          <h2>A few things we&apos;ve<br /><em>made better.</em></h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <ProjectVisual project={project} />
              <div className="project-info">
                <div>
                  {project.projectNum && <p className="project-num">{project.projectNum}</p>}
                  <p className="project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.text}</p>
                </div>
                <ProjectLink project={project} />
              </div>
            </article>
          ))}
        </div>
        <a className="text-link" href="#contact">Have a project in mind? <span>Let&apos;s talk <FiArrowUpRight /></span></a>
      </div>
    </section>
  )
}

export default Portfolio
