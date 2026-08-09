import { FiArrowUpRight } from 'react-icons/fi'

const projects = [
  { title: 'Banking AI Tutor', category: 'AI / EdTech / Web App', text: 'An AI-powered learning platform designed to help users understand banking concepts through interactive and intelligent assistance.', className: 'project-banking', label: 'Banking AI Tutor', url: 'https://banking-ai-tutor.vercel.app/' },
  { title: 'Northstar Finance', category: 'Fintech / Product design', text: 'A calm, confident finance platform for a new generation of investors.', className: 'project-northstar', label: 'Northstar' },
  { title: 'Sonder Health', category: 'Healthcare / Web platform', text: 'Making access to better healthcare feel more human and less complicated.', className: 'project-sonder', label: 'sonder' },
  { title: 'Arc Athletics', category: 'Commerce / Brand experience', text: 'A high-energy storefront for a performance brand on the rise.', className: 'project-arc', label: 'ARC' },
]

function ProjectVisual({ project }) {
  return <div className={`project-visual ${project.className}`}><div className="visual-shape shape-a" /><div className="visual-shape shape-b" /><div className="visual-ui"><span>{project.label}</span><b aria-hidden="true">↗</b></div>{project.className === 'project-banking' && <div className="banking-preview"><span className="banking-preview-mark">✦</span><strong>Learn smarter.</strong><small>Banking AI Tutor</small><i /><i /><i /></div>}</div>
}

function Portfolio() {
  return (
    <section className="section portfolio-section" id="work">
      <div className="container"><div className="section-heading"><p className="section-kicker">Selected work</p><h2>A few things we&apos;ve<br /><em>made better.</em></h2></div><div className="project-grid">{projects.map((project) => <article className="project-card" key={project.title}><ProjectVisual project={project} /><div className="project-info"><div><p className="project-category">{project.category}</p><h3>{project.title}</h3><p>{project.text}</p></div>{project.url ? <a className="project-cta-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} project (opens in a new tab)`}><span className="project-cta-label">View Project</span><FiArrowUpRight /></a> : <a href="#contact" aria-label={`Discuss a project like ${project.title}`}><FiArrowUpRight /></a>}</div></article>)}</div><a className="text-link" href="#contact">Have a project in mind? <span>Let&apos;s talk <FiArrowUpRight /></span></a></div>
    </section>
  )
}

export default Portfolio
