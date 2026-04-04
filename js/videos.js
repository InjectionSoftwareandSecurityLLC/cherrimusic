// ── YouTube Video Fetching ──
// Replace YOUR_YOUTUBE_API_KEY with a real YouTube Data API v3 key
(function () {
  var API_KEY = 'AIzaSyD97_O89-D8OkqrG66ogYcLHdP0okZQZ7E';
  var CHANNEL_HANDLE = 'CHERRImusicofficial';
  var MAX_RESULTS = 25;

  var grid = document.getElementById('videoGrid');
  var loader = document.getElementById('videoLoader');
  var player = document.getElementById('featured-player');
  var homeVideo = document.getElementById('home-video');

  // Watch page — full gallery
  if (grid) {
    fetchChannelVideos();
  }

  // Home page — latest video only
  if (homeVideo && !grid) {
    fetchLatestForHome();
  }

  async function resolveChannelId() {
    var url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails' +
      '&forHandle=' + encodeURIComponent(CHANNEL_HANDLE) +
      '&key=' + encodeURIComponent(API_KEY);
    var resp = await fetch(url);
    var data = await resp.json();
    if (!data.items || data.items.length === 0) return null;
    return data.items[0].contentDetails.relatedPlaylists.uploads;
  }

  async function fetchUploads(uploadsPlaylistId, maxResults) {
    var items = [];
    var nextPageToken = '';
    var limit = maxResults || MAX_RESULTS;

    while (items.length < limit) {
      var perPage = Math.min(50, limit - items.length);
      var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
        '&playlistId=' + encodeURIComponent(uploadsPlaylistId) +
        '&maxResults=' + perPage +
        '&key=' + encodeURIComponent(API_KEY);
      if (nextPageToken) url += '&pageToken=' + encodeURIComponent(nextPageToken);

      var resp = await fetch(url);
      var data = await resp.json();
      if (!data.items) break;
      items = items.concat(data.items);
      nextPageToken = data.nextPageToken;
      if (!nextPageToken) break;
    }

    return items;
  }

  async function fetchChannelVideos() {
    try {
      var uploadsId = await resolveChannelId();
      if (!uploadsId) throw new Error('Channel not found');

      var items = await fetchUploads(uploadsId, MAX_RESULTS);

      if (loader) loader.style.display = 'none';

      if (items.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#888;">No videos found.</p>';
        return;
      }

      // Featured player — most recent video
      if (player) {
        player.src = 'https://www.youtube.com/embed/' + items[0].snippet.resourceId.videoId;
      }

      // Build gallery grid (already ordered most-recent-first from uploads playlist)
      items.forEach(function (item) {
        var vid = item.snippet.resourceId.videoId;
        var title = item.snippet.title;
        var thumbs = item.snippet.thumbnails;
        var thumb = (thumbs.high || thumbs.medium || thumbs.default).url;

        var card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML =
          '<img src="' + thumb + '" alt="' + title.replace(/"/g, '&quot;') + '">' +
          '<p class="video-card-title">' + title + '</p>';

        card.addEventListener('click', function () {
          if (player) {
            player.src = 'https://www.youtube.com/embed/' + vid + '?autoplay=1';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });

        grid.appendChild(card);
      });
    } catch (err) {
      if (loader) loader.style.display = 'none';
      grid.innerHTML = '<p style="text-align:center;color:#888;">Unable to load videos.</p>';
    }
  }

  async function fetchLatestForHome() {
    try {
      var uploadsId = await resolveChannelId();
      if (!uploadsId) return;
      var items = await fetchUploads(uploadsId, 1);
      if (items.length > 0) {
        homeVideo.src = 'https://www.youtube.com/embed/' + items[0].snippet.resourceId.videoId;
      }
    } catch (e) {
      // Silently fail on home page
    }
  }
})();
