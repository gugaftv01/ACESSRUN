/* AcessRun · site acessível de corrida inclusiva
   Funciona sozinho (dados no navegador) e com Firebase quando js/firebase-config.js estiver preenchido. */
{
const BASE = document.currentScript ? document.currentScript.src : location.href;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } }
};
const say = msg => { const l = $('#live'); l.textContent = ''; setTimeout(() => { l.textContent = msg; }, 60); };

/* ---------- dados ---------- */
const MODS = {
  cadeira: { nome: 'Cadeira de rodas', titulo: 'Corrida em cadeira de rodas', ic: 'i-cadeira' },
  handbike: { nome: 'Handbike', titulo: 'Pedal de handbike', ic: 'i-handbike' },
  protese: { nome: 'Corrida com prótese', titulo: 'Corrida com prótese', ic: 'i-protese' },
  guia: { nome: 'Corrida com guia', titulo: 'Corrida com guia', ic: 'i-guia' },
  adaptada: { nome: 'Caminhada ou corrida adaptada', titulo: 'Caminhada ou corrida adaptada', ic: 'i-adaptada' }
};
const ROTAS = [
  { id: 'lago', nome: 'Circuito Lago Azul', km: 5.2, piso: 'Asfalto liso', incl: 2, semDegrau: true, pisoLiso: true, banheiro: true, luz: true, sombra: false, nota: 4.7, aval: 41, perfil: [2, 3, 5, 6, 5, 4, 4, 3, 2, 2] },
  { id: 'eixo', nome: 'Eixo das Árvores, rua fechada aos domingos', km: 10, piso: 'Asfalto liso', incl: 1, semDegrau: true, pisoLiso: true, banheiro: false, luz: true, sombra: true, nota: 4.8, aval: 63, perfil: [3, 3, 4, 4, 4, 3, 3, 3, 4, 3] },
  { id: 'ipe', nome: 'Parque dos Ipês', km: 3.1, piso: 'Concreto', incl: 4, semDegrau: true, pisoLiso: true, banheiro: true, luz: false, sombra: true, nota: 4.4, aval: 27, perfil: [2, 4, 7, 8, 6, 4, 3, 5, 4, 2] },
  { id: 'pista', nome: 'Pista de atletismo municipal', km: 0.4, piso: 'Pista sintética', incl: 0, semDegrau: true, pisoLiso: true, banheiro: true, luz: true, sombra: false, nota: 4.9, aval: 35, perfil: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
  { id: 'orla', nome: 'Orla Norte', km: 8, piso: 'Asfalto com trechos de bloquete', incl: 3, semDegrau: false, pisoLiso: false, banheiro: false, luz: true, sombra: true, nota: 3.9, aval: 19, perfil: [2, 2, 3, 5, 4, 3, 5, 6, 4, 3] }
];
const PROVAS = [
  { d: '2026-12-06', nome: 'Corrida Rodas e Passos', cidade: 'Brasília (DF)', dist: '3 km e 5 km', cats: ['Cadeirante', 'DV com guia', 'Amputados', 'DI'], largada: 'Largada adaptada 10 minutos antes da geral', regra: 'Atletas com deficiência visual correm com guia obrigatório, que não paga inscrição.' },
  { d: '2026-12-13', nome: 'Desafio Noturno Inclusivo', cidade: 'Goiânia (GO)', dist: '5 km e 10 km', cats: ['Cadeirante', 'DV com guia', 'Amputados'], largada: 'Largada adaptada às 19h40', regra: 'Cadeira de rodas sem motor e sem ajuda de terceiros no percurso.' },
  { d: '2026-12-20', nome: 'Meia do Cerrado Adaptada', cidade: 'Brasília (DF)', dist: '10 km e 21 km', cats: ['Cadeirante', 'DV com guia', 'Amputados', 'DI'], largada: 'Largada adaptada 15 minutos antes da geral', regra: 'Percurso de 21 km com pontos de apoio a cada 3 km e banheiros acessíveis.' },
  { d: '2027-01-17', nome: 'Volta do Lago 7K', cidade: 'Brasília (DF)', dist: '7 km', cats: ['DV com guia', 'DI'], largada: 'Largada única com corredor exclusivo para duplas atleta e guia', regra: 'Cordinha de guia de até 50 cm, presa ao punho ou à mão.' }
];
const GUIAS = [
  { nome: 'Rafa', cidade: 'Brasília (DF)', ritmo: '6 min/km', dias: 'sábado e domingo de manhã', provas: 12 },
  { nome: 'Carla', cidade: 'Taguatinga (DF)', ritmo: '7 min/km', dias: 'terça e quinta à noite', provas: 5 },
  { nome: 'Tiago', cidade: 'Goiânia (GO)', ritmo: '5:30 min/km', dias: 'domingo cedo', provas: 20 }
];
const CLUBES = [
  { id: 'rodas', nome: 'Rodas Livres', txt: 'Cadeirantes e handbike. Treino coletivo aos domingos, 7h.', membros: 86 },
  { id: 'lamina', nome: 'Lâmina e Asfalto', txt: 'Corredores amputados e com prótese, do 5K à meia maratona.', membros: 41 },
  { id: 'passo', nome: 'Passo Guiado', txt: 'Atletas cegos e com baixa visão, junto com guias voluntários.', membros: 64 },
  { id: 'todos', nome: 'Todo Corpo Corre', txt: 'Caminhada e corrida adaptada para quem está começando.', membros: 120 }
];
const H = 3600e3;
const SEED = [
  { id: 's1', nome: 'Ana', modalidade: 'cadeira', distanciaKm: 5.2, tempoSeg: 1450, esforco: 7, rota: 'lago', aplausos: 32, ts: Date.now() - 2 * H, exemplo: true },
  { id: 's2', nome: 'Léo', modalidade: 'protese', distanciaKm: 8, tempoSeg: 2880, esforco: 6, rota: 'orla', aplausos: 18, ts: Date.now() - 5 * H, exemplo: true },
  { id: 's3', nome: 'Bia e Rafa', modalidade: 'guia', distanciaKm: 10, tempoSeg: 3720, esforco: 8, rota: 'eixo', aplausos: 47, ts: Date.now() - 26 * H, exemplo: true },
  { id: 's4', nome: 'Jorge', modalidade: 'handbike', distanciaKm: 21, tempoSeg: 3900, esforco: 7, rota: 'eixo', aplausos: 25, ts: Date.now() - 50 * H, exemplo: true }
];

/* ---------- armazenamento: Firebase ou navegador ---------- */
const Store = {
  mode: 'local', fb: null,
  async init() {
    const c = window.ACESSRUN_FIREBASE;
    if (c && c.apiKey && c.projectId) {
      try {
        const m = await import(new URL('firebase.js', BASE).href);
        this.fb = m.connect(c);
        await this.fb.list('atividades', 1);
        this.mode = 'firebase';
      } catch (e) { console.warn('AcessRun: Firebase indisponível, usando o navegador.', e); this.fb = null; this.mode = 'local'; }
    }
  },
  async list(col) {
    if (this.mode === 'firebase') return (await this.fb.list(col, 40)).map(d => ({ ...d, ts: d.criadoEm && d.criadoEm.toMillis ? d.criadoEm.toMillis() : Date.now() }));
    return LS.get('ar_' + col, []);
  },
  async add(col, data) {
    if (this.mode === 'firebase') return this.fb.add(col, data);
    const arr = LS.get('ar_' + col, []); const item = { ...data, id: 'l' + Date.now(), ts: Date.now() };
    arr.unshift(item); LS.set('ar_' + col, arr.slice(0, 200)); return item.id;
  },
  async inc(col, id) {
    if (this.mode === 'firebase') return this.fb.inc(col, id, 'aplausos');
    const arr = LS.get('ar_' + col, []); const it = arr.find(a => a.id === id);
    if (it) { it.aplausos = (it.aplausos || 0) + 1; LS.set('ar_' + col, arr); }
  }
};

/* ---------- formatação ---------- */
const num = v => { const n = parseFloat(String(v).trim().replace(',', '.')); return Number.isFinite(n) ? n : NaN; };
const secs = v => { const p = String(v).trim().split(':'); if (!p.length || p.some(x => x === '' || isNaN(+x))) return NaN; return p.reduce((s, x) => s * 60 + +x, 0); };
const fmtT = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; const p = n => String(n).padStart(2, '0'); return h ? `${h}:${p(m)}:${p(ss)}` : `${m}:${p(ss)}`; };
const fmtKm = n => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const pace = (km, s) => (km > 0 && s > 0 ? fmtT(s / km) : '–');
const speed = (km, s) => (km > 0 && s > 0 ? (km / (s / 3600)).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '–');
const paceWords = (km, s) => { if (!(km > 0 && s > 0)) return ''; const p = Math.round(s / km); return `${Math.floor(p / 60)} minutos e ${p % 60} segundos por quilômetro`; };
const ago = ts => { const m = Math.round((Date.now() - ts) / 60000); if (m < 1) return 'agora'; if (m < 60) return `há ${m} min`; const h = Math.round(m / 60); if (h < 24) return `há ${h} h`; const d = Math.round(h / 24); return d === 1 ? 'ontem' : `há ${d} dias`; };
const ESF = ['', 'muito leve', 'muito leve', 'leve', 'leve', 'moderado', 'moderado', 'forte', 'forte', 'máximo', 'máximo'];

