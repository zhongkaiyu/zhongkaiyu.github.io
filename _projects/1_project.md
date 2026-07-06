---
layout: page
title: Us
description: The places we love, made better because we were there together.
img: assets/img/moment_us_bg.png
importance: 1
category: Fun
related_publications: false
---

<div class="moments-page" markdown="0">

<p class="moments-intro">Every trip is a little better with you in it. Here are some of our favorite moments, gathered place by place <span class="heart">&#10084;</span> tap any photo to look closer.</p>

{% include moments_gallery.liquid %}

<p class="moments-outro"><span class="heart">&#10084;</span>&nbsp; to be continued</p>

</div>

<script>
  (function () {
    var rows = document.querySelectorAll(".moments-page .j-row");
    if (!rows.length || !("IntersectionObserver" in window)) return;
    rows.forEach(function (r) { r.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    rows.forEach(function (r) { io.observe(r); });
  })();
</script>

<script src="{{ '/assets/js/moments-magic.js' | relative_url }}" defer></script>
