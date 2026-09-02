// 2. THUMBNAIL CASCADE — every image on the page flips in sequence,
//    like a deck of cards being dealt. Works on any image-heavy page;
//    especially good on youtube.com/results or an image gallery.
all('img', flip, 80);

// 3. PARAGRAPH WAVE — every paragraph on the page breathes in a
//    staggered wave, like the page is reading itself out loud.
//    Great on Wikipedia or any long-form article.
all('p', breathe, 120);

// 4. NERVOUS FORM — every input and button on the page starts
//    jittering, like the form is anxious about being submitted.
//    Works on any page with a form.
all('input, textarea, button', shake, 30);

// 5. CHAOS MODE — a random effect fires on a random visible element
//    every 400ms, forever. Genuinely bananas on a busy page. Run
//    stopChaos() to end it (stop() alone won't catch every element
//    chaos has touched).
var __chaosPool = [breathe, flip, dance, drift, pulse, tilt, skew, stretch, shake, invert, hue];
var __chaosId = setInterval(function() {
  var els = Array.from(document.querySelectorAll('body *')).filter(function(el) {
    var r = el.getBoundingClientRect();
    return r.width > 20 && r.height > 20;
  });
  if (!els.length) return;
  tap(els[Math.floor(Math.random() * els.length)]);
  __chaosPool[Math.floor(Math.random() * __chaosPool.length)]();
}, 400);
function stopChaos() { clearInterval(__chaosId); }

// ---- The rest of these repurpose the same tools for something they
// weren't really built for: manipulating actual video playback state.
// currentTime/volume/playbackRate aren't CSS, so these use every()
// instead of play() — but they're built from the exact same system.
// All target the page's <video> element directly (works on any page
// with one — youtube.com/watch is the obvious target).

// 8. DJ SCRATCH — the video scrubs back and forth while the whole page
//    visually shakes in sync, like a turntable being scratched.
var v8 = document.querySelector('video');
var scratchStart = v8.currentTime;
tap(document.body);
shake();
every(function() {
  v8.currentTime = Math.max(0, scratchStart + Math.sin(Date.now() / 1000) * 1.5);
}, 50);
// stopAll() to end both the scrub and the shake together.


// 9. VOLUME TREMOLO — native .volume oscillating. No Web Audio, no
//    filters, just the element's own property, wobbling.
var v9 = document.querySelector('video');
every(function() {
  v9.volume = (Math.sin(Date.now() / 200) + 1) / 2;
}, 30);


// 10. WARPED TAPE — playbackRate wobbling with preservesPitch turned
//     off, so speed changes actually bend the pitch, like a dying
//     cassette rather than just slo-mo/fast-forward.
var v10 = document.querySelector('video');
v10.preservesPitch = false;
every(function() {
  v10.playbackRate = Math.max(0.1, 1 + Math.sin(Date.now() / 400) * 0.5);
}, 50);
// stopAll() won't reset playbackRate/preservesPitch themselves —
// run v10.playbackRate = 1; v10.preservesPitch = true; after.

// 11. CHANNEL SURF — jumps to a random point in the video every
//     800ms, like someone aggressively dragging the scrubber. Chaotic
//     on anything longer than a couple minutes.
var v11 = document.querySelector('video');
every(function() {
  v11.currentTime = Math.random() * v11.duration;
}, 800);

// 13. TAB SCREAM — flashes the browser tab's title back and forth,
//     like an old "you've got mail" alert. Repurposes sequence() for
//     something that isn't a visual effect at all. Works on any page.
var __originalTitle = document.title;
sequence([
  [function() { document.title = '🚨 WAKE UP 🚨'; }, 0],
  [function() { document.title = __originalTitle; }, 500],
  [function() { document.title = '🚨 WAKE UP 🚨'; }, 1000],
  [function() { document.title = __originalTitle; }, 1500]
]);

// 14. PAGE SURF — native smooth-scroll used as a choreography move,
//     riding the whole page up and down on a timer instead of
//     transforming anything. Works on any scrollable page.
every(function() {
  window.scrollTo({ top: Math.random() * document.body.scrollHeight, behavior: 'smooth' });
}, 2000);