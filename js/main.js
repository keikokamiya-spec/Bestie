/* ============================================================
   Bestie — main.js
   スムーススクロール / ヘッダー / ハンバーガー / スクロールリベール / 本日の営業状況
   ============================================================ */

'use strict';

/* ─── DOM Ready ─── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initBurger();
  initSmoothScroll();
  initScrollReveal();
  initTodayInfo();
  initTodayRowHighlight();
});


/* ============================================================
   1. HEADER — スクロールで背景を変化
   ============================================================ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初期実行
}


/* ============================================================
   2. HAMBURGER MENU（SP）
   ============================================================ */
function initBurger() {
  const btn   = document.getElementById('burgerBtn');
  const menu  = document.getElementById('spMenu');
  const links = menu ? menu.querySelectorAll('.sp-menu__link, .sp-menu__ig') : [];
  if (!btn || !menu) return;

  const open  = () => {
    btn.classList.add('open');
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? close() : open();
  });

  links.forEach(link => link.addEventListener('click', close));

  // ESCキーで閉じる
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}


/* ============================================================
   3. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  const HEADER_HEIGHT = 68;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ============================================================
   4. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // 一度だけ
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


/* ============================================================
   5. 本日の営業ステータスバッジ
   ============================================================ */
function initTodayInfo() {
  const badge = document.getElementById('todayBadge');
  if (!badge) return;

  const now  = new Date();
  const dow  = now.getDay();   // 0=日, 1=月 ... 6=土
  const hour = now.getHours();
  const min  = now.getMinutes();
  const time = hour * 60 + min; // 分換算

  const lunchSchedule = {
    0: [12*60, 17*60],
    1: null,
    2: [12*60, 17*60],
    3: [12*60, 17*60],
    4: [12*60, 17*60],
    5: [12*60, 17*60],
    6: [12*60, 17*60],
  };

  const todayLunch = lunchSchedule[dow];
  const inRange = (start, end) => time >= start && time < end;

  const isLunchOpen  = todayLunch && inRange(todayLunch[0], todayLunch[1]);
  const isNightOpen  = time >= 20*60 || time < 3*60;

  let html = '';
  if (isLunchOpen) {
    html = `<span class="today-open">昼の部 営業中 12:00〜17:00</span>`;
  } else if (isNightOpen) {
    html = `<span class="today-open">夜の部 営業中 20:00〜翌3:00</span>`;
  } else {
    html = `<span class="today-closed">現在 準備中 / 営業時間外</span>`;
  }
  badge.innerHTML = html;
}


/* ============================================================
   6. 営業時間テーブル — 本日の行をハイライト
   ============================================================ */
function initTodayRowHighlight() {
  const dow = new Date().getDay();
  const row = document.querySelector(`.hours-table tbody tr[data-day="${dow}"]`);
  if (row) {
    row.classList.add('today-row');
    // 曜日セルに「今日」ラベル追加
    const dayCell = row.querySelector('.day-cell');
    if (dayCell) {
      dayCell.innerHTML += `<span style="
        display:block;
        font-size:0.55rem;
        letter-spacing:0.08em;
        color:var(--pink);
        font-weight:600;
        margin-top:1px;
      ">TODAY</span>`;
    }
  }
}
