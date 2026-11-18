/* =====================================================================
   Color palettes for the palette picker (the swatch button in the top bar).
   Each palette sets the site's colors; "mode" says whether it is a light or
   dark theme. Add your own by copying a block. The first light and first
   dark palette are the defaults.

   This file also applies the visitor's saved palette before the page draws,
   so there's no flash of the wrong colors.
   ===================================================================== */
window.THEMES = [
  // ---- light ----
  { id: "paper", name: "Paper", mode: "light",
    bg: "#fafaf8", bg2: "#f2f1ec", card: "#ffffff", line: "#e4e2db", line2: "#d3d0c6",
    ink: "#15171a", text: "#33373d", dim: "#6a6f77", accent: "#a95a14", accentInk: "#ffffff", ok: "#1f7a4d", chip: "#f4f3ee" },
  { id: "solarized-light", name: "Solarized Light", mode: "light",
    bg: "#fdf6e3", bg2: "#eee8d5", card: "#fffcf2", line: "#e6dfc8", line2: "#d6ceb5",
    ink: "#073642", text: "#4a5f66", dim: "#657b83", accent: "#c0440f", accentInk: "#fdf6e3", ok: "#5f7000", chip: "#f3ecd8" },
  { id: "gruvbox-light", name: "Gruvbox Light", mode: "light",
    bg: "#fbf1c7", bg2: "#f2e5bc", card: "#f9f5d7", line: "#ebdbb2", line2: "#d5c4a1",
    ink: "#282828", text: "#3c3836", dim: "#7c6f64", accent: "#af3a03", accentInk: "#fbf1c7", ok: "#79740e", chip: "#f2e5bc" },
  { id: "catppuccin-latte", name: "Catppuccin Latte", mode: "light",
    bg: "#eff1f5", bg2: "#e6e9ef", card: "#f8f9fb", line: "#d5d9e2", line2: "#bcc0cc",
    ink: "#4c4f69", text: "#4c4f69", dim: "#6c6f85", accent: "#8839ef", accentInk: "#ffffff", ok: "#2f7d1f", chip: "#e6e9ef" },
  { id: "rose-pine-dawn", name: "Rosé Pine Dawn", mode: "light",
    bg: "#faf4ed", bg2: "#f2e9e1", card: "#fffaf3", line: "#e6deda", line2: "#cecacd",
    ink: "#464261", text: "#575279", dim: "#797593", accent: "#a34f68", accentInk: "#fffaf3", ok: "#286983", chip: "#f2e9e1" },

  // ---- dark ----
  { id: "terminal", name: "Terminal", mode: "dark",
    bg: "#111214", bg2: "#15171a", card: "#17191c", line: "#2a2d32", line2: "#3a3e45",
    ink: "#eceef0", text: "#d4d6d9", dim: "#9096a0", accent: "#e7b75f", accentInk: "#111214", ok: "#9fd3a8", chip: "#1d2024" },
  { id: "solarized-dark", name: "Solarized Dark", mode: "dark",
    bg: "#002b36", bg2: "#00252f", card: "#073642", line: "#0f4654", line2: "#2a5966",
    ink: "#eee8d5", text: "#b5c0c0", dim: "#8a9b9d", accent: "#b58900", accentInk: "#002b36", ok: "#859900", chip: "#0a3b48" },
  { id: "gruvbox-dark", name: "Gruvbox Dark", mode: "dark",
    bg: "#282828", bg2: "#1d2021", card: "#32302f", line: "#3c3836", line2: "#504945",
    ink: "#fbf1c7", text: "#ebdbb2", dim: "#a89984", accent: "#fabd2f", accentInk: "#282828", ok: "#b8bb26", chip: "#3c3836" },
  { id: "dracula", name: "Dracula", mode: "dark",
    bg: "#282a36", bg2: "#21222c", card: "#2f3241", line: "#44475a", line2: "#565a73",
    ink: "#f8f8f2", text: "#e2e2dc", dim: "#a4acc4", accent: "#bd93f9", accentInk: "#282a36", ok: "#50fa7b", chip: "#383a4a" },
  { id: "nord", name: "Nord", mode: "dark",
    bg: "#2e3440", bg2: "#292e39", card: "#3b4252", line: "#434c5e", line2: "#4c566a",
    ink: "#eceff4", text: "#d8dee9", dim: "#a3acbd", accent: "#88c0d0", accentInk: "#2e3440", ok: "#a3be8c", chip: "#434c5e" },
  { id: "tokyo-night", name: "Tokyo Night", mode: "dark",
    bg: "#1a1b26", bg2: "#16161e", card: "#1f2335", line: "#292e42", line2: "#3b4261",
    ink: "#c0caf5", text: "#a9b1d6", dim: "#7f88b0", accent: "#7aa2f7", accentInk: "#1a1b26", ok: "#9ece6a", chip: "#24283b" },
  { id: "catppuccin-mocha", name: "Catppuccin Mocha", mode: "dark",
    bg: "#1e1e2e", bg2: "#181825", card: "#252536", line: "#313244", line2: "#45475a",
    ink: "#cdd6f4", text: "#bac2de", dim: "#9399b2", accent: "#cba6f7", accentInk: "#1e1e2e", ok: "#a6e3a1", chip: "#313244" },
  { id: "rose-pine", name: "Rosé Pine", mode: "dark",
    bg: "#191724", bg2: "#16141f", card: "#1f1d2e", line: "#26233a", line2: "#403d52",
    ink: "#e0def4", text: "#e0def4", dim: "#908caa", accent: "#ebbcba", accentInk: "#191724", ok: "#9ccfd8", chip: "#26233a" },
];

(function () {
  const VARS = { bg: "--bg", bg2: "--bg-2", card: "--card", line: "--line", line2: "--line-2", ink: "--ink",
    text: "--text", dim: "--dim", accent: "--accent", accentInk: "--accent-ink", ok: "--ok", chip: "--chip" };
  window.applyTheme = function (id) {
    const t = window.THEMES.find((x) => x.id === id) || window.THEMES[0];
    const root = document.documentElement;
    for (const [k, v] of Object.entries(VARS)) root.style.setProperty(v, t[k]);
    root.dataset.theme = t.mode;
    root.dataset.palette = t.id;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = t.bg;
    return t;
  };
  let saved = null;
  try {
    saved = localStorage.getItem("palette");
    if (!saved) { const old = localStorage.getItem("theme"); if (old === "dark") saved = "terminal"; }
  } catch (e) {}
  window.applyTheme(saved || "paper");
})();
