import {MessageProcessor} from '@a2ui/web_core';
import {basicCatalog, setMarkdownRenderer} from '@a2ui/web_core/catalogs/basic/v1';
import '@a2ui/lit';
import CARDS from './cards.json';

/* ==========================================================================
   1) 더미 데이터 — prototype.html 의 카드 12장 (src/cards.json)
   ========================================================================== */
const STATUS_LABELS = {draft: '요약 초안', check: '확인 필요', edited: '사용자 수정'};
const SECTIONS = [
  ['confirmed', '확정'],
  ['pending', '미정'],
  ['next', '다음 행동'],
];
const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================================
   2) 카드 → A2UI 1.0 메시지
   에이전트가 보낼 JSON을 흉내 낸다. 구조(updateComponents)를 먼저 보내고
   내용(updateDataModel)을 나중에 보내므로, 카드 틀이 먼저 서고 글자가 채워진다.
   ========================================================================== */
function cardMessages(card) {
  const surfaceId = card.id;
  const components = [
    {id: 'root', component: 'Card', child: 'body'},
    {
      id: 'body',
      component: 'Column',
      children: ['meta', 'title', ...SECTIONS.map(([key]) => `section_${key}`), 'divider', 'actions'],
    },
    {id: 'meta', component: 'Row', children: ['meta_label', 'status'], justify: 'spaceBetween', align: 'center'},
    {id: 'meta_label', component: 'Text', text: {'@path': '/meta'}, variant: 'caption'},
    {id: 'status', component: 'Text', text: {'@path': '/statusLabel'}, variant: 'caption'},
    {id: 'title', component: 'Text', text: {'@path': '/titleMarkdown'}},
  ];
  for (const [key, label] of SECTIONS) {
    components.push(
      {id: `section_${key}`, component: 'Column', children: [`label_${key}`, `list_${key}`]},
      {id: `label_${key}`, component: 'Text', text: `**${label}**`},
      {id: `list_${key}`, component: 'Column', children: {path: `/${key}`, componentId: `item_${key}`}},
      {id: `item_${key}`, component: 'Text', text: {'@path': 'text'}},
    );
  }
  components.push(
    {id: 'divider', component: 'Divider'},
    {id: 'actions', component: 'Row', children: ['evidence_button', 'go_button'], justify: 'spaceBetween', align: 'center'},
    {
      id: 'evidence_button',
      component: 'Button',
      child: 'evidence_label',
      action: {event: {name: 'show_evidence', context: {cardId: card.id}}},
    },
    {id: 'evidence_label', component: 'Text', text: '근거 보기'},
    {
      id: 'go_button',
      component: 'Button',
      child: 'go_label',
      variant: 'primary',
      action: {event: {name: 'open_conversation', context: {cardId: card.id, ai: card.ai}}},
    },
    {id: 'go_label', component: 'Text', text: '바로 가기 →'},
  );

  const toItems = (texts) => (texts.length ? texts : ['아직 없음']).map((text) => ({text}));
  return [
    {version: '1.0', createSurface: {surfaceId, catalogId: basicCatalog.id}},
    {version: '1.0', updateComponents: {surfaceId, components}},
    {
      version: '1.0',
      updateDataModel: {
        surfaceId,
        value: {
          meta: `${card.ai} · ${card.theme}`,
          statusLabel: STATUS_LABELS[card.status],
          titleMarkdown: `#### ${card.title}`,
          confirmed: toItems(card.confirmed),
          pending: toItems(card.pending),
          next: toItems(card.next),
        },
      },
    },
  ];
}

/* ==========================================================================
   3) 마크다운 — 기본 카탈로그의 Text는 마크다운을 쓴다.
   모든 글자를 먼저 이스케이프하고, 제목(#)과 굵게(**)만 다시 태그로 바꾼다.
   ========================================================================== */
const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (ch) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[ch]);

