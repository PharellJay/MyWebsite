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
 *   status          badge at the top left of the navigation bar, e.g. what you're looking for ("" to hide)
 *   achievement     "Achievement unlocked" pop-up at the top of the page ("" to hide)
 *   photo           e.g. "assets/photo.jpg", shown next to your name ("" to hide)
 *   github, linkedin, email   used at the top and in the Contact section
 *   discord         your Discord username (clicking copies it) or a full link,
 *                   e.g. "https://discord.com/users/<your id>" ("" to hide)
 */
const PROFILE = {
  name: "Pharell Jay Jeyakumar",
  tagline: "Software Engineering student at Hochschule Heilbronn",
  intro: "I build tools that solve real problems, from an anticheat protecting large game servers to small apps for everyday learning. Here you'll find my projects and papers.",
  location: "Heilbronn, Germany",
  languages: "German, English",
  status: "Open to internships & working student roles",
  achievement: "16,000+ players protected by my anticheat",
  photo: "",
  github: "https://github.com/PharellJay",
  linkedin: "https://www.linkedin.com/in/pharell-jay-jeyakumar/",
  email: "pharelljeyakumar1010@gmail.com",
  discord: "pharelljay", 
};

/*
 * PROJECTS — one object per project.
 *   title        (required)
 *   description  (required) one or two sentences
 *   tech         list of technologies
 *   repo         link to the GitHub repository (the title links there)
 *   demo         optional link to a live version ("" to hide)
 *   featured     true = the big "main quest" card above the others (use it for one project)
 *   stat         featured card only: highlighted number, e.g. { value: "16,000+", label: "registered players" }
 *   status       featured card only: small badge text, e.g. "Live" or "Discontinued"
 *   continued    featured card only: false = the status badge is red (discontinued), otherwise green
 */
const PROJECTS = [
  {
    title: "RedM Anticheat",
    description: "Advanced and precise anticheat for RedM (Red Dead Redemption 2 multiplayer), detecting a wide range of cheats with a focus on performance.",
    tech: ["Lua", "HTML",  "JavaScript", "SQL"],
    repo: "https://github.com/PharellJay/RedMAnticheat",
    demo: "",
    featured: true,
    stat: { value: "16,000+", label: "protected players" },
    status: "Discontinued",
    continued: false,
  },
  {
    title: "Flashcards",
    description: "A small flashcard tool designed to help me and others while learning as public flashcard apps tend to be flooded with paywalls and ads.",
    tech: ["Python", "json", "bash"],
    repo: "https://github.com/PharellJay/Flashcards",
    demo: "",
  },
  {
    title: "My Website",
    description: "The logic behind what you see. A personal portfolio built from scratch with plain HTML, CSS and JavaScript, no frameworks. All content lives in a single data file, so adding a new project or paper takes just a few lines.",
    tech: ["HTML", "JavaScript", "CSS"],
    repo: "https://github.com/PharellJay/MyWebsite",
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
 * TECH_STACK — one card per group.
 *   group   card title
 *   icon    "code", "web", "tools", "game" or "concepts"
 *   items   technologies, shown as logos (name on hover); logos are mapped in script.js (STACK_ICONS)
 *   main    true = the highlighted card; on wide screens it sits on the left with the others in a square next to it
 */
const TECH_STACK = [
  { group: "Languages", icon: "code", main: true, items: ["Java", "Python", "Lua", "C", "C++", "JavaScript", "SQL"] },
  { group: "Tools", icon: "tools", items: ["Git", "Linux", "Docker", "IntelliJ", "VS Code"] },
  { group: "Web & Frameworks", icon: "web", items: ["HTML & CSS", "React", "Node.js", "Spring Boot"] },
  { group: "Concepts", icon: "concepts", items: ["OOP", "Design Patterns", "Agile / Scrum", "Testing", "UML"] },
  { group: "Game Dev", icon: "game", items: ["Unity", "Godot", "Cfx.re (FiveM / RedM)"] },
];

/*
 * EDUCATION — newest first, shown as a timeline.
 *   date, title, place, description ("" to hide the description)
 *   icon     "university" or "school"
 *   focus    list of subjects / topics, shown as tags
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
    date: "2024",
    title: "Abitur",
    place: "Leibniz Gymnasium Dormagen",
    icon: "school",
    description: "Where I discovered my passion for philosophy and wrote my Facharbeit on whether AI could ever be like a human.",
    focus: ["Mathematics", "Computer Science"],
  },
];

/*
 * CONTACT — sentence above your email address in the Contact section.
 */
const CONTACT = {
  text:
    "Email or Discord are the best ways to reach me.",
};
