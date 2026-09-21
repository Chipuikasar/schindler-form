(function () {
  "use strict";
  if (window.top === window.self) {
    return;
  }

  var SOURCE = "schindler-form-resize";
  var lastHeight = 0;

  function measureHeight() {
    // document.documentElement.scrollHeight is floored at the iframe's own
    // viewport height, so it can't report a height smaller than the box the
    // parent already gave it, and it under-reports true content height on
    // first paint. Measuring the app's root content element gives its real,
    // intrinsic height instead.
    var root = document.querySelector(".app-shell") || document.body;
    return Math.ceil(root.getBoundingClientRect().height);
  }

  function postHeight() {
    var height = measureHeight();
    if (height === lastHeight || height <= 0) {
      return;
    }
    lastHeight = height;
    window.parent.postMessage({ source: SOURCE, height: height }, "*");
  }

  if (window.ResizeObserver) {
    new ResizeObserver(postHeight).observe(document.documentElement);
  }

  new MutationObserver(postHeight).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  window.addEventListener("load", postHeight);
  window.addEventListener("resize", postHeight);
  postHeight();
})();