/* ---------- voz ---------- */
let prefs = Object.assign({ fs: 1, hc: false, dys: false, motion: false, links: false, cursor: false, ruler: false, rate: 1 }, LS.get('ar_prefs', {}));
function speak(txt) {
  try {
    const ss = window.speechSynthesis; if (!ss) { say('Leitura em voz alta não está disponível neste navegador.'); return; }
    ss.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'pt-BR'; u.rate = prefs.rate || 1;
    const v = ss.getVoices().find(x => /pt[-_]BR/i.test(x.lang)); if (v) u.voice = v; ss.speak(u);
  } catch (e) { say('Não foi possível ler em voz alta.'); }
}
const sectionText = el => $$('h2, h3, p, li, legend, label, th, td', el).filter(n => !n.closest('.read, .sr, button')).map(n => n.textContent.trim()).filter(Boolean).join('. ').slice(0, 1800);

/* ---------- registrar ---------- */
const form = $('#regForm');
const fDist = $('#dist'), fTempo = $('#tempo'), fEsf = $('#esforco'), fRota = $('#rotaSel'), fNome = $('#nome'), fVoz = $('#voz');
fRota.innerHTML = '<option value="">Sem rota definida</option>' + ROTAS.map(r => `<option value="${esc(r.id)}">${esc(r.nome)}</option>`).join('');
fRota.value = 'lago';
fNome.value = LS.get('ar_nome', '');
const curMod = () => ($('input[name=mod]:checked') || {}).value || 'cadeira';
function calc() {
  const km = num(fDist.value), s = secs(fTempo.value), m = MODS[curMod()];
  $('#resMod').textContent = m.titulo; $('#resIcon').setAttribute('href', '#' + m.ic);
  $('#resPace').textContent = pace(km, s); $('#resSpeed').textContent = speed(km, s);
  $('#resDist').textContent = km > 0 ? fmtKm(km) : '–'; $('#resTime').textContent = s > 0 ? fmtT(s) : '–';
  const v = +fEsf.value; $('#esfOut').textContent = `${v}, ${ESF[v]}`; fEsf.setAttribute('aria-valuetext', `${v}, ${ESF[v]}`);
}
form.addEventListener('input', calc);
form.addEventListener('change', calc);

