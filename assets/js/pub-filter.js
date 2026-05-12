(function () {
  'use strict';

  function initPubFilter(container) {
    var filterBar = container.querySelector('.pub-filter-bar');
    if (!filterBar) return;

    var btns = filterBar.querySelectorAll('.pub-filter-btn');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.dataset.filter;

        btns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        var items = container.querySelectorAll('ol.bibliography li');

        if (filter === 'all') {
          items.forEach(function (li) {
            li.classList.remove('pub-dimmed', 'pub-highlighted');
          });
          container.querySelectorAll('h2.bibliography').forEach(function (h2) {
            h2.classList.remove('year-all-dimmed');
          });
        } else {
          items.forEach(function (li) {
            var row = li.querySelector('[data-category]');
            var cat = row ? row.dataset.category : '';
            if (cat === filter) {
              li.classList.remove('pub-dimmed');
              li.classList.add('pub-highlighted');
            } else {
              li.classList.remove('pub-highlighted');
              li.classList.add('pub-dimmed');
            }
          });

          // Dim year headers when all papers in that year are filtered out
          container.querySelectorAll('ol.bibliography').forEach(function (ol) {
            var lis = ol.querySelectorAll('li');
            var allDimmed = Array.from(lis).every(function (li) {
              return li.classList.contains('pub-dimmed');
            });
            var prev = ol.previousElementSibling;
            while (prev && prev.tagName !== 'H2') {
              prev = prev.previousElementSibling;
            }
            if (prev && prev.classList.contains('bibliography')) {
              prev.classList.toggle('year-all-dimmed', allDimmed);
            }
          });
        }
      });
    });
  }

  function init() {
    document.querySelectorAll('.publications').forEach(function (container) {
      initPubFilter(container);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
