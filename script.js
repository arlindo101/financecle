/* ─── NAVBAR SCROLL ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) navLinks.classList.remove('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function updateActiveNav() {
  const sections = ['accueil', 'investissement', 'epargne', 'budget', 'outils'];
  const links = navLinks.querySelectorAll('.nav-link:not(.btn-nav)');
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

/* ─── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(interval); }
      else el.textContent = Math.floor(current);
    }, 30);
  });
}

/* ─── INTERSECTION OBSERVER (AOS + counters) ────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('hero-stats')) animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { animateCounters(); statsObs.disconnect(); }
  }, { threshold: 0.5 });
  statsObs.observe(heroStats);
}

/* ─── BUDGET METHODS ────────────────────────────────────────── */
const methods = {
  '503020': {
    title: 'La règle 50/30/20',
    description: 'Répartissez votre revenu net en 3 catégories : 50 % pour les besoins essentiels, 30 % pour les envies et loisirs, 20 % pour l\'épargne et le remboursement de dettes.',
    bars: [
      { label: 'Besoins (50 %)', pct: 50, color: '#6366f1' },
      { label: 'Envies (30 %)',  pct: 30, color: '#06b6d4' },
      { label: 'Épargne (20 %)', pct: 20, color: '#10b981' },
    ]
  },
  'zerobased': {
    title: 'Le budget zéro',
    description: 'Attribuez chaque euro de votre revenu à une catégorie spécifique jusqu\'à ce que Revenus − Dépenses = 0. Idéal pour éviter les dépenses impulsives et maximiser l\'épargne.',
    bars: [
      { label: 'Logement',   pct: 30, color: '#6366f1' },
      { label: 'Alimentation', pct: 15, color: '#f59e0b' },
      { label: 'Transport',  pct: 10, color: '#06b6d4' },
      { label: 'Épargne',    pct: 25, color: '#10b981' },
      { label: 'Autres',     pct: 20, color: '#8b5cf6' },
    ]
  },
  'envelope': {
    title: 'La méthode des enveloppes',
    description: 'Dès réception de votre salaire, répartissez votre argent en enveloppes (physiques ou virtuelles). Quand une enveloppe est vide, vous ne dépensez plus dans cette catégorie.',
    bars: [
      { label: 'Courses',    pct: 20, color: '#f59e0b' },
      { label: 'Restaurants', pct: 8, color: '#ef4444' },
      { label: 'Loisirs',    pct: 10, color: '#8b5cf6' },
      { label: 'Vêtements',  pct: 5, color: '#06b6d4' },
      { label: 'Épargne',    pct: 20, color: '#10b981' },
      { label: 'Charges fixes', pct: 37, color: '#6366f1' },
    ]
  }
};

function renderMethod(key) {
  const m = methods[key];
  const detail = document.getElementById('methodDetail');
  detail.innerHTML = `
    <h3>${m.title}</h3>
    <p>${m.description}</p>
    <div class="method-bars">
      ${m.bars.map(b => `
        <div class="method-bar">
          <span class="bar-label">${b.label}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width:${b.pct}%;background:${b.color}"></div>
          </div>
          <span class="bar-pct">${b.pct} %</span>
        </div>
      `).join('')}
    </div>
  `;
}

document.querySelectorAll('.method-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    renderMethod(card.dataset.method);
  });
});

renderMethod('503020');

/* ─── TOOL TABS ─────────────────────────────────────────────── */
document.querySelectorAll('.tool-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tool-' + tab.dataset.tool).classList.add('active');
  });
});

/* ─── RANGE SLIDER LABELS ───────────────────────────────────── */
function bindRange(rangeId, labelId) {
  const r = document.getElementById(rangeId);
  const l = document.getElementById(labelId);
  if (r && l) r.addEventListener('input', () => { l.textContent = r.value; });
}
bindRange('ci-years', 'ci-years-label');
bindRange('sg-years', 'sg-years-label');

/* ─── COMPOUND INTEREST CALCULATOR ─────────────────────────── */
document.getElementById('ci-calc').addEventListener('click', calcCompound);

