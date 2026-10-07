const heroVideo = document.querySelector('.hero-banner-video');
const heroVideoToggle = document.querySelector('.hero-video-toggle');
if (heroVideo && heroVideoToggle) {
  const heroBanner = heroVideo.closest('.hero-banner');
  const showHeroImage = () => {
    heroVideo.pause();
    heroVideo.hidden = true;
    heroVideoToggle.hidden = true;
    heroBanner?.classList.remove('is-video-playing');
  };
  heroVideo.addEventListener('ended', showHeroImage);
  heroVideo.addEventListener('error', showHeroImage);
  heroVideo.querySelector('source')?.addEventListener('error', showHeroImage);
  heroVideoToggle.addEventListener('click', showHeroImage);
  heroVideo.addEventListener('playing', () => {
    heroBanner?.classList.add('is-video-playing');
    heroVideo.hidden = false;
    heroVideoToggle.hidden = false;
  });
  // Pääkuva säilyy, jos automaattitoisto estyy tai käyttäjä vähentää liikettä.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.muted = true;
    heroVideo.play()?.catch(showHeroImage);
  }
}