/* cronômetro e GPS */
let tm = { run: false, start: 0, acc: 0, id: 0, lastCue: 0 };
const tmOut = $('#tmOut'), tmBtn = $('#tmStart');
function tick() {
  const s = tm.acc + (tm.run ? (Date.now() - tm.start) / 1000 : 0);
  tmOut.textContent = fmtT(s); fTempo.value = fmtT(s).split(':').length === 2 ? '0:' + fmtT(s).padStart(5, '0') : fmtT(s); calc();
  const min = Math.floor(s / 60);
  if (fVoz.checked && tm.run && min > 0 && min % 5 === 0 && min !== tm.lastCue) { tm.lastCue = min; speak(`${min} minutos de treino.` + (num(fDist.value) > 0 ? ` Ritmo de ${paceWords(num(fDist.value), s)}.` : '')); }
}
tmBtn.addEventListener('click', () => {
  if (!tm.run) { tm.run = true; tm.start = Date.now(); tm.id = setInterval(tick, 250); tmBtn.textContent = 'Pausar'; $('#resNote').textContent = 'Cronômetro rodando.'; if (fVoz.checked) speak('Treino iniciado. Bom treino!'); }
  else { tm.acc += (Date.now() - tm.start) / 1000; tm.run = false; clearInterval(tm.id); tmBtn.textContent = 'Continuar'; $('#resNote').textContent = 'Cronômetro pausado.'; tick(); }
});
$('#tmReset').addEventListener('click', () => { clearInterval(tm.id); tm = { run: false, start: 0, acc: 0, id: 0, lastCue: 0 }; tmBtn.textContent = 'Iniciar'; tmOut.textContent = '0:00'; $('#resNote').textContent = 'Cronômetro zerado.'; });
let gps = { id: null, last: null, km: 0, nextKm: 1 };
const hav = (a, b) => { const R = 6371, r = x => x * Math.PI / 180; const dLa = r(b.latitude - a.latitude), dLo = r(b.longitude - a.longitude); const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.latitude)) * Math.cos(r(b.latitude)) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
$('#gpsBtn').addEventListener('click', e => {
  const b = e.currentTarget;
  if (gps.id !== null) { navigator.geolocation.clearWatch(gps.id); gps.id = null; b.setAttribute('aria-pressed', 'false'); b.textContent = 'Medir com GPS'; $('#resNote').textContent = 'GPS desligado.'; return; }
  if (!('geolocation' in navigator)) { $('#resNote').textContent = 'Este navegador não tem GPS. Digite a distância.'; return; }
  try {
    gps = { id: null, last: null, km: 0, nextKm: 1 };
    gps.id = navigator.geolocation.watchPosition(p => {
      const c = p.coords; if (c.accuracy > 35) return;
      if (gps.last) { const d = hav(gps.last, c); if (d > 0.003 && d < 0.2) { gps.km += d; fDist.value = fmtKm(gps.km); calc(); } }
      gps.last = c;
      if (gps.km >= gps.nextKm) { const s = secs(fTempo.value); if (fVoz.checked) speak(`${gps.nextKm} quilômetro${gps.nextKm > 1 ? 's' : ''}. Ritmo de ${paceWords(gps.km, s)}.`); gps.nextKm++; }
    }, err => { $('#resNote').textContent = err.code === 1 ? 'O GPS foi bloqueado aqui. Digite a distância ou libere a localização no site publicado.' : 'Não foi possível usar o GPS agora. Digite a distância.'; b.setAttribute('aria-pressed', 'false'); b.textContent = 'Medir com GPS'; gps.id = null; }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 });
    b.setAttribute('aria-pressed', 'true'); b.textContent = 'Parar GPS'; $('#resNote').textContent = 'Procurando sinal de GPS…';
    if (!tm.run) tmBtn.click();
  } catch (err) { $('#resNote').textContent = 'O GPS não está disponível nesta prévia. Digite a distância.'; }
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const km = num(fDist.value), s = secs(fTempo.value), err = $('#regErr');
  fDist.removeAttribute('aria-invalid'); fTempo.removeAttribute('aria-invalid');
  if (!(km > 0 && km <= 300)) { err.textContent = 'Informe a distância em quilômetros, por exemplo 5,2.'; fDist.setAttribute('aria-invalid', 'true'); fDist.focus(); return; }
  if (!(s > 0 && s <= 86400)) { err.textContent = 'Informe o tempo como 0:24:10 ou use o cronômetro.'; fTempo.setAttribute('aria-invalid', 'true'); fTempo.focus(); return; }
  err.textContent = '';
  const nome = fNome.value.trim().slice(0, 40) || 'Atleta'; LS.set('ar_nome', fNome.value.trim());
  const data = { nome, modalidade: curMod(), distanciaKm: Math.round(km * 100) / 100, tempoSeg: Math.round(s), esforco: +fEsf.value, rota: fRota.value, aplausos: 0 };
  try {
    await Store.add('atividades', data);
    const msg = `Atividade salva: ${MODS[data.modalidade].titulo}, ${fmtKm(km)} quilômetros em ${fmtT(s)}. Ritmo de ${paceWords(km, s)}.`;
    $('#resNote').textContent = 'Atividade salva no feed.'; say(msg); if (fVoz.checked) speak(msg);
    await renderFeed();
  } catch (x) { err.textContent = 'Não foi possível salvar agora. Tente de novo em instantes.'; }
});

