// ── Shows page sticky notes ──
(function () {
  var grid = document.getElementById('showsGrid');
  var loader = document.getElementById('showLoader');

  if (!grid || !window.CherriShows) return;

  var NOTE_COLORS = [
    '#ffe14d', '#ff9ec0', '#8ce0c0', '#8fcbff',
    '#ffb26b', '#c9a5ff', '#d7f26a', '#ff7f7f'
  ];

  var FIRST_NOTE_COLOR = '#ffe14d';

  // Draws from a reshuffled pool so colors stay random but never repeat back to back.
  var colorPool = [];
  var lastColor = null;

  function nextColor() {
    if (!colorPool.length) {
      colorPool = NOTE_COLORS.slice().sort(function () { return Math.random() - 0.5; });
      if (colorPool[0] === lastColor) colorPool.push(colorPool.shift());
    }
    lastColor = colorPool.shift();
    return lastColor;
  }

  // Events arrive sorted, so index 0 is the soonest show and always gets the yellow note.
  function colorFor(index) {
    if (index === 0) {
      lastColor = FIRST_NOTE_COLOR;
      return FIRST_NOTE_COLOR;
    }
    return nextColor();
  }

  window.CherriShows.fetchEvents().then(function (events) {
    if (loader) loader.style.display = 'none';

    if (!events.length) {
      grid.innerHTML = '<p class="no-shows">No upcoming shows. Check back soon.</p>';
      return;
    }

    events.forEach(function (evt, i) {
      grid.appendChild(buildSticky(evt, i));
    });
  });

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  // Alternates lean direction across the grid, with a random magnitude so it never looks mechanical.
  function tiltFor(index) {
    var magnitude = 1.4 + Math.random() * 2.1;
    return (index % 2 === 0 ? -magnitude : magnitude).toFixed(2) + 'deg';
  }

  function buildSticky(evt, index) {
    var date = window.CherriShows.formatDate(evt.datetime, { weekday: 'short', month: 'short', day: 'numeric' });

    var a = el('a', 'sticky-note');
    a.href = evt.url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.style.setProperty('--tilt', tiltFor(index));
    a.style.setProperty('--note-color', colorFor(index));

    a.appendChild(el('span', 'sticky-date', date));
    a.appendChild(el('span', 'sticky-venue', evt.venue.name));
    a.appendChild(el('span', 'sticky-location', window.CherriShows.formatLocation(evt.venue)));
    a.appendChild(el('span', 'sticky-cta', 'Tickets'));
    return a;
  }
})();
