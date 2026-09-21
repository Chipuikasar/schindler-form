(function () {
  "use strict";
  if (window.top === window.self) {
    return;
  }

  var SOURCE = "schindler-form-resize";
  var lastHeight = 0;

  function postHeight() {
    var height = document.documentElement.scrollHeight;
    if (height === lastHeight) {
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
