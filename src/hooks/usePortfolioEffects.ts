import { useEffect } from 'react';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function usePortfolioEffects() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progressBar = document.getElementById('scroll-progress');
    const heroScale = document.getElementById('hero-scale');
    const cursorLight = document.getElementById('cursor-light');
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const statElements = Array.from(document.querySelectorAll<HTMLElement>('.stat-val'));

    const updateProgress = () => {
      if (!progressBar) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    };

    const updateHeroScale = () => {
      if (!heroScale) return;
      const progress = Math.max(0, Math.min(window.scrollY / window.innerHeight, 1));
      heroScale.style.transform = `scale(${1 - progress * 0.09})`;
      heroScale.style.borderRadius = `${progress * 24}px`;
      heroScale.style.opacity = String(1 - progress * 0.55);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('scroll', updateHeroScale, { passive: true });
    updateProgress();
    updateHeroScale();

    let revealObserver: IntersectionObserver | undefined;
    if (prefersReduced) {
      revealElements.forEach((element) => element.classList.add('visible'));
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              window.setTimeout(() => entry.target.classList.add('visible'), index * 70);
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
      );
      revealElements.forEach((element) => revealObserver?.observe(element));
    }

    const statTargets: Record<string, { value: number; decimals: number }> = {
      '4.0': { value: 4.0, decimals: 1 },
      '2': { value: 2, decimals: 0 },
      '4': { value: 4, decimals: 0 },
    };

    const animateStat = (element: HTMLElement) => {
      const key = element.textContent?.trim() ?? '';
      const config = statTargets[key];
      if (!config || prefersReduced) return;

      const duration = 1100;
      const start = performance.now();
      element.classList.add('counting');

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = easeOutCubic(progress) * config.value;
        element.textContent = config.decimals ? value.toFixed(config.decimals) : Math.round(value).toString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = config.decimals ? config.value.toFixed(config.decimals) : config.value.toString();
          element.classList.remove('counting');
        }
      };

      requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStat(entry.target as HTMLElement);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    statElements.forEach((element) => statObserver.observe(element));

    let lightFrame = 0;
    const handleMouseMove = (event: MouseEvent) => {
      cursorState.lx = event.clientX;
      cursorState.ly = event.clientY;
    };
    const cursorState = {
      lx: window.innerWidth / 2,
      ly: window.innerHeight / 2,
      cx: window.innerWidth / 2,
      cy: window.innerHeight / 2,
    };

    const animateLight = () => {
      if (!cursorLight) return;
      cursorState.cx += (cursorState.lx - cursorState.cx) * 0.08;
      cursorState.cy += (cursorState.ly - cursorState.cy) * 0.08;
      cursorLight.style.left = `${cursorState.cx}px`;
      cursorLight.style.top = `${cursorState.cy}px`;
      lightFrame = requestAnimationFrame(animateLight);
    };

    const hideLight = () => {
      if (cursorLight) cursorLight.style.opacity = '0';
    };
    const showLight = () => {
      if (cursorLight) cursorLight.style.opacity = '1';
    };

    if (!prefersReduced && cursorLight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', hideLight);
      document.addEventListener('mouseenter', showLight);
      animateLight();
    }

    const spotlightCards = Array.from(document.querySelectorAll<HTMLElement>('.expertise-card, .project-card'));
    const spotlightCleanups: Array<() => void> = [];
    if (!prefersReduced) {
      spotlightCards.forEach((card) => {
        const spot = document.createElement('div');
        spot.className = 'card-spotlight';
        card.prepend(spot);
        const moveSpot = (event: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          spot.style.left = `${event.clientX - rect.left}px`;
          spot.style.top = `${event.clientY - rect.top}px`;
        };
        card.addEventListener('mousemove', moveSpot);
        spotlightCleanups.push(() => {
          card.removeEventListener('mousemove', moveSpot);
          spot.remove();
        });
      });
    }

    const magnetButtons = Array.from(document.querySelectorAll<HTMLElement>('.btn-primary, .btn-ghost'));
    const magnetCleanups: Array<() => void> = [];
    if (!prefersReduced && window.innerWidth > 768) {
      magnetButtons.forEach((button) => {
        const moveButton = (event: MouseEvent) => {
          const rect = button.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const radius = 90;
          if (distance < radius) {
            const pull = (1 - distance / radius) * 0.28;
            button.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
          }
        };
        const resetButton = () => {
          button.style.transform = '';
        };
        button.addEventListener('mousemove', moveButton);
        button.addEventListener('mouseleave', resetButton);
        magnetCleanups.push(() => {
          button.removeEventListener('mousemove', moveButton);
          button.removeEventListener('mouseleave', resetButton);
        });
      });
    }

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('scroll', updateHeroScale);
      revealObserver?.disconnect();
      statObserver.disconnect();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', hideLight);
      document.removeEventListener('mouseenter', showLight);
      cancelAnimationFrame(lightFrame);
      spotlightCleanups.forEach((cleanup) => cleanup());
      magnetCleanups.forEach((cleanup) => cleanup());
    };
  }, []);
}
