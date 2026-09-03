// flip all images
all('img', flip, 80);

// breathe all text paragraphs
all('p', breathe, 120);

// skake all text input areas
all('input, textarea, button', shake, 30);

// chaos: randomly adds effect to one element over time
var __chaosPool = [breathe, flip, dance, drift, pulse, tilt, skew, stretch, shake, invert, hue];
var __chaosId = setInterval(function() {
  var els = Array.from(document.querySelectorAll('body *')).filter(function(el) {
    var r = el.getBoundingClientRect();
    return r.width > 20 && r.height > 20;
  });
  if (!els.length) return;
  tap(els[Math.floor(Math.random() * els.length)]);
  __chaosPool[Math.floor(Math.random() * __chaosPool.length)]();
}, 200);
function stopChaos() { clearInterval(__chaosId); }

// dj scratch effect with youtube video
var v8 = document.querySelector('video');
var scratchStart = v8.currentTime;
tap(document.body);
shake();
every(function() {
  v8.currentTime = Math.max(0, scratchStart + Math.sin(Date.now() / 1000) * 1.5);
}, 50);

// manipulate playback pitch and speed
var v10 = document.querySelector('video');
v10.preservesPitch = false;
every(function() {
  v10.playbackRate = Math.max(0.1, 1 + Math.sin(Date.now() / 400) * 0.5);
}, 50);

// scrub youtube video
var v11 = document.querySelector('video');
every(function() {
  v11.currentTime = Math.random() * v11.duration;
}, 800);

// random scrolling
every(function() {
  window.scrollTo({ top: Math.random() * document.body.scrollHeight, behavior: 'smooth' });
}, 2000);
