/* =========================================================================
   RAJIN OLAHRAGA — main.js
   Dipakai bersama oleh semua halaman. Setiap fungsi mengecek dulu apakah
   elemen yang dibutuhkan ada di halaman itu, jadi aman dipakai di mana saja.

   CATATAN INTEGRASI BACKEND (Cloudflare Workers + D1)
   Titik yang perlu diganti dengan fetch() ke worker kamu ditandai // TODO(API)
   Contoh:
     const res = await fetch('https://cms-api-worker.widyazef28.workers.dev/api/login', {
       method:'POST', headers:{'Content-Type':'application/json'},
       body: JSON.stringify({ email, password })
     });
   ========================================================================= */

/* ---------- DRAWER (burger menu) ---------- */
function toggleDrawer(open){
  const d = document.getElementById('drawer');
  const o = document.getElementById('drawer-overlay');
  if(!d || !o) return;
  d.classList.toggle('open', open);
  o.classList.toggle('open', open);
}

/* ---------- TOP APPS MENU (submenu) ---------- */
function toggleAppsMenu(force){
  const panel = document.getElementById('apps-menu-panel');
  if(!panel) return;
  const open = force !== undefined ? force : !panel.classList.contains('open');
  panel.classList.toggle('open', open);
}
document.addEventListener('click', function(e){
  const panel = document.getElementById('apps-menu-panel');
  const btn = document.getElementById('apps-btn');
  if(panel && btn && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)){
    panel.classList.remove('open');
  }
});

/* ---------- PASSWORD SHOW / HIDE (ikon mata) ---------- */
function togglePasswordVisibility(inputId, btn){
  const input = document.getElementById(inputId);
  if(!input) return;
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  btn.innerHTML = showing ? eyeIconOpen() : eyeIconClosed();
  btn.setAttribute('aria-label', showing ? 'Tampilkan sandi' : 'Sembunyikan sandi');
}
function eyeIconOpen(){
  return '<svg class="i" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
}
function eyeIconClosed(){
  return '<svg class="i" viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.66 19.66 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.5 19.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
}

/* ---------- LOGIN: validasi sandi salah (contoh, ganti dgn API) ---------- */
const DEMO_EMAIL = 'budi@rajinolahraga.id';
const DEMO_PASSWORD = '123456';

function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;
  const field = document.getElementById('login-pass-field');
  const error = document.getElementById('login-pass-error');

  // TODO(API): ganti blok ini dengan POST ke /api/login lalu cek respons server
  const isValid = (email === DEMO_EMAIL && pass === DEMO_PASSWORD);

  if(!isValid){
    field.classList.add('has-error');
    error.classList.add('show');
    return false;
  }
  field.classList.remove('has-error');
  error.classList.remove('show');
  window.location.href = 'dashboard.html';
  return false;
}

function handleRegister(e){
  e.preventDefault();
  // TODO(API): POST ke /api/register, lalu arahkan ke login.html atau dashboard.html
  window.location.href = 'login.html';
  return false;
}

/* ---------- DATA CONTOH (dashboard, kalori, latihan, rapor) ---------- */
const weekData = [
  {d:'Sen', sport:'lari', done:true},
  {d:'Sel', sport:'sepeda', done:true},
  {d:'Rab', sport:null, done:false},
  {d:'Kam', sport:'renang', done:true},
  {d:'Jum', sport:'lari', done:true},
  {d:'Sab', sport:'sepeda', done:true},
  {d:'Min', sport:null, done:false},
];

const sportColor = {lari:'var(--lari)', sepeda:'var(--sepeda)', renang:'var(--renang)'};
const sportTint  = {lari:'var(--lari-tint)', sepeda:'var(--sepeda-tint)', renang:'var(--renang-tint)'};
const sportLabel = {lari:'Lari', sepeda:'Bersepeda', renang:'Berenang'};

