const fs = require("fs");
const path = require("path");

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".jsx")) {
      let t = fs.readFileSync(p, "utf8");
      const n = t.replace(/<\/?motion\b/g, (m) => m.replace("motion", "div"));
      if (n !== t) {
        fs.writeFileSync(p, n);
        console.log("fixed", p);
      }
    }
  }
}

walk(path.join(__dirname, "src"));
