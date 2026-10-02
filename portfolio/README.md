# Parker Jones · Portfolio

A plain HTML/CSS/JS site. No build step, no frameworks. GitHub Pages serves it as-is.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `content.js` | Every word on the site: intro, education, projects, work, skills, links | **Yes, this is the one** |
| `images/` | Project photos and screenshots | Add files here |
| `index.html` | Page skeleton | Rarely |
| `styles.css` | Colors, fonts, layout | Only to change the look |
| `main.js` | Turns `content.js` into the page | No |

## Editing content

Open `content.js` on GitHub (click the file, then the pencil icon), change text, and click **Commit changes**. The live site updates in about a minute.

- **Add a project:** copy a whole `{ ... },` block inside `projects`, paste it, edit it. Position in the list = position on the page.
- **Add photos:** upload to `images/` (Add file → Upload files), then in that project set
  `images: [{ src: "images/wristband.jpg", alt: "Haptic wristband prototype", caption: "Optional caption" }]`
- **Add links:** `links: [{ label: "Live demo", url: "https://..." }, { label: "Code", url: "https://github.com/..." }]`
- **Filter buttons** come from each project's `tags`. A tag only shows as a button if it's listed in `filters` and at least one project uses it.
- **Resume button:** upload your PDF as `resume.pdf` next to `index.html`, then set `resume: "resume.pdf"` under `contact`.

If the page goes blank after an edit, it's almost always a missing comma or quote in `content.js`. Check the line you just changed.

## Publishing on GitHub Pages (one time)

1. On GitHub, create a **public** repository named exactly `parker-t-jones.github.io`.
2. Upload these files to it (Add file → Upload files, drag in everything including the `images` folder). Commit.
3. Go to **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
4. After a minute or two the site is live at **https://parker-t-jones.github.io**. Put that URL on your resume.

## Previewing locally (optional)

Double-click `index.html` to open it in a browser. Or from this folder run `python3 -m http.server` and visit http://localhost:8000.
