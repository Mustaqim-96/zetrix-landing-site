(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ZetrixNavDropdown = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var CLOSE_DELAY = 160;

  function isActivationKey(key) {
    return key === 'Enter' || key === ' ';
  }

  function wrapTabIndex(index, direction, length) {
    if (!length) return 0;
    return (index + direction + length) % length;
  }

  function init(doc, win) {
    var nav = doc.querySelector('[data-nav]');
    if (!nav || !win.matchMedia) return function () {};

    var panel = nav.querySelector('[data-nav-panel]');
    var surface = nav.querySelector('.nav-dropdown__surface');
    var triggers = Array.from(nav.querySelectorAll('[data-nav-trigger]'));
    var groups = Array.from(nav.querySelectorAll('[data-nav-group]'));
    var accordionTriggers = Array.from(nav.querySelectorAll('[data-nav-accordion-trigger]'));
    var mobileToggle = nav.querySelector('[data-nav-mobile-toggle]');
    var backdrop = nav.parentNode.querySelector('[data-nav-backdrop]');
    if (!panel || !surface || !mobileToggle || !backdrop || !triggers.length || !groups.length) {
      return function () {};
    }

    var desktop = win.matchMedia('(min-width: 1024px)');
    var closeTimer = 0;
    var switchFrame = 0;
    var removers = [];
    var activeKey = '';
    var lastTrigger = null;
    var mobileOpen = false;

    nav.classList.add('is-enhanced');

    function listen(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      removers.push(function () {
        target.removeEventListener(type, handler, options);
      });
    }

    function groupFor(key) {
      return groups.find(function (group) {
        return group.dataset.navGroup === key;
      });
    }

    function triggerFor(key) {
      return triggers.find(function (trigger) {
        return trigger.dataset.navTrigger === key;
      });
    }

    function clearCloseTimer() {
      if (closeTimer) win.clearTimeout(closeTimer);
      closeTimer = 0;
    }

    function focusables() {
      var candidates = [mobileToggle].concat(Array.from(panel.querySelectorAll('button:not([disabled]), a[href]')));
      return candidates.filter(function (item) {
        return !item.hidden && item.offsetParent !== null;
      });
    }

    function updateHeight(group) {
      if (!group) return;
      var content = group.querySelector('[data-nav-group-content]');
      if (!content) return;
      surface.style.setProperty('--nav-panel-height', (content.scrollHeight + 32) + 'px');
    }

    function setExpanded(key) {
      triggers.forEach(function (trigger) {
        trigger.setAttribute('aria-expanded', String(trigger.dataset.navTrigger === key));
      });
    }

    function setDesktopGroup(key) {
      if (switchFrame) win.cancelAnimationFrame(switchFrame);

      groups.forEach(function (group) {
        var active = group.dataset.navGroup === key;
        group.classList.toggle('is-active', active);
        group.classList.toggle('is-switching', active);
      });

      var group = groupFor(key);
      updateHeight(group);
      setExpanded(key);

      switchFrame = win.requestAnimationFrame(function () {
        switchFrame = 0;
        if (group) group.classList.remove('is-switching');
      });
    }

    function openDesktop(key, trigger) {
      clearCloseTimer();
      activeKey = key;
      lastTrigger = trigger || triggerFor(key);
      panel.hidden = false;
      setDesktopGroup(key);
      nav.classList.add('is-menu-open');
    }

    function closeDesktop(restoreFocus) {
      clearCloseTimer();
      activeKey = '';
      nav.classList.remove('is-menu-open');
      setExpanded('');
      if (restoreFocus && lastTrigger) lastTrigger.focus();
    }

    function scheduleDesktopClose() {
      clearCloseTimer();
      closeTimer = win.setTimeout(function () {
        closeDesktop(false);
      }, CLOSE_DELAY);
    }

    function setAccordion(key) {
      groups.forEach(function (group) {
        var open = group.dataset.navGroup === key;
        var button = group.querySelector('[data-nav-accordion-trigger]');
        var content = group.querySelector('[data-nav-group-content]');
        group.classList.toggle('is-accordion-open', open);
        if (button) button.setAttribute('aria-expanded', String(open));
        if (content) content.hidden = !open;
      });
    }

    function setMobileOpen(open, restoreFocus) {
      mobileOpen = open;
      panel.hidden = !open;
      backdrop.hidden = !open;
      nav.classList.toggle('is-mobile-open', open);
      doc.body.classList.toggle('is-nav-locked', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');

      if (!open) {
        setAccordion('');
        if (restoreFocus) mobileToggle.focus();
      }
    }

    function closeAll(restoreFocus) {
      if (desktop.matches) closeDesktop(restoreFocus);
      else setMobileOpen(false, restoreFocus);
    }

    function onDocumentPointerDown(event) {
      if (!nav.contains(event.target)) closeAll(false);
    }

    function onDocumentKeyDown(event) {
      if (event.key === 'Escape' && (activeKey || mobileOpen)) {
        event.preventDefault();
        closeAll(true);
        return;
      }

      if (event.key !== 'Tab' || !mobileOpen || desktop.matches) return;

      var items = focusables();
      if (!items.length) return;

      var current = items.indexOf(doc.activeElement);
      var direction = event.shiftKey ? -1 : 1;
      var leavingStart = direction < 0 && current === 0;
      var leavingEnd = direction > 0 && current === items.length - 1;

      if (current === -1 || leavingStart || leavingEnd) {
        event.preventDefault();
        var start = current < 0 ? (direction < 0 ? 0 : -1) : current;
        items[wrapTabIndex(start, direction, items.length)].focus();
      }
    }

    function onModeChange() {
      clearCloseTimer();
      nav.classList.remove('is-menu-open', 'is-mobile-open');
      doc.body.classList.remove('is-nav-locked');
      panel.hidden = true;
      backdrop.hidden = true;
      activeKey = '';
      mobileOpen = false;
      setExpanded('');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Open navigation menu');

      if (desktop.matches) {
        groups.forEach(function (group) {
          var button = group.querySelector('[data-nav-accordion-trigger]');
          var content = group.querySelector('[data-nav-group-content]');
          group.classList.remove('is-accordion-open');
          if (button) button.setAttribute('aria-expanded', 'false');
          if (content) content.hidden = false;
        });
      } else {
        setAccordion('');
      }
    }

    function onResize() {
      if (desktop.matches && activeKey) updateHeight(groupFor(activeKey));
    }

    triggers.forEach(function (trigger) {
      var key = trigger.dataset.navTrigger;

      listen(trigger, 'pointerenter', function () {
        if (desktop.matches) openDesktop(key, trigger);
      });

      listen(trigger, 'focusin', function () {
        if (desktop.matches) openDesktop(key, trigger);
      });

      listen(trigger, 'click', function () {
        if (desktop.matches) openDesktop(key, trigger);
      });

      listen(trigger, 'keydown', function (event) {
        if (desktop.matches && isActivationKey(event.key)) {
          event.preventDefault();
          openDesktop(key, trigger);
        }
      });
    });

    listen(nav, 'pointerleave', function () {
      if (desktop.matches) scheduleDesktopClose();
    });
    listen(nav, 'pointerenter', clearCloseTimer);
    listen(nav, 'focusout', function (event) {
      if (desktop.matches && !nav.contains(event.relatedTarget)) scheduleDesktopClose();
    });

    accordionTriggers.forEach(function (button) {
      listen(button, 'click', function () {
        var key = button.dataset.navAccordionTrigger;
        setAccordion(button.getAttribute('aria-expanded') === 'true' ? '' : key);
      });
    });

    listen(mobileToggle, 'click', function () {
      setMobileOpen(!mobileOpen, false);
    });
    listen(backdrop, 'click', function () {
      setMobileOpen(false, true);
    });
    listen(doc, 'pointerdown', onDocumentPointerDown);
    listen(doc, 'keydown', onDocumentKeyDown);
    listen(win, 'resize', onResize);
    listen(desktop, 'change', onModeChange);

    onModeChange();

    return function cleanup() {
      clearCloseTimer();
      if (switchFrame) win.cancelAnimationFrame(switchFrame);
      removers.forEach(function (remove) { remove(); });
      removers = [];
      doc.body.classList.remove('is-nav-locked');
      nav.classList.remove('is-enhanced', 'is-menu-open', 'is-mobile-open');
      panel.hidden = true;
      backdrop.hidden = true;
    };
  }

  return {
    CLOSE_DELAY: CLOSE_DELAY,
    isActivationKey: isActivationKey,
    wrapTabIndex: wrapTabIndex,
    init: init
  };
});

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.ZetrixNavDropdown.init(document, window);
}
