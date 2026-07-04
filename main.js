/* =========================================================================
   RAJIN OLAHRAGA — main.js
   File JS bersama untuk semua halaman (login.html, dashboard.html, dst).
   Setiap fungsi render sudah dijaga dengan pengecekan elemen, jadi aman
   dipakai di halaman manapun tanpa error walau elemennya tidak ada.

   CATATAN INTEGRASI BACKEND (Cloudflare Workers + D1):
   Ganti fungsi-fungsi bertanda // TODO(API) dengan fetch() ke worker kamu,
   contoh:

   async function handleLogin(e){
     e.preventDefault();
     const res = await fetch('https://cms-api-worker.widyazef28.workers.dev/api/login', {
       method:'POST', headers:{'Content-Type':'application/json'},
       body: JSON.stringify({ email, password })
     });
     const data = await res.json();
     // simpan data.token di cookie httpOnly (diset dari server), lalu redirect
   }
   ========================================================================= */

// ---------- KREDENSIAL CONTOH (hapus setelah backend nyata terpasang) ----------
const DEMO_EMAIL = 'budi@rajinolahraga.id';
const DEMO_PASS  = '123456';

// ---------- DATA CONTOH (ganti dengan hasil fetch API) ----------
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

// Jurnal progress SENGAJA kosong di awal — pengguna harus input sendiri
// dulu lewat form "+ Catat" di halaman progress.html sebelum ada isinya.
let journal = [];
let journalIdCounter = 1;

let kalori = [
  {label:'Lari pagi 5K', kkal:420, sport:'lari'},
  {label:'Sepeda santai 14 km', kkal:560, sport:'sepeda'},
  {label:'Aktivitas harian', kkal:870, sport:null},
];

// =========================================================================
// AUTH (login.html)
// =========================================================================
function switchAuthTab(tab){
  document.getElementById('tab-login').classList.toggle('active', tab==='login');
  document.getElementById('tab-register').classList.toggle('active', tab==='register');
  document.getElementById('tab-login').setAttribute('aria-selected', tab==='login');
  document.getElementById('tab-register').setAttribute('aria-selected', tab==='register');
  document.getElementById('form-login').classList.toggle('hidden', tab!=='login');
  document.getElementById('form-register').classList.toggle('hidden', tab!=='register');
}

// Klik ikon mata: tampil/sembunyikan kata sandi
function togglePasswordVisibility(inputId, btn){
  const input = document.getElementById(inputId);
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  btn.classList.toggle('showing', !showing);
  btn.setAttribute('aria-label', showing ? 'Lihat kata sandi' : 'Sembunyikan kata sandi');
}

function clearLoginError(){
  const field = document.getElementById('login-pass-field');
  const err = document.getElementById('login-error');
  if(!field || !err) return;
  field.classList.remove('has-error');
  err.classList.remove('show');
}

function showLoginError(){
  const field = document.getElementById('login-pass-field');
  const err = document.getElementById('login-error');
  if(!field || !err) return;
  field.classList.add('has-error');
  err.classList.add('show');
}

function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;

  // TODO(API): ganti pengecekan ini dengan POST ke /api/login
  if(email !== DEMO_EMAIL || pass !== DEMO_PASS){
    showLoginError();
    return false;
  }
  clearLoginError();
  localStorage.setItem('ro_logged_in', '1');
  localStorage.setItem('ro_nama', 'Budi Santoso');
  localStorage.setItem('ro_email', email);
  window.location.href = 'dashboard.html';
  return false;
}

function handleRegister(e){
  e.preventDefault();
  const nama = document.getElementById('reg-nama').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  // TODO(API): POST ke /api/register, lalu auto-login
  localStorage.setItem('ro_logged_in', '1');
  localStorage.setItem('ro_nama', nama || 'Pengguna Baru');
  localStorage.setItem('ro_email', email);
  window.location.href = 'dashboard.html';
  return false;
}

function handleLogout(){
  localStorage.removeItem('ro_logged_in');
  window.location.href = 'login.html';
}

// Jaga akses: kalau halaman ini butuh login tapi belum login, lempar ke login.html
function guardAuth(){
  if(document.body.dataset.requiresAuth === 'true' && localStorage.getItem('ro_logged_in') !== '1'){
    window.location.href = 'login.html';
  }
}

// Isi nama/email pengguna di topbar, drawer, dan halaman profil
function fillUserInfo(){
  const nama = localStorage.getItem('ro_nama') || 'Budi Santoso';
  const email = localStorage.getItem('ro_email') || 'budi@rajinolahraga.id';
  const initials = nama.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

  document.querySelectorAll('#topbar-avatar, .drawer-user .avatar').forEach(el => el.textContent = initials);
  const un = document.getElementById('drawer-username');
  if(un) un.textContent = nama;

  const pn = document.getElementById('profil-nama');
  const pe = document.getElementById('profil-email');
  const pav = document.getElementById('profil-avatar');
  if(pn) pn.textContent = nama;
  if(pe) pe.textContent = email;
  if(pav) pav.textContent = initials;
  const inputNama = document.getElementById('profil-input-nama');
  const inputEmail = document.getElementById('profil-input-email');
  if(inputNama) inputNama.value = nama;
  if(inputEmail) inputEmail.value = email;
}

