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

  function postHeight(reason) {
    var height = measureHeight();
    window.parent.postMessage(
      {
        source: SOURCE,
        height: height,
        reason: reason,
        cardCount: document.querySelectorAll("#card-grid > *").length,
        readyState: document.readyState,
      },
      "*"
    );
    if (height === lastHeight || height <= 0) {
      return;
    }
    lastHeight = height;
  }

  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      postHeight("resize-observer");
    }).observe(document.documentElement);
  }

  new MutationObserver(function () {
    postHeight("mutation-observer");
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  window.addEventListener("load", function () {
    postHeight("load");
  });
  window.addEventListener("resize", function () {
    postHeight("window-resize");
  });
  postHeight("initial");
})();
