/* =========================================================
   NLP Knowledge Artifact Repository — shared site behaviour
   Vanilla JS, no dependencies, no build step (GitHub Pages
   serves everything as-is).
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  function initNav() {
    var btn = document.getElementById("navToggle");
    var nav = document.getElementById("siteNav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Scroll progress bar ---------- */
  function initProgressBar() {
    var bar = document.getElementById("progressBar");
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + "%";
    }
    document.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Copy buttons on example boxes ---------- */
  function initCopyButtons() {
    var boxes = document.querySelectorAll(".example-box");
    boxes.forEach(function (box) {
      var btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy example text");
      btn.addEventListener("click", function () {
        var text = box.textContent.replace(/Copy$/, "").trim();
        var done = function () {
          btn.textContent = "Copied";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          done();
        }
      });
      box.appendChild(btn);
    });
  }

  /* ---------- Concept card search + category filter ---------- */
  function initConceptFilter() {
    var toolbar = document.getElementById("cardToolbar");
    if (!toolbar) return;
    var search = document.getElementById("cardSearch");
    var chips = toolbar.querySelectorAll(".chip");
    var countEl = document.getElementById("cardCount");
    var noResults = document.getElementById("noResults");
    var expandBtn = document.getElementById("expandAll");
    var collapseBtn = document.getElementById("collapseAll");

    var catLabels = Array.prototype.slice.call(document.querySelectorAll(".cat-label"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("details.card"));

    // Map each card to its preceding category label
    var catOf = new Map();
    catLabels.forEach(function (label) {
      var el = label.nextElementSibling;
      while (el && !el.classList.contains("cat-label")) {
        if (el.matches("details.card")) catOf.set(el, label.dataset.cat || label.textContent);
        el = el.nextElementSibling;
      }
    });

    var activeCat = "all";

    function apply() {
      var q = (search.value || "").trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var inCat = activeCat === "all" || catOf.get(card) === activeCat;
        var matches = inCat && (q === "" || text.indexOf(q) !== -1);
        card.style.display = matches ? "" : "none";
        if (matches) visible++;
      });
      catLabels.forEach(function (label) {
        var anyVisible = false;
        var el = label.nextElementSibling;
        while (el && !el.classList.contains("cat-label")) {
          if (el.matches("details.card") && el.style.display !== "none") anyVisible = true;
          el = el.nextElementSibling;
        }
        label.style.display = anyVisible ? "" : "none";
      });
      countEl.textContent = "Showing " + visible + " of " + cards.length;
      noResults.classList.toggle("show", visible === 0);
    }

    search.addEventListener("input", apply);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        activeCat = chip.dataset.cat;
        apply();
      });
    });
    if (expandBtn) expandBtn.addEventListener("click", function () {
      cards.forEach(function (c) { c.open = true; });
    });
    if (collapseBtn) collapseBtn.addEventListener("click", function () {
      cards.forEach(function (c) { c.open = false; });
    });

    apply();
  }

  /* ---------- Flashcard study mode ---------- */
  function initFlashcards() {
    var trigger = document.getElementById("flashcardTrigger");
    var overlay = document.getElementById("flashOverlay");
    if (!trigger || !overlay) return;

    var cards = Array.prototype.slice.call(document.querySelectorAll("details.card"));
    var catLabels = Array.prototype.slice.call(document.querySelectorAll(".cat-label"));
    var catOf = new Map();
    catLabels.forEach(function (label) {
      var el = label.nextElementSibling;
      while (el && !el.classList.contains("cat-label")) {
        if (el.matches("details.card")) catOf.set(el, label.textContent);
        el = el.nextElementSibling;
      }
    });

    var deck = cards.map(function (card) {
      var tag = card.querySelector(".tag") ? card.querySelector(".tag").textContent.trim() : "";
      var summaryClone = card.querySelector("summary").cloneNode(true);
      var tagEl = summaryClone.querySelector(".tag");
      if (tagEl) tagEl.remove();
      var term = summaryClone.textContent.trim();
      var fields = card.querySelectorAll(".field");
      var picked = [];
      fields.forEach(function (f) {
        var label = f.querySelector(".label") ? f.querySelector(".label").textContent.trim() : "";
        if (label === "Definition" || label === "Working Principle" || label === "Example") {
          var clone = f.cloneNode(true);
          var l = clone.querySelector(".label");
          if (l) l.remove();
          picked.push({ label: label, value: clone.textContent.trim() });
        }
      });
      return { tag: tag, term: term, cat: catOf.get(card) || "", fields: picked };
    });

    var order = deck.map(function (_, i) { return i; });
    var pos = 0;
    var revealed = false;

    var elCat = overlay.querySelector(".flash-meta .cat");
    var elPos = overlay.querySelector(".flash-meta .pos");
    var elCardFace = overlay.querySelector(".flash-card");
    var btnPrev = overlay.querySelector(".flash-prev");
    var btnNext = overlay.querySelector(".flash-next");
    var btnShuffle = overlay.querySelector(".flash-shuffle");
    var btnClose = overlay.querySelector(".flash-close");

    function render() {
      var item = deck[order[pos]];
      elCat.textContent = item.cat;
      elPos.textContent = (pos + 1) + " / " + order.length;
      btnPrev.disabled = pos === 0;
      btnNext.disabled = pos === order.length - 1;

      if (!revealed) {
        elCardFace.innerHTML =
          '<span class="flash-tag">' + item.tag + "</span>" +
          '<div class="flash-term">' + item.term + "</div>" +
          '<div class="flash-hint">Click card, or press Space, to reveal the answer</div>';
      } else {
        var html = '<div class="flash-back"><span class="flash-tag">' + item.tag + '</span><div class="flash-term" style="margin-bottom:14px;">' + item.term + "</div>";
        item.fields.forEach(function (f) {
          html += '<div class="field"><span class="label">' + f.label + "</span>" + f.value + "</div>";
        });
        html += '<div class="flash-hint">Click card, or press Space, to flip back</div></div>';
        elCardFace.innerHTML = html;
      }
    }

    function goto(newPos) {
      pos = Math.max(0, Math.min(order.length - 1, newPos));
      revealed = false;
      render();
    }

    function shuffle() {
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = order[i]; order[i] = order[j]; order[j] = t;
      }
      goto(0);
    }

    function open() {
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      goto(0);
      btnClose.focus();
    }
    function close() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      trigger.focus();
    }

    trigger.addEventListener("click", open);
    btnClose.addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    elCardFace.addEventListener("click", function () { revealed = !revealed; render(); });
    btnPrev.addEventListener("click", function () { goto(pos - 1); });
    btnNext.addEventListener("click", function () { goto(pos + 1); });
    btnShuffle.addEventListener("click", shuffle);

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") goto(pos + 1);
      else if (e.key === "ArrowLeft") goto(pos - 1);
      else if (e.key === " ") { e.preventDefault(); revealed = !revealed; render(); }
    });
  }

  /* ---------- Homepage interactive tokenizer demo ---------- */
  function initTokenizerDemo() {
    var input = document.getElementById("demoInput");
    if (!input) return;
    var vocab = ["nlp", "language", "text", "model", "data", "word", "token", "vector", "hard", "fun"];
    var outTokens = document.getElementById("demoTokens");
    var outLower = document.getElementById("demoLower");
    var outVector = document.getElementById("demoVector");

    function run() {
      var raw = input.value || "";
      var tokens = raw.match(/[A-Za-z0-9']+|[.,!?;:]/g) || [];
      outTokens.innerHTML = tokens.length
        ? tokens.map(function (t) { return "<span>" + escapeHtml(t) + "</span>"; }).join("")
        : '<span style="color:var(--ink-soft);">(type something above)</span>';

      var lower = tokens.map(function (t) { return t.toLowerCase(); });
      outLower.innerHTML = lower.length
        ? lower.map(function (t) { return "<span>" + escapeHtml(t) + "</span>"; }).join("")
        : "";

      var lowerSet = new Set(lower);
      outVector.innerHTML = vocab.map(function (w) {
        var hit = lowerSet.has(w);
        return '<span class="' + (hit ? "hit" : "miss") + '">' + w + ": " + (hit ? 1 : 0) + "</span>";
      }).join("");
    }

    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    input.addEventListener("input", run);
    run();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initProgressBar();
    initCopyButtons();
    initConceptFilter();
    initFlashcards();
    initTokenizerDemo();
  });
})();