// =========================================================================
// NAVIGASI ANTAR HALAMAN
// =========================================================================
function goPage(page){
  window.location.href = page + '.html';
}

function highlightActiveNav(){
  const current = document.body.dataset.page;
  if(!current) return;
  document.querySelectorAll('.nav-item[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page===current));
  document.querySelectorAll('.bottom-nav button[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page===current));
}

// ---------- DRAWER ----------
function toggleDrawer(open){
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if(!drawer || !overlay) return;
  drawer.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
}

// ---------- TOP APPS MENU ----------
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

// =========================================================================
// DASHBOARD
// =========================================================================
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
        <div class="video-meta">
          <span class="tag ${v.sport}">${sportLabel[v.sport]}</span>
        </div>
      </div>
    </div>`;
}
function renderDashVideos(){
  const el = document.getElementById('dash-next-videos');
  if(!el) return;
  el.innerHTML = videos.slice(0,3).map(videoCardHTML).join('');
}

// =========================================================================
// LATIHAN MINGGUAN
// =========================================================================
function renderLatihan(filter){
  filter = filter || 'semua';
  const grid = document.getElementById('latihan-grid');
  if(!grid) return;
  const list = filter==='semua' ? videos : videos.filter(v => v.sport===filter);
  grid.innerHTML = list.map(videoCardHTML).join('');
}

// =========================================================================
// KALORI
// =========================================================================
function renderKaloriRing(percent){
  const ring = document.getElementById('kalori-ring');
  if(!ring) return;
  const circ = 2 * Math.PI * 62;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ * (1 - percent/100);
  ring.style.transition = 'stroke-dashoffset .7s ease';
  document.getElementById('kalori-ring-num').textContent = percent + '%';

  const ticks = document.getElementById('stopwatch-ticks');
  let tickSvg = '';
  for(let i=0;i<24;i++){
    const angle = (i/24) * 360;
    const isMajor = i % 6 === 0;
    tickSvg += `<line x1="75" y1="${isMajor?9:11}" x2="75" y2="15" stroke="var(--ink-faint)" stroke-width="${isMajor?2:1}" transform="rotate(${angle} 75 75)"/>`;
  }
  ticks.innerHTML = tickSvg;
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

// =========================================================================
// JURNAL PROGRESS (dengan delete confirm + undo)
// =========================================================================
let pendingDeleteId = null;
let lastDeleted = null;
let undoTimer = null;

function renderJournal(){
  const wrap = document.getElementById('journal-list');
  if(!wrap) return;
  if(journal.length === 0){
    wrap.innerHTML = `<div class="card" style="text-align:center; color:var(--ink-soft);">Belum ada catatan. Tambahkan latihan pertamamu di atas.</div>`;
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
  const sport = document.getElementById('j-jenis').value;
  const jarak = parseFloat(document.getElementById('j-jarak').value) || 0;
  const durasi = parseInt(document.getElementById('j-durasi').value) || 0;
  if(jarak<=0 || durasi<=0){ document.getElementById('j-jarak').focus(); return; }
  journal.unshift({id: journalIdCounter++, sport, jarak, durasi, tgl:'Baru saja'});
  document.getElementById('j-jarak').value = '';
  document.getElementById('j-durasi').value = '';
  renderJournal();
  // TODO(API): POST ke /api/progress
}

function askDelete(id){
  pendingDeleteId = id;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(){
  document.getElementById('modal-overlay').classList.remove('open');
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
  document.getElementById('undo-bar').classList.remove('show');
  clearTimeout(undoTimer);
  lastDeleted = null;
}

// =========================================================================
// REFRESH
// =========================================================================
function refreshData(btn, page){
  btn.classList.add('spinning');
  // TODO(API): GET data terbaru dari worker sesuai `page`
  setTimeout(() => {
    if(page === 'dashboard'){
      const kal = 1700 + Math.floor(Math.random()*400);
      const el = document.getElementById('stat-kalori');
      if(el) el.textContent = kal.toLocaleString('id-ID');
    }
    if(page === 'kalori'){
      const pct = 60 + Math.floor(Math.random()*35);
      renderKaloriRing(pct);
    }
    btn.classList.remove('spinning');
  }, 650);
}

// =========================================================================
// INIT
// =========================================================================
document.addEventListener('DOMContentLoaded', function(){
  guardAuth();
  fillUserInfo();
  highlightActiveNav();

  // Dashboard
  renderWeek();
  renderDashVideos();

  // Latihan
  renderLatihan('semua');
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

  // Kalori
  renderKaloriRing(74);
  renderKaloriList();

  // Jurnal progress
  renderJournal();

  // Tabbar rentang waktu (dashboard)
  const dashTabbar = document.querySelector('#page-dashboard .tabbar');
  if(dashTabbar){
    dashTabbar.addEventListener('click', function(e){
      const btn = e.target.closest('button[data-range]');
      if(!btn) return;
      this.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // TODO(API): refetch stats sesuai rentang waktu terpilih
    });
  }
});
