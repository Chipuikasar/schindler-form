// Shared data layer for the Factsheet Generator prototype.
// Persists to localStorage so state carries across list.html / form.html / index.html.
(function (global) {
  "use strict";

  var STORAGE_KEY = "schindler-factsheet-data-v1";
  var COLORS = [
    "#DC0000",
    "#111111",
    "#A80000",
    "#4D4D4D",
    "#7A0000",
    "#000000",
  ];

  var counter = 0;
  function uid() {
    counter += 1;
    return "id" + Date.now().toString(36) + counter;
  }

  function colorFor(seed) {
    var h = 0;
    seed = seed || "x";
    for (var i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return COLORS[h % COLORS.length];
  }

  function escapeAttr(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;");
  }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function makeSection(order, type, title, html) {
    return { id: uid(), order: order, type: type, title: title, html: html };
  }

  function makeFactsheet(code, title, tagline, status, sections) {
    return {
      id: uid(),
      code: code,
      title: title,
      tagline: tagline,
      status: status,
      heroDataUrl: null,
      quicklinks: [
        {
          id: uid(),
          label: "Installation guide",
          url: "https://schindler.sharepoint.com/docs/install",
        },
        {
          id: uid(),
          label: "Warranty terms",
          url: "https://schindler.sharepoint.com/docs/warranty",
        },
      ],
      contacts: [
        {
          id: uid(),
          name: "Meera Rao",
          role: "Product Manager",
          email: "meera.rao@contoso.com",
          phone: "+91 98200 11223",
        },
      ],
      generatedPageUrl:
        status === "Published"
          ? "/sites/schindler/pages/" + code + ".aspx"
          : "",
      generatedPdfUrl:
        status === "Published" ? "/factsheets/" + code + ".pdf" : "",
      sections: sections,
    };
  }

  function seedData() {
    return [
      makeFactsheet(
        "ELV-2200",
        "Nova Traction Elevator",
        "High-rise passenger elevator, 1600kg, 2.5 m/s",
        "Published",
        [
          makeSection(
            1,
            "Overview",
            "Overview",
            "<p>The Nova Traction line is built for high-rise passenger service, balancing speed, ride comfort and energy efficiency.</p>",
          ),
          makeSection(
            2,
            "Specifications",
            "Technical specifications",
            '<p><strong>Rated capacity:</strong> 1600 kg / 21 persons — configurable to 2000 kg.</p><table><tr><td style="background:#F3F2F1;font-weight:600">Speed</td><td>1.0 – 2.5 m/s</td></tr><tr><td style="background:#F3F2F1;font-weight:600">Travel height</td><td>Up to 120 m</td></tr><tr><td style="background:#F3F2F1;font-weight:600">Drive type</td><td>Gearless traction, PM synchronous motor</td></tr></table><ul><li>Regenerative drive reduces energy use by up to 30%</li><li>Destination dispatch compatible</li></ul>',
          ),
          makeSection(
            3,
            "Key features",
            "Key features",
            "<ul><li>Regenerative drive</li><li>Destination dispatch</li><li>Smart diagnostics</li></ul>",
          ),
        ],
      ),
      makeFactsheet(
        "ELV-1800",
        "Horizon MRL Elevator",
        "Machine-room-less unit for mid-rise residential",
        "Draft",
        [
          makeSection(
            1,
            "Overview",
            "Overview",
            "<p>Compact machine-room-less elevator designed for mid-rise residential buildings.</p>",
          ),
        ],
      ),
      makeFactsheet(
        "ESC-3000",
        "Sentinel Escalator",
        "Commercial escalator, 35° incline, stainless finish",
        "Published",
        [
          makeSection(
            1,
            "Overview",
            "Overview",
            "<p>Heavy-duty commercial escalator for retail and transit environments.</p>",
          ),
          makeSection(
            2,
            "Specifications",
            "Technical specifications",
            '<table><tr><td style="background:#F3F2F1;font-weight:600">Incline</td><td>35°</td></tr><tr><td style="background:#F3F2F1;font-weight:600">Step width</td><td>600 / 800 / 1000 mm</td></tr></table>',
          ),
        ],
      ),
      makeFactsheet(
        "MWK-1100",
        "Pathway Moving Walk",
        "Autowalk for airports and transit hubs",
        "Published",
        [
          makeSection(
            1,
            "Overview",
            "Overview",
            "<p>Continuous moving walk for high-traffic transit environments.</p>",
          ),
        ],
      ),
    ];
  }

  function load() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* fall through to seed */
    }
    var seeded = seedData();
    save(seeded);
    return seeded;
  }

  function save(data) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* ignore */
    }
  }

  function reset() {
    var seeded = seedData();
    save(seeded);
    return seeded;
  }

  global.FactsheetStore = {
    uid: uid,
    colorFor: colorFor,
    escapeAttr: escapeAttr,
    escapeHtml: escapeHtml,
    makeSection: makeSection,
    makeFactsheet: makeFactsheet,
    load: load,
    save: save,
    reset: reset,
  };
})(window);
