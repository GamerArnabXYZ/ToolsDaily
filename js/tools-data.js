/* =====================================================================
   Daily Tools — shared tool registry
   Loaded as a plain script (no module) so both the homepage (main.js)
   and the search page (search.js) can reuse the same data.
   Exposes window.TOOLS and window.CATEGORIES.
   ===================================================================== */

const TOOLS = [
  { name: "JSON Formatter", desc: "Pretty-print, validate and minify JSON instantly.", category: "developers", href: "tools/json-formatter.html", icon: "{}" },
  { name: "CSS Minifier", desc: "Strip whitespace and comments from CSS safely.", category: "developers", href: "tools/css-minifier.html", icon: "</>" },
  { name: "Base64 Encode", desc: "Encode and decode text or files to Base64.", category: "developers", href: "tools/base64.html", icon: "B64" },
  { name: "Hash Generator", desc: "MD5, SHA-1, SHA-256 of any input string.", category: "developers", href: "tools/hash.html", icon: "#" },
  { name: "Word Counter", desc: "Count words, characters, sentences and reading time.", category: "students", href: "tools/word-counter.html", icon: "W" },
  { name: "Citation Builder", desc: "Generate APA, MLA and Chicago citations.", category: "students", href: "tools/citation.html", icon: "❝" },
  { name: "Grade Calculator", desc: "Weight your assignments into a final grade.", category: "students", href: "tools/grade.html", icon: "%" },
  { name: "Unit Converter", desc: "Length, mass, temperature and more.", category: "students", href: "tools/unit.html", icon: "⇄" },
  { name: "Attendance Tracker", desc: "Log and summarise class attendance.", category: "teachers", href: "tools/attendance.html", icon: "✓" },
  { name: "Rubric Scorer", desc: "Score students against a reusable rubric.", category: "teachers", href: "tools/rubric.html", icon: "★" },
  { name: "Lesson Timer", desc: "Pace lessons with a clean countdown timer.", category: "teachers", href: "tools/timer.html", icon: "⏱" },
  { name: "Quiz Maker", desc: "Build a quick multiple-choice quiz.", category: "teachers", href: "tools/quiz.html", icon: "?" },
  { name: "Image to Base64", desc: "Read an image and copy its data URL.", category: "everyday", href: "tools/image.html", icon: "▦" },
  { name: "Password Generator", desc: "Strong, copy-ready random passwords.", category: "everyday", href: "tools/password.html", icon: "🔑" },
  { name: "Tip Calculator", desc: "Split bills and tips with friends.", category: "everyday", href: "tools/tip.html", icon: "$" },
  { name: "Color Picker", desc: "Pick, copy and convert HEX/RGB/HSL.", category: "everyday", href: "tools/color.html", icon: "◑" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "students", label: "Students" },
  { id: "teachers", label: "Teachers" },
  { id: "developers", label: "Developers" },
  { id: "everyday", label: "Everyday" },
];

// Expose globally so non-module scripts (search.js) can read them.
window.TOOLS = TOOLS;
window.CATEGORIES = CATEGORIES;
