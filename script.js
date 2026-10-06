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
    setText("#brand", profile.name);
    setText("#name", profile.name);
    setText("#tagline", profile.tagline);
    setText("#intro", profile.intro);
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
  function renderProject(p) {
    const title = el("h3", {}, p.repo ? externalLink(p.repo, p.title) : p.title);

    const actions = el("div", { class: "project-actions" });
    if (p.repo) actions.append(el("a", { href: p.repo, target: "_blank", rel: "noopener", class: "btn btn-primary" }, "View project"));
    if (p.demo) actions.append(el("a", { href: p.demo, target: "_blank", rel: "noopener", class: "btn" }, "Live demo"));

    return el("article", { class: "card project" },
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
              el("span", { class: "grade-label" }, "Grade"),
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
  const row = (label, value) => el("div", {}, el("dt", {}, label), el("dd", {}, value));

  function renderAbout() {
    $("#about-body")?.append(...(about.paragraphs || []).map((t) => el("p", {}, t)));
  }

  // Card next to the name at the top: photo (or initials), name, tagline and the facts from ABOUT
  function renderProfileCard() {
    const card = $("#profile-card");
    if (!card) return;
    const name = profile.name || "";
    const initials = name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("");
    // With a photo: large picture across the top of the card. Without: small initials badge.
    if (profile.photo) {
      card.classList.add("has-photo");
      card.append(el("img", { class: "profile-photo", src: profile.photo, alt: name }));
    }

    card.append(
      el("div", { class: "profile-top" },
        profile.photo ? null : el("div", { class: "avatar", "aria-hidden": "true" }, initials),
        el("div", {},
          el("p", { class: "profile-name" }, name),
          profile.tagline ? el("p", { class: "profile-sub" }, profile.tagline) : null
        )
      )
    );
    if (about.facts?.length) {
      card.append(el("dl", { class: "rows" }, ...about.facts.map((f) => row(f.label, f.value))));
    }
  }

  const count = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  function renderEducation(e) {
    return el("article", { class: "card edu" },
      el("p", { class: "edu-date" }, e.date || ""),
      el("div", {},
        el("h3", {}, e.title),
        e.place ? el("p", { class: "edu-place" }, e.place) : null,
        e.description ? el("p", { class: "edu-text" }, e.description) : null
      )
    );
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
  renderProfileCard();
  if (projects.length) setText("#projects-meta", count(projects.length, "project"));
  if (papers.length) setText("#papers-meta", count(papers.length, "paper"));
  fillList($("#stack-list"), stack, "Nothing here yet.", (g) => row(g.group, tags(g.items)));
  fillList($("#education-list"), education, "Nothing here yet.", renderEducation);
  setText("#contact-text", contact.text);
  $("#year").textContent = new Date().getFullYear();

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
