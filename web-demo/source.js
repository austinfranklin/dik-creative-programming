// this is what every effect points at until you call tap()
var current = document.body;

// keeps track of what's running on each element
var registry = new Map();

function reg(el) {
  if (!registry.has(el)) registry.set(el, {});
  return registry.get(el);
}

// starts an animation and remembers it by name
function play(name, keyframes, options) {
  var el = current;
  var r = reg(el);
  if (r[name]) r[name].cancel();
  var anim = el.animate(keyframes, options);
  r[name] = anim;
  return anim;
}

// same idea as play(), but for stuff that isn't a CSS property
window.__intervals = window.__intervals || [];
function every(fn, ms) {
  var id = setInterval(fn, ms);
  __intervals.push(id);
  return id;
}

// targeting

// points everything at one element
function tap(target) {
  var el = typeof target === 'string' ? document.querySelector(target) : target;
  if (target && !el) { console.warn('nothing matches:', target); return; }
  current = el || document.body;
  var rect = current.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    console.warn('that element has no size, you won\'t see anything:', current);
  } else {
    console.log('tapped:', current);
  }
}

// click something on the page to tap it
function pick() {
  console.log('click something to tap it, esc to cancel');

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

// taps every element matching selector, one at a time, running fn()
// on each with a delay in between
function all(selector, fn, stagger) {
  var els = Array.from(document.querySelectorAll(selector));
  els.forEach(function(el, i) {
    setTimeout(function() {
      tap(el);
      fn();
    }, (stagger || 0) * i);
  });
}

// timing

// setTimeout, just shorter to type
function after(ms, fn) {
  setTimeout(fn, ms);
}

// chains a list of [fn, wait] pairs into a little timeline
function sequence(steps) {
  var t = 0;
  steps.forEach(function(step) {
    after(t, step[0]);
    t += step[1];
  });
}

// effects

// these all act on whatever's currently tapped
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

// color
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

// control

// cancels one effect by name on the current element, or everything if you don't pass a name
function stop(key) {
  var r = reg(current);
  if (key) {
    if (r[key]) { r[key].cancel(); delete r[key]; }
    return;
  }
  Object.keys(r).forEach(function(k) { r[k].cancel(); });
  registry.set(current, {});
}

// clears every animation and interval everywhere
function stopAll() {
  registry.forEach(function(r) {
    Object.keys(r).forEach(function(k) { r[k].cancel(); });
  });
  registry = new Map();
  __intervals.forEach(function(id) { clearInterval(id); });
  __intervals = [];
}