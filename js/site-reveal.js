(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroSignalSent = false;
  var heroRoot = null;
  var heroEndDelay = 0;

  function signalHeroComplete() {
    if (heroSignalSent) return false;
    heroSignalSent = true;
    document.documentElement.dataset.heroRevealComplete = 'true';
    if (typeof window.CustomEvent === 'function') {
      window.dispatchEvent(new window.CustomEvent('zetrix:hero-reveal-complete'));
    }
    return true;
  }

  // Without motion support, the untouched markup remains fully visible.
  if (reduceMotion || !('IntersectionObserver' in window)) {
    signalHeroComplete();
    return;
  }

  function startReveal(root) {
    window.requestAnimationFrame(function () {
      root.classList.add('is-in');
      if (root === heroRoot) window.setTimeout(signalHeroComplete, heroEndDelay);
    });
  }

  function revealAfterIntro(root) {
    if (root !== heroRoot ||
        !document.documentElement.classList.contains('site-intro-pending')) {
      startReveal(root);
      return;
    }
    var started = false;
    function begin() {
      if (started) return;
      started = true;
      startReveal(root);
    }
    window.addEventListener('zetrix:intro-complete', begin, { once: true });
    window.setTimeout(begin, 4300);
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var root = entry.target;
      revealObserver.unobserve(root);
      revealAfterIntro(root);
    });
  }, { threshold: 0.15 });

  function enhanceHeroText(element, baseDelay, glyphStep) {
    if (!element) return false;

    var doc = element.ownerDocument;
    var originalNodes = Array.prototype.slice.call(element.childNodes);
    var supported = originalNodes.every(function (node) {
      return node.nodeType === 3 || node.nodeName === 'BR';
    });

    if (!supported) return false;

    var accessibleText = originalNodes.map(function (node) {
      return node.nodeName === 'BR' ? ' ' : node.nodeValue;
    }).join('').replace(/\s+/g, ' ').trim();

    var visual = doc.createElement('span');
    visual.className = 'hero__reveal-visual';
    visual.setAttribute('aria-hidden', 'true');
    var glyphIndex = 0;
    var lastGlyphDelay = baseDelay;

    originalNodes.forEach(function (node) {
      if (node.nodeName === 'BR') {
        visual.appendChild(doc.createElement('br'));
        return;
      }

      node.nodeValue.split(/(\s+)/).filter(Boolean).forEach(function (token) {
        if (/^\s+$/.test(token)) {
          visual.appendChild(doc.createTextNode(token));
          glyphIndex += token.length;
          return;
        }

        var word = doc.createElement('span');
        word.className = 'hero__word';

        Array.from(token).forEach(function (character) {
          var glyph = doc.createElement('span');
          glyph.className = 'hero__glyph';
          lastGlyphDelay = baseDelay + glyphIndex * glyphStep;
          glyph.style.setProperty('--hero-glyph-delay',
            lastGlyphDelay + 'ms');
          glyph.textContent = character;
          word.appendChild(glyph);
          glyphIndex += 1;
        });

        visual.appendChild(word);
      });
    });

    var accessible = doc.createElement('span');
    accessible.className = 'hero__reveal-a11y';
    accessible.textContent = accessibleText;

    var fragment = doc.createDocumentFragment();
    fragment.appendChild(visual);
    fragment.appendChild(accessible);
    element.replaceChildren(fragment);
    return { ready: true, end: lastGlyphDelay + 720 };
  }

  function enhanceSectionCopy(element, baseDelay, wordStep) {
    if (!element) return false;

    var doc = element.ownerDocument;
    var originalNodes = Array.prototype.slice.call(element.childNodes);
    var supported = originalNodes.every(function (node) {
      return node.nodeType === 3 || node.nodeName === 'BR';
    });

    if (!supported) return false;

    var accessibleText = originalNodes.map(function (node) {
      return node.nodeName === 'BR' ? ' ' : node.nodeValue;
    }).join('').replace(/\s+/g, ' ').trim();

    var visual = doc.createElement('span');
    visual.className = 'copy-dissolve__visual';
    visual.setAttribute('aria-hidden', 'true');
    var wordIndex = 0;

    originalNodes.forEach(function (node) {
      if (node.nodeName === 'BR') {
        visual.appendChild(doc.createElement('br'));
        return;
      }

      node.nodeValue.split(/(\s+)/).filter(Boolean).forEach(function (token) {
        if (/^\s+$/.test(token)) {
          visual.appendChild(doc.createTextNode(token));
          return;
        }

        var word = doc.createElement('span');
        word.className = 'copy-dissolve__word';
        word.style.setProperty('--copy-word-delay',
          (baseDelay + wordIndex * wordStep) + 'ms');
        word.textContent = token;
        visual.appendChild(word);
        wordIndex += 1;
      });
    });

    var accessible = doc.createElement('span');
    accessible.className = 'copy-dissolve__a11y';
    accessible.textContent = accessibleText;

    var fragment = doc.createDocumentFragment();
    fragment.appendChild(visual);
    fragment.appendChild(accessible);
    element.replaceChildren(fragment);
    return true;
  }

  function prepareSurfaceCards(surfaceCards, staggerStep) {
    var step = typeof staggerStep === 'number' ? staggerStep : 160;
    surfaceCards.forEach(function (card, index) {
      card.style.setProperty('--tool-card-delay', (560 + index * step) + 'ms');
    });
  }

  function setupHeroReveal(root, title, subtitle, cta) {
    if (!root) {
      signalHeroComplete();
      return;
    }

    var titleResult = enhanceHeroText(title, 0, 8);
    var subtitleResult = enhanceHeroText(subtitle, 180, 3);
    if (!titleResult && !subtitleResult && !cta) {
      signalHeroComplete();
      return;
    }

    heroRoot = root;
    heroEndDelay = Math.max(
      titleResult ? titleResult.end : 0,
      subtitleResult ? subtitleResult.end : 0,
      cta ? 920 : 0
    );
    root.classList.add('is-reveal-ready');
    revealObserver.observe(root);
  }

  function setupDissolveGroup(root, copyTargets, surfaceCards, cardStagger) {
    if (!root) return;

    var targets = copyTargets.filter(Boolean);
    if (!targets.length && !surfaceCards.length) return;

    targets.forEach(function (target, index) {
      var ready = enhanceSectionCopy(target, index === 0 ? 0 : 180, 50);
      if (ready) target.classList.add('copy-dissolve');
    });

    prepareSurfaceCards(surfaceCards, cardStagger);
    root.classList.add('is-reveal-ready');
    revealObserver.observe(root);
  }

  var heroContent = document.querySelector('.hero__content');
  setupHeroReveal(heroContent,
    heroContent && heroContent.querySelector('.hero__title'),
    heroContent && heroContent.querySelector('.hero__subtitle'),
    heroContent && heroContent.querySelector('.hero__cta')
  );

  var ecoCopy = document.querySelector('.eco-card__left');
  setupDissolveGroup(ecoCopy, [
    ecoCopy && ecoCopy.querySelector('.section-heading'),
    ecoCopy && ecoCopy.querySelector('.eco-card__sub')
  ], []);

  var toolsCopy = document.querySelector('.tools__left');
  var toolCards = toolsCopy ?
    Array.prototype.slice.call(toolsCopy.querySelectorAll('.tool-card')) : [];
  setupDissolveGroup(toolsCopy, [
    toolsCopy && toolsCopy.querySelector('.section-heading'),
    toolsCopy && toolsCopy.querySelector('.tools__sub')
  ], toolCards);

  var aiCopy = document.querySelector('.ai-layer__inner');
  var aiCards = aiCopy ?
    Array.prototype.slice.call(aiCopy.querySelectorAll('.ai-card')) : [];
  setupDissolveGroup(aiCopy, [
    aiCopy && aiCopy.querySelector('.section-heading')
  ], aiCards);

  var roboticsCopy = document.querySelector('.robotics__inner');
  var roboticsCards = roboticsCopy ?
    Array.prototype.slice.call(roboticsCopy.querySelectorAll('.robot-card')) : [];
  setupDissolveGroup(roboticsCopy, [
    roboticsCopy && roboticsCopy.querySelector('.robotics__title'),
    roboticsCopy && roboticsCopy.querySelector('.robotics__subtitle')
  ], roboticsCards);

  var layersCopy = document.querySelector('.layers__inner');
  var layersSurfaces = layersCopy ?
    Array.prototype.slice.call(layersCopy.querySelectorAll('.carousel__stack, .carousel__foot')) : [];
  setupDissolveGroup(layersCopy, [
    layersCopy && layersCopy.querySelector('.section-heading'),
    layersCopy && layersCopy.querySelector('.section-sub')
  ], layersSurfaces);
})();