const videos = [
  {id:1, sport:'lari', title:'Lari Interval Pemula 20 Menit', dur:'20:15', img:'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80'},
  {id:2, sport:'sepeda', title:'Sepeda Statis: Endurance Ringan', dur:'35:40', img:'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80'},
  {id:3, sport:'renang', title:'Teknik Dasar Gaya Bebas', dur:'18:00', img:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80'},
  {id:4, sport:'lari', title:'Lari Jarak Jauh 5K Santai', dur:'28:30', img:'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=600&q=80'},
  {id:5, sport:'sepeda', title:'Sepeda Tanjakan: Kekuatan Kaki', dur:'40:00', img:'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80'},
  {id:6, sport:'renang', title:'Renang Interval untuk Stamina', dur:'22:10', img:'https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&q=80'},
];

// Jurnal progress KOSONG di awal — user harus input dulu (sesuai permintaan)
let journal = [];
let journalIdCounter = 1;

const kalori = [
  {label:'Lari pagi 5K', kkal:420, sport:'lari'},
  {label:'Sepeda santai 14 km', kkal:560, sport:'sepeda'},
  {label:'Aktivitas harian', kkal:870, sport:null},
];

/* ---------- WEEK TRACK ---------- */
function renderWeek(){
  const wrap = document.getElementById('week-lanes');
  if(!wrap) return;
  wrap.innerHTML = weekData.map(day => `
    <div class="lane ${day.done ? 'filled' : ''}">
      ${day.done ? `<div class="fill" style="height:70%; background:${sportColor[day.sport]};"></div>` : ''}
      ${day.done ? `<svg class="i check" viewBox="0 0 24 24" style="width:16px;height:16px;color:#fff;"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
      <span class="day-label">${day.d}</span>
    </div>
  `).join('');
}

/* ---------- VIDEO CARDS ---------- */
function videoCardHTML(v){
  return `
    <div class="card video-card hoverable">
      <div class="video-thumb">
        <img src="${v.img}" alt="Thumbnail latihan ${sportLabel[v.sport]}: ${v.title}">
        <span class="duration mono">${v.dur}</span>
        <div class="play-badge"><div class="circle"><svg class="i" viewBox="0 0 24 24" style="width:18px;height:18px;"><polygon points="6 4 20 12 6 20 6 4"/></svg></div></div>
      </div>
      <div class="video-body">
        <h4>${v.title}</h4>
        <div class="video-meta"><span class="tag ${v.sport}">${sportLabel[v.sport]}</span></div>
      </div>
    </div>`;
}
function renderLatihan(filter){
  const grid = document.getElementById('latihan-grid');
  if(!grid) return;
  filter = filter || 'semua';
  const list = filter==='semua' ? videos : videos.filter(v => v.sport===filter);
  grid.innerHTML = list.map(videoCardHTML).join('');
}
function renderDashVideos(){
  const el = document.getElementById('dash-next-videos');
  if(!el) return;
  el.innerHTML = videos.slice(0,3).map(videoCardHTML).join('');
}

/* ---------- KALORI RING ---------- */
function renderKaloriRing(percent){
  const ring = document.getElementById('kalori-ring');
  if(!ring) return;
  const circ = 2 * Math.PI * 62;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ * (1 - percent/100);
  ring.style.transition = 'stroke-dashoffset .7s ease';
  document.getElementById('kalori-ring-num').textContent = percent + '%';

  const ticks = document.getElementById('stopwatch-ticks');
  if(ticks){
    let tickSvg = '';
    for(let i=0;i<24;i++){
      const angle = (i/24) * 360;
      const isMajor = i % 6 === 0;
      tickSvg += `<line x1="75" y1="${isMajor?9:11}" x2="75" y2="15" stroke="var(--ink-faint)" stroke-width="${isMajor?2:1}" transform="rotate(${angle} 75 75)"/>`;
    }
    ticks.innerHTML = tickSvg;
  }
}
function renderKaloriList(){
  const wrap = document.getElementById('kalori-list');
  if(!wrap) return;
  const icByS = {lari:'var(--lari)', sepeda:'var(--sepeda)', renang:'var(--renang)', null:'var(--ink-faint)'};
  const tintByS = {lari:'var(--lari-tint)', sepeda:'var(--sepeda-tint)', renang:'var(--renang-tint)', null:'var(--surface-2)'};
  wrap.innerHTML = kalori.map(k => `
    <div class="journal-item">
      <div class="j-ic" style="background:${tintByS[k.sport]}; color:${icByS[k.sport]};">
        <svg class="i" viewBox="0 0 24 24" style="width:20px;height:20px;"><path d="M12 21c4.4 0 7-2.8 7-6.4 0-4-3-6.6-4.6-9.6-.4 2-1.4 3-2.6 3-1.6 0-2-1.6-1.6-3.4C7.6 6.6 5 9.6 5 14.6 5 18.2 7.6 21 12 21z"/></svg>
      </div>
      <div class="j-body"><h4>${k.label}</h4><p>${k.sport ? sportLabel[k.sport] : 'Umum'}</p></div>
      <span class="j-num">${k.kkal} kkal</span>
    </div>
  `).join('');
}

/* ---------- JURNAL PROGRESS (mulai kosong + konfirmasi hapus + undo) ---------- */
let pendingDeleteId = null;
let lastDeleted = null;
let undoTimer = null;

function renderJournal(){
  const wrap = document.getElementById('journal-list');
  if(!wrap) return;
  if(journal.length === 0){
    wrap.innerHTML = `
      <div class="empty-state">
        <div class="e-ic"><svg class="i" viewBox="0 0 24 24" style="width:26px;height:26px;"><path d="M4 20V10M12 20V4M20 20v-7"/></svg></div>
        <h4>Belum ada catatan progress</h4>
        <p>Isi form di atas untuk mencatat latihan pertamamu.</p>
      </div>`;
    return;
  }
  wrap.innerHTML = journal.map(j => `
    <div class="journal-item">
      <div class="j-ic" style="background:${sportTint[j.sport]}; color:${sportColor[j.sport]};">
        <svg class="i" viewBox="0 0 24 24" style="width:20px;height:20px;"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>
      </div>
      <div class="j-body">
        <h4>${sportLabel[j.sport]} · ${j.jarak} km</h4>
        <p>${j.durasi} menit &middot; ${j.tgl}</p>
      </div>
      <div class="j-actions">
        <button class="icon-btn" aria-label="Ubah catatan" title="Ubah">
          <svg class="i" viewBox="0 0 24 24" style="width:18px;height:18px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </button>
        <button class="icon-btn" aria-label="Hapus catatan" title="Hapus" style="color:var(--warn);" onclick="askDelete(${j.id})">
          <svg class="i" viewBox="0 0 24 24" style="width:18px;height:18px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function addJournalEntry(){
  const sportEl = document.getElementById('j-jenis');
  const jarakEl = document.getElementById('j-jarak');
  const durasiEl = document.getElementById('j-durasi');
  if(!sportEl) return;
  const sport = sportEl.value;
  const jarak = parseFloat(jarakEl.value) || 0;
  const durasi = parseInt(durasiEl.value) || 0;
  if(jarak<=0 || durasi<=0){ jarakEl.focus(); return; }
  journal.unshift({id: journalIdCounter++, sport, jarak, durasi, tgl:'Baru saja'});
  jarakEl.value = '';
  durasiEl.value = '';
  renderJournal();
  // TODO(API): POST ke /api/progress
}

function askDelete(id){
  pendingDeleteId = id;
  const overlay = document.getElementById('modal-overlay');
  if(overlay) overlay.classList.add('open');
}
function closeModal(){
  const overlay = document.getElementById('modal-overlay');
  if(overlay) overlay.classList.remove('open');
  pendingDeleteId = null;
}
function confirmDelete(){
  const idx = journal.findIndex(j => j.id === pendingDeleteId);
  if(idx > -1){
    lastDeleted = {item: journal[idx], index: idx};
    journal.splice(idx,1);
    renderJournal();
    showUndoBar();
    // TODO(API): DELETE ke /api/progress/:id
  }
  closeModal();
}
function showUndoBar(){
  const bar = document.getElementById('undo-bar');
  if(!bar) return;
  document.getElementById('undo-text').textContent = 'Catatan latihan dihapus.';
  bar.classList.add('show');
  clearTimeout(undoTimer);
  undoTimer = setTimeout(() => { bar.classList.remove('show'); lastDeleted = null; }, 6000);
}
function undoDelete(){
  if(lastDeleted){
    journal.splice(lastDeleted.index, 0, lastDeleted.item);
    renderJournal();
  }
  const bar = document.getElementById('undo-bar');
  if(bar) bar.classList.remove('show');
  clearTimeout(undoTimer);
  lastDeleted = null;
}

/* ---------- REFRESH ---------- */
function refreshData(btn, page){
  btn.classList.add('spinning');
  // TODO(API): GET data terbaru dari worker sesuai `page`
  setTimeout(() => {
    if(page === 'dashboard'){
      const el = document.getElementById('stat-kalori');
      if(el){ const kal = 1700 + Math.floor(Math.random()*400); el.textContent = kal.toLocaleString('id-ID'); }
    }
    if(page === 'kalori'){
      const pct = 60 + Math.floor(Math.random()*35);
      renderKaloriRing(pct);
    }
    btn.classList.remove('spinning');
  }, 650);
}

/* ---------- INIT PER HALAMAN ---------- */
document.addEventListener('DOMContentLoaded', function(){
  renderWeek();
  renderDashVideos();
  renderLatihan('semua');
  renderKaloriRing(74);
  renderKaloriList();
  renderJournal();

  const latihanTabs = document.getElementById('latihan-tabs');
  if(latihanTabs){
    latihanTabs.addEventListener('click', function(e){
      const btn = e.target.closest('button[data-filter]');
      if(!btn) return;
      this.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLatihan(btn.dataset.filter);
    });
  }

  const rangeTabs = document.getElementById('range-tabs');
  if(rangeTabs){
    rangeTabs.addEventListener('click', function(e){
      const btn = e.target.closest('button[data-range]');
      if(!btn) return;
      this.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // TODO(API): refetch statistik sesuai rentang waktu terpilih
    });
  }
});
