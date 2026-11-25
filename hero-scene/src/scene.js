/* REFLOW 랜딩 첫 화면 three.js 장면
   흩어진 대화 조각(점)이 요약 카드 한 장으로 모이고, 스크롤하면 아래로 흘러 다음 장면(#flow)으로 이어진다.

   좌표: 카메라 거리를 맞춰 z=0 평면에서 1 단위 = CSS 1px (y는 위가 +).
   카드는 #heroSlot 상자 안에 그린다. 상자 위치는 CSS가 정하고, 여기서는 재기만 한다.
   색은 :root 토큰을 읽어 쓴다 (HEX를 여기 적지 않는다). */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BufferGeometry,
  BufferAttribute,
  Points,
  ShaderMaterial
} from "three";

const CARD_ASPECT = 1.32;          // 카드 가로 : 세로
const CARD_H = 1 / CARD_ASPECT;    // 카드 단위(가로 = 1)로 본 세로 길이

function init() {
  const hero = document.getElementById("top");
  const canvas = document.getElementById("heroScene");
  const slot = document.getElementById("heroSlot");
  if (!hero || !canvas || !slot) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  } catch (e) {
    return; // WebGL이 없으면 장면 없이 원래 히어로 그대로
  }
  renderer.setClearColor(0x000000, 0);
  hero.classList.add("hero--scene");

  /* ── 색: 토큰에서 읽기 ── */
  const css = getComputedStyle(document.documentElement);
  const rgb = (name) => {
    const v = css.getPropertyValue(name).trim();
    const hex = v.charAt(0) === "#" ? v.slice(1) : "000000";
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const n = parseInt(full, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };
  const C = {
    confirmed: rgb("--color-primary-main"),
    pending: rgb("--color-primary-point"),
    next: rgb("--color-primary-sub"),
    title: rgb("--color-text-primary"),
    text: rgb("--color-text-tertiary"),
    meta: rgb("--color-text-disabled"),
    line: rgb("--color-border-default"),
    outline: rgb("--color-primary-light")
  };

  /* ── 고정 난수 (새로 고쳐도 같은 모양) ── */
  let seed = 20261125;
  const rand = () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const gauss = () => {
    let u = 0;
    while (!u) u = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };

  /* ── 카드 설계도 (카드 단위: 가로 0~1, 세로 0~CARD_H, 위에서 아래로) ── */
  const pts = []; // { u, v, color, size, kind }
  const add = (u, v, color, size) => pts.push({ u, v, color, size, kind: 0 });
  const line = (u0, u1, v, n, color, size) => {
    for (let i = 0; i < n; i++) add(u0 + (u1 - u0) * (i / (n - 1)), v, color, size);
  };
  const disk = (cu, cv, r, n, color, size) => {
    for (let i = 0; i < n; i++) {
      const a = i * 2.39996; // 황금각: 고르게 퍼진 원판
      const rr = r * Math.sqrt((i + 0.5) / n);
      add(cu + Math.cos(a) * rr, cv + Math.sin(a) * rr, color, size);
    }
  };
  const roundRect = (u0, v0, u1, v1, r, n, color, size) => {
    const w = u1 - u0, h = v1 - v0;
    const straight = 2 * (w - 2 * r) + 2 * (h - 2 * r);
    const arc = 2 * Math.PI * r;
    const total = straight + arc;
    for (let i = 0; i < n; i++) {
      let d = (i / n) * total;
      const seg = [w - 2 * r, Math.PI * r / 2, h - 2 * r, Math.PI * r / 2, w - 2 * r, Math.PI * r / 2, h - 2 * r, Math.PI * r / 2];
      let k = 0;
      while (k < seg.length - 1 && d > seg[k]) { d -= seg[k]; k++; }
      let u, v;
      const t = d / r;
      switch (k) {
        case 0: u = u0 + r + d; v = v0; break;
        case 1: u = u1 - r + Math.sin(t) * r; v = v0 + r - Math.cos(t) * r; break;
        case 2: u = u1; v = v0 + r + d; break;
        case 3: u = u1 - r + Math.cos(t) * r; v = v1 - r + Math.sin(t) * r; break;
        case 4: u = u1 - r - d; v = v1; break;
        case 5: u = u0 + r - Math.sin(t) * r; v = v1 - r + Math.cos(t) * r; break;
        case 6: u = u0; v = v1 - r - d; break;
        default: u = u0 + r - Math.cos(t) * r; v = v0 + r - Math.sin(t) * r;
      }
      add(u, v, color, size);
    }
  };

  // 카드 테두리
  roundRect(0, 0, 1, CARD_H, 0.035, 300, C.outline, 2.2);
  // 메타 줄 (AI · 테마 · 시각)
  line(0.06, 0.13, 0.075, 7, C.meta, 1.9);
  line(0.16, 0.24, 0.075, 8, C.meta, 1.9);
  line(0.27, 0.42, 0.075, 14, C.meta, 1.9);
  // 제목 (두 겹으로 굵게)
  line(0.06, 0.62, 0.15, 56, C.title, 2.4);
  line(0.06, 0.62, 0.172, 56, C.title, 2.4);
  // 확정 · 미정 · 다음 행동
  const rows = [
    { v: 0.285, color: C.confirmed, ends: [0.86, 0.6] },
    { v: 0.41, color: C.pending, ends: [0.72] },
    { v: 0.515, color: C.next, ends: [0.8] }
  ];
  rows.forEach((r) => {
    disk(0.075, r.v, 0.016, 16, r.color, 2.0);
    line(0.105, 0.19, r.v, 10, C.title, 2.2);
    r.ends.forEach((end, i) => line(0.25, end, r.v + i * 0.042, Math.round((end - 0.25) * 100), C.text, 2.0));
  });
  // 구분선
  line(0.06, 0.94, 0.63, 88, C.line, 1.6);
  // 근거 보기 · 요약 수정
  line(0.06, 0.17, 0.695, 11, C.next, 2.0);
  line(0.21, 0.32, 0.695, 11, C.next, 2.0);
  // 바로 가기 버튼
  roundRect(0.72, 0.662, 0.94, 0.728, 0.012, 56, C.text, 1.8);
  line(0.77, 0.89, 0.695, 12, C.title, 2.0);

  const targetCount = pts.length;
  const isSmall = window.matchMedia("(max-width: 760px)").matches;
  const ambientCount = isSmall ? 140 : 260;
  const ambientColors = [C.confirmed, C.pending, C.next, C.meta];
  for (let i = 0; i < ambientCount; i++) {
    pts.push({ u: rand(), v: rand(), color: ambientColors[i % 4], size: 1.6, kind: 1 });
  }

  /* 흩어진 자리: AI 네 곳(무리 네 개) — 상자 기준 정규 좌표 */
  const CLUSTERS = [[-0.32, -0.12], [0.88, -0.28], [0.12, 1.18], [1.08, 0.86]];
  const total = pts.length;
  const seedData = pts.map((p) => ({
    cluster: Math.floor(rand() * CLUSTERS.length),
    g: [gauss(), gauss(), gauss()],
    delay: p.kind ? 0 : Math.min(1, 0.55 * p.u + 0.35 * (p.v / CARD_H) * 0.6 + 0.25 * rand()),
    r: [0.35 + rand() * 0.55, rand(), 0.35 + rand() * 0.55, rand()]
  }));

  /* ── 지오메트리 ── */
  const aScatter = new Float32Array(total * 3);
  const aTarget = new Float32Array(total * 3);
  const aColor = new Float32Array(total * 3);
  const aSize = new Float32Array(total);
  const aDelay = new Float32Array(total);
  const aRand = new Float32Array(total * 4);
  const aKind = new Float32Array(total);
  pts.forEach((p, i) => {
    aColor.set(p.color, i * 3);
    aSize[i] = p.size;
    aDelay[i] = seedData[i].delay;
    aRand.set(seedData[i].r, i * 4);
    aKind[i] = p.kind;
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(aTarget, 3)); // 경계 계산용
  geometry.setAttribute("aScatter", new BufferAttribute(aScatter, 3));
  geometry.setAttribute("aTarget", new BufferAttribute(aTarget, 3));
  geometry.setAttribute("aColor", new BufferAttribute(aColor, 3));
  geometry.setAttribute("aSize", new BufferAttribute(aSize, 1));
  geometry.setAttribute("aDelay", new BufferAttribute(aDelay, 1));
  geometry.setAttribute("aRand", new BufferAttribute(aRand, 4));
  geometry.setAttribute("aKind", new BufferAttribute(aKind, 1));

  const uniforms = {
    uTime: { value: 0 },
    uIntro: { value: reduceMotion ? 100 : 0 },
    uScroll: { value: 0 },
    uFlow: { value: 600 },
    uDrift: { value: reduceMotion ? 0 : 18 },
    uPixelRatio: { value: 1 },
    uSizeScale: { value: 1 },
    uDist: { value: 1000 }
  };

  const material = new ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      attribute vec3 aScatter;
      attribute vec3 aTarget;
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aDelay;
      attribute vec4 aRand;
      attribute float aKind;
      uniform float uTime;
      uniform float uIntro;
      uniform float uScroll;
      uniform float uFlow;
      uniform float uDrift;
      uniform float uPixelRatio;
      uniform float uSizeScale;
      uniform float uDist;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        // 모이기: 점마다 늦게 출발하는 정도(aDelay)가 달라 읽는 순서대로 자리를 잡는다
        float f = clamp((uIntro - 0.5 - aDelay * 1.3) / 1.7, 0.0, 1.0);
        f = (1.0 - pow(1.0 - f, 3.0)) * (1.0 - aKind);
        vec3 p = mix(aScatter, aTarget, f);

        // 떠다니기: 흩어져 있을 때 크게, 자리를 잡으면 숨 쉬듯 작게
        float amp = uDrift * mix(1.0, 0.015, f);
        float ph = aRand.y * 6.2832;
        p += amp * vec3(
          sin(uTime * aRand.x + ph),
          cos(uTime * aRand.z + ph * 1.3),
          sin(uTime * aRand.x * 0.7 + aRand.w * 6.2832)
        );

        // 흐르기: 스크롤하면 아래로 흘러내리며 가늘어진다
        float s = clamp(uScroll * 1.6 - aRand.w * 0.6, 0.0, 1.0);
        s = s * s;
        p.y -= s * uFlow;
        p.x *= 1.0 - 0.7 * s;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uSizeScale * uPixelRatio * (uDist / -mv.z);
        vColor = aColor;
        float base = aKind > 0.5 ? 0.3 : mix(0.45, 1.0, f);
        vAlpha = base * (1.0 - s);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = (1.0 - smoothstep(0.32, 0.5, d)) * vAlpha;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor, a);
      }
    `
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  const scene = new Scene();
  scene.add(points);
  const camera = new PerspectiveCamera(30, 1, 1, 10000);

  /* ── 배치: 화면 크기·글꼴이 바뀔 때마다 다시 잰다 ── */
  function layout() {
    const hr = hero.getBoundingClientRect();
    const sr = slot.getBoundingClientRect();
    const W = Math.max(1, hr.width), H = Math.max(1, hr.height);
    if (sr.width < 2 || sr.height < 2) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 2));
    renderer.setSize(W, H, false);
    uniforms.uPixelRatio.value = renderer.getPixelRatio();

    const dist = (H / 2) / Math.tan((camera.fov * Math.PI) / 360);
    camera.aspect = W / H;
    camera.near = dist * 0.05;
    camera.far = dist * 4;
    camera.position.set(0, 0, dist);
    camera.updateProjectionMatrix();
    uniforms.uDist.value = dist;

    // 상자 중심을 장면 원점 기준으로
    const cx = sr.left + sr.width / 2 - (hr.left + W / 2);
    const cy = -(sr.top + sr.height / 2 - (hr.top + H / 2));
    points.position.set(cx, cy, 0);

    const cw = Math.min(sr.width, sr.height * CARD_ASPECT);
    uniforms.uSizeScale.value = Math.max(0.8, Math.min(1.1, cw / 360));
    uniforms.uFlow.value = H * 0.9;
    if (!reduceMotion) uniforms.uDrift.value = 0.06 * sr.width;

    // 떠다니는 점이 머무는 범위: 상자를 왼쪽으로 넓게, 위아래로 조금 넓힌 영역 (화면 안으로 제한)
    const left = Math.max(hr.left, sr.left - sr.width * 0.8);
    const right = hr.right;
    const top = Math.max(hr.top, sr.top - sr.height * 0.9);
    const bottom = Math.min(hr.bottom, sr.bottom + sr.height * 0.9);

    pts.forEach((p, i) => {
      const sd = seedData[i];
      if (p.kind === 0) {
        aTarget[i * 3] = (p.u - 0.5) * cw;
        aTarget[i * 3 + 1] = -(p.v - CARD_H / 2) * cw;
        aTarget[i * 3 + 2] = 0;
        const c = CLUSTERS[sd.cluster];
        aScatter[i * 3] = (c[0] - 0.5) * sr.width + sd.g[0] * sr.width * 0.17;
        aScatter[i * 3 + 1] = -((c[1] - 0.5) * sr.height + sd.g[1] * sr.height * 0.22);
        aScatter[i * 3 + 2] = sd.g[2] * sr.width * 0.45;
      } else {
        const x = left + (right - left) * p.u - (sr.left + sr.width / 2);
        const y = -(top + (bottom - top) * p.v - (sr.top + sr.height / 2));
        const z = sd.g[2] * sr.width * 0.4;
        aTarget[i * 3] = aScatter[i * 3] = x;
        aTarget[i * 3 + 1] = aScatter[i * 3 + 1] = y;
        aTarget[i * 3 + 2] = aScatter[i * 3 + 2] = z;
      }
    });
    geometry.attributes.aScatter.needsUpdate = true;
    geometry.attributes.aTarget.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;
    draw(performance.now());
  }

  /* ── 움직임 ── */
  const t0 = performance.now();
  const pointer = { x: 0, y: 0 };
  const rot = { x: 0.25, y: -0.55 };
  let visible = true;
  let raf = 0;

  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  function draw(now) {
    const t = (now - t0) / 1000;
    const hr = hero.getBoundingClientRect();
    const s = reduceMotion ? 0 : Math.min(1, Math.max(0, -hr.top / (hr.height * 0.62)));
    const g = reduceMotion ? 1 : smooth(0.5, 3.2, t); // 카드가 모이는 동안 정면으로 돌아온다

    uniforms.uTime.value = reduceMotion ? 0 : t;
    if (!reduceMotion) uniforms.uIntro.value = t;
    uniforms.uScroll.value = s;

    const ty = -0.55 + 0.47 * g + pointer.x * 0.2;
    const tx = 0.25 - 0.21 * g + pointer.y * 0.12 + s * 0.45;
    if (reduceMotion) { rot.x = tx; rot.y = ty; }
    else { rot.x += (tx - rot.x) * 0.06; rot.y += (ty - rot.y) * 0.06; }
    points.rotation.set(rot.x, rot.y, 0);

    renderer.render(scene, camera);
  }

  function frame(now) {
    raf = 0;
    draw(now);
    if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
  }
  function start() {
    canvas.dataset.animationActive = "true";
    if (!raf && !reduceMotion) raf = requestAnimationFrame(frame);
  }
  function stop() {
    canvas.dataset.animationActive = "false";
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  // 화면 밖에서는 멈춘다
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(hero);
  }

  if (!reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  let pending = 0;
  const relayout = () => {
    if (pending) return;
    pending = requestAnimationFrame(() => { pending = 0; layout(); });
  };
  if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(hero);
  window.addEventListener("resize", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  layout();
  start();
}

init();
