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
  { name: "Unit Converter", desc: "Length, mass, temperature and more.", category: "students", href: "tools/unit.html", icon: "⇄" },
  { name: "Image to Base64", desc: "Read an image and copy its data URL.", category: "everyday", href: "tools/image.html", icon: "▦" },
  { name: "Password Generator", desc: "Strong, copy-ready random passwords.", category: "everyday", href: "tools/password.html", icon: "🔑" },
  { name: "Color Picker", desc: "Pick, copy and convert HEX/RGB/HSL.", category: "everyday", href: "tools/color.html", icon: "◑" },
  { name: "Case Converter", desc: "UPPERCASE, lowercase, Title Case, camelCase and more.", category: "developers", href: "tools/case-converter.html", icon: "Aa" },
  { name: "Lorem Ipsum Generator", desc: "Generate placeholder paragraphs, sentences or words.", category: "everyday", href: "tools/lorem-ipsum.html", icon: "¶" },
  { name: "Age Calculator", desc: "Find your exact age in years, months and days.", category: "everyday", href: "tools/age-calculator.html", icon: "🎂" },
  { name: "Quiz Maker", desc: "Build a multiple-choice quiz and share it with a link.", category: "students", href: "tools/quiz-maker.html", icon: "?" },
  { name: "Regex Tester", desc: "Test regular expressions live with match highlighting.", category: "developers", href: "tools/regex-tester.html", icon: ".*" },
  { name: "Image Compressor", desc: "Shrink photo file size right in your browser.", category: "everyday", href: "tools/image-compressor.html", icon: "▤" },
  { name: "Favicon Generator", desc: "Create every favicon size from one image.", category: "developers", href: "tools/favicon-generator.html", icon: "◱" },
  { name: "QR Code Generator", desc: "Turn text, URLs or Wi-Fi info into a QR code.", category: "everyday", href: "tools/qr-code-generator.html", icon: "▦" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "students", label: "Students" },
  { id: "developers", label: "Developers" },
  { id: "everyday", label: "Everyday" },
];

// Expose globally so non-module scripts (search.js) can read them.
window.TOOLS = TOOLS;
window.CATEGORIES = CATEGORIES;
