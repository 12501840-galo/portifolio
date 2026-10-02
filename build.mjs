import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = fileURLToPath(new URL("./", import.meta.url));
for (const name of ["index.html", "style.css", "config.js", "main.js", "jquery-3.7.1.min.js", "tilt.jquery.min.js", "favicon-gl.png"]) await stat(resolve(root, name));
for (const name of ["config.js", "main.js"]) new vm.Script(await readFile(resolve(root, name), "utf8"), { filename: name });
const html = await readFile(resolve(root, "index.html"), "utf8");
if (!html.includes('lang="pt-BR"')) throw new Error("O documento precisa estar em português.");
for (const id of ["home", "about", "skills", "projects", "education", "contact"]) {
  if (!html.includes('id="' + id + '"')) throw new Error("Seção ausente: " + id);
}
if (html.includes('href="#"')) throw new Error("Link provisório vazio encontrado.");
const css = await readFile(resolve(root, "style.css"), "utf8");
const config = await readFile(resolve(root, "config.js"), "utf8");
const resources = [
  ...Array.from(html.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]),
  ...Array.from(css.matchAll(/url\(["']?([^"')]+)["']?\)/g), (match) => match[1]),
  ...Array.from(config.matchAll(/(?:src|favicon):\s*"([^"]+)"/g), (match) => match[1]),
];
for (const resource of new Set(resources)) {
  if (resource.startsWith("#") || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(resource)) continue;
  await stat(resolve(root, decodeURIComponent(resource.split(/[?#]/)[0])));
}
console.log("Site estático validado. Todos os arquivos estão na pasta principal; abra index.html ou publique essa pasta.");
