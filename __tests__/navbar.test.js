const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
let document;

beforeAll(() => {
  const dom = new JSDOM(html);
  document = dom.window.document;
});

test("navbar exposes four routes with correct hrefs", () => {
  const wanted = ["Home", "About", "Projects", "Contact"];

  const items = [...document.querySelectorAll("nav a")].map(a => ({
    text: a.textContent.trim(),
    href: a.getAttribute("href"),
  }));

  // keep only the real routes
  const routes = items.filter(i => wanted.includes(i.text));

  // must have exactly one of each
  expect(routes.map(r => r.text).sort()).toEqual(wanted.slice().sort());

  // and the hrefs must match exactly
  const byText = Object.fromEntries(routes.map(r => [r.text, r.href]));
  expect(byText.Home).toBe("./");
  expect(byText.About).toBe("about.html");
  expect(byText.Projects).toBe("projects.html");
  expect(byText.Contact).toBe("contact.html");
});

test("footer contains year element", () => {
  expect(document.querySelector("#y")).not.toBeNull();
});

// bonus: catch duplicate navbars
test("there is exactly one navbar", () => {
  expect(document.querySelectorAll("nav").length).toBe(1);
});

// bonus: catch wrong filename casing
test("route hrefs are lowercase (case-sensitive hosting safety)", () => {
  const hrefs = [...document.querySelectorAll("nav a")]
    .map(a => a.getAttribute("href"))
    .filter(Boolean);
  hrefs.forEach(href => {
    expect(href).toBe(href.toLowerCase());
  });
});
