// ── YouTube Video Fetching ──
// Replace YOUTUBE_API_KEY and PLAYLIST_ID with real values
(function () {
  var API_KEY = 'YOUR_YOUTUBE_API_KEY';
  var PLAYLIST_IDS = [
    'PLAYLIST_ID_1'
    // Add more playlist IDs as needed
  ];
  var MAX_RESULTS = 20;

  var grid = document.getElementById('videoGrid');
  var loader = document.getElementById('videoLoader');
  var player = document.getElementById('featured-player');
  var homeVideo = document.getElementById('home-video');

  // If we're on the watch page
  if (grid) {
    fetchAllVideos();
  }

  // If we're on the home page, just load the latest video
  if (homeVideo && !grid) {
    fetchLatestForHome();
  }

  async function fetchAllVideos() {
    try {
      var allItems = [];
      for (var i = 0; i < PLAYLIST_IDS.length; i++) {
        var items = await fetchPlaylist(PLAYLIST_IDS[i]);
        allItems = allItems.concat(items);
      }

      // Deduplicate by video ID
      var seen = {};
      var unique = [];
      allItems.forEach(function (item) {
        var vid = item.snippet.resourceId.videoId;
        if (!seen[vid]) {
          seen[vid] = true;
          unique.push(item);
        }
      });

      if (loader) loader.style.display = 'none';

      if (unique.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#888;">No videos found.</p>';
        return;
      }

      // Set featured player to first video
      if (player) {
        player.src = 'https://www.youtube.com/embed/' + unique[0].snippet.resourceId.videoId;
      }

      // Build grid
      unique.forEach(function (item) {
        var vid = item.snippet.resourceId.videoId;
        var title = item.snippet.title;
        var thumb = (item.snippet.thumbnails.high || item.snippet.thumbnails.medium || item.snippet.thumbnails.default).url;

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
      if (PLAYLIST_IDS.length === 0) return;
      var items = await fetchPlaylist(PLAYLIST_IDS[0], 1);
      if (items.length > 0) {
        homeVideo.src = 'https://www.youtube.com/embed/' + items[0].snippet.resourceId.videoId;
      }
    } catch (e) {
      // Silently fail on home page
    }
  }

  async function fetchPlaylist(playlistId, maxResults) {
    var limit = maxResults || MAX_RESULTS;
    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
      '&playlistId=' + encodeURIComponent(playlistId) +
      '&maxResults=' + limit +
      '&key=' + encodeURIComponent(API_KEY);
    var resp = await fetch(url);
    var data = await resp.json();
    return data.items || [];
  }
})();