/* feed */
const seedKudos = LS.get('ar_seedKudos', {});
const myKudos = new Set(LS.get('ar_myKudos', []));
let feedItems = [];
async function renderFeed() {
  let items = [];
  try { items = await Store.list('atividades'); } catch (e) { items = []; }
  const seeds = SEED.map(s => ({ ...s, aplausos: s.aplausos + (seedKudos[s.id] || 0) }));
  feedItems = [...items, ...(Store.mode === 'local' || !items.length ? seeds : [])].sort((a, b) => b.ts - a.ts).slice(0, 12);
  const rotaNome = id => (ROTAS.find(r => r.id === id) || {}).nome || 'Treino livre';
  $('#feed').innerHTML = feedItems.map(a => {
    const m = MODS[a.modalidade] || MODS.adaptada, on = myKudos.has(a.id);
    return `<li class="post">
      <span class="ava" aria-hidden="true"><svg><use href="#${m.ic}"/></svg></span>
      <h4>${esc(a.nome)}</h4>
      <p class="meta">${esc(m.titulo)} · ${esc(ago(a.ts))}</p>
      <div class="stats"><p><b>${esc(fmtKm(+a.distanciaKm))}</b><span>km</span></p><p><b>${esc(fmtT(+a.tempoSeg))}</b><span>tempo</span></p><p><b>${esc(pace(+a.distanciaKm, +a.tempoSeg))}</b><span>min/km</span></p></div>
      <div class="post-foot"><span class="meta">${esc(rotaNome(a.rota))}</span>${a.exemplo ? '<span class="ex">exemplo</span>' : ''}
        <button type="button" class="kudo" data-id="${esc(a.id)}" data-ex="${a.exemplo ? 1 : 0}" aria-pressed="${on}" aria-label="Aplaudir o treino de ${esc(a.nome)}. ${esc(a.aplausos || 0)} aplausos"><svg aria-hidden="true"><use href="#i-palmas"/></svg><span>${esc(a.aplausos || 0)}</span></button></div>
    </li>`;
  }).join('') || '<li class="post"><p>Nenhum treino ainda. Registre o primeiro!</p></li>';
  renderChallenge();
}
$('#feed').addEventListener('click', async e => {
  const b = e.target.closest('.kudo'); if (!b || b.getAttribute('aria-pressed') === 'true') return;
  const id = b.dataset.id; myKudos.add(id); LS.set('ar_myKudos', [...myKudos]);
  if (b.dataset.ex === '1') { seedKudos[id] = (seedKudos[id] || 0) + 1; LS.set('ar_seedKudos', seedKudos); }
  else { try { await Store.inc('atividades', id); } catch (x) { /* ignora */ } }
  const n = +b.querySelector('span').textContent + 1; b.querySelector('span').textContent = n; b.setAttribute('aria-pressed', 'true');
  say(`Você aplaudiu. Agora são ${n} aplausos.`);
});
function renderChallenge() {
  const now = new Date();
  const km = feedItems.filter(a => { const d = new Date(a.ts); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).reduce((s, a) => s + (+a.distanciaKm || 0), 0);
  const pct = Math.min(100, Math.round(km));
  $('#meterFill').style.width = pct + '%'; $('#meter').setAttribute('aria-valuenow', pct); $('#meter').setAttribute('aria-valuetext', `${fmtKm(km)} de 100 quilômetros`);
  $('#meterKm').textContent = fmtKm(Math.round(km * 10) / 10);
}

/* ---------- rotas ---------- */
const filters = new Set();
const ratings = LS.get('ar_ratings', {});
function profile(p) {
  const w = 300, h = 56, mx = Math.max(...p, 8), step = w / (p.length - 1);
  const pts = p.map((v, i) => `${(i * step).toFixed(1)},${(h - 6 - (v / mx) * (h - 14)).toFixed(1)}`);
  return `<svg class="prof" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,${h} ${pts.join(' ')} ${w},${h}" fill="color-mix(in srgb, var(--blue) 18%, transparent)"/><polyline points="${pts.join(' ')}" fill="none" stroke="var(--blue)" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>`;
}
function renderRoutes() {
  const list = ROTAS.filter(r => [...filters].every(f => f === 'leve' ? r.incl <= 3 : r[f]));
  $('#rotaCount').textContent = list.length === 1 ? '1 rota encontrada' : `${list.length} rotas encontradas`;
  const feat = (ok, t) => `<li class="${ok ? 'y' : 'n'}">${ok ? '' : 'sem '}${t}</li>`;
  $('#routes').innerHTML = list.map(r => {
    const extra = ratings[r.id] || { n: 0, sum: 0 }, n = r.aval + extra.n, nota = (r.nota * r.aval + extra.sum) / n;
    return `<li class="route">
      <div class="r-top"><h3>${esc(r.nome)}</h3><span class="r-km">${esc(fmtKm(r.km))} km</span></div>
      <p class="r-meta">${esc(r.piso)} · inclinação máxima de ${esc(r.incl)}%</p>
      ${profile(r.perfil)}
      <ul class="feat">${r.semDegrau ? '<li class="y">Sem degraus</li>' : '<li class="warn">Tem degraus</li>'}${feat(r.banheiro, 'banheiro acessível')}${feat(r.luz, 'iluminação')}${feat(r.sombra, 'sombra')}</ul>
      <p class="r-rate">Nota ${esc(nota.toLocaleString('pt-BR', { maximumFractionDigits: 1 }))} de 5 · ${esc(n)} avaliações</p>
      <div class="r-btns"><button type="button" class="mini" data-use="${esc(r.id)}">Usar no registro</button><button type="button" class="mini ghost" data-rate="${esc(r.id)}">Avaliar acessibilidade</button></div>
    </li>`;
  }).join('') || '<li class="route"><p>Nenhuma rota com todos esses filtros. Tire um filtro para ver mais.</p></li>';
}
$$('.chip').forEach(c => c.addEventListener('click', () => {
  const f = c.dataset.f, on = c.getAttribute('aria-pressed') !== 'true';
  c.setAttribute('aria-pressed', on); on ? filters.add(f) : filters.delete(f); renderRoutes();
}));
$('#routes').addEventListener('click', e => {
  const u = e.target.closest('[data-use]'), r = e.target.closest('[data-rate]');
  if (u) { fRota.value = u.dataset.use; calc(); location.hash = 'registrar'; setTimeout(() => fRota.focus(), 350); say('Rota escolhida para o registro.'); }
  if (r) rateDialog(r.dataset.rate);
});

/* ---------- janela (dialog) ---------- */
const dlg = $('#dlg'); let lastFocus = null;
function openDlg(title, html) {
  lastFocus = document.activeElement; $('#dlgTitle').textContent = title; $('#dlgBody').innerHTML = html;
  try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); }
  const f = $('#dlgBody input, #dlgBody button, #dlgBody a', dlg); (f || $('#dlgClose')).focus();
}
function closeDlg() { try { dlg.close(); } catch (e) { dlg.removeAttribute('open'); } if (lastFocus) lastFocus.focus(); }
$('#dlgClose').addEventListener('click', closeDlg);
dlg.addEventListener('cancel', e => { e.preventDefault(); closeDlg(); });
function rateDialog(id) {
  const r = ROTAS.find(x => x.id === id);
  openDlg(`Avaliar: ${r.nome}`, `<form id="rateForm">
    <fieldset><legend>Nota de acessibilidade</legend><div class="stars">${[1, 2, 3, 4, 5].map(n => `<label><input type="radio" name="nota" value="${n}" ${n === 5 ? 'checked' : ''}><span>${n}</span><span class="sr"> de 5</span></label>`).join('')}</div></fieldset>
    <fieldset class="days"><legend>O que você encontrou?</legend>${['Piso liso', 'Rampas boas', 'Banheiro acessível', 'Bebedouro na altura certa', 'Calçada com buracos', 'Degrau sem rampa'].map(t => `<label><input type="checkbox" name="item" value="${esc(t)}">${esc(t)}</label>`).join('')}</fieldset>
    <button class="btn blue" type="submit">Enviar avaliação</button></form>`);
  $('#rateForm').addEventListener('submit', async e => {
    e.preventDefault();
    const nota = +($('input[name=nota]:checked', e.target) || { value: 5 }).value;
    const itens = $$('input[name=item]:checked', e.target).map(i => i.value);
    try { await Store.add('avaliacoesRotas', { rotaId: id, nota, itens }); } catch (x) { /* segue local */ }
    const cur = ratings[id] || { n: 0, sum: 0 }; ratings[id] = { n: cur.n + 1, sum: cur.sum + nota }; LS.set('ar_ratings', ratings);
    closeDlg(); renderRoutes(); say(`Obrigado! Sua nota ${nota} para ${r.nome} foi registrada.`);
  });
}

