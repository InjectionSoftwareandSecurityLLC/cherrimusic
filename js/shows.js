// ── Bandsintown Shows Fetching ──
// Replace ARTIST_NAME with the actual Bandsintown artist name
(function () {
  var APP_ID = 'YOUR_BANDSINTOWN_APP_ID';
  var ARTIST_NAME = 'Cherri';

  var list = document.getElementById('showsList');
  var loader = document.getElementById('showLoader');

  if (!list) return;

  fetchShows();

  async function fetchShows() {
    try {
      var url = 'https://rest.bandsintown.com/artists/' +
        encodeURIComponent(ARTIST_NAME) +
        '/events?app_id=' + encodeURIComponent(APP_ID);

      var resp = await fetch(url);
      var events = await resp.json();

      if (loader) loader.style.display = 'none';

      if (!Array.isArray(events) || events.length === 0) {
        list.innerHTML = '<p class="no-shows">No upcoming shows. Check back soon.</p>';
        return;
      }

      events.forEach(function (evt) {
        var date = new Date(evt.datetime);
        var dateStr = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        var item = document.createElement('div');
        item.className = 'show-item';
        item.innerHTML =
          '<div class="show-date">' + dateStr + '</div>' +
          '<div class="show-info">' +
            '<span class="show-venue">' + evt.venue.name + '</span>' +
            '<span class="show-location">' + evt.venue.city + ', ' + (evt.venue.region || evt.venue.country) + '</span>' +
          '</div>' +
          '<a class="show-tickets" href="' + evt.url + '" target="_blank" rel="noopener noreferrer">Tickets</a>';

        list.appendChild(item);
      });
    } catch (err) {
      if (loader) loader.style.display = 'none';
      list.innerHTML = '<p class="no-shows">Unable to load shows. Please try again later.</p>';
    }
  }
})();
