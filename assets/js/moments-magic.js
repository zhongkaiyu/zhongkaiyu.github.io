// Playful love animations + hidden easter eggs for the "Us" page.
// Runs only where .moments-page exists. Respects prefers-reduced-motion.
// (redeploy trigger: GitHub Pages publish retry)
(function () {
  var page = document.querySelector(".moments-page");
  if (!page) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var layer = document.createElement("div");
  layer.className = "magic-layer";
  document.body.appendChild(layer);

  var HEARTS = ["❤", "💕", "💖", "💗", "💓"];
  function rnd(a, b) {
    return a + Math.random() * (b - a);
  }

  function makeHeart(x, y, o) {
    o = o || {};
    var el = document.createElement("span");
    el.className = "magic-heart";
    el.textContent = o.char || HEARTS[(Math.random() * HEARTS.length) | 0];
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.fontSize = (o.size || rnd(14, 26)) + "px";
    var dx = o.dx != null ? o.dx : rnd(-40, 40);
    var dy = o.dy != null ? o.dy : -rnd(80, 150);
    var rot = rnd(-40, 40);
    var peak = o.peak != null ? o.peak : 0.95;
    el.animate(
      [
        { transform: "translate(0,0) scale(.4) rotate(0)", opacity: 0 },
        { transform: "translate(" + dx * 0.4 + "px," + dy * 0.3 + "px) scale(1) rotate(" + rot * 0.5 + "deg)", opacity: peak, offset: 0.25 },
        { transform: "translate(" + dx + "px," + dy + "px) scale(.9) rotate(" + rot + "deg)", opacity: 0 },
      ],
      { duration: o.dur || rnd(1300, 2200), easing: "cubic-bezier(.22,1,.36,1)" }
    ).onfinish = function () {
      el.remove();
    };
    layer.appendChild(el);
  }

  function burst(x, y, n) {
    for (var i = 0; i < (n || 6); i++) makeHeart(x + rnd(-8, 8), y + rnd(-8, 8), {});
  }

  function heartRain() {
    for (var i = 0; i < 46; i++) {
      (function (i) {
        setTimeout(function () {
          makeHeart(rnd(0, window.innerWidth), -20, {
            dy: window.innerHeight + 60,
            dx: rnd(-60, 60),
            dur: rnd(2600, 4600),
            size: rnd(16, 34),
            peak: 1,
          });
        }, i * 55);
      })(i);
    }
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "magic-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.classList.add("show");
    });
    setTimeout(function () {
      t.classList.remove("show");
    }, 3200);
    setTimeout(function () {
      t.remove();
    }, 3800);
  }

  if (reduce) return; // no motion: layer stays empty, easter eggs off

  // ambient: a gentle heart drifts up now and then
  setInterval(function () {
    if (document.hidden) return;
    makeHeart(rnd(0, window.innerWidth), window.innerHeight + 10, {
      dy: -rnd(window.innerHeight * 0.45, window.innerHeight * 0.75),
      dx: rnd(-30, 30),
      dur: rnd(6500, 10500),
      size: rnd(12, 20),
      peak: 0.4,
    });
  }, 3200);

  // click inside the gallery bursts a few hearts (but leave photo-zoom alone)
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".moments-page")) return;
    if (e.target.closest(".moments-img") || document.querySelector(".medium-zoom-image--opened")) return;
    burst(e.clientX, e.clientY, 5);
  });

  // hidden trick #1 — Konami code: up up down down left right left right B A
  var seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    pos = 0;
  document.addEventListener("keydown", function (e) {
    pos = e.keyCode === seq[pos] ? pos + 1 : e.keyCode === seq[0] ? 1 : 0;
    if (pos === seq.length) {
      pos = 0;
      heartRain();
      toast("you found our little secret ❤");
    }
  });

  // hidden trick #2 — tap the "Us" title five times
  var title = document.querySelector(".post-title") || document.querySelector("h1");
  if (title) {
    var clicks = 0,
      timer;
    title.addEventListener("click", function () {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(function () {
        clicks = 0;
      }, 1500);
      if (clicks >= 5) {
        clicks = 0;
        heartRain();
        toast("made with love, just for us ❤");
      }
    });
  }
})();
