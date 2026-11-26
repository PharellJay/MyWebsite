/*
 * ============================================================
 *  CONTENT FILE — edit this file to update your portfolio.
 *  Everything below is rendered automatically by script.js.
 * ============================================================
 */

/*
 * PROFILE — top of the page and your links.
 *   name, tagline   shown at the top of the page
 *   intro           short sentence under the header
 *   location, languages   small line under the tagline ("" to hide)
 *   status          badge above your name and in Contact, e.g. what you're looking for ("" to hide)
 *   photo           e.g. "assets/photo.jpg", shown next to your name ("" to hide)
 *   github, linkedin, email   used at the top and in the Contact section
 *   githubStats     true = GitHub profile card under the projects (avatar, name, live stats and
 *                   languages for the github account above; links to the profile) (false to hide)
 *   cv              path to your CV PDF, e.g. "papers/cv.pdf"; adds a "CV" button at the top and in Contact ("" to hide)
 */
const PROFILE = {
  name: "Pharell Jay Jeyakumar",
  tagline: "Software Engineering student at Hochschule Heilbronn",
  intro: "I build tools that solve real problems, from an anticheat protecting large game servers to small apps for everyday learning. Here you'll find my projects and papers.",
  location: "Heilbronn, Germany",
  languages: "German, English",
  status: "Open to internships & working student roles",
  photo: "",
  github: "https://github.com/PharellJay",
  githubStats: true,
  linkedin: "https://www.linkedin.com/in/pharell-jay-jeyakumar/",
  email: "contact@pharelljay.me",
  cv: "",
};

/*
 * PROJECTS — one object per project.
 *   title        (required)
 *   description  (required) one short sentence, shown on the page
 *   details      longer description, shown in the "Details" window (list of paragraphs)
 *   highlights   technical highlights, shown as a list in the "Details" window
 *   tech         list of technologies
 *   repo         link to the GitHub repository (the title links there)
 *   demo         optional link to a live version ("" to hide)
 *   highlight    true = in the spotlight carousel at the top (one slide each, with its picture); every project,
 *                spotlight or not, is also listed as a card under "All projects by topic"
 *   category     topic of the project, one of PROJECT_CATEGORIES below (the filter chips use it;
 *                projects without one land in "Other")
 *   caseStudy    optional link to a case-study page, e.g. "projects/npc-workshop.html" (its content lives in
 *                CASE_STUDIES); the title and a "Read case study" button then lead there
 *   visual       picture on the spotlight slide, one of:
 *                  { type: "browser", src, width, height, label, alt }   screenshot in a browser frame (label = address bar)
 *                  { type: "screen", src, width, height, caption, alt }  pixel-art screen, scaled up without blur
 *                  { type: "code", file, firstLine, code, alt }          real code in an editor window (Lua colouring)
 *   badge        spotlight only: extra label, e.g. "University project · HHN"
 *   tag          short version of the badge for the cards, e.g. "HHN"
 *   stat         spotlight only: highlighted number, e.g. { value: "16,000+", label: "registered players" }
 *   status       spotlight only: small badge text, e.g. "Live" or "Archived"
 *   continued    false = the status badge is grey (archived), otherwise green
 */

// Order of the topic filters. A new topic? Add it here and use the exact same name as "category".
const PROJECT_CATEGORIES = [
  "Security & Networking",
  "Games & Emulation",
  "AI & Machine Learning",
  "Bots & Automation",
  "Learning & Productivity",
  "Dev Tools & Web",
];

