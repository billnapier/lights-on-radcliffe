(() => {
  const ENDPOINT = 'https://remotefalcon.com/remote-falcon-viewer/graphql';
  const SUBDOMAIN = 'lightsonradcliffe';
  const POLL_MS = 15000;

  const QUERY = `query ($showSubdomain: String) {
    getShow(showSubdomain: $showSubdomain) {
      playingNow
      playingNext
      playingNextFromSchedule
      playingNowSequence { name displayName artist }
      playingNextSequence { name displayName artist }
      requests { sequence { name displayName artist } position }
      preferences { viewerControlEnabled viewerControlMode }
    }
  }`;

  const card = document.getElementById('now-playing-card');
  if (!card) return;

  const labelEl = document.getElementById('np-label');
  const titleEl = document.getElementById('np-title');
  const metaEl = document.getElementById('np-meta');
  const queueEl = document.getElementById('np-queue');

  function formatSong(seq, fallback) {
    const title = (seq && (seq.displayName || seq.name)) || fallback || '';
    const artist = (seq && seq.artist) || '';
    return { title: title.trim(), artist: artist.trim() };
  }

  function render(show) {
    const now = formatSong(show.playingNowSequence, show.playingNow);
    const next = formatSong(
      show.playingNextSequence,
      show.playingNext || show.playingNextFromSchedule
    );
    const queueCount = Array.isArray(show.requests) ? show.requests.length : 0;

    if (now.title) {
      card.classList.add('is-live');
      card.classList.remove('is-idle');
      labelEl.textContent = 'Now Playing on 88.3 FM';
      titleEl.textContent = now.artist ? `${now.title} — ${now.artist}` : now.title;

      const metaParts = [];
      if (next.title) {
        metaParts.push(`Up next: ${next.title}`);
      }
      metaEl.textContent = metaParts.join(' · ') || 'Watch live and request what plays next!';

      if (queueCount > 0) {
        queueEl.textContent = `${queueCount} in queue`;
        queueEl.hidden = false;
      } else {
        queueEl.hidden = true;
      }
    } else {
      card.classList.remove('is-live');
      card.classList.add('is-idle');
      labelEl.textContent = 'Live Show Status';
      titleEl.textContent = 'Lights are resting right now';
      metaEl.textContent = 'Shows run nightly 5:00 – 10:00 PM (December 1 – January 6) on 88.3 FM.';
      queueEl.hidden = true;
    }
  }

  let inFlight = false;

  async function refresh() {
    if (inFlight || document.hidden) return;
    inFlight = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: QUERY,
          variables: { showSubdomain: SUBDOMAIN }
        }),
        signal: controller.signal
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.data && json.data.getShow) {
        render(json.data.getShow);
      }
    } catch (_) {
      // Fail silently — keep static fallback copy visible
    } finally {
      clearTimeout(timer);
      inFlight = false;
    }
  }

  refresh();
  setInterval(refresh, POLL_MS);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refresh();
  });
})();
