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
 *   photo           e.g. "assets/photo.jpg", shown in the profile card at the top ("" shows initials)
 *   github, linkedin, email   used at the top and in the Contact section
 *   discord         your Discord username (clicking copies it) or a full link,
 *                   e.g. "https://discord.com/users/<your id>" ("" to hide)
 */
const PROFILE = {
  name: "Pharell Jay Jeyakumar",
  tagline: "Software Engineering student at Hochschule Heilbronn",
  intro: "I study Software Engineering in Heilbronn. This page collects the projects I've built and the papers I've written.",
  photo: "assets/foto.jpg",
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
 */
const PROJECTS = [
  {
    title: "RedM Anticheat",
    description: "Advanced and precise anticheat for RedM (Red Dead Redemption 2 multiplayer), detecting a wide range of cheats with a focus on performance. Proven on servers with over 16,000 players.",
    tech: ["Lua", "HTML",  "JavaScript", "SQL"],
    repo: "https://github.com/your-username/portfolio",
    demo: "",
  },
  {
    title: "Flashcards",
    description: "A small flashcard tool designed to help me and others while learning as public flashcard apps tend to be flooded with paywalls and ads.",
    tech: ["Python", "json", "bash"],
    repo: "https://github.com/PharellJay/Flashcards",
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
 *   paragraphs   list of text paragraphs
 *   facts        label/value rows shown in the profile card at the top
 */
const ABOUT = {
  paragraphs: [
    "I'm studying Software Engineering at Hochschule Heilbronn. The program covers how " +
      "software gets built in practice: requirements, design, implementation, testing and deployment.",
    "Outside of university I work on my own projects. I'm currently looking for an internship " +
      "or a working student position.",
  ],
  facts: [
    { label: "Study", value: "B.Sc. Software Engineering" },
    { label: "University", value: "Hochschule Heilbronn" },
    { label: "Location", value: "Heilbronn, Germany" },
    { label: "Languages", value: "German, English" },
  ],
};

/*
 * TECH_STACK — one row per group.
 *   group   label on the left
 *   items   technologies, shown as a comma-separated list
 */
const TECH_STACK = [
  { group: "Languages", items: ["Java", "Python", "Lua", "C", "C++","JavaScript", "SQL"] },
  { group: "Web & Frameworks", items: ["HTML & CSS", "React", "Node.js", "Spring Boot"] },
  { group: "Tools", items: ["Git", "Linux", "Docker", "IntelliJ", "VS Code"] },
  { group: "Concepts", items: ["OOP", "Design Patterns", "Agile / Scrum", "Testing", "UML"] },
];

/*
 * EDUCATION — newest first.
 *   date, title, place, description ("" to hide the description)
 */
const EDUCATION = [
  {
    date: "2026 – present",
    title: "B.Sc. Software Engineering",
    place: "Hochschule Heilbronn",
    description: "Software development, architecture, project management and quality assurance.",
  },
  {
    date: "2024",
    title: "Abitur",
    place: "Leibniz Gymnasium Dormagen",
    description: "General education with a focus on mathematics and computer sciences.",
  },
];

/*
 * CONTACT — sentence above your email address in the Contact section.
 */
const CONTACT = {
  text:
    "Email or Discord are the best ways to reach me.",
};
