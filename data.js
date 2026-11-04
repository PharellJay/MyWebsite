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
 *   featured     true = the big "Featured" panel above the others (use it for one project)
 *   highlight    true = shown as a large row under the featured one; projects without it are listed
 *                compactly under "Other projects"
 *   stat         featured project only: highlighted number, e.g. { value: "16,000+", label: "registered players" }
 *   status       featured project only: small badge text, e.g. "Live" or "Discontinued"
 *   continued    featured project only: false = the status badge is grey (archived), otherwise green
 */
const PROJECTS = [
  {
    title: "RedM Anticheat",
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
    /*featured: true,*/
    stat: { value: "16,000+", label: "protected players" },
    status: "Archived",
    continued: false,
    highlight: true,
  },
  {
    title: "Lua Obfuscator",
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
    demo: "",
    highlight: true,
  },
  {
    title: "ChessML",
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
    demo: "",
    highlight: true,
  },
  {
    title: "Decentralised VPN",
    description: "A peer-to-peer VPN with no central server: traffic is routed through two encrypted hops and leaves the internet from another peer's IP.",
    details: [
      "Peers find each other through a distributed hash table, without any central server. Your traffic first goes to a relay, then to another peer's exit, " +
        "so the relay knows who you are but not where you're going, and the exit sees the destination but not you.",
      "The network works on a \"lend to use\" principle: you can only route traffic through it while your own machine lends its IP as an exit for others. " +
        "It installs as a Debian/Ubuntu package with a background service, a terminal dashboard and a desktop app.",
    ],
    highlights: [
      "Two-hop circuits with a Noise handshake against the exit's signed key; the relay only ever forwards encrypted bytes",
      "Serverless discovery via Kademlia DHT and mDNS, NAT traversal with AutoNAT, hole punching and relays (libp2p)",
      "Kill switch: once connected, traffic is blocked instead of leaked when the tunnel drops; IPv6 blocked, DNS forced through the tunnel",
      "Exit choice at random or by latency, measured through encrypted test circuits so exits never see your IP",
      "systemd service controlled over a permission-checked Unix socket, used by the CLI, the Ratatui dashboard and a Tauri tray app",
      "Packets padded to size buckets against fingerprinting; routes and firewall rules are restored even after a crash",
    ],
    tech: ["Rust", "libp2p", "Tokio", "Noise Protocol", "Ratatui", "Tauri"],
    repo: "https://github.com/PharellJay/DecentralisedVPN",
    demo: "",
  },
  {
    title: "My Website",
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
    title: "Language Practice Tool",
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
];

/*
 * CONTACT — sentence above your email address in the Contact section.
 */
const CONTACT = {
  text:
    "Email or LinkedIn are the best ways to reach me.",
};
