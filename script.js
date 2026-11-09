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

  // Touch screens (no hover): cards aren't one big link there, so a tap meant to scroll or to read
  // doesn't send the visitor off to GitHub; only the titles and buttons are links
  const touchScreen = window.matchMedia("(hover: none)");

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

    // Location / languages line under the tagline
    const stats = $("#hero-stats");
    const statRows = [
      ["Based in", profile.location],
      ["Speaks", profile.languages],
    ].filter(([, value]) => value);
    if (stats && statRows.length) {
      stats.append(...statRows.map(([label, value]) => el("div", {}, el("dt", {}, label), el("dd", {}, value))));
    } else stats?.remove();
    setText("#footer-name", profile.name);
    setText("#brand-name", profile.name);

    document.querySelectorAll("[data-profile]").forEach((link) => {
      const key = link.dataset.profile;
      const value = profile[key];
      if (!value) {
        (link.closest("li") || link).remove();
        return;
      }
      const isUrl = /^https?:\/\//.test(value);
      const name = link.textContent.trim();

      // CV: a file link that keeps its text label, so it's obvious at a glance
      if (key === "cv") {
        link.textContent = "";
        link.append(icon("cv"), el("span", {}, name));
        link.href = value;
        return;
      }

      // Icon, plus the value (email address / username) where the link asks for it
      link.textContent = "";
      link.append(icon(key));
      const label = link.hasAttribute("data-show-value") && !isUrl
        ? link.appendChild(el("span", {}, value))
        : null;
      link.setAttribute("aria-label", label ? `${name}: ${value}` : name);
      link.title = name;
      if (!label) link.classList.add("chip-icon");

      // Email with the address shown (Contact): clicking copies it, the paper plane next to it
      // opens the mail app (mailto: often does nothing on PCs without one)
      if (key === "email" && label) {
        makeCopyLink(link, label, value, "email address");
        const send = el("a", { class: "chip chip-icon", href: `mailto:${value}`, "aria-label": "Write an email", title: "Write an email" }, icon("send"));
        const item = link.closest("li");
        if (item) item.after(el("li", {}, send));
        else link.after(send);
        return;
      }
      link.href = key === "email" ? `mailto:${value}` : value;
    });
  }

  // For the email address with the value shown: clicking copies it instead of navigating.
  function makeCopyLink(link, label, value, what) {
    link.href = "#";
    link.removeAttribute("target");
    link.title = `Copy ${what} "${value}"`;
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      let copied = true;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        copied = false;
      }
      label.textContent = copied ? "Copied" : value;
      setTimeout(() => (label.textContent = value), 1500);
    });
  }

  /* ---------- icons (GitHub and LinkedIn logos from Simple Icons) ---------- */
  const ICONS = {
    github: '<path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>',
    linkedin: '<path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
    email: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></g>',
    // Lucide "file-text" (CV download)
    cv: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></g>',
    // Lucide "chevron-down" (Other projects toggle)
    chevron: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/>',
    // Lucide "send" (paper plane)
    send: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></g>',
  };

  function icon(key) {
    const span = el("span", { class: "icon", "aria-hidden": "true" });
    // Static, trusted markup from ICONS above (never user data)
    span.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16">${ICONS[key] || ""}</svg>`;
    return span;
  }

  // Muted mono line "a · b · c" (tech of other projects, education focus)
  const techLine = (items) => el("p", { class: "tech-line" }, items.join(" · "));

  /* ---------- projects ---------- */
  // "View project" / "Live demo" links (null if the project has neither)
  function projectLinks(p) {
    const actions = el("div", { class: "project-actions" });
    if (p.repo) actions.append(el("a", { href: p.repo, target: "_blank", rel: "noopener", class: "btn btn-primary" }, "View project"));
    if (p.demo) actions.append(el("a", { href: p.demo, target: "_blank", rel: "noopener", class: "btn" }, "Live demo"));
    return actions.childElementCount ? actions : null;
  }

  // Project links plus a "Details" button that opens the details window
  function projectActions(p) {
    const actions = projectLinks(p);
    if (!hasDetails(p)) return actions;
    const button = detailsButton(p, "btn");
    if (!actions) return el("div", { class: "project-actions" }, button);
    actions.append(button);
    return actions;
  }

  const hasDetails = (p) => Boolean(p.details?.length || p.highlights?.length);

  function detailsButton(p, className) {
    const button = el("button", { type: "button", class: className, "aria-haspopup": "dialog" }, "Details");
    button.addEventListener("click", () => openDetails(p));
    return button;
  }

  // Details window: longer description and technical highlights from PROJECTS
  const detailsDialog = $("#details-dialog");
  function openDetails(p) {
    if (!detailsDialog?.showModal) {
      if (p.repo) window.open(p.repo, "_blank", "noopener");
      return;
    }
    const paragraphs = [].concat(p.details?.length ? p.details : p.description || []);
    const parts = [
      el("h2", { id: "details-title" }, p.title),
      ...paragraphs.map((text) => el("p", { class: "details-text" }, text)),
      p.highlights?.length
        ? el("section", { class: "details-block" },
            el("h3", { class: "quest-label" }, "Technical highlights"),
            el("ul", { class: "details-highlights" }, ...p.highlights.map((h) => el("li", {}, h))))
        : null,
      p.tech?.length
        ? el("section", { class: "details-block" },
            el("h3", { class: "quest-label" }, "Built with"),
            el("ul", { class: "tech-pills", "aria-label": "Technologies" }, ...p.tech.map(techPill)))
        : null,
      projectLinks(p),
    ];
    $("#details-body").replaceChildren(...parts.filter(Boolean));
    detailsDialog.style.transform = "";
    detailsDialog.showModal();
    $("#details-body").scrollTop = 0;
    document.body.classList.add("no-scroll");
    // A history entry, so the phone's back button / back swipe closes the window instead of leaving the page
    history.pushState({ details: true }, "");
  }

  if (detailsDialog) {
    $("#details-close").addEventListener("click", () => detailsDialog.close());
    detailsDialog.addEventListener("click", (e) => {
      if (e.target === detailsDialog) detailsDialog.close();
    });
    detailsDialog.addEventListener("close", () => {
      document.body.classList.remove("no-scroll");
      if (history.state?.details) history.back(); // closed with the button: drop the extra history entry
    });
    window.addEventListener("popstate", () => { if (detailsDialog.open) detailsDialog.close(); });
    initSheetDrag(detailsDialog, $(".details-header"));
  }

  // Phones show the details window as a bottom sheet: dragging its header down closes it
  function initSheetDrag(sheet, handle) {
    const phone = window.matchMedia("(max-width: 720px)");
    let startY = null, dy = 0;
    handle.addEventListener("pointerdown", (e) => {
      if (!phone.matches || e.target.closest("button")) return;
      startY = e.clientY;
      dy = 0;
      sheet.classList.add("dragging");
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (startY === null) return;
      dy = Math.max(0, e.clientY - startY);
      sheet.style.transform = `translateY(${dy}px)`;
    });
    const end = () => {
      if (startY === null) return;
      startY = null;
      sheet.classList.remove("dragging");
      if (dy > 90) sheet.close();
      else sheet.style.transform = "";
    };
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  }

  // Featured project content: label + status badge and tech over a hairline, then title, description
  // and buttons. Tech uses the logo + name items from the Stack section.
  function projectContent(p, label, extra) {
    return [
      el("div", { class: "project-head rule-head" },
        el("div", { class: "project-label" }, el("p", { class: "quest-label" }, label), extra),
        p.tech?.length ? el("ul", { class: "project-tech" }, ...p.tech.map(stackItem)) : null),
      el("h3", {}, p.repo ? externalLink(p.repo, p.title) : p.title),
      p.description ? el("p", {}, p.description) : null,
      // Phones: the tech moves out of the crowded header into pills under the description (CSS)
      p.tech?.length ? el("ul", { class: "tech-pills featured-pills", "aria-label": "Technologies" }, ...p.tech.map(techPill)) : null,
      projectActions(p),
    ];
  }

  // Highlighted project: title and description first, then the tech as small logo pills, then the buttons
  function renderProject(p) {
    return el("article", { class: "project rule-top" },
      el("h3", {}, p.repo ? externalLink(p.repo, p.title) : p.title),
      p.description ? el("p", {}, p.description) : null,
      p.tech?.length ? el("ul", { class: "tech-pills", "aria-label": "Technologies" }, ...p.tech.map(techPill)) : null,
      projectActions(p));
  }

  // Same logo + name as a Stack item, styled as a pill
  function techPill(name) {
    const item = stackItem(name);
    item.className = "tech-pill";
    return item;
  }

  // Compact row for the "Other projects" list: title on the left, description + tech in the middle,
  // "Details" button on the right
  function renderOtherProject(p) {
    return el("li", { class: "side-quest" },
      el("h3", {}, p.repo ? externalLink(p.repo, p.title) : p.title),
      el("div", {},
        p.description ? el("p", {}, p.description) : null,
        p.tech?.length ? techLine(p.tech) : null),
      hasDetails(p) ? detailsButton(p, "btn btn-sm side-details") : null
    );
  }

  // Collapsed by default behind a toggle row (title, count, preview of the names), so visitors who
  // don't want the full list don't have to scroll past it. The list slides open on click.
  function renderOtherProjects(list) {
    const panelId = "other-projects-panel";
    const action = el("span", { class: "other-action" }, "Show all");
    const toggle = el("button", { type: "button", class: "other-toggle", "aria-expanded": "false", "aria-controls": panelId },
      el("span", { class: "other-title" }, "Other projects"),
      el("span", { class: "other-count" }, String(list.length)),
      el("span", { class: "other-preview", "aria-hidden": "true" }, list.map((p) => p.title).join(", ")),
      action, icon("chevron"));
    const panel = el("div", { class: "other-panel", id: panelId },
      el("div", {}, el("ul", { class: "side-quests" }, ...list.map(renderOtherProject))));
    panel.inert = true; // collapsed rows can't be tabbed into

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      // Collapsing from further down the list: bring the toggle back into view first,
      // so the page doesn't jump to whatever comes after the list
      if (!open && toggle.getBoundingClientRect().top < 0) toggle.scrollIntoView({ block: "start" });
      toggle.setAttribute("aria-expanded", String(open));
      action.textContent = open ? "Show less" : "Show all";
      panel.classList.toggle("open", open);
      panel.inert = !open;
    });
    return [el("h3", { class: "other-head" }, toggle), panel];
  }

  // Featured project: a panel with the status badge in the header and the highlighted stat on the right
  function renderFeaturedProject(p) {
    const status = p.status
      ? el("span", { class: `featured-status${p.continued === false ? " off" : ""}` },
          el("span", { class: "dot", "aria-hidden": "true" }), p.status)
      : null;
    const side = el("div", { class: "featured-side" },
      p.stat ? el("span", { class: "featured-value" }, p.stat.value) : null,
      p.stat?.label ? el("span", { class: "featured-label" }, p.stat.label) : null
    );
    return el("article", { class: "project featured" },
      el("div", { class: "featured-main" }, ...projectContent(p, "Featured", status)),
      side.childElementCount ? side : null
    );
  }

  /* ---------- GitHub profile card ---------- */
  // Compact card under the projects: avatar, name and a few stats, the whole card links to the profile.
  // Data comes live from the GitHub API (+ github-contributions-api.jogruber.de for the yearly count)
  // and is cached in the browser for an hour (the GitHub API allows 60 requests per hour without a token).
  const GH_CACHE_KEY = "gh-profile-v3";
  const GH_CACHE_MS = 60 * 60 * 1000;
  // Colors for the language bar: the Stack logo colors where there is one, else GitHub's own
  const LANG_COLORS = { Rust: "#dea584", TypeScript: "#3178c6", Go: "#00add8", Shell: "#89e051", Kotlin: "#a97bff", "C#": "#178600" };
  const langColor = (name) => STACK_ICONS[name]?.colors?.[0] || LANG_COLORS[name] || "var(--muted)";

  async function fetchGithubProfile(user) {
    try {
      const cached = JSON.parse(localStorage.getItem(GH_CACHE_KEY));
      if (cached?.user === user && Date.now() - cached.ts < GH_CACHE_MS) return cached.data;
    } catch { /* storage blocked or empty */ }

    const json = (res) => (res.ok ? res.json() : null);
    const [userData, repos, contrib] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`).then(json).catch(() => null),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`).then(json).catch(() => null),
      fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`).then(json).catch(() => null),
    ]);
    if (!userData && !repos && !contrib) return null;

    // Languages: share of (own, non-fork) repositories per main language
    const own = Array.isArray(repos) ? repos.filter((r) => !r.fork) : [];
    const langCount = {};
    for (const r of own) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    const langTotal = Object.values(langCount).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, n]) => ({ name, share: n / langTotal }));
    const lastPush = own.map((r) => r.pushed_at).filter(Boolean).sort().pop() || null;

    const data = {
      name: userData?.name || null,
      repos: userData?.public_repos ?? (own.length || null),
      since: userData?.created_at ? new Date(userData.created_at).getFullYear() : null,
      contributions: contrib?.total?.lastYear ?? null,
      lastPush,
      languages,
    };
    try {
      localStorage.setItem(GH_CACHE_KEY, JSON.stringify({ user, ts: Date.now(), data }));
    } catch { /* fine, just not cached */ }
    return data;
  }

  // "today", "yesterday", "3 days ago", "2 weeks ago", ...
  function timeAgo(iso) {
    const days = Math.round((Date.now() - new Date(iso)) / 86400000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (days < 7) return rtf.format(-days, "day");
    if (days < 60) return rtf.format(-Math.round(days / 7), "week");
    if (days < 730) return rtf.format(-Math.round(days / 30), "month");
    return rtf.format(-Math.round(days / 365), "year");
  }

  function renderGithubCard() {
    const box = $("#github-card");
    const user = profile.github?.match(/github\.com\/([^/?#]+)/)?.[1];
    if (!box || !user || profile.githubStats === false) {
      box?.remove();
      return;
    }

    const stat = (label) => {
      const value = el("dd", {}, "—");
      return [el("div", { class: "gh-stat" }, el("dt", {}, label), value), value];
    };
    const [reposRow, reposValue] = stat("Public repos");
    const [contribRow, contribValue] = stat("Contributions");
    const [sinceRow, sinceValue] = stat("On GitHub since");
    const [pushRow, pushValue] = stat("Last push");
    contribRow.title = "Last 12 months";

    // The avatar is loaded straight from github.com, so it shows even when the API is rate-limited
    const avatar = el("img", { class: "gh-avatar", src: `https://github.com/${user}.png?size=160`, alt: "", width: "56", height: "56", loading: "lazy" });
    avatar.addEventListener("error", () => avatar.remove());
    const name = el("span", { class: "gh-name" }, profile.name || user);
    const langs = el("div", { class: "gh-langs" });

    const card = el("a", { class: "gh-card", href: profile.github, target: "_blank", rel: "noopener", "aria-label": `GitHub profile of ${profile.name || user} (@${user})` },
      el("div", { class: "gh-id" },
        el("span", { class: "gh-avatar-wrap" }, avatar, el("span", { class: "gh-badge" }, icon("github"))),
        el("span", { class: "gh-who" }, name, el("span", { class: "gh-handle" }, `@${user}`)),
        el("span", { class: "gh-cta" }, el("span", { class: "gh-cta-text" }, "View profile"), el("span", { class: "gh-arrow", "aria-hidden": "true" }, "↗"))),
      el("dl", { class: "gh-stats" }, reposRow, contribRow, sinceRow, pushRow),
      langs
    );
    box.replaceWith(card);

    fetchGithubProfile(user).then((data) => {
      if (!data) {
        card.querySelector(".gh-stats").remove();
        langs.remove();
        return;
      }
      if (data.name) name.textContent = data.name;
      const show = (node, value) => { if (value != null) node.textContent = value; };
      show(reposValue, data.repos?.toLocaleString("en-US"));
      show(contribValue, data.contributions?.toLocaleString("en-US"));
      show(sinceValue, data.since);
      show(pushValue, data.lastPush ? timeAgo(data.lastPush) : null);
      [[reposRow, data.repos], [contribRow, data.contributions], [sinceRow, data.since], [pushRow, data.lastPush]]
        .forEach(([row, value]) => { if (value == null) row.remove(); });

      // Language split: a pixel bar (one block per ~5%) plus a legend of the top four
      if (!data.languages?.length) {
        langs.remove();
        return;
      }
      const top = data.languages.slice(0, 4);
      const rest = 1 - top.reduce((sum, l) => sum + l.share, 0);
      const parts = rest > 0.001 ? [...top, { name: "Other", share: rest, other: true }] : top;
      const bar = el("div", { class: "gh-bar", "aria-hidden": "true" }, ...parts.map((l) => {
        const seg = el("span");
        seg.style.flexGrow = l.share;
        seg.style.setProperty("--lang", l.other ? "var(--line-strong)" : langColor(l.name));
        return seg;
      }));
      const legend = el("ul", { class: "gh-legend", "aria-label": "Languages across my repositories" }, ...parts.map((l) => {
        const swatch = el("span", { class: "gh-swatch", "aria-hidden": "true" });
        swatch.style.setProperty("--lang", l.other ? "var(--line-strong)" : langColor(l.name));
        return el("li", {}, swatch, l.name, el("span", { class: "gh-pct" }, `${Math.round(l.share * 100)}%`));
      }));
      langs.append(el("p", { class: "quest-label" }, "Languages"), bar, legend);
      card.classList.add("is-live");
    });
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

    const card = el("article", { class: p.pdf ? "paper clickable" : "paper" },
      el("div", { class: "paper-top rule-head" },
        el("p", { class: "paper-meta" }, meta),
        p.grade
          ? el("p", { class: "grade" },
              el("span", { class: "grade-label" }, "Grade"),
              el("span", { class: "grade-value" }, p.grade))
          : null
      ),
      el("h3", {}, p.title),
      p.abstract ? el("p", { class: "abstract" }, p.abstract) : null,
      actions.childElementCount ? actions : null
    );

    // Clicking anywhere on the card does the same as "Read paper"
    // (except on the buttons themselves, when the visitor is selecting text, and on touch screens,
    // where a tap on the text would otherwise open the PDF in a new tab)
    if (p.pdf) {
      card.addEventListener("click", (e) => {
        if (touchScreen.matches || e.target.closest("a, button")) return;
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
    "HTML": dev("html5-plain", "#e34f26"),
    "CSS": dev("css3-plain", "#2965f1"),
    "json": dev("json-plain", "#cbcb41"),
    "bash": dev("bash-plain", "#4eaa25"),
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

  // Icons for the group rows
  const STACK_GROUP_ICONS = {
    code: svg('<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'),
    web: svg('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
    game: svg('<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>'),
    tools: svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    concepts: svg('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'),
  };

  // Adds the logo(s) for a STACK_ICONS entry to node and sets its brand color
  function fillStackLogo(node, icon) {
    // Static, trusted markup from STACK_ICONS (never user data)
    if (icon.svg) {
      node.insertAdjacentHTML("beforeend", icon.svg);
      if (icon.colors) node.style.setProperty("--brand", icon.colors[0]);
    } else {
      node.style.setProperty("--brand", icon.colors[0]);
      node.append(...icon.names.map((n, i) => {
        const logo = el("i", { class: `devicon-${n}`, "aria-hidden": "true" });
        logo.style.setProperty("--brand", icon.colors[i] || icon.colors[0]);
        return logo;
      }));
    }
  }

  // Logo + name list item (Stack section and project rows); names without a logo get a small square instead
  function stackItem(name) {
    const icon = STACK_ICONS[name];
    const logo = el("span", { class: `stack-logo${icon ? "" : " none"}`, "aria-hidden": "true" });
    if (icon) fillStackLogo(logo, icon);
    return el("li", { class: "stack-item" }, logo, el("span", {}, name));
  }

  // One row per group: label (icon + name) on the left, the technologies as logo pills on the right
  function renderStackGroup(g) {
    const iconBox = el("span", { class: "stack-group-icon", "aria-hidden": "true" });
    // Static, trusted markup from STACK_GROUP_ICONS (never user data)
    iconBox.innerHTML = STACK_GROUP_ICONS[g.icon] || "";
    const pills = (g.items || []).map((name) => {
      const pill = techPill(name);
      pill.classList.add("stack-pill");
      return pill;
    });
    return el("div", { class: "stack-row" },
      el("div", { class: "stack-label" }, iconBox, el("h3", {}, g.group)),
      el("ul", { class: "stack-pills", "aria-label": g.group }, ...pills)
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
    return el("article", { class: `about-card${c.wide ? " wide" : ""}` },
      el("div", { class: "about-head rule-head" },
        iconBox,
        el("div", {},
          el("h3", {}, c.title))
      ),
      el("p", {}, c.text),
      c.link ? el("a", { class: "about-link", href: c.link.href }, `${c.link.text} →`) : null
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
    // Lucide "gamepad-2" (self-driven projects)
    projects: svg('<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>'),
    school: svg('<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.45 1.73a1 1 0 0 1 .55.9V21a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8.38a1 1 0 0 1 .55-.9L6 10"/><path d="M18 5v17"/><path d="m4 6 7.1-3.55a2 2 0 0 1 1.8 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>'),
  };

  function renderEducation(e) {
    const current = /present/i.test(e.date || "");
    const node = el("span", { class: "edu-node", "aria-hidden": "true" });
    // Static, trusted markup from EDU_ICONS (never user data)
    node.innerHTML = EDU_ICONS[e.icon] || EDU_ICONS.school;

    return el("article", { class: `edu${current ? " current" : ""}` },
      node,
      el("div", { class: "edu-body" },
        el("div", { class: "edu-top" },
          el("p", { class: "edu-date" }, e.date || ""),
          el("span", { class: `edu-badge${current ? "" : " done"}` }, current ? "Current" : "Completed"),
          // Optional final grade, styled like the grade of a paper
          e.grade
            ? el("p", { class: "grade edu-grade" },
                el("span", { class: "grade-label" }, "Grade"),
                el("span", { class: "grade-value" }, e.grade))
            : null
        ),
        el("h3", {}, e.title),
        e.place ? el("p", { class: "edu-place" }, e.place) : null,
        e.description ? el("p", { class: "edu-text" }, e.description) : null,
        e.focus?.length ? techLine(e.focus) : null
      )
    );
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- keyboard: 1–6 jump to a section, plus a hidden Konami code easter egg ---------- */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

  function initKeys(voxel) {
    const levels = [...document.querySelectorAll("#nav a")];
    let progress = 0;
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || dialog?.open) return;
      if (e.target.closest?.("input, textarea, select, [contenteditable]")) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress]) progress++;
      else if (key === "ArrowUp") progress = progress === 2 ? 2 : 1; // extra "up" at the start
      else progress = 0;
      if (progress === KONAMI.length) {
        progress = 0;
        voxel?.celebrate();
        return;
      }

      // 1–6: jump to that section, like the numbers above the section titles
      const level = Number(e.key);
      if (!Number.isInteger(level) || level < 1 || level > levels.length) return;
      const target = $(levels[level - 1].hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  // Thin bar under the top bar that fills up as you scroll
  function initScrollProgress() {
    const fill = $("#progress-fill");
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

  // Section headings fade in once when they come into view
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
  // (hero: code, Projects: computer, ...); when you scroll on it fades out and fades back in
  // at the next slot as that slot's shape. Hovering blows it apart into its cubes (a tap on touch screens).
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
    braces: [
      "..ccc..........ccc..",
      ".cc..............cc.",
      ".cc..............cc.",
      ".cc..............cc.",
      ".cc..............cc.",
      "cc...ww..ww..ww...cc",
      "cc...ww..ww..ww...cc",
      ".cc..............cc.",
      ".cc..............cc.",
      ".cc..............cc.",
      ".cc..............cc.",
      "..ccc..........ccc..",
    ],
    chip: [
      "...m.m.m.m.m...",
      "..ddddddddddd..",
      "mmdaaaaaaaaadmm",
      "..dwaaaaaaaad..",
      "mmdaalllllaadmm",
      "..daalggglaad..",
      "mmdaalggglaadmm",
      "..daalggglaad..",
      "mmdaalllllaadmm",
      "..daaaaaaaaad..",
      "mmdaaaaaaaaadmm",
      "..ddddddddddd..",
      "...m.m.m.m.m...",
    ],
    database: [
      "....llllllll....",
      ".llllllllllllll.",
      "aallllllllllllaa",
      "aaaallllllllaaaa",
      "aaaaaaaaaaaaaaga",
      "aaaaaaaaaaaaaaaa",
      "dddaaaaaaaaaaddd",
      "aaaddddddddddaaa",
      "aaaaaaaaaaaaaaga",
      "aaaaaaaaaaaaaaaa",
      "dddaaaaaaaaaaddd",
      "aaaddddddddddaaa",
      ".aaaaaaaaaaaaaa.",
      "....aaaaaaaa....",
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
    // Konami code easter egg (shown in rainbow colors, see .rainbow)
    oneup: [
      "..gg...gg..gg.gggg..",
      "..gg...gg..gg.gggg..",
      "gggg...gg..gg.gg..gg",
      "gggg...gg..gg.gg..gg",
      "..gg...gg..gg.gggg..",
      "..gg...gg..gg.gggg..",
      "..gg...gg..gg.gg....",
      "..gg...gg..gg.gg....",
      "gggggg.gggggg.gg....",
      "gggggg.gggggg.gg....",
    ],
  };

  // Grid → list of cubes { x, y, color, hx, hy, hr, hs, ex, ey, er }
  // (hx/hy/hr/hs: where it flies when hovered; ex/ey/er: where it flies when the shape changes)
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
      const burst = 30 + Math.random() * 40;
      // Hover: every cube flies in its own random direction (so neighbours cross and the outline is
      // lost), with only a slight push away from the middle and a small drop as if falling
      const angle = Math.random() * Math.PI * 2;
      const dist = 16 + Math.random() * 30;
      return {
        x: (c + offC) * VOXEL_PITCH, y: (r + offR) * VOXEL_PITCH, color: VOXEL_COLORS[ch],
        hx: Math.cos(angle) * dist + dx * 14, hy: Math.sin(angle) * dist + dy * 10 + 6,
        hr: (Math.random() - 0.5) * 360, hs: 0.5 + Math.random() * 0.4,
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
        const cell = cells[i] || { x: (VOXEL_COLS / 2) * VOXEL_PITCH, y: (VOXEL_ROWS / 2) * VOXEL_PITCH, hx: 0, hy: 0, hr: 0, hs: 1, ex: 0, ey: 0, er: 0 };
        const s = cube.style;
        s.setProperty("--x", `${cell.x}px`);
        s.setProperty("--y", `${cell.y}px`);
        s.setProperty("--hx", `${cell.hx.toFixed(1)}px`);
        s.setProperty("--hy", `${cell.hy.toFixed(1)}px`);
        s.setProperty("--hr", `${cell.hr.toFixed(0)}deg`);
        s.setProperty("--hs", cell.hs.toFixed(2));
        s.setProperty("--ex", `${cell.ex.toFixed(1)}px`);
        s.setProperty("--ey", `${cell.ey.toFixed(1)}px`);
        s.setProperty("--er", `${cell.er.toFixed(1)}deg`);
        s.setProperty("--s", cells[i] ? 1 : 0);
        if (cell.color) s.setProperty("--c", cell.color);
      });
    }

    // The figure lives inside the current slot, so it scrolls (and sticks under the section
    // title) together with the page instead of being repositioned from JavaScript, which lags a frame
    let active = null;
    function mount() {
      const width = active?.clientWidth;
      if (!width) {
        box.classList.remove("ready");
        return;
      }
      if (box.parentElement !== active) active.append(box);
      box.style.transform = `scale(${width / (VOXEL_COLS * VOXEL_PITCH)})`;
      box.classList.add("ready");
    }

    // Current section: the last one whose top has passed a line on the screen: 70% of the height
    // while scrolling down, 30% while scrolling up, so it switches early in both directions
    // (and the last one once you hit the bottom of the page, since short sections there never reach the line).
    // Narrow screens have no room under the section titles, so it stays in the hero there.
    const sections = [...slots.keys()];
    const narrow = window.matchMedia("(max-width: 1000px)");
    const heroSlot = slots.get($(".hero"));
    let lastY = window.scrollY, scrollingUp = false;
    function currentSlot() {
      if (window.scrollY !== lastY) scrollingUp = window.scrollY < lastY;
      lastY = window.scrollY;
      if (narrow.matches) return heroSlot || null;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) return slots.get(sections[sections.length - 1]);
      // At the very top it always starts in the first section (on tall screens the next one is already past the line)
      if (window.scrollY < 40) return slots.get(sections[0]);
      const line = window.innerHeight * (scrollingUp ? 0.3 : 0.7);
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
      mount(); // moves to the new slot while invisible
      void box.offsetWidth; // apply the jump before the cube transitions come back
      box.classList.remove("instant", "fading", "scatter", "burst"); // arrives in one piece
      busy = false;
    }

    // Slots with data-cycle (the hero) rotate through their shapes every 4 seconds, paused while
    // hovered, while the tab is in the background and while you scroll (so it doesn't start a
    // change right before a section switch)
    let cycleTimer = 0, lastScroll = 0, offscreen = false;
    function startCycle(slot) {
      clearInterval(cycleTimer);
      const names = slot ? [slot.dataset.shape, ...(slot.dataset.cycle || "").split(/\s+/).filter((n) => shapes[n])] : [];
      if (names.length < 2 || reducedMotion) return;
      let index = 0;
      cycleTimer = setInterval(() => {
        if (busy || celebrating || offscreen || document.hidden || box.classList.contains("burst") || performance.now() - lastScroll < 600) return;
        index = (index + 1) % names.length;
        transition(() => setShape(names[index]));
      }, 4000);
    }

    // Switching sections: break apart at the old slot, come together at the new one
    let target = null;
    function update() {
      const slot = currentSlot();
      if (slot !== target) switchTo(slot);
    }
    function switchTo(slot) {
      target = slot;
      clearInterval(cycleTimer);
      transition(() => {
        stopCelebrating();
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
    window.addEventListener("scroll", () => {
      lastScroll = performance.now();
      onMove();
    }, { passive: true });
    window.addEventListener("resize", () => {
      onMove();
      mount(); // slot size can change (e.g. the hero slot on narrow screens)
    });

    // Easter egg: "1UP" in rainbow colors for a few seconds, then back to the current shape
    let celebrating = 0;
    function stopCelebrating() {
      clearTimeout(celebrating);
      celebrating = 0;
      box.classList.remove("rainbow");
    }
    function celebrate() {
      if (!active) return;
      clearTimeout(celebrating);
      transition(() => {
        setShape("oneup");
        box.classList.add("rainbow");
      });
      celebrating = setTimeout(() => transition(() => {
        stopCelebrating();
        if (active) setShape(active.dataset.shape);
      }), 3000);
    }

    // Mouse: blown apart while hovered, back together on leave.
    // Touch (no hover): a tap blows it apart and it comes back together by itself.
    let tapTimer = 0;
    box.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && !busy) box.classList.add("burst"); });
    box.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") box.classList.remove("burst"); });
    box.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" || busy) return;
      clearTimeout(tapTimer);
      box.classList.add("burst");
      tapTimer = setTimeout(() => box.classList.remove("burst"), 1100);
    });

    // The hero cycle pauses while the figure is off screen (on phones it stays in the hero the whole
    // time, so it would otherwise keep animating while you read further down)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; }).observe(box);
    }
    update();
    return { celebrate };
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
  // featured: big card · highlight: cards below it · the rest: compact "Other projects" list
  // (if nothing is marked as highlight, every project gets a card)
  const featuredProject = projects.find((p) => p.featured);
  const restProjects = projects.filter((p) => p !== featuredProject);
  const anyHighlight = restProjects.some((p) => p.highlight);
  const highlightProjects = anyHighlight ? restProjects.filter((p) => p.highlight) : restProjects;
  const sideProjects = anyHighlight ? restProjects.filter((p) => !p.highlight) : [];
  if (featuredProject) $("#projects-featured").append(renderFeaturedProject(featuredProject));
  else $("#projects-featured").remove();
  if (featuredProject && !highlightProjects.length) $("#projects-list").remove();
  else fillList($("#projects-list"), highlightProjects, "Nothing here yet.", renderProject);
  if (sideProjects.length) $("#projects-other").append(...renderOtherProjects(sideProjects));
  else $("#projects-other").remove();
  renderGithubCard();
  fillList($("#papers-list"), papers, "Nothing here yet.", renderPaper);
  renderAbout();
  renderHeroPhoto();
  renderStatus();
  if (projects.length) setText("#projects-meta", count(projects.length, "project"));
  if (papers.length) setText("#papers-meta", count(papers.length, "paper"));
  fillList($("#stack-list"), stack, "Nothing here yet.", renderStackGroup);
  const techCount = stack.reduce((n, g) => n + (g.items?.length || 0), 0);
  if (techCount) setText("#stack-meta", techCount === 1 ? "1 technology" : `${techCount} technologies`);
  fillList($("#education-list"), education, "Nothing here yet.", renderEducation);
  setText("#contact-text", contact.text);
  $("#year").textContent = new Date().getFullYear();
  initScrollProgress();
  initReveal();
  initKeys(initVoxel());

  /* ---------- mobile menu ---------- */
  // Below 820px the section links live in a dropdown under the top bar. It closes when a link is
  // picked, on a tap outside, on Escape, and when the screen gets wide enough for the inline nav.
  function initMenu() {
    const topbar = $(".topbar");
    const toggle = $("#menu-toggle");
    const nav = $("#nav");
    if (!topbar || !toggle || !nav) return;
    const isOpen = () => topbar.classList.contains("menu-open");
    const setOpen = (open) => {
      topbar.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", () => setOpen(!isOpen()));
    // The dimmed backdrop under the open menu belongs to the top bar (::after), so a tap on it lands
    // here and only closes the menu, instead of also hitting a link behind it
    topbar.addEventListener("click", (e) => { if (e.target === topbar && isOpen()) setOpen(false); });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("click", (e) => { if (isOpen() && !topbar.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !isOpen()) return;
      setOpen(false);
      toggle.focus();
    });
    window.matchMedia("(min-width: 821px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }
  initMenu();

  /* ---------- highlight the current section in the top bar ---------- */
  const navLinks = [...document.querySelectorAll("#nav a")];
  if ("IntersectionObserver" in window && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach((a) => {
          const current = a.hash === `#${entry.target.id}`;
          a.classList.toggle("active", current);
          if (current) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
  }
})();
