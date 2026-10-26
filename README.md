# Parker Jones · Portfolio

A plain HTML/CSS/JS site with a terminal theme. No build step, no frameworks. GitHub Pages serves it as-is.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `content.js` | Every word on the site: intro, photo, education, projects, work, skills, links | **Yes, this is the one** |
| `images/` | Your photo, project photos and screenshots, and `og-card.png` (the link-preview image) | Add files here |
| `index.html` | Page skeleton | Rarely |
| `styles.css` | Colors, fonts, layout (colors are the `--` variables at the top) | Only to change the look |
| `main.js` | Turns `content.js` into the page and runs the terminal | No |

## Editing content

Open `content.js` on GitHub (click the file, then the pencil icon), change text, and click **Commit changes**. The live site updates in about a minute.

- **Add a project:** copy a whole `{ ... },` block inside `projects`, paste it, edit it. Position in the list = position on the page.
- **Featured vs. other projects:** `featured: true` puts a project in "Selected work" as a large pane (keep it to your best 3 to 5). Everything else shows in the "More projects" listing. The first 3 bullets of a featured project show right away; the rest sit behind "+ N more".
- **Terminal name:** the console's `ls` and `open` commands use a short name built from the first two words of the title (e.g. `scissor-lift`). To choose your own, add `cmd: "wristband"` to a project.
- **Add photos:** open the `images/` folder on GitHub, click Add file → Upload files, and drop them in. Then in that project set
  `images: [{ src: "images/wristband.jpg", alt: "Haptic wristband prototype", caption: "Optional caption" }]`
  - The first image is the big one on featured projects; the rest become thumbnails. Visitors can click any image to page through them full size.
  - Mark tall phone screenshots with `kind: "phone"` so they aren't cropped (see Pivot).
  - Keep each file under ~500 KB. Phone photos are often 3–5 MB, so resize to ~1600px wide first (on a Mac: open in Preview → Tools → Adjust Size).
  - File names are case-sensitive on the live site: `Wristband.JPG` and `wristband.jpg` are different files.
- **Your photo:** replace `images/parker.jpg` with a new file of the same name, or point `photo.src` somewhere else. Set `src: ""` to hide it.
- **Add links:** `links: [{ label: "Code on GitHub", url: "https://github.com/..." }]`.
- **Resume button:** upload your PDF as `resume.pdf` next to `index.html`, then set `resume: "resume.pdf"` under `contact`. The terminal's `resume` command uses it too.

If the page goes blank after an edit, it's almost always a missing comma or quote in `content.js`. Check the line you just changed.

## The terminal

The console at the top is optional for visitors; everything on the page reads without it. Commands: `help`, `whoami`, `ls`, `open <name>`, `education`, `experience`, `skills`, `contact`, `resume`, `clear`, and `sudo hire parker`. Tab completes, and the up arrow recalls earlier commands.

## Previewing locally (optional)

From this folder run `python3 -m http.server` and visit http://localhost:8000.