const PROJECTS = [
  {
    title: "NPC Workshop",
    category: "Games & Emulation",
    description: "A browser game that teaches students logic gates: repair a game's broken NPCs by wiring sensors, gates and actions, no coding needed. Built through a full Design Thinking process, from interviews to a playable prototype.",
    tech: ["JavaScript", "HTML", "CSS", "SVG"],
    repo: "https://github.com/PharellJay/NPCWorkshop",
    demo: "https://npcworkshop.pharelljay.me",
    caseStudy: "projects/npc-workshop.html",
    visual: {
      type: "browser", src: "assets/npc-workshop/game-main-menu.webp", width: 1127, height: 796, label: "npcworkshop.pharelljay.me",
      alt: "The NPC Workshop main menu: title and pitch, an AND gate lighting a lamp, the Wild West world map and the badges",
    },
    badge: "University project · HHN · team of 3",
    tag: "HHN",
    stat: { value: "7", label: "levels across 2 worlds" },
    status: "Live",
    highlight: true,
  },
  {
    title: "RedM Anticheat",
    category: "Security & Networking",
    description: "Over 16000 Players have been protected by this server-side driven anticheat for RedM (Red Dead Redemption 2 multiplayer) with 25+ detection modules, hardware-token bans and protected client code.",
    details: [
      "Deadeye Anticheat protected some of the biggest RedM community servers, with more than 16,000 players. " +
        "Detection runs on the server wherever possible, so a modified client can't simply switch it off.",
      "Every module can be toggled and tuned on its own, with separate log, kick and ban settings, exempt groups " +
        "and exempt zones, so server owners can fit it to their game modes without false positives.",
    ],
    highlights: [
      "25+ detection modules: godmode, invisibility, teleport, freecam, killaura, triggerbot (inhuman reaction times), enlarged hitboxes, infinite ammo, injected resources, entity spam and more",
      "Persistent MySQL bans matched on license, Steam, Discord, IP and hardware tokens, so a new account on the same machine is still recognised",
      "Built-in clientloader: the client code is sent to each player at runtime and executed in memory, so it can't be dumped from the cache; repeated requests are flagged as a dump attempt",
      "Discord integration: per-module webhook logs, a role check for online players and a priority connect queue with reserved slots and reconnect grace",
      "Stealth mode that hides the anticheat from players while ban checks keep running",
    ],
    tech: ["Lua", "SQL", "JavaScript", "HTML"],
    repo: "https://github.com/PharellJay/RedMAnticheat",
    demo: "",
    visual: {
      type: "code", file: "config.lua", firstLine: 71,
      alt: "Excerpt from config.lua: the list of detection modules, each switched on with true",
      code: "--MODULES\n---------\nConfig.Modules = {\n    Discordrolecheck = true,\n    Antirapidfire = true,\n    AntiAI = true,\n    AntiInjection = true,\n    NuiBlocker = true,\n    AntiCrash = true,\n    AntiDevmode = true,\n    ForceReleaseChannel = false, --(ALPHA)\n    AntiSpawnweapons = true,\n    BlacklistWeapons = true,\n    BlacklistAmmo = true,\n    AntiPedhack = true,\n    AntiInvincible = true,\n    AntiExplosion = true,\n    AntiFreecam = true, --(ALPHA)\n    AntiInvisible = true,\n    CommandDetection = true,\n    AntiKillaura = true,\n    AntiMasskill = true,\n    EntityBlacklist = true,\n    AntiEntityspam = true,",
    },
    stat: { value: "16,000+", label: "protected players" },
    status: "Archived",
    continued: false,
    highlight: true,
  },
  {
    title: "Lua Obfuscator",
    category: "Security & Networking",
    description: "A Lua obfuscator written in pure Lua, built around a bytecode virtual machine that turns protected functions into encrypted, per-build randomised bytecode.",
    details: [
      "The obfuscator reads Lua with its own lexer and parser and compiles selected functions into a private instruction set, " +
        "run by an interpreter that is emitted into the output. The original logic of a virtualised function no longer exists as code, only as opaque data.",
      "Around the VM, a pipeline of source-to-source passes hardens everything else. A round-trip test harness runs the original and the " +
        "obfuscated program side by side to prove they still behave identically, and an optional web UI runs the whole obfuscator in the browser, with nothing uploaded.",
    ],
    highlights: [
      "Lexer, parser, expression IR, VM compiler and interpreter generator, all in pure Lua with no dependencies",
      "The VM handles all control flow, varargs, multiple returns, closures with shared upvalues and coroutines, and falls back to native code for anything it can't compile safely",
      "Per-build hardening: permuted opcodes, encrypted string and number constants, and interpreter handlers emitted in a random order",
      "Control-flow flattening into state machines, dead code behind opaque predicates, scope-aware renaming, string and number encoding, constant pooling",
      "Anti-tamper loader whose decryption key is derived from a checksum of the payload, so editing a single byte breaks it",
      "Browser UI that runs the real obfuscator client-side in a Web Worker via Fengari (Lua compiled to JavaScript)",
    ],
    tech: ["Lua", "JavaScript"],
    repo: "https://github.com/PharellJay/LuaObfuscator",
    visual: {
      type: "browser", src: "assets/projects/lua-obfuscator-web.webp", width: 1145, height: 796, label: "Deadeye Obfuscator · web UI",
      alt: "The obfuscator's web UI: preset and pass settings on the left, an example file obfuscated in the browser with its build log on the right",
    },
    demo: "",
    highlight: true,
  },
  {
    title: "ChessML",
    category: "AI & Machine Learning",
    description: "A chess engine that teaches itself by self-play, AlphaZero-style, sized to train on an ordinary CPU, with a live dashboard to watch and play against it.",
    details: [
      "ChessML only knows the rules of chess. A small residual policy/value network guides a Monte Carlo tree search, plays against itself and learns from the results: " +
        "the AlphaZero approach, scaled down from months of TPU time to hours on a CPU.",
      "A local web interface controls the whole process. You can start, pause and resume training, follow losses, throughput and the current self-play game live, " +
        "measure strength in real Elo against Stockfish and play against any checkpoint.",
    ],
    highlights: [
      "Residual network (4 blocks × 48 channels, ~266k parameters), sized by benchmarking so network calls and tree search cost about the same on a CPU",
      "Batched MCTS: each worker plays 16 games at once and scores all their leaves in one network call; playout cap randomisation (from KataGo) for more games per CPU hour",
      "Multi-process pipeline of self-play workers, a trainer with a replay buffer and a separate evaluation process",
      "Self-calibrating resignation threshold and learning-rate drops based on averaged evaluation ratings",
      "Strength measured in Elo against Stockfish's rated mode, with a 95% confidence interval",
      "FastAPI + WebSocket dashboard with live charts, move probabilities and a playable board",
    ],
    tech: ["Python", "PyTorch", "FastAPI", "JavaScript"],
    repo: "https://github.com/PharellJay/ChessML",
    visual: {
      type: "browser", src: "assets/projects/chessml-play.webp", width: 1360, height: 745, label: "ChessML · play",
      alt: "ChessML's dashboard in play mode: a chess board on the left, the engine's candidate moves with visits and values on the right",
    },
    demo: "",
    highlight: true,
  },
  {
    title: "Game Boy Emulator",
    category: "Games & Emulation",
    description: "An original Game Boy (DMG) emulator written from scratch in Rust: load a .gb ROM and play it with video, sound, remappable controls, battery saves and save states.",
    details: [
      "The emulator core (CPU, picture and audio units, timer and cartridge mappers) is a standalone Rust crate with no dependencies and no windowing, audio or file I/O. " +
        "A separate desktop frontend adds the window, sound output, settings and save files.",
      "Accuracy is checked against well-known community test ROMs: the CPU and timing suites pass completely, and the rendering test matches its reference image pixel for pixel.",
    ],
    highlights: [
      "Full Sharp LR35902 CPU passing all of Blargg's cpu_instrs, instr_timing and mem_timing tests",
      "Pixel-exact rendering on dmg-acid2 and a four-channel APU passing most of Blargg's dmg_sound tests",
      "Cartridge support for ROM only, MBC1, MBC3 with real-time clock and MBC5, covering most of the Game Boy library",
      "Battery saves in the common BGB/VBA-M format, so saves from other emulators work, plus one save-state slot per game",
      "egui settings menu for volume, window scale and remappable controls; audio via cpal",
      "Workspace split into a dependency-free core and a desktop app, checked with clippy and rustfmt",
    ],
    tech: ["Rust", "egui", "cpal"],
    repo: "https://github.com/PharellJay/GBEmulator",
    visual: {
      type: "screen", src: "assets/projects/gb-emulator-tetris.png", width: 640, height: 576,
      caption: "Tetris, running in the emulator",
      alt: "A game of Tetris running in the emulator: a T piece falling onto a small stack, score 114, level 0",
    },
    demo: "",
    highlight: true,
  },
  {
    title: "Decentralised VPN",
    category: "Security & Networking",
    description: "A peer-to-peer VPN with no central server: traffic is routed through two encrypted hops and leaves the internet from another peer's IP.",
    details: [
      "Peers find each other through a distributed hash table, without any central server. Your traffic first goes to a relay, then to another peer's exit, " +
        "so the relay knows who you are but not where you're going, and the exit sees the destination but not you.",
      "The network works on a \"lend to use\" principle: you can only route traffic through it while your own machine lends its IP as an exit for others, " +
        "and once you've agreed to that, it lends automatically after every restart. " +
        "It installs as two Debian/Ubuntu packages: a background service that does the networking, and a desktop app with a tray icon to control it, no terminal or sudo needed.",
    ],
    highlights: [
      "Two-hop circuits with an end-to-end Noise handshake against the exit's signed key; the relay only ever forwards encrypted bytes",
      "Serverless discovery via Kademlia DHT and mDNS, NAT traversal with AutoNAT, hole punching and relays (libp2p)",
      "Kill switch: once connected, traffic is blocked instead of leaked when the tunnel drops; IPv6 blocked, DNS forced through the tunnel, no inbound connections from the exit",
      "Exit choice at random or by max ping, measured through encrypted test circuits so exits never see your IP; dedicated exits are preferred over other users'",
      "Exits refuse traffic to private networks and SMTP, with per-session rate limits",
      "systemd service controlled over a permission-checked Unix socket by a Tauri desktop app with a tray icon",
      "Packets padded to size buckets against fingerprinting; routes and firewall rules are restored even after a crash",
      "Tested end to end with real TUN devices, routes and NAT in throwaway network namespaces",
    ],
    tech: ["Rust", "libp2p", "Tokio", "Noise Protocol", "Tauri", "nftables"],
    repo: "https://github.com/PharellJay/DecentralisedVPN",
    demo: "",
  },
  {
    title: "My Website",
    category: "Dev Tools & Web",
    description: "This portfolio, built from scratch in plain HTML, CSS and JavaScript, with all content in a single data file.",
    details: [
      "No framework and no build step: everything you see is rendered by one script from a single data file, " +
        "so adding a new project or paper takes a few lines.",
      "The focus was on a clean, fast page that works just as well on a phone as on a large screen, with a few playful details along the way.",
    ],
    highlights: [
      "Content and logic fully separated: data.js holds the text, script.js renders every section",
      "A cube companion made of small voxels that follows you through the sections and morphs into a new shape for each one",
      "Tech logos that hop and give off a little pixel burst in their brand color on hover",
      "A live GitHub profile card with stats and a language breakdown, cached in the browser to stay within the API's rate limit",
      "Responsive down to small phones, with a fold-out menu, touch-sized buttons and reduced-motion support",
      "Built-in PDF viewer for papers and detail windows for projects, using the native <dialog> element",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    repo: "https://github.com/PharellJay/MyWebsite",
    demo: "",
  },
  {
    title: "Discord Music Bot",
    category: "Bots & Automation",
    description: "A music bot for our Discord server: play songs from YouTube or Spotify and control the shared queue with slash commands or buttons.",
    details: [
      "Paste a YouTube or Spotify link, or just type the name of a song, and everyone in the voice channel can manage the queue together.",
      "Spotify doesn't allow bots to stream its music, so the bot uses Spotify only to find the right track and then plays the official audio from YouTube Music.",
    ],
    highlights: [
      "Spotify search and links (tracks, albums, playlists), matched to YouTube Music audio; YouTube, SoundCloud and other yt-dlp sources work directly",
      "Full queue control: skip, previous, seek, move, shuffle, loop, remove duplicates or one person's songs, history",
      "Autoplay of similar songs when the queue runs out, plus lyrics for any song",
      "Now-playing message with buttons and a progress bar, and song names that autocomplete as you type",
      "Leaves by itself when it's alone or idle; actions are posted in the chat with who did them",
    ],
    tech: ["Python", "discord.py", "yt-dlp", "Spotify API"],
    repo: "https://github.com/PharellJay/DiscordMusicbot",
    demo: "",
  },
  {
    title: "NotebookLM Discord Bot",
    category: "Bots & Automation",
    description: "A Discord bot that lets everyone on a server ask questions of shared Google NotebookLM notebooks, add sources and build up notes together.",
    details: [
      "Link a channel to a notebook and anyone in it can ask with /ask or just mention the bot. The answer is posted in the channel with numbered citations, " +
        "so the whole group sees it and can follow up. Each channel and thread keeps its own conversation, so side questions don't get mixed into the main one.",
      "NotebookLM has no official API for asking questions, so the bot uses the unofficial notebooklm-py library, logged in as a dedicated Google account. " +
        "All NotebookLM access goes through a single module, which turns its errors into friendly messages.",
    ],
    highlights: [
      "Answers with numbered citations and a Sources button that shows the cited passages only to whoever clicks it",
      "Follow-up questions remember the conversation per channel or thread, even across restarts; questions in one channel run in order, different channels in parallel",
      "Save answers as shared notes, and add web pages, YouTube videos, files or pasted text as sources right from Discord",
      "Studio support: generate Audio and Video Overviews, slide decks, quizzes, mind maps and more, then post them as files in the channel",
      "Anyone can ask, only managers can link notebooks or change sources; per-user cooldowns keep the shared NotebookLM limits in check",
      "Notebook and source names autocomplete, and long answers are split across several messages to fit Discord's limits",
    ],
    tech: ["Python", "discord.py", "NotebookLM"],
    repo: "https://github.com/PharellJay/NotebookLMDiscordBot",
    demo: "",
  },
  {
    title: "Gitcheck",
    category: "Dev Tools & Web",
    description: "A small command-line tool that finds every git repository inside a folder and shows the status of each one at a glance.",
    details: [
      "Point it at a folder and it finds every git repository inside, at any depth, then prints one line per clean repo and the full status for any that need attention. " +
        "It's a quick way to spot uncommitted work or unpushed commits across all your projects at once.",
      "Every repo is fetched first, in parallel, so ahead/behind is up to date. Fetching never touches your files or branches.",
    ],
    highlights: [
      "Finds repos at any depth, including repos nested inside other repos; skips .git and node_modules to stay fast",
      "Color-coded output: green for clean and in sync, yellow for uncommitted changes or ahead of/behind the remote",
      "Parallel fetch before checking, with failed fetches (e.g. ones needing a password) flagged in red instead of shown as in sync",
      "Offline mode with -n/--no-fetch for an instant check against the last fetch",
      "One-line installer into ~/.local/bin, with a custom install location and uninstall option; works on Linux and macOS",
    ],
    tech: ["Bash", "Git"],
    repo: "https://github.com/PharellJay/Gitcheck",
    demo: "",
  },
  {
    title: "Language Practice Tool",
    category: "Learning & Productivity",
    description: "Practise the everyday sentences and words you actually need, in any language pair, with read-aloud and spaced repetition.",
    details: [
      "Pick the language you speak and the one you want to learn. All content is written once in English and translated on demand by a self-hosted LibreTranslate server, " +
        "so any language pair works without extra content.",
      "Spaced repetition decides what comes next, so you don't see the same item over and over, but everything comes back often enough to stick.",
    ],
    highlights: [
      "Simplified SM-2 scheduler (as used by Anki) with a daily goal, due reviews first and in-session repeats",
      "Translations fetched in batches and cached in IndexedDB, so the server is only needed for new items",
      "Read-aloud through the browser's Web Speech API, no server required",
      "Plain ES modules with no build step and no dependencies; progress kept separately per language",
      "Tests for the scheduler and the translation client against a fake server",
    ],
    tech: ["JavaScript", "HTML", "CSS", "LibreTranslate"],
    repo: "https://github.com/PharellJay/LanguagePracticeTool",
    demo: "",
  },
  {
    title: "Flashcards",
    category: "Learning & Productivity",
    description: "A keyboard-friendly flashcard app for the terminal, with nested folders and decks you can share as a short code.",
    details: [
      "Public flashcard apps tend to be full of paywalls and ads, so I built my own: organise cards in nested folders, study them and share whole folders with friends.",
      "A folder, with all its subfolders, can be exported as one line of text that anyone can paste into the app to get the same cards.",
    ],
    highlights: [
      "Textual-based terminal UI with a folder tree, card list and preview; every action has a button and a hotkey",
      "Two study modes: Study for due cards with Again / Done grading, Cram for all cards shuffled; either side can be shown first",
      "Tracks how often each card was missed, and offers undo for grades and deletions",
      "Share codes for folders or the whole collection, copied straight to the clipboard",
      "Every change is saved right away with a backup of the previous version",
    ],
    tech: ["Python", "Textual", "JSON"],
    repo: "https://github.com/PharellJay/Flashcards",
    demo: "",
  },
  {
    title: "Questlog",
    category: "Learning & Productivity",
    description: "A to-do list disguised as an RPG quest journal in the terminal, with XP, levels and a JRPG-style dashboard.",
    details: [
      "Organise tasks into nested questlines with due dates and priorities, see today and the week ahead at a glance, and earn XP and levels for every quest you complete.",
      "Underneath the quest words it is a full task tracker, and whole questlines can be shared with friends through a short code.",
    ],
    highlights: [
      "JRPG-style dashboard built with Textual: questlines, a command menu, today's quests and a week view in framed windows",
      "XP by priority, levels with titles from Novice to Legend, and a daily streak",
      "Quick date input (today, fri, +3, 2w, …) with a live preview, plus filters and sensible sorting",
      "Undo for completions (XP included) and deletions; share codes for questlines",
      "Unit tests for the data model; every change is saved right away with a backup",
    ],
    tech: ["Python", "Textual", "JSON"],
    repo: "https://github.com/PharellJay/Questlog",
    demo: "",
  },
];

/*
 * CASE_STUDIES — long-form project pages (e.g. projects/npc-workshop.html), keyed by the name the page
 * asks for in <body data-case-study="...">. Paths to images and PDFs are relative to the site root.
 *   title, label, pitch, intro       hero: small label, title, large opening sentence, a second sentence
 *   facts        [label, value] pairs under the intro (role, course, timeframe, ...)
 *   live, repo   links for the "Play live" and "View code" buttons
 *   screenshot   { src, width, height, alt }: shown in a browser frame under the hero, links to "live"
 *   stats        [{ value, label }] strip under the hero
 *   challenge    the question the project started from
 *   phases       one section per step of the process (also the top-bar navigation):
 *                id, name, when (optional date), status ("next" = not done yet), shape (cube companion),
 *                lead (one sentence), blocks (see below)
 *   decisions    [{ title, text }]   ·   next   [{ title, text }]
 * Block types inside a phase (each may have a "title"):
 *   { type: "text", paragraphs: [...] }               { type: "stats", items: [{ value, label }] }
 *   { type: "cards", items: [{ tag, title, text, badge }] }   badge = highlighted card with that label
 *   { type: "quote", label, text }                    { type: "list", intro, items: [...] } (numbered)
 *   { type: "flow", items: [...] }                    short steps in a row with arrows
 *   { type: "steps", items: [{ title, text }] }       numbered iterations on a vertical line
 *   { type: "figure", src, pdf, alt, caption }        image that opens its PDF
 *   { type: "gallery", pdf, items: [{ src, alt }], caption }
 *   { type: "table", head: [...], rows: [[...]], collapsed: true }  collapsed = behind a toggle
 */
const CASE_STUDIES = {
  "npc-workshop": {
    title: "NPC Workshop",
    label: "Case study · Design Thinking",
    pitch: "You've just started at a game studio, and the NPCs of its castle game are broken. Fix them by wiring sensors, logic gates and actions together, no coding needed.",
    intro: "A browser game that teaches students aged 16 and up the basics of digital logic: signals 0/1 and the gates AND, OR and NOT. The test scene shows right away whether the NPC reacts correctly.",
    facts: [
      ["Role", "Developer of the digital prototype, part of a 3-person team"],
      ["Course", "Design Thinking, Hochschule Heilbronn, winter term 2026/27"],
      ["Timeframe", "Oct 2026 – Feb 2027"],
      ["Built with", "Vanilla JavaScript · SVG · no build step"],
    ],
    live: "https://npcworkshop.pharelljay.me",
    repo: "https://github.com/PharellJay/NPCWorkshop",
    screenshot: {
      src: "assets/npc-workshop/game-main-menu.webp", width: 1127, height: 796,
      alt: "The NPC Workshop main menu: title and pitch, an AND gate lighting a lamp, the Wild West world map with level stations, and the badges “What have I learned?”",
    },
    stats: [
      { value: "6", label: "student interviews" },
      { value: "6", label: "key insights" },
      { value: "7", label: "levels in 2 worlds" },
      { value: "45–60", label: "minutes of play" },
    ],
    challenge: "How might we make computer science more exciting for students?",
    phases: [
      {
        id: "empathize",
        name: "Empathize",
        when: "Oct 29 & Nov 10, 2026",
        shape: "player",
        lead: "We started by talking to the people the game is for.",
        blocks: [
          { type: "stats", items: [
            { value: "6", label: "interviews" },
            { value: "14–17", label: "years old" },
            { value: "2", label: "school types" },
          ] },
          { type: "text", paragraphs: [
            "Six interviews with students aged 14 to 17: from a vocational college with a business & IT track, and from a Year 9 class with the science & technology profile (NwT), among others at a Gymnasium.",
            "The interview guide mixed open questions with rating scales on interest in computer science, previous experiences, self-confidence, ideas about IT jobs and gaming habits. All interviews were transcribed and anonymised; quotes from them stay private on purpose.",
          ] },
        ],
      },
      {
        id: "define",
        name: "Define",
        shape: "paper",
        lead: "From a pile of statements to one clear question: who exactly are we designing for?",
        blocks: [
          { type: "text", title: "Clustering", paragraphs: [
            "From every interview we pulled out statements (observation) and the needs behind them (interpretation), then derived six traits: interest in computer science, wanting to understand how technology works, self-confidence, experiences of failure, the image of an IT job and social play. Three groups emerged:",
          ] },
          { type: "cards", items: [
            { tag: "A", title: "Interested despite setbacks", text: "Curious and wants to understand how technology works, but held back by concrete failures, so computer science feels like “not for me”.", badge: "Our target group" },
            { tag: "B", title: "Use-oriented", text: "Computer science is mainly a compulsory subject. Technology is there to be used, not understood." },
            { tag: "C", title: "Interested and confident", text: "Computer science already fits, built on positive experiences." },
          ] },
          { type: "text", paragraphs: [
            "Across all groups, almost everyone prefers playing in a team, and whoever keeps losing stops. We chose cluster A: the interest is there, but it is blocked by hurdles that a game can actually address.",
          ] },
          { type: "cards", title: "Key insights", items: [
            { tag: "E1", title: "Basics before jargon", text: "The entry has to start with the basics; technical terms come after." },
            { tag: "E2", title: "One mistake mustn't break everything", text: "So far, a single mistake feels like everything is wrong." },
            { tag: "E3", title: "“You need talent for that”", text: "Whoever has failed explains it with a lack of talent and counts themselves out." },
            { tag: "E4", title: "Curious about what's behind it", text: "For example, how NPCs in games react to situations. Understanding instead of memorising." },
            { tag: "E5", title: "Puzzling together gives confidence", text: "Talking it through, and laughing about mistakes together." },
            { tag: "E6", title: "Constant losing kills motivation", text: "It takes regular moments of success." },
          ] },
          { type: "figure", title: "Persona",
            src: "assets/npc-workshop/persona-lena.png", pdf: "assets/npc-workshop/persona-lena.pdf",
            alt: "Persona Lena, 16: profile, how her interest in computer science dropped with Arduino as the turning point, her attitude towards computer science, what holds her back and what drives her, her gaming habits and what the game has to do for her",
            caption: "Lena, 16, “the curious one who got left behind”: fictional, condensed from several interviews. Quotes and personal details are paraphrased in this public version. Document in German." },
          { type: "quote", label: "Point of view", text: "Lena wants to finally understand how the technology behind the things that make her curious works. But when she started, she was overwhelmed without the basics and with untranslated technical terms, every small mistake brought everything to a halt, and since then she believes you need talent for it." },
          { type: "text", title: "Topic: digital logic", paragraphs: [
            "Signals 0/1, the gates AND, OR and NOT, simple circuits. This is exactly where Lena dropped out: at its core, Arduino is about digital signals (button on/off, LED on/off). The topic ties into the science & technology class, can be taught entirely without programming and is small enough for a game.",
          ] },
          { type: "list", title: "Learning goals", intro: "After playing, Lena can …", items: [
            "explain that digital circuits work with two states (0/1), and tell inputs (sensors) from outputs (actions)",
            "predict the output of AND, OR and NOT and record it in a truth table",
            "combine several gates into a circuit for an everyday rule",
            "narrow down a faulty circuit step by step instead of starting over",
          ] },
          { type: "text", title: "Impact goal", paragraphs: [
            "Lena sees mistakes as a normal part of solving a problem, and trusts herself again to work on circuits, for example on an Arduino.",
          ] },
          { type: "quote", label: "How might we", text: "How might we give Lena, who lost track when starting with Arduino, insights into digital logic through a game, so that she understands how logic gates turn input signals into an output, and trusts herself again to try out circuits on her own?" },
        ],
      },
      {
        id: "ideate",
        name: "Ideate",
        when: "Nov 19, 2026",
        shape: "cloud",
        lead: "Many rough ideas, fast, then narrowed down to one concept.",
        blocks: [
          { type: "text", paragraphs: [
            "As our team method we researched and presented Quick Sketching: instead of writing ideas down, you sketch them roughly under time pressure (for example Crazy 8s: 8 ideas in 8 minutes), keep drawing on each other's sketches and rate them by dot voting.",
          ] },
          { type: "flow", title: "The ideation session", items: ["Collect ideas", "Cluster", "Dot voting", "3 favourites", "1 concept"] },
          { type: "figure", title: "Result: the concept brief",
            src: "assets/npc-workshop/konzept-steckbrief.png", pdf: "assets/npc-workshop/konzept-steckbrief.pdf",
            alt: "Concept brief NPC Workshop: game name, persona and how-might-we question, learning goals, game idea, goal and characters, core game loop, mechanics, organisation, a sketch, and open questions and assumptions",
            caption: "Game idea, core loop, mechanics, a sketch, and the open questions and assumptions to test. Document in German." },
        ],
      },
      {
        id: "prototype",
        name: "Prototype",
        when: "From Nov 25, 2026",
        shape: "code",
        lead: "The brief planned a paper prototype, with one team member playing “the computer”. We built a digital prototype in the browser instead: it was quicker to change, so it could go through many more iterations.",
        blocks: [
          { type: "steps", title: "Iterations", items: [
            { title: "The first version wasn't intuitive", text: "The switches looked like the answer, although the test run checked every situation by itself. Next, players set and tested each situation one by one, so the truth table came from their own testing." },
            { title: "Testing one by one was tedious", text: "Four test runs per circuit, and back to the start after every change. Now “Test run” plays through all situations in a row: the switches visibly follow along, the scene shows each situation and the checklist fills up line by line, so it's clear the result doesn't depend on the switch positions." },
            { title: "Level 1 becomes a guided tutorial", text: "Bit, the mentor robot, helps right next to the control you need next." },
            { title: "Gates get their real names", text: "Neutral names (“Block 1/2”) were confusing, so the gates are called AND, OR and NOT from the start." },
            { title: "Around the core", text: "Mission briefs, a main menu, badges, a certificate, German and English, and a landscape layout for phones so you don't have to scroll." },
          ] },
          { type: "table", title: "From interview to game mechanic", head: ["Insight", "Requirement", "In the game"], rows: [
            ["E1 Basics before jargon", "Start without prior knowledge", "Level 1 as a step-by-step tutorial; missions in everyday language; one new gate per level"],
            ["E2 One mistake mustn't break everything", "Mistakes are harmless", "Unlimited test runs, no game over; the checklist shows exactly which situation is wrong; Bit gives a concrete hint"],
            ["E3 “You need talent for that”", "Experience success step by step", "Rising difficulty; badges in first person (“I know: AND only gives 1 if …”); a certificate"],
            ["E4 Curious about what's behind it", "Show the technology behind familiar things", "Repair the NPCs of a game; signals light up live on the wires and the lamp"],
            ["E5 Puzzling together", "Teamwork and aha moments", "Made for 1–2 players per device; funny mishaps in the scenes (“False alarm?!”, “Zzz …”)"],
            ["E6 Constant losing", "Win early", "Short, guided first levels; every correct situation turns green right away and gets praise; a badge for every level solved"],
          ] },
          { type: "table", title: "Where we deviated from the concept brief", collapsed: true, head: ["In the brief", "In the game", "Why"], rows: [
            ["Paper prototype, a team member plays “the computer”", "Digital prototype in the browser", "Quicker to change digitally, so it could improve over more iterations"],
            ["Bit names technical terms only after trying things out", "The gates are called AND, OR and NOT from the start", "Neutral names (“Block 1/2”) were confusing and too unfriendly while trying things out"],
            ["A new gate per chapter", "A new gate per level; a chapter is a world with several levels", "Difficulty rises in smaller steps"],
            ["NPC order: gate guard (AND), lantern (NOT), tower guard (OR), merchant", "The tower guard (OR) comes as level 2, before the lantern (NOT)", "OR has two inputs like AND; NOT is a new kind of part with a single input"],
            ["NPCs of a castle game", "Chapter 1 castle, plus chapter 2 “Wild West” with three sensors", "Its own theme per chapter (confirmed by the team); three sensors are the next step in difficulty"],
            ["Signal magnifier: check 0/1 on every wire", "No magnifier; every wire shows its signal live", "Since every signal is visible anyway, a separate tool would be redundant"],
            ["Pair mode: one builds, one predicts", "No separate mode; made for 1–2 players per device", "Two people at one device works without a mode, they just talk it through"],
          ] },
          { type: "stats", title: "The prototype today", items: [
            { value: "7", label: "levels in 2 worlds" },
            { value: "9", label: "badges" },
            { value: "26", label: "mishaps to collect" },
            { value: "DE / EN", label: "languages" },
          ] },
        ],
      },
      {
        id: "test",
        name: "Test",
        when: "Up next",
        status: "next",
        shape: "bug",
        lead: "So far the prototype has only been tried internally. Next, we test it with students from the target group.",
        blocks: [
          { type: "text", paragraphs: [
            "For this there is a six-page test guide: the learning goals and eight assumptions with success criteria (for example: is lit/dark understood as 1/0 without explanation?), the session flow with a moderation script, an observation sheet, a debrief with a transfer task, and the evaluation.",
          ] },
          { type: "gallery", title: "Test guide", pdf: "assets/npc-workshop/testleitfaden.pdf",
            caption: "Three of the six pages. Click a page to open the full guide (German).",
            items: [
              { src: "assets/npc-workshop/testleitfaden-seite1.png", alt: "Test guide page 1: learning goals and assumptions with success criteria" },
              { src: "assets/npc-workshop/testleitfaden-seite4.png", alt: "Test guide: observation sheet per participant" },
              { src: "assets/npc-workshop/testleitfaden-seite5.png", alt: "Test guide: debrief with ratings and a transfer task" },
            ] },
        ],
      },
    ],
    decisions: [
      { title: "Web instead of Godot", text: "Vanilla JavaScript and SVG with no build step: runs on any device without installing anything, is easy to host on GitHub Pages and quick to change." },
      { title: "One test run plays every situation", text: "Testing situations one by one was tedious and not self-explanatory. Checking live without a test run would have been too easy, since you could just wire at random." },
      { title: "Tiered hints after two red test runs", text: "Three steps: rule, gate, solution. Only the solution costs the “All by myself” badge. Whoever gets stuck gets help instead of frustration, but tries alone first." },
      { title: "Mistakes become collectibles", text: "Every red line in the checklist is a named mishap that goes into a gallery, so a mistake turns into something to find instead of a failure (E2)." },
      { title: "A mission card instead of a letter", text: "Long texts put the target group off. The mission is now a chain of blocks that looks like the workbench: 31 instead of over 100 words in level 1." },
      { title: "A world map instead of a level list", text: "An idea from the team: more playful than a list, and the landscape shows each world's theme at a glance." },
    ],
    next: [
      { title: "Test with real players", text: "Students from the target group who don't know the game yet. The test guide is ready." },
      { title: "More chapters and levels", text: "The world map already says “More soon”." },
    ],
  },
};

/*
 * PAPERS — scientific works (Facharbeit, seminar papers, theses, ...).
 *   title, type, subject, year, school, grade, abstract
 *   pdf   path to the PDF inside the "papers" folder, e.g. "papers/facharbeit.pdf"
 *         ("" if you don't want to publish the document)
 */
const PAPERS = [
  {
    title: "Wird eine künstliche Intelligenz irgendwann wie ein Mensch sein?",
    type: "Facharbeit",
    subject: "Philosophy",
    year: "2023",
    school: "Dormagen",
    grade: "15 Punkte (1+)",
    abstract:
      "Will an AI ever be like a human? The paper weighs Nagel's double-aspect theory, Searle's " +
      "Chinese Room, functionalism and the Turing test, and uses Kant to ask how we should deal with AI. " +
      "Conclusion: AI will soon imitate humans convincingly, but a truly human AI with real feelings " +
      "is still far off. (Written in German.)",
    pdf: "papers/wird-eine-kuenstliche-intelligenz-irgendwann-wie-ein-mensch-sein.pdf",
  },
];

/*
 * ABOUT — "About me" section.
 *   lead         large opening sentence; the part in *stars* is highlighted
 *   paragraphs   list of text paragraphs below it
 *   cards        small cards: icon, title, text, optional link { href, text }, wide: true for a full-width card
 *                icons: drive, now, offline, philosophy
 */
const ABOUT = {
  lead: "It all started with *video games* and the question of what actually happens behind them.",
  paragraphs: [
    "That curiosity is what made me fall in love with programming. I hit plenty of walls early on " +
      "and ran into problem after problem, but instead of letting that get me down, it pushed me further.",
  ],
  cards: [
    {
      icon: "drive",
      title: "What I love",
      text: "Solving hard problems, security (especially in gaming) and performance optimization.",
    },
    {
      icon: "now",
      title: "Right now",
      text: "Fully focused on my studies at Hochschule Heilbronn, while building projects that don't just look good but deliver real value.",
    },
    {
      icon: "offline",
      title: "Off the keyboard",
      text: "Video games, basketball, reading and music.",
    },
    {
      icon: "philosophy",
      title: "My other passion: philosophy",
      text: "In upper school I discovered philosophy, and since then I engage with life's big questions every day, " +
        "whether that's thinking things through on my own, exploring the great philosophers of history or getting into a good debate.",
      link: { href: "#research", text: "Read my paper on AI and humanity" },
      wide: true,
    },
  ],
};

/*
 * TECH_STACK — one row per group, in this order.
 *   group   row title
 *   icon    "code", "web", "tools", "game" or "concepts"
 *   items   technologies, shown as logo pills; logos are mapped in script.js (STACK_ICONS)
 */
const TECH_STACK = [
  { group: "Languages", icon: "code", items: ["Java", "Python", "Lua", "C", "C++", "JavaScript", "SQL"] },
  { group: "Tools", icon: "tools", items: ["Git", "Linux", "Docker", "IntelliJ", "VS Code"] },
  { group: "Web & Frameworks", icon: "web", items: ["HTML & CSS", "React", "Node.js", "Spring Boot"] },
  { group: "Concepts", icon: "concepts", items: ["OOP", "Design Patterns", "Agile / Scrum", "Testing", "UML"] },
  { group: "Game Dev", icon: "game", items: ["Unity", "Godot", "Cfx.re (FiveM / RedM)"] },
];

/*
 * EDUCATION — newest first, shown as a timeline.
 *   date, title, place, description ("" to hide the description)
 *   icon     "university", "school" or "projects" (game controller, for self-driven work)
 *   focus    list of subjects / topics, shown as tags
 *   grade    optional final grade, e.g. "1,2" (leave it out or "" to hide)
 *   A date containing "present" marks the entry as current.
 */
const EDUCATION = [
  {
    date: "2026 – present",
    title: "B.Sc. Software Engineering",
    place: "Hochschule Heilbronn",
    icon: "university",
    description: "Learning how software gets built in practice, from requirements and design to testing and deployment.",
    focus: ["Software Development", "Architecture", "Project Management", "Quality Assurance"],
  },
  {
    date: "2024 – 2026",
    title: "Independent Developer & Server Operator",
    place: "RedM (Red Dead Redemption 2 multiplayer)",
    icon: "projects",
    description: "Two years between school and university spent building real things: I ran some of the biggest RedM community servers and " +
      "developed an anticheat from scratch.",
    focus: ["Lua", "Game Security", "Server Administration", "Game Design", "Team Lead"],
  },
  {
    date: "2024",
    title: "Abitur",
    place: "Leibniz Gymnasium Dormagen",
    icon: "school",
    grade: "1,2",
    description: "Where I discovered my passion for philosophy and wrote my Facharbeit on whether AI could ever be like a human.",
    focus: ["Mathematics", "Computer Science"],
  },
  {
    date: "2023",
    title: "Deutsche SchülerAkademie",
    place: "Europäisches Gymnasium Waldenburg",
    icon: "school",
    description: "Nominated by my school as one of its top students and then selected for this national academy for gifted students. " +
      "I spent 16 days in the course \"Philosophy: Art or Science?\", learning to work scientifically alongside equally curious peers.",
    focus: ["Philosophy", "Academic Work"],
  },
];

/*
 * CONTACT — sentence above your email address in the Contact section.
 */
const CONTACT = {
  text:
    "Email or LinkedIn are the best ways to reach me.",
};