/* ---------- provas ---------- */
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const SEM = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function renderEvents() {
  const cat = $('#catSel').value;
  const list = PROVAS.filter(p => !cat || p.cats.includes(cat));
  $('#events').innerHTML = list.map((p, i) => {
    const d = new Date(p.d + 'T12:00:00');
    return `<li class="ev"><p class="date" aria-hidden="true"><b>${d.getDate()}</b><span>${MES[d.getMonth()]}</span></p>
      <div><h3>${esc(p.nome)}</h3><p><span class="sr">${esc(SEM[d.getDay()])}, ${d.getDate()} de ${esc(MES[d.getMonth()])}. </span>${esc(SEM[d.getDay()])} · ${esc(p.cidade)} · ${esc(p.dist)}</p>
      <ul class="cats" aria-label="Categorias">${p.cats.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
      <button type="button" class="mini ghost" data-ev="${PROVAS.indexOf(p)}">Ver detalhes</button></li>`;
  }).join('') || '<li class="ev"><p>Nenhuma prova nessa categoria por enquanto.</p></li>';
}
$('#catSel').addEventListener('change', () => { renderEvents(); say(`${$$('#events .ev h3').length} provas na lista.`); });
$('#events').addEventListener('click', e => {
  const b = e.target.closest('[data-ev]'); if (!b) return; const p = PROVAS[+b.dataset.ev]; const d = new Date(p.d + 'T12:00:00');
  openDlg(p.nome, `<p><b>${esc(SEM[d.getDay()])}, ${d.getDate()} de ${esc(MES[d.getMonth()])}</b> · ${esc(p.cidade)} · ${esc(p.dist)}</p>
    <ul class="ticks"><li>${esc(p.largada)}</li><li>${esc(p.regra)}</li><li>Categorias: ${esc(p.cats.join(', '))}</li></ul>
    <p class="note">Prova de exemplo. No app, a inscrição abre direto no site da organização.</p>`);
});

