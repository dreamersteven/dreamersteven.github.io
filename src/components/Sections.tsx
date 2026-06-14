import { ExternalLink, Github, Mail } from 'lucide-react';
import { education, expertise, experiences, profile, projects } from '../data/portfolio';

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="tag-row">
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-layout">
          <div className="about-left">
            <h2 id="about-heading" className="section-label">
              About
            </h2>
            <p className="about-headline">I build things that require both deep technical knowledge and the audacity to ship.</p>
          </div>
          <div className="about-right">
            <p className="about-body">
              I'm a dual-master's student at <strong>Georgia Tech</strong> pursuing MS ECE and MS CSE simultaneously -
              maintaining a 4.0 across both programs. Before that, I completed dual bachelor's degrees at the{' '}
              <strong>University of Michigan</strong>.
            </p>
            <p className="about-body">
              My work spans three domains most people treat as separate: hardware (signal processing, acoustics, embedded
              systems), software (ML infrastructure, LLM systems, CUDA optimization), and product (founding a startup,
              navigating patent law, talking to customers).
            </p>
            <p className="about-body">The most interesting problems live at the boundary of disciplines.</p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-val">4.0</span>
                <span className="stat-key">GPA at Georgia Tech</span>
              </div>
              <div className="stat">
                <span className="stat-val">2</span>
                <span className="stat-key">Patents Filed</span>
              </div>
              <div className="stat">
                <span className="stat-val">4</span>
                <span className="stat-key">Degrees (2 BS + 2 MS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Expertise() {
  return (
    <section id="expertise" className="section section-alt" aria-labelledby="expertise-heading">
      <div className="container">
        <h2 id="expertise-heading" className="section-label">
          Expertise
        </h2>
        <div className="expertise-grid">
          {expertise.map((item) => (
            <article key={item.title} className="expertise-card reveal">
              <div className="expertise-num" aria-hidden="true">
                {item.number}
              </div>
              <h3 className="expertise-title">{item.title}</h3>
              <p className="expertise-desc">{item.description}</p>
              <ul className="skill-list">
                {item.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <h2 id="experience-heading" className="section-label">
          Experience
        </h2>
        <div className="timeline">
          {experiences.map((item) => (
            <article key={`${item.org}-${item.role}`} className="timeline-item reveal">
              <div className="timeline-meta">
                <time className="timeline-date">{item.date}</time>
                <span className="timeline-org">{item.org}</span>
              </div>
              <div className="timeline-body">
                <h3 className="timeline-role">{item.role}</h3>
                <p className="timeline-team">{item.team}</p>
                <ul className="timeline-bullets">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <TagRow tags={item.tags} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section section-alt" aria-labelledby="projects-heading">
      <div className="container">
        <h2 id="projects-heading" className="section-label">
          Projects
        </h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.title} className="project-card reveal">
              <div className="project-top">
                <span className="project-type">{project.type}</span>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="View on GitHub">
                    <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              {project.detail ? <p className="project-detail">{project.detail}</p> : null}
              <TagRow tags={project.tags} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-heading">
      <div className="container">
        <h2 id="education-heading" className="section-label">
          Education
        </h2>
        <div className="edu-list">
          {education.map((item) => (
            <article key={item.school} className="edu-item reveal">
              <div className="edu-mark" aria-hidden="true">
                {item.mark}
              </div>
              <div className="edu-body">
                <div className="edu-top">
                  <div>
                    <h3 className="edu-school">{item.school}</h3>
                    <p className="edu-degrees">{item.degrees}</p>
                  </div>
                  <div className="edu-right">
                    <span className="edu-gpa">{item.gpa}</span>
                    <time className="edu-date">{item.date}</time>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section section-alt" aria-labelledby="contact-heading">
      <div className="container contact-wrap">
        <h2 id="contact-heading" className="section-label">
          Contact
        </h2>
        <p className="contact-headline">Let's work on something hard.</p>
        <p className="contact-sub">Dual MS at Georgia Tech · US patent holder · Available now.</p>
        <div className="contact-row">
          <a href={`mailto:${profile.email}`} className="contact-item">
            <Mail size={15} strokeWidth={1.75} aria-hidden="true" />
            {profile.email}
          </a>
          <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="contact-item">
            in
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="contact-item">
            <Github size={15} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
