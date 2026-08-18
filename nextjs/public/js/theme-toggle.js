(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ZetrixThemeToggle = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var STORAGE_KEY = 'zetrix-theme';

  function normalizeTheme(value) {
    return value === 'light' ? 'light' : 'dark';
  }

  function readStoredTheme(storage) {
    try {
      return normalizeTheme(storage && storage.getItem(STORAGE_KEY));
    } catch (error) {
      return 'dark';
    }
  }

  function writeStoredTheme(storage, theme) {
    try {
      if (storage) storage.setItem(STORAGE_KEY, normalizeTheme(theme));
      return true;
    } catch (error) {
      return false;
    }
  }

  function applyTheme(doc, theme) {
    var light = normalizeTheme(theme) === 'light';
    if (light) doc.documentElement.setAttribute('data-theme', 'light');
    else doc.documentElement.removeAttribute('data-theme');
    return light ? 'light' : 'dark';
  }

  function syncButton(button, theme) {
    var light = theme === 'light';
    var label = light ? 'Switch to dark mode' : 'Switch to light mode';
    button.setAttribute('aria-pressed', String(light));
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  }

  function init(doc, win) {
    var buttons = doc.querySelectorAll('[data-theme-toggle]');
    if (!buttons.length) return function () {};

    var storage = null;
    try {
      storage = win.localStorage;
    } catch (error) {}

    function syncAll(t) {
      for (var i = 0; i < buttons.length; i++) syncButton(buttons[i], t);
    }

    var theme = applyTheme(doc, 'dark');
    syncAll(theme);

    function onClick() {
      theme = applyTheme(doc, theme === 'light' ? 'dark' : 'light');
      syncAll(theme);
      writeStoredTheme(storage, theme);
    }

    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener('click', onClick);

    return function cleanup() {
      for (var j = 0; j < buttons.length; j++) buttons[j].removeEventListener('click', onClick);
    };
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    normalizeTheme: normalizeTheme,
    readStoredTheme: readStoredTheme,
    writeStoredTheme: writeStoredTheme,
    applyTheme: applyTheme,
    init: init
  };
});

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.ZetrixThemeToggle.init(document, window);
}