/* ---------- guias ---------- */
$('#guidesList').innerHTML = GUIAS.map(g => `<li class="guide"><span class="ava" aria-hidden="true"><svg><use href="#i-guia"/></svg></span><h3>${esc(g.nome)} · ${esc(g.cidade)}</h3><p>Ritmo de ${esc(g.ritmo)} · ${esc(g.dias)} · ${esc(g.provas)} provas como guia</p></li>`).join('');
$('#guiaForm').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, ok = $('#guiaOk'); ok.textContent = '';
  const fields = [['gNome', v => v.length >= 2, 'Escreva seu primeiro nome.'], ['gCidade', v => v.length >= 2, 'Escreva sua cidade.'],
    ['gContato', v => /^\S+@\S+\.\S+$/.test(v) || v.replace(/\D/g, '').length >= 10, 'Escreva um e-mail ou um WhatsApp com DDD.']];
  let first = null;
  for (const [id, test, msg] of fields) {
    const el = $('#' + id), bad = !test(el.value.trim());
    el.setAttribute('aria-invalid', bad); $('#' + id + 'Err').textContent = bad ? msg : '';
    if (bad && !first) first = el;
  }
  const lg = $('#gLgpd'); const badL = !lg.checked; $('#gLgpdErr').textContent = badL ? 'Marque a concordância para enviar.' : ''; lg.setAttribute('aria-invalid', badL);
  if (badL && !first) first = lg;
  if (first) { first.focus(); say('Confira os campos destacados.'); return; }
  const data = { tipo: $('input[name=tipo]:checked', f).value, nome: $('#gNome').value.trim().slice(0, 40), cidade: $('#gCidade').value.trim().slice(0, 60),
    ritmo: $('#gRitmo').value, dias: $$('input[name=dia]:checked', f).map(i => i.value), contato: $('#gContato').value.trim().slice(0, 80), consentimento: true };
  try {
    await Store.add('cadastrosGuia', data);
    ok.textContent = data.tipo === 'guia' ? `Obrigado, ${data.nome}! Seu cadastro como guia foi recebido.` : `Pronto, ${data.nome}! Vamos procurar um guia em ${data.cidade} para você.`;
    say(ok.textContent); f.reset(); $$('[aria-invalid]', f).forEach(x => x.removeAttribute('aria-invalid'));
  } catch (x) { ok.textContent = 'Não foi possível enviar agora. Tente de novo em instantes.'; }
});

