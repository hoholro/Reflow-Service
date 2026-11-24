// a2ui-demo/src 를 한 파일로 묶어 저장소 맨 위의 a2ui.html 로 쓴다.
// 결과물은 서버 없이 더블클릭으로 열린다. 다시 만들 때: npm install && npm run build
import {build} from 'esbuild';
import {readFile, writeFile} from 'node:fs/promises';

const result = await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'iife',
  minify: true,
  legalComments: 'eof',
  write: false,
  target: ['es2022'],
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const template = await readFile('src/template.html', 'utf8');
const marker = '/*__A2UI_BUNDLE__*/';
if (!template.includes(marker)) throw new Error('template.html 에 번들 자리표시가 없습니다');
await writeFile('../a2ui.html', template.replace(marker, () => js));
console.log(`a2ui.html 작성 완료 (스크립트 ${(js.length / 1024).toFixed(0)}KB)`);
