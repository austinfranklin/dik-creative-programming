// Copy/Paste this entire script into the browser's console
//
// Built entirely on native browser APIs — no custom animation engine:
//   - Element.animate() (Web Animations API) drives every visual effect
//   - composite:'add' lets multiple transform-based effects run on the
//     same element simultaneously and compose natively, instead of us
//     hand-merging transform strings ourselves
//   - Animation.cancel() natively resets an element when stopped —
//     no manual style bookkeeping required
//   - querySelectorAll / setTimeout / addEventListener do the rest
//
// Every effect returns its Animation object, so you can grab it and use
// native controls directly: var a = breathe(); a.pause(); a.playbackRate = 3;

// ---- targeting ----
// tap(target) — sets which element functions act on (defaults to document.body if never called).
//               Accepts a CSS selector string ('.some-div', '#header') or a DOM element directly
//               (e.g. $0 from DevTools). Warns if the tapped element has zero size. Each element
//               keeps its own separate set of running animations, so tap(body), start an effect,
//               then tap('.some-div') and start another — both keep running independently.
// pick()     — click-to-tap picker. Hovering highlights elements in red; clicking one taps it;
//              Esc cancels.
// all(selector, fn, stagger) — taps every element matching selector in turn, running fn() on
//              each, staggered by `stagger` ms. e.g. all('.card', shake, 80)

// ---- timing ----
// after(ms, fn)     — runs fn once, ms milliseconds from now
// sequence(steps)   — plays an ordered list of [fn, waitMs] pairs as a timeline
// every(fn, ms)     — runs fn every ms, forever, registered so stopAll() can clear it. Use this
//                     for numeric properties Element.animate() can't touch — currentTime, volume,
//                     playbackRate — since those aren't CSS properties.

// ---- visual effects (all act on the currently tapped element; each returns its Animation) ----
// breathe()  — scales the element in and out in a slow pulse, like inhaling and exhaling
// flip()     — spins the element continuously around its vertical (Y) axis, like a card flipping
// dance()    — slams the element side to side along the X axis in a fast shake
// drift()    — slowly rotates the element flat, like a clock hand sweeping
// pulse()    — fades the element's opacity in and out in a steady strobe
// tilt()     — spins the element around its horizontal (X) axis, a front-to-back tumble
// skew()     — shears the element side to side, like it's leaning under force
// stretch()  — squashes and stretches the element vertically, like breathing but on one axis
// shake()    — rapid small vertical jitter, like a tremor
// invert()   — strobes the element's colors between normal and negative
// hue()      — continuously cycles the element's colors through the spectrum
//
// breathe/flip/dance/drift/tilt/skew/stretch/shake all animate `transform` with composite:'add',
// so any combination of them can run on the same element at once and blend natively. pulse/invert/
// hue animate opacity/filter and use the default 'replace' composite — stacking two of those
// doesn't make physical sense the way stacking transforms does, so the newer one simply replaces.

// ---- control ----
// stop(key)  — cancels one named effect on the currently tapped element (native Animation.cancel());
//              stop() with no key cancels every effect on the currently tapped element ONLY
// stopAll()  — cancels every effect on every element that's ever been tapped. Use this after all()
//              or pick()-ing across multiple elements — stop() alone won't reach elements other
//              than whichever one is currently tapped.

// ---- CORE ----

var current = document.body; // default target until tap() is called
var registry = new Map();    // el -> { effectName: Animation }

function reg(el) {
  if (!registry.has(el)) registry.set(el, {});
  return registry.get(el);
}

// Starts (or restarts) a named animation on the currently tapped element.
function play(name, keyframes, options) {
  var el = current;
  var r = reg(el);
  if (r[name]) r[name].cancel(); // replace any running instance under this name
  var anim = el.animate(keyframes, options);
  r[name] = anim;
  return anim;
}

// Runs fn every ms, forever, registered so stopAll() can clear it. For
// numeric properties Element.animate() can't touch (currentTime, volume,
// playbackRate) — anything that isn't a CSS property.
window.__intervals = window.__intervals || [];
function every(fn, ms) {
  var id = setInterval(fn, ms);
  __intervals.push(id);
  return id;
}

// ---- TARGETING ----

function tap(target) {
  var el = typeof target === 'string' ? document.querySelector(target) : target;
  if (target && !el) { console.warn('No element matches:', target); return; }
  current = el || document.body;
  var rect = current.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    console.warn('Tapped element has zero size — effects won\'t be visible:', current);
  } else {
    console.log('Tapped:', current);
  }
}

