import { About, Contact, Education, Experience, Expertise, Projects } from './components/Sections';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { profile } from './data/portfolio';
import { usePortfolioEffects } from './hooks/usePortfolioEffects';

export default function App() {
  usePortfolioEffects();

  return (
    <>
      <div id="scroll-progress" aria-hidden="true" />
      <div id="cursor-light" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <footer role="contentinfo">
        <div className="footer-inner">
          <span>&copy; 2026 {profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </footer>
    </>
  );
}
