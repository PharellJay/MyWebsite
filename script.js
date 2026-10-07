(() => {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === "class") node.className = value;
      else node.setAttribute(key, value);
    }
    for (const child of children) {
      if (child == null || child === false) continue;
      node.append(child);
    }
    return node;
  }

  const externalLink = (href, text) => el("a", { href, target: "_blank", rel: "noopener" }, text);
  const emptyMessage = (text) => el("p", { class: "empty" }, text);

  const setText = (sel, text) => {
    const node = $(sel);
    if (node && text) node.textContent = text;
  };

  // Data blocks from data.js (missing blocks fall back to empty values)
  const profile = typeof PROFILE !== "undefined" ? PROFILE : {};
  const projects = typeof PROJECTS !== "undefined" ? PROJECTS : [];
  const papers = typeof PAPERS !== "undefined" ? PAPERS : [];
  const about = typeof ABOUT !== "undefined" ? ABOUT : {};
  const stack = typeof TECH_STACK !== "undefined" ? TECH_STACK : [];
  const education = typeof EDUCATION !== "undefined" ? EDUCATION : [];
  const contact = typeof CONTACT !== "undefined" ? CONTACT : {};

  function fillList(container, items, emptyText, render) {
    if (!container) return;
    if (!items.length) {
      container.append(emptyMessage(emptyText));
      return;
    }
    container.append(...items.map(render));
  }

  /* ---------- header, intro, links ---------- */
  function renderProfile() {
    setText("#name", profile.name);
    setText("#tagline", profile.tagline);
    setText("#intro", profile.intro);

    // Stat strip under the tagline (status only shows on small screens, where the top bar hides it)
    const stats = $("#hero-stats");
    const statRows = [
      ["Region", profile.location],
      ["Lang", profile.languages],
      ["Status", profile.status, "stat-status"],
    ].filter(([, value]) => value);
    if (stats && statRows.length) {
      stats.append(...statRows.map(([label, value, cls]) =>
        el("div", cls ? { class: cls } : {}, el("dt", {}, label), el("dd", {}, value))));
    } else stats?.remove();
    setText("#footer-name", profile.name);

    document.querySelectorAll("[data-profile]").forEach((link) => {
      const key = link.dataset.profile;
      const value = profile[key];
      if (!value) {
        (link.closest("li") || link).remove();
        return;
      }
      const isUrl = /^https?:\/\//.test(value);
      const name = link.textContent.trim();

      // Icon, plus the value (email address / username) where the link asks for it
      link.textContent = "";
      link.append(icon(key));
      const label = link.hasAttribute("data-show-value") && !isUrl
        ? link.appendChild(el("span", {}, value))
        : null;
      link.setAttribute("aria-label", label ? `${name}: ${value}` : name);
      link.title = name;
      if (!label) link.classList.add("chip-icon");

      if (key === "discord" && !isUrl) {
        makeCopyLink(link, label, value);
        return;
      }
      link.href = key === "email" ? `mailto:${value}` : value;
    });
  }

  // For a plain username (e.g. Discord): clicking copies it instead of navigating.
  function makeCopyLink(link, label, value) {
    link.href = "#";
    link.removeAttribute("target");
    link.title = `Copy Discord username "${value}"`;
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      let copied = true;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        copied = false;
      }
      if (label) {
        label.textContent = copied ? "Copied" : value;
        setTimeout(() => (label.textContent = value), 1500);
      } else if (copied) {
        // Icon-only button: show a small "Copied" bubble instead
        link.classList.add("copied");
        setTimeout(() => link.classList.remove("copied"), 1500);
      } else {
        window.prompt("Discord username:", value);
      }
    });
  }

  /* ---------- icons (GitHub, LinkedIn and Discord logos from Simple Icons) ---------- */
  const ICONS = {
    github: '<path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>',
    linkedin: '<path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
    email: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></g>',
    discord: '<path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>',
  };

  function icon(key) {
    const span = el("span", { class: "icon", "aria-hidden": "true" });
    // Static, trusted markup from ICONS above (never user data)
    span.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16">${ICONS[key] || ""}</svg>`;
    return span;
  }

  const tags = (items = []) => el("ul", { class: "tags" }, ...items.map((t) => el("li", { class: "tag" }, t)));

  /* ---------- projects ---------- */
  const pad2 = (n) => String(n).padStart(2, "0");

  function renderProject(p, i) {
    const title = el("h3", {}, p.repo ? externalLink(p.repo, p.title) : p.title);

    const actions = el("div", { class: "project-actions" });
    if (p.repo) actions.append(el("a", { href: p.repo, target: "_blank", rel: "noopener", class: "btn btn-primary" }, "View project"));
    if (p.demo) actions.append(el("a", { href: p.demo, target: "_blank", rel: "noopener", class: "btn" }, "Live demo"));

    return el("article", { class: "card project" },
      el("p", { class: "quest-label" }, `Quest ${pad2(i + 1)}`),
      title,
      p.description ? el("p", {}, p.description) : null,
      p.tech?.length ? tags(p.tech) : null,
      actions.childElementCount ? actions : null
    );
  }

  /* ---------- scientific works ---------- */
  function renderPaper(p) {
    const meta = [p.type, p.subject, p.year, p.school].filter(Boolean).join(" · ");

    const actions = el("div", { class: "paper-actions" });
    if (p.pdf) {
      const read = el("button", { type: "button", class: "btn btn-primary" }, "Read paper");
      read.addEventListener("click", () => openPdf(p.pdf, p.title));
      actions.append(read, el("a", { href: p.pdf, download: "", class: "btn" }, "Download PDF"));
    }

    const card = el("article", { class: p.pdf ? "card paper clickable" : "card paper" },
      el("div", { class: "paper-top" },
        el("div", {},
          meta ? el("p", { class: "paper-meta" }, meta) : null,
          el("h3", {}, p.title)
        ),
        p.grade
          ? el("div", { class: "grade" },
              el("span", { class: "grade-label" }, "Score"),
              el("span", { class: "grade-value" }, p.grade))
          : null
      ),
      p.abstract ? el("p", { class: "abstract" }, p.abstract) : null,
      actions.childElementCount ? actions : null
    );

    // Clicking anywhere on the card does the same as "Read paper"
    // (except on the buttons themselves, or when the visitor is selecting text)
    if (p.pdf) {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a, button")) return;
        if (window.getSelection()?.toString()) return;
        openPdf(p.pdf, p.title);
      });
    }
    return card;
  }

  /* ---------- about, stack, education ---------- */

  // Stack icons: Devicon logos, a filled brand logo (logo), or inline SVG (Lucide) for things without a logo.
  // Each logo lights up in its brand color on hover. Items without an entry fall back to a text tag.
  const svg = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  const dev = (names, colors) => ({ names: [].concat(names), colors: [].concat(colors) });
  const lucide = (paths) => ({ svg: svg(paths) });
  const logo = (viewBox, path, color) => ({ svg: `<svg class="logo" viewBox="${viewBox}" fill="currentColor"><path d="${path}"/></svg>`, colors: [color] });
  const STACK_ICONS = {
    "Java": dev("java-plain", "#f89820"),
    "Python": dev("python-plain", "#4b8bbe"),
    "Lua": dev("lua-plain", "#6c7cff"),
    "C": dev("c-plain", "#5c8dbc"),
    "C++": dev("cplusplus-plain", "#659ad2"),
    "JavaScript": dev("javascript-plain", "#f7df1e"),
    "SQL": lucide('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>'),
    "HTML & CSS": dev(["html5-plain", "css3-plain"], ["#e34f26", "#2965f1"]),
    "React": dev("react-original", "#61dafb"),
    "Node.js": dev("nodejs-plain", "#5fa04e"),
    "Spring Boot": dev("spring-original", "#6db33f"),
    "Unity": dev("unity-plain", "#ffffff"),
    "Godot": dev("godot-plain", "#478cbf"),
    // Cfx.re logo (from cfx.re), cropped to the symbol
    "Cfx.re (FiveM / RedM)": logo("118.95 -5 70 70", "M166.457 6.585L188.633 53.415H161.123L160.223 42.288H147.608L146.708 53.415H119.276L141.452 6.585H150.506L149.75 15.99H158.099L157.343 6.585ZM159.608 34.539L158.42 19.902H149.432L148.244 34.539Z", "#f40552"),
    "Git": dev("git-plain", "#f05032"),
    "Linux": dev("linux-plain", "#fcc624"),
    "Docker": dev("docker-plain", "#2496ed"),
    "IntelliJ": dev("intellij-plain", "#fe315d"),
    "VS Code": dev("vscode-plain", "#23a9f2"),
    "OOP": lucide('<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'),
    "Design Patterns": lucide('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>'),
    "Agile / Scrum": lucide('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>'),
    "Testing": lucide('<path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/>'),
    "UML": lucide('<rect width="8" height="6" x="8" y="2" rx="1"/><rect width="8" height="6" x="2" y="16" rx="1"/><rect width="8" height="6" x="14" y="16" rx="1"/><path d="M6 16v-3h12v3"/><path d="M12 8v5"/>'),
  };

  // Icons for the group cards
  const STACK_GROUP_ICONS = {
    code: svg('<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'),
    web: svg('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
    game: svg('<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>'),
    tools: svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    concepts: svg('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'),
  };

  // withName: also show the name next to the logo (main card, shown as a list on wide screens)
  function stackIcon(name, withName) {
    const icon = STACK_ICONS[name];
    if (!icon) return el("li", { class: "tag" }, name);
    const item = el("li", { class: "stack-icon", tabindex: "0", "aria-label": name, "data-name": name });
    // Static, trusted markup from STACK_ICONS (never user data)
    if (icon.svg) {
      item.innerHTML = icon.svg;
      if (icon.colors) item.style.setProperty("--brand", icon.colors[0]);
    } else {
      item.style.setProperty("--brand", icon.colors[0]);
      item.append(...icon.names.map((n, i) => {
        const logo = el("i", { class: `devicon-${n}`, "aria-hidden": "true" });
        logo.style.setProperty("--brand", icon.colors[i] || icon.colors[0]);
        return logo;
      }));
    }
    if (withName) item.append(el("span", { class: "stack-name", "aria-hidden": "true" }, name));
    return item;
  }

  function renderStackGroup(g) {
    const iconBox = el("span", { class: "about-icon", "aria-hidden": "true" });
    iconBox.innerHTML = STACK_GROUP_ICONS[g.icon] || "";
    const items = g.items || [];
    // Spread the icons evenly over the rows (5 → 3 + 2 instead of 4 + 1); each row is centered.
    // Wide cards fit up to 10 per row, narrow ones 3; on phones (--cols-sm) every card fits up to 5.
    const balanced = (max) => Math.ceil(items.length / (Math.ceil(items.length / max) || 1));
    const list = el("ul", { class: "stack-icons" }, ...items.map((name) => stackIcon(name, g.main)));
    list.style.setProperty("--cols", balanced(g.main ? 4 : 3));
    list.style.setProperty("--cols-sm", balanced(5));
    return el("article", { class: `card stack-group${g.main ? " main" : ""}` },
      el("div", { class: "stack-group-head" }, iconBox, el("h3", {}, g.group)),
      list
    );
  }

  // Lucide icons for the About cards
  const ABOUT_ICONS = {
    drive: svg('<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'),
    now: svg('<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>'),
    offline: svg('<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59c-.01.05-.01.1-.02.15C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.41.59L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.55-.6-6.58-.68-7.26-.01-.05-.01-.1-.02-.15A4 4 0 0 0 17.32 5z"/>'),
    philosophy: svg('<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'),
  };

  // "*word*" in the lead sentence becomes a highlighted span
  function highlight(text) {
    return text.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? el("span", { class: "hl" }, part) : part));
  }

  function renderAboutCard(c) {
    const iconBox = el("span", { class: "about-icon", "aria-hidden": "true" });
    // Static, trusted markup from ABOUT_ICONS (never user data)
    iconBox.innerHTML = ABOUT_ICONS[c.icon] || "";
    return el("article", { class: `card about-card${c.wide ? " wide" : ""}` },
      iconBox,
      el("div", {},
        c.wide ? el("p", { class: "quest-label" }, "Side quest") : null,
        el("h3", {}, c.title),
        el("p", {}, c.text),
        c.link ? el("a", { class: "about-link", href: c.link.href }, `${c.link.text} →`) : null
      )
    );
  }

  function renderAbout() {
    const body = $("#about-body");
    if (!body) return;
    if (about.lead) body.append(el("p", { class: "about-lead" }, ...highlight(about.lead)));
    body.append(...(about.paragraphs || []).map((t) => el("p", {}, t)));
    if (about.cards?.length) body.append(el("div", { class: "about-cards" }, ...about.cards.map(renderAboutCard)));
  }

  // Photo next to the name (hidden if there is no photo)
  function renderHeroPhoto() {
    const frame = $("#hero-photo");
    if (!frame) return;
    if (!profile.photo) {
      frame.remove();
      return;
    }
    frame.append(el("img", { src: profile.photo, alt: profile.name || "" }));
  }

  // Status badge in the top bar (on small screens the stat strip in the hero shows it instead)
  function renderStatus() {
    for (const badge of document.querySelectorAll(".status-badge")) {
      if (!profile.status) {
        badge.remove();
        continue;
      }
      badge.append(el("span", { class: "dot", "aria-hidden": "true" }), profile.status);
    }
  }



  const count = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  // Lucide icons for the education timeline
  const EDU_ICONS = {
    university: svg('<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>'),
    school: svg('<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.45 1.73a1 1 0 0 1 .55.9V21a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8.38a1 1 0 0 1 .55-.9L6 10"/><path d="M18 5v17"/><path d="m4 6 7.1-3.55a2 2 0 0 1 1.8 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>'),
  };

  function renderEducation(e) {
    const current = /present/i.test(e.date || "");
    const node = el("span", { class: "edu-node", "aria-hidden": "true" });
    // Static, trusted markup from EDU_ICONS (never user data)
    node.innerHTML = EDU_ICONS[e.icon] || EDU_ICONS.school;

    return el("article", { class: `edu${current ? " current" : ""}` },
      node,
      el("div", { class: "card edu-body" },
        el("div", { class: "edu-top" },
          el("p", { class: "edu-date" }, e.date || ""),
          el("span", { class: `edu-badge${current ? "" : " done"}` }, current ? "In progress" : "Completed ✓")
        ),
        el("h3", {}, e.title),
        e.place ? el("p", { class: "edu-place" }, e.place) : null,
        e.description ? el("p", { class: "edu-text" }, e.description) : null,
        e.focus?.length ? tags(e.focus) : null,
        current ? el("div", { class: "edu-progress", "aria-hidden": "true" }) : null
      )
    );
  }

  /* ---------- game touches ---------- */
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // "Achievement unlocked" toast in the hero, shown shortly after the page loads
  function renderAchievement() {
    const box = $("#achievement");
    if (!box) return;
    if (!profile.achievement) {
      box.remove();
      return;
    }
    const trophy = el("span", { class: "achievement-icon", "aria-hidden": "true" });
    // Static, trusted markup (Lucide trophy)
    trophy.innerHTML = svg('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>');
    box.append(trophy,
      el("div", {}, el("p", { class: "achievement-label" }, "Achievement unlocked"), el("p", {}, profile.achievement)));
    setTimeout(() => {
      box.hidden = false;
      requestAnimationFrame(() => box.classList.add("show"));
    }, reducedMotion ? 0 : 900);
  }

  // Thin bar under the top bar that fills up as you scroll
  function initXpBar() {
    const fill = $("#xp-fill");
    if (!fill) return;
    let queued = false;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    };
    window.addEventListener("scroll", () => {
      if (!queued) requestAnimationFrame(update);
      queued = true;
    }, { passive: true });
    update();
  }

  // Section headings "scan in" once when they come into view
  function initReveal() {
    if (reducedMotion || !("IntersectionObserver" in window)) return;
    const heads = document.querySelectorAll(".section-head");
    document.documentElement.classList.add("js-reveal");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    heads.forEach((h) => observer.observe(h));
  }

  /* ---------- cube companion ---------- */
  // A pixel figure made of small cubes. It sits in the .voxel-slot of the section you're in
  // (hero: controller, Projects: computer, ...); when you scroll on it fades out and fades back in
  // at the next slot as that slot's shape. Hovering nudges the cubes apart a little.
  const VOXEL_COLS = 20;
  const VOXEL_ROWS = 14;
  const VOXEL_PITCH = 12; // px per cube (11px cube + 1px gap), before scaling to the slot
  const VOXEL_COLORS = {
    a: "var(--accent)", l: "var(--accent-hover)", d: "#4c2f8f", k: "#1c1630",
    w: "var(--text)", m: "var(--muted)", g: "var(--xp)",
    y: "#fbbf24", p: "#f472b6", c: "#38bdf8", n: "#f1c27d", r: "#f43f5e", e: "#059669",
  };
  // 20 × 14 grids, "." = empty, letters = VOXEL_COLORS; each shape is centered in the grid
  const VOXEL_SHAPES = {
    controller: [
      "..lll..........lll..",
      "..aaaaaaaaaaaaaaaa..",
      ".aaaaaaaaaaaaaaaaaa.",
      "aaaawaaaaaaaaaagaaaa",
      "aaawwwaadaadaayapaaa",
      "aaaawaaaaaaaaaacaaaa",
      "aaaaaaaaaaaaaaaaaaaa",
      "aaaaaa........aaaaaa",
      ".aaaa..........aaaa.",
      "..aa............aa..",
    ],
    computer: [
      "..aaaaaaaaaaaaaaaa..",
      "..akkkkkkkkkkkkkka..",
      "..akgkkkkkkkkkkkka..",
      "..akkgkkkkkkkkkkka..",
      "..akgkkgggkkkkkkka..",
      "..akkkkkkkkkkkkkka..",
      "..aaaaaaaaaaaaaaaa..",
      "........dddd........",
      "......dddddddd......",
      "....................",
      ".lwlwlwlwlwlwlwlwll.",
      ".lllllwwwwwwwwlllll.",
    ],
    paper: [
      ".wwwwwwwwww.........",
      ".wwwwwwwwwwm.....pp.",
      ".wwwwwwwwwwww...mm..",
      ".wwllllllllww..yy...",
      ".wwwwwwwwwwww.yy....",
      ".wwllllllllwwyy.....",
      ".wwwwwwwwwwwyy......",
      ".wwllllllllyy.......",
      ".wwwwwwwwwyyw.......",
      ".wwllllllnnww.......",
      ".wwwwwwwkkwww.......",
      ".wwwwwwwwwwww.......",
      ".wwwwwwwwwwww.......",
    ],
    toolbox: [
      "....................",
      ".......mmmmmm.......",
      ".......m....m.......",
      ".......m....m.......",
      ".llllllllllllllllll.",
      ".llllllllyyllllllll.",
      ".aaaaaaaayyaaaaaaaa.",
      ".aaaaaaaayyaaaaaaaa.",
      ".dddddddddddddddddd.",
      ".aaaaaaaaaaaaaaaaaa.",
      ".aaaaaaaaaaaaaaaaaa.",
      ".aaaaaaaaaaaaaaaaaa.",
    ],
    cap: [
      ".......dddddd.......",
      "...ddddddlldddddd...",
      "ddddddddddyyyyyyyddd",
      "...ddddddddddddddy..",
      ".....aaddddddaa..y..",
      ".....aaaaaaaaaa..y..",
      ".....aaaaaaaaaa..y..",
      ".....aaaaaaaaaa..y..",
      ".....llllllllll.yyy.",
      "................yyy.",
    ],
    player: [
      ".......kkkkkk.......",
      "......kkkkkkkk......",
      "......knnnnnnk......",
      "......nnknnknn......",
      "......nnnnnnnn......",
      ".......nnppnn.......",
      ".....aaaaaaaaaa.....",
      "....aaaaaggaaaaa....",
      "....naaaaaaaaaan....",
      "......dddddddd......",
      "......ddd..ddd......",
      "......ddd..ddd......",
      ".....kkkk..kkkk.....",
    ],
    envelope: [
      ".................gg.",
      "..daaaaaaaaaaaaaagg.",
      "..adaaaaaaaaaaaada..",
      "..aadaaaaaaaaaadaa..",
      "..aaadaaaaaaaadaaa..",
      "..aaaadaaaaaadaaaa..",
      "..aaaaadaaaadaaaaa..",
      "..aaaaaadaadaaaaaa..",
      "..aaaaaaaddaaaaaaa..",
      "..aaaaaaaaaaaaaaaa..",
      "..aaaaaaaaaaaaaaaa..",
    ],
    invader: [
      "....dd.......dd.....",
      "....dd.......dd.....",
      "......d.....d.......",
      "....ddddddddddd.....",
      "....ddddddddddd.....",
      "...ddd.ddddd.ddd....",
      ".ddddddddddddddddd..",
      ".ddddddddddddddddd..",
      ".dd.ddddddddddd.dd..",
      ".dd.dd.......dd.dd..",
      ".dd.dd.......dd.dd..",
      "......ddd.ddd.......",
    ],
    code: [
      "...........ee.......",
      "...........ee.......",
      "....gg....ee..gg....",
      "...gg.....ee...gg...",
      "..gg.....ee.....gg..",
      ".gg......ee......gg.",
      ".gg.....ee.......gg.",
      "..gg....ee......gg..",
      "...gg..ee......gg...",
      "....gg.ee.....gg....",
      "......ee............",
      "......ee............",
    ],
    heart: [
      "...rrrr....rrrr.....",
      "..rrrrrr..rrrrrr....",
      ".rrwwrrrrrrrrrrrr...",
      ".rwwrrrrrrrrrrrrr...",
      ".rwrrrrrrrrrrrrrr...",
      ".rrrrrrrrrrrrrrrr...",
      "..rrrrrrrrrrrrrr....",
      "...rrrrrrrrrrrr.....",
      "....rrrrrrrrrr......",
      ".....rrrrrrrr.......",
      "......rrrrrr........",
      ".......rrrr.........",
      "........rr..........",
    ],
  };

  // Grid → list of cubes { x, y, color, rx, ry, rr, ex, ey, er }
  // (rx/ry/rr: hover nudge away from the center; ex/ey/er: where it flies when the shape breaks apart)
  function voxelCells(rows) {
    const cells = [];
    rows.forEach((row, r) => [...row].forEach((ch, c) => { if (ch !== ".") cells.push({ r, c, ch }); }));
    const minC = Math.min(...cells.map((p) => p.c)), maxC = Math.max(...cells.map((p) => p.c));
    const minR = Math.min(...cells.map((p) => p.r)), maxR = Math.max(...cells.map((p) => p.r));
    const offC = Math.floor((VOXEL_COLS - (maxC - minC + 1)) / 2) - minC;
    const offR = Math.floor((VOXEL_ROWS - (maxR - minR + 1)) / 2) - minR;
    const mid = (n) => (n - 1) / 2;
    return cells.map(({ r, c, ch }) => {
      const dx = (c + offC - mid(VOXEL_COLS)) / mid(VOXEL_COLS);
      const dy = (r + offR - mid(VOXEL_ROWS)) / mid(VOXEL_ROWS);
      const jitter = () => (Math.random() - 0.5) * 3;
      const burst = 30 + Math.random() * 40;
      return {
        x: (c + offC) * VOXEL_PITCH, y: (r + offR) * VOXEL_PITCH, color: VOXEL_COLORS[ch],
        rx: dx * 4 + jitter(), ry: dy * 4 + jitter(), rr: (Math.random() - 0.5) * 24,
        ex: (dx + Math.random() - 0.5) * burst, ey: (dy + Math.random() - 0.5) * burst, er: (Math.random() - 0.5) * 240,
      };
    });
  }

  function initVoxel() {
    const box = $("#voxel");
    if (!box) return;
    // The photo (if any) takes the hero's right column
    if ($("#hero-photo")) $(".hero .voxel-slot")?.remove();
    const slots = new Map(); // section → its slot
    for (const slot of document.querySelectorAll(".voxel-slot")) {
      if (VOXEL_SHAPES[slot.dataset.shape]) slots.set(slot.closest("section"), slot);
    }
    if (!slots.size) {
      box.remove();
      return;
    }

    const shapes = Object.fromEntries(Object.entries(VOXEL_SHAPES).map(([k, rows]) => [k, voxelCells(rows)]));
    const cubes = Array.from({ length: Math.max(...Object.values(shapes).map((s) => s.length)) }, () => {
      const cube = el("span", { class: "vox" });
      cube.style.setProperty("--d", `${Math.round(Math.random() * 250)}ms`);
      return cube;
    });
    box.style.width = `${VOXEL_COLS * VOXEL_PITCH}px`;
    box.style.height = `${VOXEL_ROWS * VOXEL_PITCH}px`;
    box.append(...cubes);

    // Cube i takes cell i of the shape; spare cubes shrink away in the middle
    let shape = null;
    function setShape(name) {
      if (name === shape) return;
      shape = name;
      const cells = shapes[name];
      cubes.forEach((cube, i) => {
        const cell = cells[i] || { x: (VOXEL_COLS / 2) * VOXEL_PITCH, y: (VOXEL_ROWS / 2) * VOXEL_PITCH, rx: 0, ry: 0, rr: 0, ex: 0, ey: 0, er: 0 };
        const s = cube.style;
        s.setProperty("--x", `${cell.x}px`);
        s.setProperty("--y", `${cell.y}px`);
        s.setProperty("--rx", `${cell.rx.toFixed(1)}px`);
        s.setProperty("--ry", `${cell.ry.toFixed(1)}px`);
        s.setProperty("--rr", `${cell.rr.toFixed(1)}deg`);
        s.setProperty("--ex", `${cell.ex.toFixed(1)}px`);
        s.setProperty("--ey", `${cell.ey.toFixed(1)}px`);
        s.setProperty("--er", `${cell.er.toFixed(1)}deg`);
        s.setProperty("--s", cells[i] ? 1 : 0);
        if (cell.color) s.setProperty("--c", cell.color);
      });
    }

    // Follow the current slot (sticky section heads keep it in place while you read)
    let active = null;
    function place() {
      const r = active?.getBoundingClientRect();
      if (!r || !r.width) {
        box.classList.remove("ready");
        return;
      }
      box.style.transform = `translate(${r.left}px, ${r.top}px) scale(${r.width / (VOXEL_COLS * VOXEL_PITCH)})`;
      box.classList.add("ready");
    }

    // Current section: the last one whose top has passed 70% of the screen height (the last one
    // once you hit the bottom of the page, since short sections there never reach that line).
    // Narrow screens have no room under the section titles, so it stays in the hero there.
    const sections = [...slots.keys()];
    const narrow = window.matchMedia("(max-width: 1000px)");
    const heroSlot = slots.get($(".hero"));
    function currentSlot() {
      if (narrow.matches) return heroSlot || null;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) return slots.get(sections[sections.length - 1]);
      // At the very top it always starts in the first section (on tall screens the next one is already past the line)
      if (window.scrollY < 40) return slots.get(sections[0]);
      const line = window.innerHeight * 0.7;
      let current = sections[0];
      for (const section of sections) if (section.getBoundingClientRect().top <= line) current = section;
      return slots.get(current);
    }

    // Shape changes: the shape breaks apart while fading out, apply() swaps the slot and/or shape
    // while it's invisible (cubes still scattered), then it snaps together while fading back in
    let fadeTimer = 0, busy = false;
    function transition(apply) {
      clearTimeout(fadeTimer);
      if (!active || reducedMotion) return finish(apply);
      busy = true;
      box.classList.add("scatter", "fading");
      fadeTimer = setTimeout(() => finish(apply), 300);
    }
    function finish(apply) {
      box.classList.add("instant"); // cubes jump straight into the new (still scattered) shape
      apply();
      place();
      void box.offsetWidth; // apply the jump before the cube transitions come back
      box.classList.remove("instant", "fading", "scatter");
      busy = false;
    }

    // Slots with data-cycle (the hero) rotate through their shapes every 4 seconds,
    // paused while hovered or while the tab is in the background
    let cycleTimer = 0;
    function startCycle(slot) {
      clearInterval(cycleTimer);
      const names = slot ? [slot.dataset.shape, ...(slot.dataset.cycle || "").split(/\s+/).filter((n) => shapes[n])] : [];
      if (names.length < 2 || reducedMotion) return;
      let index = 0;
      cycleTimer = setInterval(() => {
        if (busy || document.hidden || box.classList.contains("shift")) return;
        index = (index + 1) % names.length;
        transition(() => setShape(names[index]));
      }, 4000);
    }

    // Switching sections: break apart at the old slot, come together at the new one
    let target = null;
    function update() {
      const slot = currentSlot();
      if (slot !== target) switchTo(slot);
      place();
    }
    function switchTo(slot) {
      target = slot;
      clearInterval(cycleTimer);
      transition(() => {
        active = slot;
        if (slot) setShape(slot.dataset.shape);
        startCycle(slot);
      });
    }

    narrow.addEventListener("change", update);

    let queued = false;
    const onMove = () => {
      if (!queued) requestAnimationFrame(() => { queued = false; update(); });
      queued = true;
    };
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);

    box.addEventListener("mouseenter", () => box.classList.add("shift"));
    box.addEventListener("mouseleave", () => box.classList.remove("shift"));
    update();
  }

  /* ---------- PDF viewer ---------- */
  const dialog = $("#pdf-dialog");
  const frame = $("#pdf-frame");
  const smallScreen = window.matchMedia("(max-width: 720px)");

  function openPdf(src, title) {
    // Mobile browsers often can't render embedded PDFs, so use their own viewer instead.
    if (smallScreen.matches || !dialog?.showModal) {
      window.open(src, "_blank", "noopener");
      return;
    }
    $("#pdf-title").textContent = title;
    $("#pdf-open").href = src;
    frame.src = `${src}#view=FitH`;
    dialog.showModal();
    document.body.classList.add("no-scroll");
  }

  if (dialog) {
    $("#pdf-close").addEventListener("click", () => dialog.close());
    // Close when clicking the backdrop
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      frame.src = "about:blank";
      document.body.classList.remove("no-scroll");
    });
  }

  /* ---------- init ---------- */
  renderProfile();
  fillList($("#projects-list"), projects, "Nothing here yet.", renderProject);
  fillList($("#papers-list"), papers, "Nothing here yet.", renderPaper);
  renderAbout();
  renderHeroPhoto();
  renderStatus();
  if (projects.length) setText("#projects-meta", count(projects.length, "project"));
  if (papers.length) setText("#papers-meta", count(papers.length, "paper"));
  fillList($("#stack-list"), stack, "Nothing here yet.", renderStackGroup);
  fillList($("#education-list"), education, "Nothing here yet.", renderEducation);
  setText("#contact-text", contact.text);
  $("#year").textContent = new Date().getFullYear();
  renderAchievement();
  initXpBar();
  initReveal();
  initVoxel();

  /* ---------- highlight the current section in the top bar ---------- */
  const navLinks = [...document.querySelectorAll("#nav a")];
  if ("IntersectionObserver" in window && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((a) => a.classList.toggle("active", a.hash === `#${entry.target.id}`));
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
  }
})();
