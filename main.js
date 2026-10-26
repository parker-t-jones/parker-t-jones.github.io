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
      if (c == null) continue;
      node.append(c instanceof Node ? c : document.createTextNode(c));
    }
    return node;
  }

  function githubIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "gh-icon");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z");
    svg.appendChild(path);
    return svg;
  }

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  /* ---------- Header ---------- */
  document.title = S.name;
  $("nav-name").textContent = S.name;
  $("name").textContent = S.name;
  $("headline").textContent = S.headline;
  $("intro").textContent = S.intro;

  function contactLinks() {
    const c = S.contact || {};
    const out = [];
    if (c.email) out.push(el("a", { class: "btn btn-primary", href: "mailto:" + c.email }, "Email me"));
    if (c.resume) out.push(el("a", { class: "btn", href: c.resume, target: "_blank", rel: "noopener" }, "Resume (PDF)"));
    if (c.linkedin) out.push(el("a", { class: "btn", href: c.linkedin, target: "_blank", rel: "noopener" }, "LinkedIn"));
    if (c.github) out.push(el("a", { class: "btn", href: c.github, target: "_blank", rel: "noopener" }, "GitHub"));
    return out;
  }
  $("contact-row").append(...contactLinks());
  $("contact-row-footer").append(...contactLinks());
  $("footer-small").textContent =
    [S.contact && S.contact.email, S.location].filter(Boolean).join("  /  ");

  /* ---------- Education ---------- */
  const e = S.education;
  if (e) {
    $("education").append(
      el("div", { class: "edu-main" },
        el("h2", { class: "edu-school", text: e.school }),
        el("p", { class: "edu-degree", text: e.degree })
      ),
      el("dl", { class: "edu-facts" },
        el("div", {}, el("dt", { text: "GPA" }), el("dd", { text: e.gpa })),
        el("div", {}, el("dt", { text: "Graduating" }), el("dd", { text: e.graduation.replace(/^Expected\s*/i, "") }))
      ),
      e.coursework && e.coursework.length
        ? el("details", { class: "edu-courses" },
            el("summary", {}, "Relevant coursework"),
            el("ul", {}, e.coursework.map((c) => el("li", { text: c }))))
        : null
    );
  }

  /* ---------- Image galleries ----------
     Each image can set kind: "phone" (tall screenshot, shown uncropped in a row).
     Everything else is "wide" (photos, desktop screenshots). A project with both
     gets a wide group first, then a phone row. Older content that sets
     imageLayout: "phone" on the project treats all its images as phone shots. */
  function figure(img, title) {
    return el("figure", {},
      el("button", { type: "button", class: "img-open", "data-full": img.src,
                     "data-caption": img.caption || img.alt || "",
                     "aria-label": "View larger: " + (img.alt || title) },
        el("img", { src: img.src, alt: img.alt || "", loading: "lazy", decoding: "async" })),
      img.caption ? el("figcaption", { text: img.caption }) : null);
  }
  function gallery(p, images) {
    if (!images.length) return [];
    const isPhone = (img) => img.kind === "phone" || (!img.kind && p.imageLayout === "phone");
    const wide = images.filter((i) => !isPhone(i));
    const phone = images.filter(isPhone);
    const out = [];
    if (wide.length) out.push(el("div", { class: "proj-images wide" + (wide.length === 1 ? " one" : "") },
      wide.map((i) => figure(i, p.title))));
    if (phone.length) out.push(el("div", { class: "proj-images phone" }, phone.map((i) => figure(i, p.title))));
    return out;
  }

  /* ---------- Projects ---------- */
  const list = $("project-list");
  const cards = [];

  S.projects.forEach((p) => {
    const tags = p.tags || [];
    const images = (p.images || []).filter((i) => i && i.src);
    const links = (p.links || []).filter((l) => l && l.url);

    const li = el("li", { class: "proj", id: slug(p.title), "data-tags": tags.join("|") },
      el("div", { class: "proj-meta" },
        el("span", { class: "proj-dates", text: p.dates }),
        el("span", { class: "proj-role", text: p.role })
      ),
      el("h3", { class: "proj-title", text: p.title }),
      p.subtitle ? el("p", { class: "proj-sub", text: p.subtitle }) : null,
      p.summary ? el("p", { class: "proj-summary", text: p.summary }) : null,
      ...gallery(p, images),
      p.bullets && p.bullets.length
        ? el("details", { class: "proj-details" },
            el("summary", {}, el("span", { class: "open-label" }, "What I did"), el("span", { class: "close-label" }, "Hide details")),
            el("ul", {}, p.bullets.map((b) => el("li", { text: b }))))
        : null,
      p.stack && p.stack.length
        ? el("ul", { class: "stack", "aria-label": "Tools and technologies" }, p.stack.map((s) => el("li", { text: s })))
        : null,
      links.length
        ? el("div", { class: "proj-links" },
            links.map((l) => el("a", { class: "proj-link", href: l.url, target: "_blank", rel: "noopener" },
              /github\.com/i.test(l.url) ? githubIcon() : null,
              el("span", {}, l.label || "Link"))))
        : null
    );
    cards.push(li);
    list.append(li);
  });

  /* ---------- Filters ---------- */
  const filterWrap = $("filters");
  const used = new Set(S.projects.flatMap((p) => p.tags || []));
  const filterNames = ["All", ...(S.filters || [...used]).filter((f) => used.has(f))];
  let active = "All";

  function applyFilter(name) {
    active = name;
    let shown = 0;
    cards.forEach((c) => {
      const match = name === "All" || c.dataset.tags.split("|").includes(name);
      c.hidden = !match;
      if (match) shown++;
    });
    $("empty").hidden = shown > 0;
    filterWrap.querySelectorAll("button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.filter === name)));
  }

  filterNames.forEach((f) => {
    const count = f === "All" ? S.projects.length : S.projects.filter((p) => (p.tags || []).includes(f)).length;
    const b = el("button", { type: "button", "data-filter": f, "aria-pressed": String(f === active) },
      f, el("span", { class: "count", text: String(count) }));
    b.addEventListener("click", () => applyFilter(f));
    filterWrap.append(b);
  });

  /* ---------- Experience ---------- */
  (S.experience || []).forEach((x) => {
    $("experience-list").append(
      el("article", { class: "exp" },
        el("div", { class: "proj-meta" }, el("span", { class: "proj-dates", text: x.dates })),
        el("h3", { class: "exp-title", text: x.title }),
        el("p", { class: "exp-role", text: x.role }),
        el("ul", {}, (x.bullets || []).map((b) => el("li", { text: b })))
      )
    );
  });

  /* ---------- Image viewer ---------- */
  const viewer = el("dialog", { class: "viewer", "aria-label": "Image viewer" },
    el("figure", { class: "viewer-fig" },
      el("img", { class: "viewer-img", alt: "" }),
      el("figcaption", { class: "viewer-cap" })),
    el("button", { type: "button", class: "viewer-close", "aria-label": "Close" }, "Close"));
  document.body.append(viewer);
  const vImg = viewer.querySelector(".viewer-img");
  const vCap = viewer.querySelector(".viewer-cap");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".img-open");
    if (!btn) return;
    const thumb = btn.querySelector("img");
    vImg.src = btn.dataset.full;
    vImg.alt = thumb ? thumb.alt : "";
    vCap.textContent = btn.dataset.caption || "";
    vCap.hidden = !btn.dataset.caption;
    if (typeof viewer.showModal === "function") viewer.showModal();
    else window.open(btn.dataset.full, "_blank", "noopener");
  });
  viewer.querySelector(".viewer-close").addEventListener("click", () => viewer.close());
  // click on the dark backdrop (outside the image) closes it
  viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });

  /* ---------- Skills ---------- */
  (S.skills || []).forEach((g) => {
    $("skill-list").append(
      el("div", { class: "skill-group" },
        el("dt", { text: g.group }),
        el("dd", {}, el("ul", {}, g.items.map((i) => el("li", { text: i })))))
    );
  });
})();