function calcCompound() {
  const capital = parseFloat(document.getElementById('ci-capital').value) || 0;
  const monthly = parseFloat(document.getElementById('ci-monthly').value) || 0;
  const rate    = parseFloat(document.getElementById('ci-rate').value) / 100 || 0;
  const years   = parseInt(document.getElementById('ci-years').value) || 0;

  const monthlyRate = rate / 12;
  let total = capital;
  const dataPoints = [];

  for (let y = 0; y <= years; y++) {
    dataPoints.push(Math.round(total));
    for (let m = 0; m < 12; m++) {
      total = total * (1 + monthlyRate) + monthly;
    }
  }

  const invested = capital + monthly * 12 * years;
  const gains    = total - invested;

  document.getElementById('ci-total').textContent = formatEur(Math.round(total));
  document.getElementById('ci-breakdown').innerHTML = `
    <div class="breakdown-row"><span>Capital investi</span><span>${formatEur(Math.round(invested))}</span></div>
    <div class="breakdown-row"><span>Intérêts composés</span><span style="color:var(--green)">${formatEur(Math.round(gains))}</span></div>
    <div class="breakdown-row"><span>Multiplicateur</span><span>${(total / Math.max(invested, 1)).toFixed(2)}×</span></div>
  `;

  drawLineChart('ci-chart', dataPoints, years);
}

function drawLineChart(canvasId, data, years) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = { top: 16, right: 16, bottom: 30, left: 60 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  const max = Math.max(...data);
  const grad = ctx.createLinearGradient(pad.left, 0, pad.left + cw, 0);
  grad.addColorStop(0, '#6366f1');
  grad.addColorStop(1, '#06b6d4');

  const fillGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
  fillGrad.addColorStop(0, 'rgba(99,102,241,0.3)');
  fillGrad.addColorStop(1, 'rgba(99,102,241,0)');

  const pts = data.map((v, i) => ({
    x: pad.left + (i / years) * cw,
    y: pad.top + ch - (v / max) * ch
  }));

  // Fill
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length-1].x, pad.top + ch);
  ctx.lineTo(pts[0].x, pad.top + ch);
  ctx.closePath();
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // X labels
  ctx.fillStyle = '#64748b';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  const step = Math.ceil(years / 5);
  for (let i = 0; i <= years; i += step) {
    const x = pad.left + (i / years) * cw;
    ctx.fillText(i + ' ans', x, H - 6);
  }

  // Y labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = pad.top + ch - (i / 4) * ch;
    ctx.fillText(formatEurShort(v), pad.left - 6, y + 4);
  }
}

/* ─── SAVINGS GOAL CALCULATOR ───────────────────────────────── */
document.getElementById('sg-calc').addEventListener('click', calcSavingsGoal);

function calcSavingsGoal() {
  const goal    = parseFloat(document.getElementById('sg-goal').value)    || 0;
  const current = parseFloat(document.getElementById('sg-current').value) || 0;
  const rate    = parseFloat(document.getElementById('sg-rate').value) / 100 || 0;
  const years   = parseInt(document.getElementById('sg-years').value)    || 0;

  const n = years * 12;
  const r = rate / 12;
  const FV = goal;
  const PV = current * Math.pow(1 + r, n);
  const needed = FV - PV;

  let monthly;
  if (r === 0) {
    monthly = needed / n;
  } else {
    monthly = (needed * r) / (Math.pow(1 + r, n) - 1);
  }

  monthly = Math.max(0, monthly);
  const totalSaved = monthly * n;
  const totalWithCurrent = current * Math.pow(1 + r, n);

  document.getElementById('sg-monthly').textContent = formatEur(Math.round(monthly));
  document.getElementById('sg-breakdown').innerHTML = `
    <div class="breakdown-row"><span>Durée</span><span>${years} ans (${n} mois)</span></div>
    <div class="breakdown-row"><span>Total versé</span><span>${formatEur(Math.round(totalSaved))}</span></div>
    <div class="breakdown-row"><span>Croissance de l'épargne actuelle</span><span style="color:var(--green)">${formatEur(Math.round(totalWithCurrent - current))}</span></div>
    <div class="breakdown-row"><span>Objectif atteint</span><span>${formatEur(Math.round(goal))}</span></div>
  `;
}

