import { Download, Github, GraduationCap, Headphones, Mail, Monitor } from 'lucide-react';
import { useState } from 'react';
import { displayCards, profile, tracks, type DisplayCard } from '../data/portfolio';
import { WaveCanvas } from './WaveCanvas';

function DisplayCardIcon({ card }: { card: DisplayCard }) {
  const className = `dc-icon-wrap${card.iconClass ? ` ${card.iconClass}` : ''}`;
  const props = { size: 14, strokeWidth: 2 };

  if (card.icon === 'education') {
    return (
      <span className={className}>
        <GraduationCap {...props} />
      </span>
    );
  }

  if (card.icon === 'monitor') {
    return (
      <span className={className}>
        <Monitor {...props} />
      </span>
    );
  }

  return (
    <span className={className}>
      <Headphones {...props} />
    </span>
  );
}

export function Hero() {
  const [activeTrack, setActiveTrack] = useState(tracks[0]);

  return (
    <section id="hero" aria-label="Introduction">
      <div id="hero-scale">
        <WaveCanvas />
        <div className="hero-layout">
          <div className="hero-inner">
            <p className="hero-eyebrow">Georgia Tech · MS ECE + CSE · GPA 4.0</p>
            <h1 className="hero-name">{profile.name}</h1>

            <div className="track-switcher" role="tablist" aria-label="Professional tracks">
              {tracks.map((track) => (
                <button
                  key={track.key}
                  className={`track-btn${activeTrack.key === track.key ? ' active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTrack.key === track.key}
                  aria-controls="track-content"
                  onClick={() => setActiveTrack(track)}
                >
                  {track.label}
                </button>
              ))}
            </div>

            <div className="track-content" id="track-content" role="tabpanel">
              <p className="track-desc active">
                {activeTrack.description[0]}
                <br />
                {activeTrack.description[1]}
              </p>
            </div>

            <div className="hero-actions">
              <a href={activeTrack.resumeFile} className="btn-primary" download={activeTrack.resumeFile}>
                <Download size={15} strokeWidth={2} aria-hidden="true" />
                <span>{activeTrack.buttonLabel}</span>
              </a>
              <a href="#projects" className="btn-ghost">
                View Work
              </a>
            </div>

            <div className="hero-social" aria-label="Social links">
              <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                <Github size={18} aria-hidden="true" />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email Hanlong">
                <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hero-cards">
            <div className="dc-stack">
              {displayCards.map((card) => (
                <a key={card.title} href={card.href} className={card.className}>
                  <div className="dc-row">
                    <DisplayCardIcon card={card} />
                    <p className={`dc-title${card.titleClass ? ` ${card.titleClass}` : ''}`}>{card.title}</p>
                  </div>
                  <p className="dc-desc">{card.description}</p>
                  <p className="dc-date">{card.date}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          scroll
        </div>
      </div>
    </section>
  );
}
