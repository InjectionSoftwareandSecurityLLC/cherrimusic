// ── Shared Bandsintown data source ──
window.CherriShows = (function () {
  var ARTIST_NAME = 'CHERRI';
  var API_URL = 'https://rest.bandsintown.com/artists/' +
    encodeURIComponent(ARTIST_NAME) +
    '/events?app_id=26113258b4b0ab3265bf61cdb27edeab';

  function normalize(events) {
    if (!Array.isArray(events)) return [];
    return events
      .filter(function (evt) { return evt && evt.datetime && evt.venue; })
      .sort(function (a, b) { return new Date(a.datetime) - new Date(b.datetime); });
  }

  async function fetchEvents() {
    try {
      var resp = await fetch(API_URL);
      return normalize(await resp.json());
    } catch (err) {
      return [];
    }
  }

  function formatDate(datetime, opts) {
    return new Date(datetime).toLocaleDateString('en-US', opts || {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  function formatLocation(venue) {
    return venue.city + ', ' + (venue.region || venue.country);
  }

  return {
    fetchEvents: fetchEvents,
    formatDate: formatDate,
    formatLocation: formatLocation
  };
})();
