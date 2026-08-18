(function () {
  var video = document.querySelector('[data-hero-video]');
  if (!video || !window.matchMedia) return;

  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function syncPlayback() {
    if (motion.matches) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    var play = video.play();
    if (play && typeof play.catch === 'function') play.catch(function () {});
  }

  syncPlayback();
  if (typeof motion.addEventListener === 'function') motion.addEventListener('change', syncPlayback);
  else if (typeof motion.addListener === 'function') motion.addListener(syncPlayback);
})();
