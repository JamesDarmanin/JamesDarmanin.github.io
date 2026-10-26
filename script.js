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
    document.body.dataset.tab = id;
    Array.prototype.forEach.call(document.querySelectorAll('#' + id + ' .chips li'), function (c, i) { c.style.setProperty('--i', i); });
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

  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) return;

  /* Typing roles */
  var el = document.getElementById('typed');
  var roles = ['Game programmer', 'AI developer', 'Interactive media', 'Hip-hop dancer'];
  var r = 0, c = roles[0].length, del = true;
  (function type() {
    var word = roles[r];
    c += del ? -1 : 1;
    el.textContent = word.slice(0, c);
    var wait = 70;
    if (!del && c === word.length) { del = true; wait = 1600; }
    else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
    setTimeout(type, del ? 35 : wait);
  })();

  /* Particle network */
  var cv = document.getElementById('bg'), ctx = cv.getContext('2d'), pts = [], mouse = { x: -999, y: -999 };
  function size() {
    cv.width = innerWidth; cv.height = innerHeight;
    var n = Math.min(90, Math.floor(innerWidth * innerHeight / 18000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
  }
  size(); window.addEventListener('resize', size);
  function frame() {
    var col = getComputedStyle(document.body).getPropertyValue('--a1').trim() || '#22d3ee';
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = col; ctx.strokeStyle = col;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > cv.width) p.vx *= -1;
      if (p.y < 0 || p.y > cv.height) p.vy *= -1;
      ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 6.283); ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) { ctx.globalAlpha = (1 - d / 130) * .25; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