function pick() {
  console.log('Click an element to tap it, or press Esc to cancel.');

  function onOver(e) { e.target.style.outline = '2px solid red'; }
  function onOut(e) { e.target.style.outline = ''; }
  function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.outline = '';
    cleanup();
    tap(e.target);
  }
  function onKey(e) { if (e.key === 'Escape') cleanup(); }
  function cleanup() {
    document.removeEventListener('mouseover', onOver, true);
    document.removeEventListener('mouseout', onOut, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKey, true);
  }

  document.addEventListener('mouseover', onOver, true);
  document.addEventListener('mouseout', onOut, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKey, true);
}

function all(selector, fn, stagger) {
  var els = Array.from(document.querySelectorAll(selector));
  els.forEach(function(el, i) {
    setTimeout(function() {
      tap(el);
      fn();
    }, (stagger || 0) * i);
  });
}

// ---- TIMING ----

function after(ms, fn) {
  setTimeout(fn, ms);
}

function sequence(steps) {
  var t = 0;
  steps.forEach(function(step) {
    after(t, step[0]);
    t += step[1];
  });
}

// ---- VISUAL EFFECTS ----

function breathe() {
  return play('breathe', [
    { transform: 'scale(1)' },
    { transform: 'scale(1.5)' },
    { transform: 'scale(1)' }
  ], { duration: 900, iterations: Infinity, easing: 'ease-in-out', composite: 'add' });
}

function flip() {
  return play('flip', [
    { transform: 'rotateY(0deg)' },
    { transform: 'rotateY(360deg)' }
  ], { duration: 1200, iterations: Infinity, easing: 'linear', composite: 'add' });
}

function dance() {
  return play('dance', [
    { transform: 'translateX(0px)' },
    { transform: 'translateX(300px)' },
    { transform: 'translateX(-300px)' },
    { transform: 'translateX(0px)' }
  ], { duration: 700, iterations: Infinity, easing: 'ease-in-out', composite: 'add' });
}

function drift() {
  return play('drift', [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
  ], { duration: 6000, iterations: Infinity, easing: 'linear', composite: 'add' });
}

function pulse() {
  return play('pulse', [
    { opacity: 1 },
    { opacity: 0.15 },
    { opacity: 1 }
  ], { duration: 470, iterations: Infinity, easing: 'ease-in-out' });
}

function tilt() {
  return play('tilt', [
    { transform: 'rotateX(0deg)' },
    { transform: 'rotateX(360deg)' }
  ], { duration: 1200, iterations: Infinity, easing: 'linear', composite: 'add' });
}

function skew() {
  return play('skew', [
    { transform: 'skewX(0deg)' },
    { transform: 'skewX(40deg)' },
    { transform: 'skewX(-40deg)' },
    { transform: 'skewX(0deg)' }
  ], { duration: 1800, iterations: Infinity, easing: 'ease-in-out', composite: 'add' });
}

function stretch() {
  return play('stretch', [
    { transform: 'scaleY(1)' },
    { transform: 'scaleY(1.6)' },
    { transform: 'scaleY(1)' }
  ], { duration: 1500, iterations: Infinity, easing: 'ease-in-out', composite: 'add' });
}

function shake() {
  return play('shake', [
    { transform: 'translateY(0px)' },
    { transform: 'translateY(20px)' },
    { transform: 'translateY(-20px)' },
    { transform: 'translateY(0px)' }
  ], { duration: 180, iterations: Infinity, easing: 'linear', composite: 'add' });
}

function invert() {
  return play('invert', [
    { filter: 'invert(0)' },
    { filter: 'invert(1)' },
    { filter: 'invert(0)' }
  ], { duration: 1200, iterations: Infinity, easing: 'ease-in-out' });
}

function hue() {
  return play('hue', [
    { filter: 'hue-rotate(0deg)' },
    { filter: 'hue-rotate(360deg)' }
  ], { duration: 3000, iterations: Infinity, easing: 'linear' });
}

// ---- CONTROL ----

function stop(key) {
  var r = reg(current);
  if (key) {
    if (r[key]) { r[key].cancel(); delete r[key]; }
    return;
  }
  Object.keys(r).forEach(function(k) { r[k].cancel(); });
  registry.set(current, {});
}

// Cancels every animation on every element ever tapped, not just current.
// stop() only sees the currently tapped element, so anything started via
// all() or picked across multiple elements needs this to fully reset.
function stopAll() {
  registry.forEach(function(r) {
    Object.keys(r).forEach(function(k) { r[k].cancel(); });
  });
  registry = new Map();
  __intervals.forEach(function(id) { clearInterval(id); });
  __intervals = [];
}
