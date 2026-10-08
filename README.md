# MyWebsite

My personal portfolio website, built from scratch with plain **HTML, CSS and JavaScript**. No frameworks, no build step, no dependencies to install.

It shows my projects, scientific work, tech stack, education and contact links, wrapped in a retro game theme: every section is a "level", a pixel-cube companion follows you through the page, and there are a few achievements to unlock along the way.

![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Features

- **Content in one file**: everything on the page comes from `data.js`. Adding a project or paper takes just a few lines, no HTML needed.
- **Game-themed sections**: Projects, Scientific work, Stack, Education, About and Contact, each presented as a level (Lvl 01 to Lvl 06).
- **Voxel companion**: a figure made of small cubes that moves to the section you're reading and changes its shape for each one.
- **Achievements**: unlocked while exploring the page and saved in the browser. Some are hidden, so feel free to look around.
- **Keyboard navigation**: press `1` to `6` to jump straight to a level.
- **Built-in PDF viewer**: papers open in a dialog on desktop and in the browser's own viewer on mobile.
- **Copy-to-clipboard contacts**: email address and Discord username are copied with a click.
- **Responsive and accessible**: works on phones, supports keyboard use and respects `prefers-reduced-motion`.
- **Link previews**: Open Graph tags for nice previews on LinkedIn, Discord, WhatsApp and others.

## Project structure

```
MyWebsite/
├── index.html   # Page skeleton (sections, nav, PDF dialog)
├── data.js      # All content: profile, projects, papers, about, stack, education, contact
├── script.js    # Renders data.js into the page, plus all interactions and animations
├── styles.css   # All styling
└── papers/      # PDFs of scientific works, linked from data.js
```

## Running it locally

Since it's a static site, you can simply open `index.html` in your browser.

For the PDF viewer to work reliably, serving the folder over a local web server is recommended:

```bash
git clone https://github.com/PharellJay/MyWebsite.git
cd MyWebsite
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing the content

All text lives in `data.js`, and every block there is documented with comments explaining each field:

| Block        | What it controls                                                     |
| ------------ | -------------------------------------------------------------------- |
| `PROFILE`    | Name, tagline, intro, status badge, photo, social links, CV          |
| `PROJECTS`   | Project cards; one can be marked `featured` as the big "main quest"  |
| `PAPERS`     | Scientific works with abstract and an optional PDF                   |
| `ABOUT`      | The "About me" text and cards                                        |
| `TECH_STACK` | Technology groups shown with logos in the Stack section              |
| `EDUCATION`  | Timeline entries, newest first                                       |
| `CONTACT`    | Text shown in the Contact section                                    |

Example of a new project:

```js
{
  title: "My New Project",
  description: "One or two sentences about what it does.",
  tech: ["Python", "Docker"],
  repo: "https://github.com/PharellJay/MyNewProject",
  demo: "",
},
```

To add a paper, put the PDF into `papers/` (simple file name, no spaces or umlauts) and reference it via `pdf: "papers/your-file.pdf"`.

> **Tip:** after editing a file, bump the `?v=` numbers in `index.html` so browsers load the new version instead of a cached one.

## Deployment

The site is fully static, so it can be hosted anywhere that serves files, for example GitHub Pages, Netlify, Vercel or Cloudflare Pages. No build command is needed; the publish directory is the repository root.

## Credits

- Fonts: [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch), [Geist](https://vercel.com/font) and [Silkscreen](https://fonts.google.com/specimen/Silkscreen) via Google Fonts
- Technology logos: [Devicon](https://devicon.dev/)
- Icons: [Lucide](https://lucide.dev/)

## License

This project is licensed under the [MIT License](LICENSE).
