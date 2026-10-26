/* Renders the page from SITE in content.js. You shouldn't need to edit this file. */
(function () {
  const S = window.SITE || SITE;
  const $ = (id) => document.getElementById(id);

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      node.append(c instanceof Node ? c : document.createTextNode(c));
    }
    return node;
  }

  function svgIcon(d, cls, viewBox) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", viewBox || "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", cls);
    const path = document.createElementNS(ns, "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", d);
    svg.appendChild(path);
    return svg;
  }
  const GH = "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z";
  const ARROW_L = "M10.3 2.3 4.6 8l5.7 5.7 1.4-1.4L7.4 8l4.3-4.3z";
  const ARROW_R = "M5.7 2.3 4.3 3.7 8.6 8l-4.3 4.3 1.4 1.4L11.4 8z";

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const isPhone = (p, img) => img.kind === "phone" || (!img.kind && p.imageLayout === "phone");

  /* ---------- Header ---------- */
  document.title = S.name;
  $("nav-name").textContent = S.name;
  $("name").textContent = S.name;
  $("headline").textContent = S.headline;
  $("intro").textContent = S.intro;
  if (S.availability) {
    $("availability").append(el("span", { class: "avail-dot", "aria-hidden": "true" }), S.availability);
  } else {
    $("availability").hidden = true;
  }

  function contactLinks() {
    const c = S.contact || {};
    const out = [];
    if (c.email) out.push(el("a", { class: "btn btn-primary", href: "mailto:" + c.email }, "Email me"));
    if (c.resume) out.push(el("a", { class: "btn", href: c.resume, target: "_blank", rel: "noopener" }, "Resume (PDF)"));
    if (c.linkedin) out.push(el("a", { class: "btn", href: c.linkedin, target: "_blank", rel: "noopener" }, "LinkedIn"));
    if (c.github) out.push(el("a", { class: "btn", href: c.github, target: "_blank", rel: "noopener" }, svgIcon(GH, "gh-icon"), "GitHub"));
    return out;
  }
  $("contact-row").append(...contactLinks());
  $("contact-row-footer").append(...contactLinks());
  $("footer-small").textContent = [S.contact && S.contact.email, S.location].filter(Boolean).join("  /  ");

  /* ---------- Education ---------- */
  const e = S.education;
  if (e) {
    $("education").append(
      el("div", { class: "edu-main" },
        el("h2", { class: "edu-school", text: e.school }),
        el("p", { class: "edu-degree", text: e.degree })),
      el("dl", { class: "edu-facts" },
        el("div", {}, el("dt", { text: "GPA" }), el("dd", { text: e.gpa })),
        el("div", {}, el("dt", { text: "Graduating" }), el("dd", { text: e.graduation.replace(/^Expected\s*/i, "") }))),
      e.coursework && e.coursework.length
        ? el("details", { class: "edu-courses" },
            el("summary", {}, "Relevant coursework"),
            el("ul", {}, e.coursework.map((c) => el("li", { text: c }))))
        : null
    );
  }

  /* ---------- Shared project pieces ---------- */
  function meta(p) {
    return el("div", { class: "proj-meta" },
      el("span", { class: "proj-dates", text: p.dates }),
      el("span", { class: "proj-role", text: p.role }));
  }
  function stack(p) {
    return p.stack && p.stack.length
      ? el("ul", { class: "stack", "aria-label": "Tools and technologies" }, p.stack.map((s) => el("li", { text: s })))
      : null;
  }
  function links(p) {
    const ls = (p.links || []).filter((l) => l && l.url);
    return ls.length
      ? el("div", { class: "proj-links" },
          ls.map((l) => el("a", { class: "proj-link", href: l.url, target: "_blank", rel: "noopener" },
            /github\.com/i.test(l.url) ? svgIcon(GH, "gh-icon") : null,
            el("span", {}, l.label || "Link"))))
      : null;
  }
  function imgButton(p, images, i, cls) {
    const img = images[i];
    return el("button", {
        type: "button", class: "img-open " + (cls || "") + (isPhone(p, img) ? " is-phone" : ""),
        "data-project": slug(p.title), "data-index": String(i),
        "aria-label": "View image " + (i + 1) + " of " + images.length + ": " + (img.alt || p.title) },
      el("img", { src: img.src, alt: img.alt || "", loading: "lazy", decoding: "async" }));
  }

  // lead visual + thumbnails for a featured project
  function media(p, images) {
    if (!images.length) return null;
    const lead = [];
    if (isPhone(p, images[0])) {
      // phone-first projects lead with up to three screens side by side
      for (let i = 0; i < images.length && lead.length < 3 && isPhone(p, images[i]); i++) lead.push(i);
    } else {
      lead.push(0);
    }
    const rest = images.map((_, i) => i).filter((i) => !lead.includes(i));
    const MAX_THUMBS = 6;
    const shown = rest.slice(0, MAX_THUMBS);
    const hidden = rest.length - shown.length;
    const caption = images[lead[0]].caption;

    return el("div", { class: "feat-media" },
      el("figure", { class: "lead" + (lead.length > 1 ? " lead-phones" : "") },
        el("div", { class: "lead-row" }, lead.map((i) => imgButton(p, images, i, "lead-img"))),
        caption && lead.length === 1 ? el("figcaption", { text: caption }) : null),
      shown.length
        ? el("div", { class: "thumbs", role: "list", "aria-label": "More images" },
            shown.map((i, n) => {
              const b = imgButton(p, images, i, "thumb");
              b.setAttribute("role", "listitem");
              if (n === shown.length - 1 && hidden > 0) b.append(el("span", { class: "more-count", text: "+" + hidden }));
              return b;
            }))
        : null,
      images.length > 1
        ? el("button", { type: "button", class: "view-all", "data-project": slug(p.title), "data-index": "0" },
            "View all " + images.length + " images")
        : null
    );
  }

  /* ---------- Selected work ---------- */
  const galleries = {};
  const featured = S.projects.filter((p) => p.featured);
  const others = S.projects.filter((p) => !p.featured);

  featured.forEach((p) => {
    const images = (p.images || []).filter((i) => i && i.src);
    galleries[slug(p.title)] = { project: p, images };
    const bullets = p.bullets || [];
    const top = bullets.slice(0, 3), extra = bullets.slice(3);
    const m = media(p, images);
    const bulletBlock = [
      top.length ? el("ul", { class: "feat-bullets" }, top.map((b) => el("li", { text: b }))) : null,
      extra.length
        ? el("details", { class: "proj-details" },
            el("summary", {}, el("span", { class: "open-label" }, "More detail (" + extra.length + ")"),
              el("span", { class: "close-label" }, "Less detail")),
            el("ul", { class: "feat-bullets" }, extra.map((b) => el("li", { text: b }))))
        : null,
    ];
    const intro = [
      meta(p),
      el("h3", { class: "feat-title", text: p.title }),
      p.subtitle ? el("p", { class: "proj-sub", text: p.subtitle }) : null,
      p.summary ? el("p", { class: "proj-summary", text: p.summary }) : null,
    ];

    // With images: text (incl. bullets) left, images right.
    // Without images: overview left, bullets right, so the row doesn't sit half empty.
    $("work-list").append(m
      ? el("li", { class: "feat", id: slug(p.title) },
          el("div", { class: "feat-head" }, intro),
          m,
          el("div", { class: "feat-body" }, bulletBlock, stack(p), links(p)))
      : el("li", { class: "feat no-media", id: slug(p.title) },
          el("div", { class: "feat-text" }, intro, stack(p), links(p)),
          el("div", { class: "feat-side" }, bulletBlock))
    );
  });

  /* ---------- More projects ---------- */
  if (!others.length) $("more").hidden = true;
  others.forEach((p) => {
    const images = (p.images || []).filter((i) => i && i.src);
    galleries[slug(p.title)] = { project: p, images };
    $("more-list").append(
      el("article", { class: "card", id: slug(p.title) },
        meta(p),
        el("h3", { class: "card-title", text: p.title }),
        p.summary ? el("p", { class: "card-summary", text: p.summary }) : null,
        images.length
          ? el("div", { class: "card-thumbs" }, images.slice(0, 4).map((_, i) => imgButton(p, images, i, "thumb")))
          : null,
        p.bullets && p.bullets.length
          ? el("details", { class: "proj-details" },
              el("summary", {}, el("span", { class: "open-label" }, "What I did"), el("span", { class: "close-label" }, "Hide details")),
              el("ul", {}, p.bullets.map((b) => el("li", { text: b }))))
          : null,
        stack(p),
        links(p))
    );
  });

  /* ---------- Image viewer (pages through one project's images) ---------- */
  const vImg = el("img", { class: "viewer-img", alt: "" });
  const vCap = el("p", { class: "viewer-cap" });
  const vCount = el("p", { class: "viewer-count" });
  const vTitle = el("p", { class: "viewer-title" });
  const prev = el("button", { type: "button", class: "viewer-nav prev", "aria-label": "Previous image" }, svgIcon(ARROW_L, "nav-icon"));
  const next = el("button", { type: "button", class: "viewer-nav next", "aria-label": "Next image" }, svgIcon(ARROW_R, "nav-icon"));
  const close = el("button", { type: "button", class: "viewer-close" }, "Close");
  const viewer = el("dialog", { class: "viewer", "aria-label": "Image viewer" },
    el("div", { class: "viewer-top" }, el("div", {}, vTitle, vCount), close),
    el("div", { class: "viewer-stage" }, prev, el("figure", { class: "viewer-fig" }, vImg, vCap), next));
  document.body.append(viewer);

  let current = null, idx = 0;
  function show(i) {
    const n = current.images.length;
    idx = (i + n) % n;
    const img = current.images[idx];
    vImg.src = img.src;
    vImg.alt = img.alt || "";
    vImg.classList.toggle("is-phone", isPhone(current.project, img));
    vCap.textContent = img.caption || "";
    vCap.hidden = !img.caption;
    vTitle.textContent = current.project.title;
    vCount.textContent = n > 1 ? (idx + 1) + " / " + n : "";
    prev.hidden = next.hidden = n < 2;
  }
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".img-open, .view-all");
    if (!btn) return;
    current = galleries[btn.dataset.project];
    if (!current || !current.images.length) return;
    show(Number(btn.dataset.index) || 0);
    if (typeof viewer.showModal === "function") viewer.showModal();
    else window.open(current.images[idx].src, "_blank", "noopener");
  });
  prev.addEventListener("click", () => show(idx - 1));
  next.addEventListener("click", () => show(idx + 1));
  close.addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (ev) => {
    if (ev.target === viewer || ev.target.classList.contains("viewer-stage")) viewer.close();
  });
  viewer.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowLeft") { ev.preventDefault(); show(idx - 1); }
    if (ev.key === "ArrowRight") { ev.preventDefault(); show(idx + 1); }
  });
  // swipe on touch screens
  let tx = null;
  viewer.addEventListener("touchstart", (ev) => { tx = ev.touches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", (ev) => {
    if (tx === null) return;
    const dx = ev.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    tx = null;
  });

  /* ---------- Experience ---------- */
  (S.experience || []).forEach((x) => {
    $("experience-list").append(
      el("article", { class: "exp" },
        el("div", { class: "proj-meta" }, el("span", { class: "proj-dates", text: x.dates })),
        el("h3", { class: "exp-title", text: x.title }),
        el("p", { class: "exp-role", text: x.role }),
        el("ul", {}, (x.bullets || []).map((b) => el("li", { text: b })))));
  });

  /* ---------- Skills ---------- */
  (S.skills || []).forEach((g) => {
    $("skill-list").append(
      el("div", { class: "skill-group" },
        el("dt", { text: g.group }),
        el("dd", {}, el("ul", {}, g.items.map((i) => el("li", { text: i }))))));
  });
})();