/* ─── BUDGET CALCULATOR ─────────────────────────────────────── */
document.getElementById('bc-calc').addEventListener('click', calcBudget);

function calcBudget() {
  const income = parseFloat(document.getElementById('bc-income').value) || 0;
  const needs  = income * 0.5;
  const wants  = income * 0.3;
  const save   = income * 0.2;

  document.getElementById('bc-alloc').innerHTML = `
    <div class="alloc-row">
      <span class="alloc-label">Besoins essentiels (50 %)</span>
      <span class="alloc-amount">${formatEur(needs)}</span>
      <span class="alloc-note">Loyer, alimentation, transport, santé</span>
    </div>
    <div class="alloc-row">
      <span class="alloc-label">Envies (30 %)</span>
      <span class="alloc-amount">${formatEur(wants)}</span>
      <span class="alloc-note">Loisirs, restaurants, vêtements</span>
    </div>
    <div class="alloc-row">
      <span class="alloc-label">Épargne (20 %)</span>
      <span class="alloc-amount">${formatEur(save)}</span>
      <span class="alloc-note">Investissements, fonds d'urgence</span>
    </div>
  `;

  drawDonut('bc-chart', [
    { value: needs, color: '#6366f1', label: 'Besoins' },
    { value: wants, color: '#06b6d4', label: 'Envies' },
    { value: save,  color: '#10b981', label: 'Épargne' },
  ]);

  const legend = document.getElementById('bc-legend');
  legend.innerHTML = [
    { color: '#6366f1', label: `Besoins – ${formatEur(needs)}` },
    { color: '#06b6d4', label: `Envies – ${formatEur(wants)}` },
    { color: '#10b981', label: `Épargne – ${formatEur(save)}` },
  ].map(item => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${item.color}"></span>
      <span>${item.label}</span>
    </div>
  `).join('');
}

function drawDonut(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 10, r = R * 0.55;

  ctx.clearRect(0, 0, W, H);

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let startAngle = -Math.PI / 2;

  segments.forEach(seg => {
    const angle = (seg.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, R, startAngle, startAngle + angle);
    ctx.arc(cx, cy, r, startAngle + angle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    startAngle += angle;
  });

  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, r - 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#1a1a2e';
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('50/30/20', cx, cy);
}

/* ─── QUIZ ──────────────────────────────────────────────────── */
const questions = [
  {
    q: "Qu'est-ce qu'un ETF (Exchange Traded Fund) ?",
    options: [
      "Un fonds qui réplique un indice boursier, négociable en Bourse",
      "Un compte épargne réglementé par l'État",
      "Un type d'assurance vie à rendement garanti",
      "Un prêt à taux variable accordé par une banque"
    ],
    correct: 0,
    explanation: "Un ETF est un fonds indiciel coté en Bourse qui réplique la performance d'un indice (CAC 40, S&P 500…). Il offre diversification et frais réduits."
  },
  {
    q: "Quelle est la durée minimale recommandée pour bénéficier de l'exonération fiscale sur un PEA ?",
    options: ["2 ans", "5 ans", "8 ans", "12 ans"],
    correct: 1,
    explanation: "Après 5 ans, les gains sur un PEA sont exonérés d'impôt sur le revenu (seuls les prélèvements sociaux de 17,2 % s'appliquent)."
  },
  {
    q: "Selon la règle 50/30/20, quelle part de votre revenu devrait aller à l'épargne ?",
    options: ["10 %", "15 %", "20 %", "30 %"],
    correct: 2,
    explanation: "La règle 50/30/20 recommande : 50 % aux besoins, 30 % aux envies et 20 % à l'épargne et au remboursement des dettes."
  },
  {
    q: "Qu'est-ce que les intérêts composés ?",
    options: [
      "Des intérêts calculés uniquement sur le capital initial",
      "Des frais prélevés par la banque sur les transactions",
      "Des intérêts calculés sur le capital ET les intérêts déjà accumulés",
      "Un taux d'intérêt fixé par la Banque centrale européenne"
    ],
    correct: 2,
    explanation: "Les intérêts composés sont des intérêts calculés sur le capital initial et sur les intérêts déjà générés. C'est l'effet « boule de neige » qui fait croître votre épargne exponentiellement."
  },
  {
    q: "Qu'est-ce qu'une SCPI ?",
    options: [
      "Une société de courtage en produits financiers",
      "Un livret d'épargne à taux progressif",
      "Une Société Civile de Placement Immobilier permettant d'investir dans l'immobilier sans le gérer",
      "Un contrat d'assurance décès-invalidité"
    ],
    correct: 2,
    explanation: "Une SCPI collecte des fonds auprès d'investisseurs pour acquérir et gérer un patrimoine immobilier. L'investisseur perçoit des revenus locatifs sans gérer de biens en direct."
  }
];

let currentQ = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById('quizCounter').textContent = `Question ${currentQ + 1} / ${questions.length}`;
  document.getElementById('quizProgress').style.width = `${((currentQ) / questions.length) * 100}%`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('quizFeedback').className = 'quiz-feedback';
  document.getElementById('quizNext').style.display = 'none';
  answered = false;

  const optionsEl = document.getElementById('quizOptions');
  optionsEl.innerHTML = q.options.map((opt, i) => `
    <button class="quiz-option" data-index="${i}">${opt}</button>
  `).join('');

  optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
  });
}

function handleAnswer(index) {
  if (answered) return;
  answered = true;

  const q = questions[currentQ];
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach(btn => btn.disabled = true);

  const fb = document.getElementById('quizFeedback');
  if (index === q.correct) {
    score++;
    buttons[index].classList.add('correct');
    fb.textContent = '✓ Bonne réponse ! ' + q.explanation;
    fb.className = 'quiz-feedback correct';
  } else {
    buttons[index].classList.add('wrong');
    buttons[q.correct].classList.add('correct');
    fb.textContent = '✗ Mauvaise réponse. ' + q.explanation;
    fb.className = 'quiz-feedback wrong';
  }

  const nextBtn = document.getElementById('quizNext');
  nextBtn.style.display = 'inline-flex';
  nextBtn.textContent = currentQ < questions.length - 1 ? 'Question suivante →' : 'Voir mes résultats →';
}

document.getElementById('quizNext').addEventListener('click', () => {
  currentQ++;
  if (currentQ < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.getElementById('quizBox').style.display = 'none';
  const resultEl = document.getElementById('quizResult');
  resultEl.classList.remove('hidden');

  document.getElementById('quizScore').textContent = `${score}/${questions.length}`;
  document.getElementById('quizProgress').style.width = '100%';

  const titles = ['À améliorer', 'En progression', 'Bon niveau !', 'Très bien !', 'Excellent !', 'Expert financier !'];
  const texts = [
    'Ne vous découragez pas ! Parcourez nos guides pour renforcer vos bases.',
    'Vous avez de bonnes intuitions. Continuez à apprendre avec nos modules.',
    'Beau résultat ! Vous maîtrisez les fondamentaux de la finance personnelle.',
    'Très bien ! Vous avez une solide culture financière. Explorez nos outils avancés.',
    'Impressionnant ! Vous êtes presque un expert. Partagez vos connaissances autour de vous.',
    'Parfait ! Vous maîtrisez la finance personnelle sur le bout des doigts.'
  ];

  document.getElementById('quizResultTitle').textContent = titles[score];
  document.getElementById('quizResultText').textContent = texts[score];
}

document.getElementById('quizRestart').addEventListener('click', () => {
  currentQ = 0;
  score = 0;
  document.getElementById('quizBox').style.display = 'block';
  document.getElementById('quizResult').classList.add('hidden');
  renderQuestion();
});

renderQuestion();

/* ─── HELPERS ────────────────────────────────────────────────── */
function formatEur(n) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}
function formatEurShort(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M€';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + ' k€';
  return Math.round(n) + ' €';
}

/* ─── AUTO-CALCULATE ON LOAD ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  calcCompound();
  calcSavingsGoal();
  calcBudget();
});

// Also trigger immediately (script is deferred via end-of-body)
calcCompound();
calcSavingsGoal();
calcBudget();
