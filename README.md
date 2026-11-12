# Adharsh Kirtan · Portfolio

A static, single-page portfolio. The home page shows a 3D drug–receptor (a GPCR in a lipid bilayer, with an agonist that binds, activates it and dissociates on a loop), built with Three.js.

## Run it

Double-click `index.html`, or serve the folder:

```
python -m http.server 8000
```

Then open http://localhost:8000. An internet connection is needed for the font and Three.js (both from CDNs).

## Edit content

| What | Where |
| --- | --- |
| Hero, About, Work, Contact text | `index.html` |
| Achievement folders | `FOLDERS` at the top of `js/main.js`. Each item is `{ t: 'Title', m: 'meta line' }`; add `link: 'https://…'` to make it clickable |
| Colours, spacing, type | tokens in `:root` at the top of `css/styles.css` |
| Receptor animation | `js/receptor.js` (timeline constants are near the bottom: `PERIOD`, `T_APPROACH`, …) |
| Résumé download | `assets/Adharsh_Kirtan_Resume.pdf` |

## Deploy

Any static host works: GitHub Pages, Netlify, or Vercel (`vercel deploy` from this folder).
