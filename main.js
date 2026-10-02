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
      images.length
        ? el("div", { class: "proj-images" + (images.length === 1 ? " one" : "") },
            images.map((img) =>
              el("figure", {},
                el("img", { src: img.src, alt: img.alt || "", loading: "lazy" }),
                img.caption ? el("figcaption", { text: img.caption }) : null)))
        : null,
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
            links.map((l) => el("a", { href: l.url, target: "_blank", rel: "noopener" }, l.label || "Link")))
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

  /* ---------- Skills ---------- */
  (S.skills || []).forEach((g) => {
    $("skill-list").append(
      el("div", { class: "skill-group" },
        el("dt", { text: g.group }),
        el("dd", {}, el("ul", {}, g.items.map((i) => el("li", { text: i })))))
    );
  });
})();
