// 히어로 장면을 한 파일로 묶어 ../index.html 안의 <script id="hero-scene-bundle"> 자리에 넣는다.
// index.html은 더블클릭으로 열려야 하므로 three.js를 외부에서 불러오지 않는다.
import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";

const result = await build({
  entryPoints: ["src/scene.js"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2019"],
  legalComments: "none",
  write: false
});
const code = result.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const page = new URL("../index.html", import.meta.url);
const html = await readFile(page, "utf8");
const open = '<script id="hero-scene-bundle">';
const start = html.indexOf(open);
const end = html.indexOf("</script>", start);
if (start < 0 || end < 0) throw new Error('index.html에 <script id="hero-scene-bundle"> 자리가 없습니다.');

const banner = "/* three.js (MIT) 히어로 장면 — hero-scene/src/scene.js를 빌드한 결과. 직접 고치지 말고 다시 빌드 */\n";
await writeFile(page, html.slice(0, start + open.length) + banner + code + html.slice(end));
console.log(`index.html 갱신 (장면 스크립트 ${Math.round(code.length / 1024)}KB)`);