/* ---------- clubes ---------- */
const joined = new Set(LS.get('ar_clubs', []));
function renderClubs() {
  $('#clubs').innerHTML = CLUBES.map(c => { const on = joined.has(c.id); return `<li class="club"><h3>${esc(c.nome)}</h3><p>${esc(c.txt)}</p><p>${esc(c.membros + (on ? 1 : 0))} membros</p><button type="button" class="mini" data-club="${esc(c.id)}" aria-pressed="${on}">${on ? 'Você participa' : 'Participar'}</button></li>`; }).join('');
}
$('#clubs').addEventListener('click', e => {
  const b = e.target.closest('[data-club]'); if (!b) return; const id = b.dataset.club;
  joined.has(id) ? joined.delete(id) : joined.add(id); LS.set('ar_clubs', [...joined]); renderClubs();
  const nb = $(`[data-club="${id}"]`); if (nb) nb.focus(); say(joined.has(id) ? 'Você entrou no clube.' : 'Você saiu do clube.');
});

/* ---------- ajustes de acessibilidade ---------- */
const root = document.documentElement, panel = $('#a11yPanel'), pBtn = $('#a11yBtn');
function applyPrefs() {
  root.style.setProperty('--fs', prefs.fs);
  root.classList.toggle('hc', prefs.hc); root.classList.toggle('dys', prefs.dys); root.classList.toggle('motion', prefs.motion);
  root.classList.toggle('links', prefs.links); root.classList.toggle('cursor', prefs.cursor);
  $('#ruler').hidden = !prefs.ruler;
  $$('[data-fs]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.fs === +prefs.fs)));
  $('#optContrast').checked = prefs.hc; $('#optDys').checked = prefs.dys; $('#optMotion').checked = prefs.motion;
  $('#optLinks').checked = prefs.links; $('#optCursor').checked = prefs.cursor; $('#optRuler').checked = prefs.ruler; $('#rate').value = prefs.rate;
  LS.set('ar_prefs', prefs);
}
function togglePanel(open, keepFocus) {
  const o = open ?? panel.hidden; panel.hidden = !o; pBtn.setAttribute('aria-expanded', String(o));
  if (keepFocus) return;
  if (o) $('#a11yClose').focus(); else pBtn.focus();
}
document.addEventListener('pointerdown', e => { if (!panel.hidden && !panel.contains(e.target) && !pBtn.contains(e.target)) togglePanel(false, true); });
pBtn.addEventListener('click', () => togglePanel());
$('#a11yClose').addEventListener('click', () => togglePanel(false));
$$('[data-fs]').forEach(b => b.addEventListener('click', () => { prefs.fs = +b.dataset.fs; applyPrefs(); say(`Texto em ${Math.round(prefs.fs * 100)} por cento.`); }));
[['optContrast', 'hc', 'Alto contraste'], ['optDys', 'dys', 'Leitura facilitada'], ['optMotion', 'motion', 'Animações reduzidas'], ['optLinks', 'links', 'Links destacados'], ['optCursor', 'cursor', 'Cursor grande'], ['optRuler', 'ruler', 'Régua de leitura']]
  .forEach(([id, k, nome]) => $('#' + id).addEventListener('change', e => { prefs[k] = e.target.checked; applyPrefs(); say(`${nome} ${e.target.checked ? 'ligado' : 'desligado'}.`); }));
$('#rate').addEventListener('change', e => { prefs.rate = +e.target.value; applyPrefs(); });
$('#a11yReset').addEventListener('click', () => { prefs = { fs: 1, hc: false, dys: false, motion: false, links: false, cursor: false, ruler: false, rate: 1 }; applyPrefs(); say('Ajustes restaurados.'); });
document.addEventListener('pointermove', e => { if (prefs.ruler) $('#ruler').style.top = (e.clientY - 26) + 'px'; });
$('#readSel').addEventListener('click', () => { const t = String(window.getSelection ? window.getSelection() : '').trim(); speak(t || 'Selecione um trecho da página e aperte de novo para eu ler.'); });
$('#readStop').addEventListener('click', () => { try { window.speechSynthesis.cancel(); } catch (e) { /* ok */ } });
$$('.read').forEach(b => b.addEventListener('click', () => speak(sectionText($(b.dataset.read)))));

/* VLibras: carrega o tradutor oficial (funciona no site publicado; a prévia bloqueia scripts externos) */
$('#libras').addEventListener('click', () => {
  const msg = $('#librasMsg');
  if (window.VLibras) { msg.textContent = 'O VLibras já está ativo. Use o botão azul de mãos no canto da tela.'; return; }
  if (!$('[vw]')) document.body.insertAdjacentHTML('beforeend', '<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>');
  const s = document.createElement('script'); s.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
  s.onload = () => { try { new window.VLibras.Widget('https://vlibras.gov.br/app'); msg.textContent = 'VLibras ativado. Use o botão de mãos no canto da tela.'; } catch (e) { msg.textContent = 'O VLibras carregou, mas não abriu. Recarregue a página.'; } };
  s.onerror = () => { msg.textContent = 'Não deu para carregar o VLibras aqui. No site publicado no GitHub Pages ou no Firebase ele funciona.'; };
  document.head.appendChild(s); msg.textContent = 'Carregando o VLibras…';
});

/* comandos de voz */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition; let rec = null;
$('#voiceCmd').addEventListener('click', e => {
  const b = e.currentTarget, msg = $('#voiceMsg');
  if (!SR) { msg.textContent = 'Este navegador não reconhece voz. No Chrome ou no Edge funciona.'; return; }
  if (rec) { rec.stop(); rec = null; b.setAttribute('aria-pressed', 'false'); b.textContent = 'Ativar comandos de voz'; msg.textContent = 'Comandos de voz desligados.'; return; }
  try {
    rec = new SR(); rec.lang = 'pt-BR'; rec.continuous = true; rec.interimResults = false;
    rec.onresult = ev => {
      const t = ev.results[ev.results.length - 1][0].transcript.toLowerCase(); msg.textContent = `Ouvi: “${t}”`;
      const go = id => { location.hash = id; say(`Indo para ${id}.`); };
      if (t.includes('registr')) go('registrar'); else if (t.includes('rota')) go('rotas'); else if (t.includes('prova')) go('provas');
      else if (t.includes('guia')) go('guias'); else if (t.includes('comunidade') || t.includes('clube')) go('comunidade');
      else if (t.includes('contraste')) { prefs.hc = !prefs.hc; applyPrefs(); }
      else if (t.includes('aumentar')) { prefs.fs = Math.min(1.5, +(prefs.fs + 0.15).toFixed(2)); applyPrefs(); }
      else if (t.includes('diminuir')) { prefs.fs = Math.max(1, +(prefs.fs - 0.15).toFixed(2)); applyPrefs(); }
      else if (t.includes('ler')) speak(sectionText($(location.hash || '#inicio') || document.body));
    };
    rec.onerror = ev => { msg.textContent = ev.error === 'not-allowed' ? 'O microfone foi bloqueado aqui. No site publicado, permita o microfone.' : 'Não entendi. Tente de novo.'; b.setAttribute('aria-pressed', 'false'); b.textContent = 'Ativar comandos de voz'; rec = null; };
    rec.start(); b.setAttribute('aria-pressed', 'true'); b.textContent = 'Desligar comandos de voz'; msg.textContent = 'Ouvindo… diga “rotas”, por exemplo.';
  } catch (x) { msg.textContent = 'Não foi possível ligar o microfone aqui.'; rec = null; }
});

/* atalhos de teclado */
document.addEventListener('keydown', e => {
  if (e.altKey && !e.ctrlKey && (e.key === 'a' || e.key === 'A')) { e.preventDefault(); togglePanel(); }
  if (e.altKey && !e.ctrlKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); location.hash = 'registrar'; setTimeout(() => $('input[name=mod]:checked').focus(), 300); }
  if (e.key === 'Escape' && !panel.hidden) togglePanel(false);
});

/* ---------- início ---------- */
applyPrefs(); calc(); renderRoutes(); renderEvents(); renderClubs();
renderFeed();
Store.init().then(() => {
  const t = $('#modeTag');
  if (Store.mode === 'firebase') { t.textContent = 'Conectado ao Firebase'; t.classList.add('on'); }
  else { t.textContent = 'Modo demonstração: salvo neste navegador'; }
  renderFeed();
});
}
