# İlhan Bahadır Yavaş - Portfolio

Portfolio site for a software engineer working across systems, backend, game engines and DevOps.
Vanilla HTML, CSS and JavaScript. No build step, no framework, no runtime dependency on a CDN.

Live at **[bahoyvs.github.io](https://bahoyvs.github.io)**.

## Design system

Dark anthracite monochrome with a single signal accent. Three locks hold the page together:

| Lock | Rule |
| --- | --- |
| Theme | Dark only. `color-scheme: dark` on `:root`. No section inverts. |
| Accent | `--accent: #a8e24c` is the only accent on the page. |
| Shape | Cards `16px`, chips and tags `8px`, buttons and pills fully round. |

All tokens live at the top of `style.css`. Changing `--accent` there restyles the entire site,
including the WebGL hero field (the shader reads the same value through the `u_accent` uniform in
`scripts.js`).

**Typography:** Geist for UI, Geist Mono for technical metadata (dates, tags, counts, kickers).

**Contrast:** every ink and surface pairing in use clears WCAG AA. The tightest is
`--text-dim` on `--surface-3` at 4.72:1.

## Structure

```
bahoyvs.github.io/
├── index.html      # Markup and copy
├── style.css       # Tokens, layout, components, responsive, reduced motion
├── scripts.js      # WebGL hero, observers, filter, modal
├── favicon.svg
├── assets/
│   ├── img/        # Project artwork
│   ├── images/     # Photos and screenshots
│   └── cv.pdf
└── readme.md
```

## The hero WebGL field

A fullscreen-triangle fragment shader in `scripts.js`: two levels of domain warping over
value-noise fbm, producing a slow anthracite flow with sparse accent filaments.

It is written to stay cheap:

- Renders at `0.72` of CSS size (`0.55` when `hardwareConcurrency <= 4`), DPR capped at `1.5`,
  then upscaled. The field is soft enough that the upscale is invisible.
- One-shot adaptive downscale to `0.45` if frames run long for a sustained stretch.
- The `requestAnimationFrame` loop stops entirely when the hero leaves the viewport
  (IntersectionObserver) or the tab is hidden (`visibilitychange`).
- Under `prefers-reduced-motion: reduce` it paints a single static frame and never loops.
- If WebGL is unavailable the canvas is removed and the CSS gradient on `.hero-canvas-wrap`
  stays as the background. Context loss is handled.

Tuning knobs, all in the `FRAG_SRC` array:

| Knob | Effect |
| --- | --- |
| `u_time * 0.042` | Flow speed. |
| `filament * 0.20` | Accent brightness. Raise for a louder field. |
| `pow(ridge, 8.5)` | Filament sparsity. Higher is sparser. |
| `col *= 1.0 - 0.62 * ...` | Vignette depth. |

## Interaction notes

- **No scroll listeners.** Every scroll-driven state (sticky header, nav scroll spy, reveal
  animations, back-to-top) is derived from `IntersectionObserver`.
- **Reveals have a failsafe.** Anything still hidden 4s after load is shown outright, so content
  can never be stranded invisible.
- **Tech stack filter** is a proper `tablist`: roving `tabindex`, arrow/Home/End keys, and a live
  region announcing the result count.
- **Project modal** traps focus, closes on Escape or scrim click, and restores focus to the
  trigger.
- **Reduced motion** is honored globally, including the shader.

## Editing content

### Adding a project

1. Add an entry to `PROJECTS` in `scripts.js`:

```javascript
'your-project-id': {
    title: 'Project Title',
    subtitle: 'One line describing what it is',
    kicker: 'Engine or context / Your role',
    awards: ['Award name, Event 2026'],   // optional
    video: 'https://youtu.be/VIDEO_ID',   // optional
    description: 'What the project is.',
    features: ['What you built.'],
    technologies: ['Tech1', 'Tech2']
}
```

2. Add the card in `index.html` inside `.work-grid`, with a
   `<button class="work-link" data-project="your-project-id">`.

3. Give it a grid span so the row still sums to 6 columns. The grid is six columns wide and the
   existing rhythm is `4+2`, `2+4`, `3+3`:

| Class | Span |
| --- | --- |
| `.work-card-wide` | 4 |
| `.work-card-half` | 3 |
| `.work-card-narrow` | 2 |

A row that does not sum to 6 leaves a visible empty cell.

### Project screenshots

The project cards currently use tinted gradient panels carrying a real headline fact from each
project, because no screenshots exist in the repo yet. Each card is ready for a real image.
Replace the `.work-visual` panel with:

```html
<div class="work-visual work-visual-image">
    <img src="assets/img/your-shot.jpg" alt="Describe the shot"
         width="800" height="500" loading="lazy" decoding="async">
</div>
```

`index.html` carries a commented slot on the Zombie Survival card showing exactly this.
Recommended size 800x500. Screenshots will noticeably lift the grid.

## Local development

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Static site. Push to the `bahoyvs.github.io` repository and GitHub Pages serves it from the
repository root.

## Author

**İlhan Bahadır Yavaş**

- Portfolio: [bahoyvs.github.io](https://bahoyvs.github.io)
- LinkedIn: [linkedin.com/in/bahoyvs](https://linkedin.com/in/bahoyvs)
- GitHub: [github.com/bahoyvs](https://github.com/bahoyvs)
- Email: ilhanbahadiryavas@gmail.com
