(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));

  function show(id, updateHash) {
    var found = false;
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      if (on) found = true;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    if (!found) return show('about', updateHash);
    panels.forEach(function (p) {
      var on = p.id === id;
      p.hidden = !on;
      p.classList.toggle('active', on);
      if (on) {
        Array.prototype.forEach.call(p.querySelectorAll('.entry'), function (e, i) {
          e.style.setProperty('--i', i);
        });
      }
    });
    if (updateHash) history.replaceState(null, '', '#' + id);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.getAttribute('aria-controls'), true); });
    t.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.focus(); next.click(); }
    });
  });

  window.addEventListener('hashchange', function () { show(location.hash.slice(1), false); });
  show(location.hash.slice(1) || 'about', false);
})();