setMarkdownRenderer(async (markdown) =>
  escapeHtml(String(markdown))
    .split('\n')
    .map((line) => {
      const bold = (text) => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      const heading = line.match(/^(#{1,5})\s+(.*)$/);
      return heading ? `<h${heading[1].length}>${bold(heading[2])}</h${heading[1].length}>` : bold(line);
    })
    .join('<br>'),
);

/* ==========================================================================
   4) 상태 · 렌더 · 이벤트
   ========================================================================== */
const gallery = document.getElementById('gallery');
const messageView = document.getElementById('messageView');
const messageTitle = document.getElementById('messageTitle');
const eventList = document.getElementById('eventList');
const counter = document.getElementById('counter');
const replayButton = document.getElementById('replay');

const state = {selectedId: CARDS[0].id, messageCount: 0, events: []};
const items = new Map();

const processor = new MessageProcessor([basicCatalog], (action) => {
  state.events.unshift({
    name: action.name,
    surfaceId: action.surfaceId,
    context: action.context,
    timestamp: action.timestamp,
  });
  state.events = state.events.slice(0, 6);
  select(action.surfaceId);
  renderEvents();
});

processor.onSurfaceCreated((surface) => {
  const item = document.createElement('div');
  item.className = 'surface-item';
  item.dataset.id = surface.id;
  item.tabIndex = 0;
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `${CARDS.find((c) => c.id === surface.id)?.title ?? surface.id} 카드의 메시지 보기`);
  const element = document.createElement('a2ui-surface');
  element.surface = surface;
  item.appendChild(element);
  gallery.appendChild(item);
  items.set(surface.id, item);
  item.classList.toggle('is-selected', surface.id === state.selectedId);
});

processor.onSurfaceDeleted((id) => {
  items.get(id)?.remove();
  items.delete(id);
});

function select(id) {
  state.selectedId = id;
  items.forEach((item, key) => item.classList.toggle('is-selected', key === id));
  const card = CARDS.find((c) => c.id === id);
  if (!card) return;
  messageTitle.textContent = `${card.title} · 메시지 3개`;
  messageView.textContent = JSON.stringify(cardMessages(card), null, 2);
}

function renderEvents() {
  eventList.innerHTML = '';
  if (!state.events.length) {
    const empty = document.createElement('li');
    empty.className = 'event-empty';
    empty.textContent = '카드의 버튼을 누르면, 렌더러가 에이전트에게 보내는 이벤트가 여기에 쌓입니다.';
    eventList.appendChild(empty);
    return;
  }
  for (const event of state.events) {
    const li = document.createElement('li');
    const name = document.createElement('strong');
    name.textContent = event.name;
    const body = document.createElement('code');
    body.textContent = JSON.stringify({surfaceId: event.surfaceId, context: event.context});
    li.append(name, body);
    eventList.appendChild(li);
  }
}

function send(messages) {
  processor.processMessages(messages);
  state.messageCount += messages.length;
  counter.textContent = `받은 메시지 ${state.messageCount}개 · 카드 ${items.size}장`;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let streamToken = 0;

async function stream() {
  const token = ++streamToken;
  for (const id of [...items.keys()]) send([{version: '1.0', deleteSurface: {surfaceId: id}}]);
  state.messageCount = 0;
  replayButton.disabled = true;
  for (const card of CARDS) {
    const [create, structure, data] = cardMessages(card);
    send([create, structure]);
    if (!reducedMotion) await wait(160);
    if (token !== streamToken) return;
    send([data]);
    if (!reducedMotion) await wait(90);
    if (token !== streamToken) return;
  }
  replayButton.disabled = false;
}

gallery.addEventListener('click', (event) => {
  const item = event.target.closest('.surface-item');
  if (item) select(item.dataset.id);
});
gallery.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const item = event.target.closest?.('.surface-item');
  if (item && event.target === item) {
    event.preventDefault();
    select(item.dataset.id);
  }
});
replayButton.addEventListener('click', stream);

select(state.selectedId);
renderEvents();
stream();
