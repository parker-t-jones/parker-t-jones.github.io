/* Renders the page from SITE in content.js. You shouldn't need to edit this file. */
(function () {
  const S = window.SITE || SITE;
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  function svgIcon(d, cls) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", cls);
    const path = document.createElementNS(ns, "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", d);
    svg.appendChild(path);
    return svg;
  }
  const ARROW_L = "M10.3 2.3 4.6 8l5.7 5.7 1.4-1.4L7.4 8l4.3-4.3z";
  const ARROW_R = "M5.7 2.3 4.3 3.7 8.6 8l-4.3 4.3 1.4 1.4L11.4 8z";

  const slug = (s) => s.toLowerCase().replace(/[“”"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const alias = (p) => p.cmd || slug(p.title).split("-").slice(0, 2).join("-");
  const isPhone = (p, img) => img.kind === "phone" || (!img.kind && p.imageLayout === "phone");
  const host = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  /* ---------- Header ---------- */
  const first = S.name.split(" ")[0].toLowerCase();
  document.title = S.name;
  $("nav-user").textContent = first;
  $("name-text").textContent = S.name;
  if (S.photo && S.photo.src) {
    $("avatar-img").src = S.photo.src;
    $("avatar-img").alt = S.photo.alt || S.name;
    $("avatar-name").textContent = S.photo.src.split("/").pop();
    $("avatar").hidden = false;
  }
  $("headline").textContent = S.headline;
  $("intro").textContent = S.intro;
  if (S.availability) {
    $("availability").append(el("span", { class: "tag-ok", "aria-hidden": "true" }, "[ OPEN ]"), " ", S.availability);
  } else {
    $("availability").hidden = true;
  }

  function contactLinks() {
    const c = S.contact || {};
    const out = [];
    if (c.email) out.push(el("a", { class: "btn btn-primary", href: "mailto:" + c.email }, "email me"));
    if (c.resume) out.push(el("a", { class: "btn", href: c.resume, target: "_blank", rel: "noopener" }, "resume.pdf"));
    if (c.linkedin) out.push(el("a", { class: "btn", href: c.linkedin, target: "_blank", rel: "noopener" }, "linkedin"));
    if (c.github) out.push(el("a", { class: "btn", href: c.github, target: "_blank", rel: "noopener" }, "github"));
    return out;
  }
  $("contact-row").append(...contactLinks());
  $("contact-row-footer").append(...contactLinks());
  $("footer-small").textContent = "# " + [S.contact && S.contact.email, S.location].filter(Boolean).join("  ·  ");

  /* ---------- Education ---------- */
  const e = S.education;
  if (e) {
    const rows = [
      ["school", e.school],
      ["degree", e.degree],
      ["gpa", e.gpa, "hl"],
      ["graduating", e.graduation.replace(/^Expected\s*/i, "")],
      ["coursework", (e.coursework || []).join(", ")],
    ];
    rows.forEach(([k, v, cls]) => {
      if (!v) return;
      $("edu-list").append(el("div", { class: "kv-row" }, el("dt", { text: k }), el("dd", { class: cls || null, text: v })));
    });
  }

  /* ---------- Shared bits ---------- */
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
            el("span", { class: "link-label" }, l.label || "link"),
            el("span", { class: "link-host" }, host(l.url)))))
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
  function media(p, images) {
    if (!images.length) return null;
    const lead = [];
    if (isPhone(p, images[0])) {
      for (let i = 0; i < images.length && lead.length < 3 && isPhone(p, images[i]); i++) lead.push(i);
    } else lead.push(0);
    const rest = images.map((_, i) => i).filter((i) => !lead.includes(i));
    const shown = rest.slice(0, 6), hidden = rest.length - shown.length;
    const cap = images[lead[0]].caption;
    return el("div", { class: "feat-media" },
      el("figure", { class: "lead" + (lead.length > 1 ? " lead-phones" : "") },
        el("div", { class: "lead-row" }, lead.map((i) => imgButton(p, images, i, "lead-img"))),
        cap && lead.length === 1 ? el("figcaption", {}, el("span", { class: "dim" }, "// "), cap) : null),
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
            "view all " + images.length + " images →")
        : null);
  }

  /* ---------- Selected work: one pane per project ---------- */
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
      top.length ? el("ul", { class: "bullets" }, top.map((b) => el("li", { text: b }))) : null,
      extra.length
        ? el("details", { class: "more-detail" },
            el("summary", {}, el("span", { class: "open-label" }, "+ " + extra.length + " more"),
              el("span", { class: "close-label" }, "− less")),
            el("ul", { class: "bullets" }, extra.map((b) => el("li", { text: b }))))
        : null,
    ];
    const head = [
      el("p", { class: "role" }, el("span", { class: "dim" }, "role: "), p.role),
      el("h3", { class: "feat-title", text: p.title }),
      p.subtitle ? el("p", { class: "sub", text: p.subtitle }) : null,
      p.summary ? el("p", { class: "summary", text: p.summary }) : null,
    ];
    const pane = el("article", { class: "pane feat" + (m ? "" : " no-media"), id: slug(p.title) },
      el("div", { class: "pane-bar" },
        el("span", {}, "~/projects/", el("b", { text: alias(p) })),
        el("span", { class: "dim", text: p.dates })),
      m
        ? el("div", { class: "pane-body" },
            el("div", { class: "feat-head" }, head), m,
            el("div", { class: "feat-body" }, bulletBlock, stack(p), links(p)))
        : el("div", { class: "pane-body" },
            el("div", { class: "feat-head" }, head, stack(p), links(p)),
            el("div", { class: "feat-side" }, bulletBlock)));
    $("work-list").append(pane);
  });

  /* ---------- More projects: an `ls -l` listing that expands ---------- */
  if (!others.length) $("more").hidden = true;
  others.forEach((p) => {
    const images = (p.images || []).filter((i) => i && i.src);
    galleries[slug(p.title)] = { project: p, images };
    $("more-list").append(
      el("details", { class: "ls-row", id: slug(p.title) },
        el("summary", {},
          el("span", { class: "ls-perm", "aria-hidden": "true", text: "drwxr-xr-x" }),
          el("span", { class: "ls-date", text: p.dates }),
          el("span", { class: "ls-name" }, el("b", { text: alias(p) + "/" })),
          el("span", { class: "ls-desc" }, el("span", { class: "ls-title", text: p.title }), " ", el("span", { class: "dim", text: "— " + (p.summary || "") }))),
        el("div", { class: "ls-body" },
          el("p", { class: "role" }, el("span", { class: "dim" }, "role: "), p.role),
          images.length ? el("div", { class: "card-thumbs" }, images.slice(0, 4).map((_, i) => imgButton(p, images, i, "thumb"))) : null,
          p.bullets && p.bullets.length ? el("ul", { class: "bullets" }, p.bullets.map((b) => el("li", { text: b }))) : null,
          stack(p), links(p))));
  });

  /* ---------- Experience log ---------- */
  (S.experience || []).forEach((x) => {
    $("experience-list").append(
      el("article", { class: "log-entry" },
        el("p", { class: "log-head" },
          el("span", { class: "log-time", text: "[" + x.dates + "]" }), " ",
          el("span", { class: "log-lvl", text: "INFO" }), " "),
        el("h3", { class: "log-title" }, x.title, el("span", { class: "dim", text: " · " + x.role })),
        el("ul", { class: "bullets" }, (x.bullets || []).map((b) => el("li", { text: b })))));
  });

  /* ---------- Skills as YAML ---------- */
  (S.skills || []).forEach((g) => {
    $("skill-list").append(
      el("div", { class: "yaml-row" },
        el("dt", {}, slug(g.group).replace(/-/g, "_"), el("span", { class: "dim", text: ":" })),
        el("dd", {}, el("ul", {}, g.items.map((i) => el("li", { text: i }))))));
  });

  /* ---------- Image viewer ---------- */
  const vImg = el("img", { class: "viewer-img", alt: "" });
  const vCap = el("p", { class: "viewer-cap" });
  const vCount = el("span", { class: "dim" });
  const vTitle = el("span", {});
  const prev = el("button", { type: "button", class: "viewer-nav", "aria-label": "Previous image" }, svgIcon(ARROW_L, "nav-icon"));
  const next = el("button", { type: "button", class: "viewer-nav", "aria-label": "Next image" }, svgIcon(ARROW_R, "nav-icon"));
  const close = el("button", { type: "button", class: "viewer-close" }, "close [esc]");
  const viewer = el("dialog", { class: "viewer", "aria-label": "Image viewer" },
    el("div", { class: "viewer-top" }, el("p", { class: "viewer-title" }, vTitle, "  ", vCount), close),
    el("div", { class: "viewer-stage" }, prev, el("figure", { class: "viewer-fig" }, vImg, vCap), next));
  document.body.append(viewer);
  let current = null, idx = 0;
  function show(i) {
    const n = current.images.length;
    idx = (i + n) % n;
    const img = current.images[idx];
    vImg.src = img.src; vImg.alt = img.alt || "";
    vImg.classList.toggle("is-phone", isPhone(current.project, img));
    vCap.textContent = img.caption || ""; vCap.hidden = !img.caption;
    vTitle.textContent = "~/projects/" + alias(current.project);
    vCount.textContent = n > 1 ? "[" + (idx + 1) + "/" + n + "]" : "";
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
  let tx = null;
  viewer.addEventListener("touchstart", (ev) => { tx = ev.touches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", (ev) => {
    if (tx === null) return;
    const dx = ev.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    tx = null;
  });

  /* ---------- Boot log ---------- */
  const t = (n) => "[" + n.toFixed(3) + "]";
  const bootLines = [
    [t(0.000), "booting " + first + "-os ", el("span", { class: "dim" }, "(duke ece+cs)")],
    [t(0.114), "i2c0: VL53L8CX time-of-flight array ", el("span", { class: "ok" }, "ok")],
    [t(0.208), "ble0: nRF52840 haptic link ", el("span", { class: "ok" }, "ok")],
    [t(0.296), "mounting ~/projects (" + S.projects.length + " entries) ", el("span", { class: "ok" }, "ok")],
    [t(0.371), "gpa=" + S.education.gpa + "  grad=" + S.education.graduation.replace(/^Expected\s*/i, "").toLowerCase()],
    [t(0.430), "ready. type ", el("kbd", {}, "help"), " or tap a command below"],
  ];
  bootLines.forEach((parts, i) =>
    $("boot").append(el("li", { style: "--i:" + i }, el("span", { class: "dim" }, parts[0] + " "), parts.slice(1))));

  /* ---------- Shell ---------- */
  const out = $("console-out");
  const input = $("prompt");
  const body = $("console-body");
  const all = S.projects;
  const history = [];
  let hpos = 0;

  function print(...lines) {
    lines.forEach((l) => out.append(el("div", { class: "out-line" }, l)));
    body.scrollTop = body.scrollHeight;
  }
  function echo(cmd) { print(el("span", {}, el("span", { class: "ps1" }, "parker@duke:~$ "), cmd)); }
  function go(target, after) {
    const node = typeof target === "string" ? document.getElementById(target) : target;
    if (!node) return;
    if (node.tagName === "DETAILS") node.open = true;
    node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    node.classList.remove("flash"); void node.offsetWidth; node.classList.add("flash");
    if (after) after();
  }
  function findProject(q) {
    q = slug(q || "");
    if (!q) return null;
    return all.find((p) => alias(p) === q) || all.find((p) => alias(p).startsWith(q)) || all.find((p) => slug(p.title).includes(q));
  }
  const c = S.contact || {};
  const featuredP = all.filter((p) => p.featured);
  const otherP = all.filter((p) => !p.featured);

  /* --- a tiny read-only file system for the commands shown on the page --- */
  const pad = (t, n) => (t + ":").padEnd(n, " ");
  function jumpLink(id, label) {
    const a = el("a", { href: "#" + id, class: "ls-link", text: label || "↳ jump to section" });
    a.addEventListener("click", (ev) => { ev.preventDefault(); go(id); });
    return a;
  }
  function runLink(cmd, label, cls) {
    const a = el("a", { href: "#", class: cls || "ls-link", text: label });
    a.addEventListener("click", (ev) => { ev.preventDefault(); run(cmd); input.focus({ preventScroll: true }); });
    return a;
  }
  function catEducation() {
    const e = S.education || {};
    print(
      el("span", {}, el("span", { class: "dim", text: pad("school", 12) }), e.school || ""),
      el("span", {}, el("span", { class: "dim", text: pad("degree", 12) }), e.degree || ""),
      el("span", {}, el("span", { class: "dim", text: pad("gpa", 12) }), el("b", { class: "ok", text: e.gpa || "" })),
      el("span", {}, el("span", { class: "dim", text: pad("graduating", 12) }), (e.graduation || "").replace(/^Expected\s*/i, "")),
      el("span", {}, el("span", { class: "dim", text: pad("coursework", 12) }), (e.coursework || []).join(", ")),
      jumpLink("education"));
  }
  function catSkills() {
    print(...(S.skills || []).map((g) =>
      el("span", {}, el("b", { class: "cmd-name", text: slug(g.group).replace(/-/g, "_") + ": " }),
        el("span", { class: "dim", text: "[" }), g.items.join(", "), el("span", { class: "dim", text: "]" }))),
      jumpLink("skills"));
  }
  function tailExperience() {
    (S.experience || []).forEach((x) => print(
      el("span", {}, el("span", { class: "dim", text: "[" + x.dates + "] " }), el("span", { class: "ok", text: "INFO " }),
        el("b", { class: "cmd-name", text: x.title }), el("span", { class: "dim", text: " · " + x.role })),
      ...(x.bullets || []).map((b) => "  › " + b)));
    print(jumpLink("experience"));
  }
  function contactSh() {
    print(...[["email", c.email && "mailto:" + c.email, c.email], ["linkedin", c.linkedin, c.linkedin && host(c.linkedin)],
        ["github", c.github, c.github && host(c.github)], ["resume", c.resume, c.resume && "resume.pdf"]]
      .filter((r) => r[1])
      .map(([k, href, label]) => el("span", {}, el("span", { class: "dim", text: pad(k, 10) }),
        el("a", { href, target: href.startsWith("mailto") ? null : "_blank", rel: "noopener", text: label }))));
  }
  function catProject(p) {
    const b = (p.bullets || []).slice(0, 3);
    print(
      el("b", { class: "cmd-name", text: "# " + p.title }),
      el("span", { class: "dim", text: p.role + "  ·  " + p.dates }),
      p.summary || "",
      ...b.map((x) => "  › " + x),
      ...((p.links || []).filter((l) => l.url).map((l) => el("span", {}, "  ↗ ",
        el("a", { href: l.url, target: "_blank", rel: "noopener", text: l.label || host(l.url) })))),
      jumpLink(slug(p.title), "↳ open " + alias(p) + " on the page"));
  }

  const FILES = {
    "education.txt": { mode: "-rw-r--r--", desc: "school, gpa, coursework", cat: catEducation },
    "experience.log": { mode: "-rw-r--r--", desc: "work & leadership", cat: tailExperience },
    "skills.yaml": { mode: "-rw-r--r--", desc: "languages, hardware, tools", cat: catSkills },
    "contact.sh": { mode: "-rwxr-xr-x", desc: "email, linkedin, github", cat: contactSh, exec: contactSh },
  };
  if (c.resume) FILES["resume.pdf"] = { mode: "-rw-r--r--", desc: "one page", cat: () => commands.resume(), exec: () => commands.resume() };

  // turn "~/projects/other/safelifts-simulator/" etc. into a node
  function resolve(path) {
    let q = (path || "").trim().replace(/^\/home\/parker\/?/, "~/").replace(/^~\/?/, "").replace(/^\.\/?/, "").replace(/\/+$/, "");
    if (q === "" || q === "~") return { type: "home" };
    if (q === "projects") return { type: "projects" };
    if (q === "projects/other" || q === "other") return { type: "other" };
    if (FILES[q]) return { type: "file", name: q };
    const name = q.replace(/^projects\/(other\/)?/, "");
    if (name.includes("/")) return null;
    const p = findProject(name);
    return p ? { type: "project", project: p } : null;
  }
  function entry(name, long, mode, desc, onClick) {
    const link = typeof onClick === "string" ? runLink(onClick, name) : (() => {
      const a = el("a", { href: "#", class: "ls-link", text: name });
      a.addEventListener("click", (ev) => { ev.preventDefault(); onClick(); });
      return a;
    })();
    return long
      ? el("span", {}, el("span", { class: "dim", text: mode + "  " }), link, el("span", { class: "dim", text: "  " + desc }))
      : link;
  }
  function printEntries(items, long) {
    if (long) print(...items);
    else print(el("span", {}, ...items.flatMap((x, i) => (i ? ["   ", x] : [x]))));
  }
  function listProjects(list, long, prefix) {
    return list.map((p) => entry(alias(p) + "/", long, "drwxr-xr-x", p.dates + "  " + p.title,
      "cat " + prefix + alias(p)));
  }

  const commands = {
    help: () => print(
      "commands:",
      ...[
        ["whoami", "who I am"],
        ["ls [path] [-l]", "list files, e.g. ls ~/projects"],
        ["cat <file>", "print a file, e.g. cat education.txt"],
        ["tail experience.log", "work & leadership"],
        ["open <project>", "jump to a project, e.g. open pivot"],
        ["./contact.sh", "email, linkedin, github"],
        ["clear", "clear the screen"],
        ["sudo hire parker", "you know you want to"],
      ].map(([a, b]) => el("span", {}, "  ", el("b", { class: "cmd-name", text: a.padEnd(21, " ") }), el("span", { class: "dim", text: b }))),
      el("span", { class: "dim", text: "files: " + Object.keys(FILES).join("  ") + "  projects/" })),
    whoami: () => print(el("b", { text: S.name }), S.headline, el("span", { class: "dim", text: S.availability || "" })),
    pwd: () => print("/home/" + first),
    echo: (arg) => print(arg || ""),
    ls: (arg) => {
      const toks = (arg || "").split(/\s+/).filter(Boolean);
      const flags = toks.filter((t) => t.startsWith("-"));
      const long = flags.some((f) => /^-[a-z]*l/.test(f));
      const featuredOnly = flags.includes("--featured");
      const paths = toks.filter((t) => !t.startsWith("-"));
      const node = resolve(paths[0] || "");
      if (!node) return print("ls: cannot access '" + paths[0] + "': No such file or directory");
      if (node.type === "home") {
        const rows = Object.entries(FILES).map(([n, f]) => [n, entry(n, long, f.mode, f.desc, f.exec ? "./" + n : "cat " + n)]);
        rows.push(["projects/", entry("projects/", long, "drwxr-xr-x", all.length + " projects", "ls ~/projects")]);
        rows.sort((a, b) => a[0].localeCompare(b[0]));
        return printEntries(rows.map((r) => r[1]), long);
      }
      if (node.type === "projects") {
        const items = listProjects(featuredP, long, "~/projects/");
        if (!featuredOnly && otherP.length) items.push(entry("other/", long, "drwxr-xr-x", otherP.length + " more projects", "ls -l ~/projects/other"));
        return printEntries(items, long);
      }
      if (node.type === "other") return printEntries(listProjects(otherP, long, "~/projects/other/"), long);
      if (node.type === "file") return printEntries([entry(node.name, long, FILES[node.name].mode, FILES[node.name].desc, "cat " + node.name)], long);
      if (node.type === "project") return catProject(node.project);
    },
    cat: (arg) => {
      const target = (arg || "").split(/\s+/).filter((t) => !t.startsWith("-"))[0];
      if (!target) return print("usage: cat <file>   (try: cat education.txt)");
      const node = resolve(target);
      if (!node) return print("cat: " + target + ": No such file or directory");
      if (node.type === "file") return FILES[node.name].cat();
      if (node.type === "project") return catProject(node.project);
      return print("cat: " + target + ": Is a directory. try ls " + target);
    },
    tail: (arg) => commands.cat(arg),
    open: (arg) => {
      if (!arg) return print("usage: open <name>   (try: open pivot)");
      const node = resolve(arg);
      if (node && node.type === "file") return FILES[node.name].cat();
      const p = node && node.type === "project" ? node.project : null;
      if (!p) return print("open: no such project: " + arg + ". try ls ~/projects");
      print("opening ~/projects/" + alias(p) + " …");
      go(slug(p.title));
    },
    cd: (arg) => {
      const node = resolve(arg || "");
      if (!node) return print("cd: " + arg + ": No such file or directory");
      if (node.type === "project") return commands.open(arg);
      if (node.type === "file") return print("cd: " + arg + ": Not a directory");
      if (node.type === "home") return;
      commands.ls(arg);
    },
    education: () => catEducation(),
    experience: () => tailExperience(),
    skills: () => catSkills(),
    contact: () => contactSh(),
    resume: () => c.resume
      ? (print("opening resume.pdf …"), window.open(c.resume, "_blank", "noopener"))
      : print("resume.pdf: available on request. run ./contact.sh"),
    clear: () => { out.textContent = ""; $("boot").hidden = true; },
    sudo: (arg) => {
      if (/^hire\b/.test(arg || "")) {
        print(el("span", { class: "ok", text: "[sudo] permission granted." }), "opening a new email to " + (c.email || "parker") + " …");
        if (c.email) setTimeout(() => { location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent("Internship opportunity"); }, 700);
      } else print("sudo: nice try. (hint: sudo hire parker)");
    },
    exit: () => print("logout? the connection stays open. run ./contact.sh instead."),
  };
  commands.head = commands.tail; commands.less = commands.cat; commands.more = commands.cat;
  commands.dir = commands.ls; commands.ll = (arg) => commands.ls("-l " + (arg || ""));
  commands.projects = () => commands.ls("~/projects"); commands.email = commands.contact;
  commands["?"] = commands.help; commands.man = commands.help;
  commands.sh = commands.bash = (arg) => {
    const f = resolve(arg || "");
    if (f && f.type === "file" && FILES[f.name].exec) return FILES[f.name].exec();
    print((arg || "sh") + ": cannot run that. try ./contact.sh");
  };

  function run(raw) {
    const line = raw.trim();
    echo(line);
    if (!line) return;
    history.push(line); hpos = history.length;
    const [name, ...rest] = line.split(/\s+/);
    if (/^(\.\/|~\/)/.test(name)) {               // ./contact.sh
      const f = resolve(name);
      if (f && f.type === "file" && FILES[f.name].exec) return FILES[f.name].exec();
      if (f && f.type === "file") return print(name + ": Permission denied");
      return print(name + ": No such file or directory");
    }
    const fn = commands[name.toLowerCase()];
    if (fn) fn(rest.join(" "));
    else print(name + ": command not found. try help");
  }
  $("prompt-form").addEventListener("submit", (ev) => { ev.preventDefault(); run(input.value); input.value = ""; });
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowUp" && history.length) { ev.preventDefault(); hpos = Math.max(0, hpos - 1); input.value = history[hpos]; }
    if (ev.key === "ArrowDown" && history.length) { ev.preventDefault(); hpos = Math.min(history.length, hpos + 1); input.value = history[hpos] || ""; }
    if (ev.key === "Tab") {
      const v = input.value;
      if (!v) return;
      const parts = v.split(/\s+/);
      const last = parts[parts.length - 1];
      let pool;
      if (parts.length <= 1) pool = Object.keys(commands).concat(Object.keys(FILES).filter((f) => FILES[f].exec).map((f) => "./" + f));
      else if (["cat", "tail", "head", "less", "more"].includes(parts[0])) pool = Object.keys(FILES).concat(["projects/", "projects/other/"], all.map(alias));
      else if (["ls", "ll", "dir", "cd"].includes(parts[0])) pool = ["~/projects", "~/projects/other", "projects", "projects/other"].concat(all.map(alias));
      else if (["open", "sh", "bash"].includes(parts[0])) pool = parts[0] === "open" ? all.map(alias) : Object.keys(FILES).filter((f) => FILES[f].exec);
      if (!pool) return;
      const hits = [...new Set(pool)].filter((x) => x.startsWith(last.toLowerCase()));
      if (!hits.length) return;
      ev.preventDefault();
      if (hits.length === 1) {
        parts[parts.length - 1] = hits[0];
        input.value = parts.join(" ") + (hits[0].endsWith("/") ? "" : " ");
      } else print(hits.join("   "));
    }
  });
  // clicking anywhere in the console focuses the prompt (but not when selecting text or clicking a link)
  body.addEventListener("click", (ev) => {
    if (ev.target.closest("a") || String(window.getSelection())) return;
    input.focus({ preventScroll: true });
  });
  ["help", "ls", "open pivot", "./contact.sh"].forEach((cmd) => {
    const b = el("button", { type: "button", class: "chip" }, el("span", { class: "dim", text: "$ " }), cmd);
    b.addEventListener("click", () => run(cmd));
    $("console-chips").append(b);
  });
})();
