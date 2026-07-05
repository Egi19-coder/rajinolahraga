
const DEMO_EMAIL = 'budi@rajinolahraga.id';
const DEMO_PASS  = '123456';


const sportColor = {lari:'var(--lari)', sepeda:'var(--sepeda)', renang:'var(--renang)'};
const sportTint  = {lari:'var(--lari-tint)', sepeda:'var(--sepeda-tint)', renang:'var(--renang-tint)'};
const sportLabel = {lari:'Lari', sepeda:'Bersepeda', renang:'Berenang'};

// Estimasi kalori terbakar per menit (kkal/menit) — dipakai supaya tiap
// catatan jurnal otomatis punya kalori yang konsisten.
const sportCalRate = {lari:11, sepeda:8, renang:9};

// Target mingguan per olahraga (dipakai untuk menghitung skor rapor)
const sportTarget = {
  lari:   {sesi:5, jarak:20},
  sepeda: {sesi:5, jarak:40},
  renang: {sesi:5, jarak:5},
};

// Link video YouTube resmi per jenis olahraga — klik kartu video akan
// membuka link ini di tab baru.
const sportVideoLink = {
  lari:   'https://youtube.com/shorts/lMyBYSISah0?si=M29KJAaUdtahUgC_',
  sepeda: 'https://youtube.com/shorts/fi6oLo5OxAM?si=-aik4OrXBVYvXCko',
  renang: 'https://youtube.com/shorts/ZfzXCvIRKfM?si=lp3bvhqDT_sCRE6G',
};

const videos = [
  {id:1, sport:'lari', title:'Lari Interval Pemula 20 Menit', dur:'20:15', img:'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80'},
  {id:2, sport:'sepeda', title:'Sepeda Statis: Endurance Ringan', dur:'35:40', img:'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80'},
  {id:3, sport:'renang', title:'Teknik Dasar Gaya Bebas', dur:'18:00', img:'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80'},
  {id:4, sport:'lari', title:'Lari Jarak Jauh 5K Santai', dur:'28:30', img:'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=600&q=80'},
  {id:5, sport:'sepeda', title:'Sepeda Tanjakan: Kekuatan Kaki', dur:'40:00', img:'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80'},
  {id:6, sport:'renang', title:'Renang Interval untuk Stamina', dur:'22:10', img:'https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&q=80'},
];

// Tips & trik singkat per olahraga — muncul di dashboard bagian "Tips & Trik"
const tips = [
  {sport:'lari',   title:'Pemanasan 5 menit dulu', text:'Jalan cepat atau jogging pelan sebelum lari penuh, biar otot & sendi siap dan cedera lebih kecil risikonya.'},
  {sport:'sepeda', title:'Atur tinggi sadel', text:'Sadel terlalu rendah bikin lutut cepat capek. Posisi ideal: kaki hampir lurus saat pedal di titik terbawah.'},
  {sport:'renang', title:'Fokus napas dulu, bukan speed', text:'Bangun ritme napas yang nyaman dulu sebelum kejar kecepatan, biar stamina di air lebih awet.'},
  {sport:'lari',   title:'Jangan naikkan jarak >10%/minggu', text:'Tambah jarak lari sedikit demi sedikit tiap minggu supaya tubuh sempat beradaptasi.'},
  {sport:'sepeda', title:'Cek tekanan angin ban', text:'Ban kurang angin bikin kayuhan lebih berat dan boros energi — cek rutin sebelum sesi latihan.'},
  {sport:'renang', title:'Peregangan bahu setelah renang', text:'Bahu paling sering pegal setelah renang, luangkan 5 menit stretching ringan sesudahnya.'},
];

// =========================================================================
// JURNAL PROGRESS — persisten di localStorage supaya tidak hilang
// =========================================================================
const JOURNAL_KEY = 'ro_journal_v1';

function loadJournal(){
  try{
    const raw = localStorage.getItem(JOURNAL_KEY);
    if(!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }catch(e){
    console.warn('Gagal membaca jurnal dari localStorage', e);
    return [];
  }
}

function saveJournal(){
  try{
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  }catch(e){
    console.warn('Gagal menyimpan jurnal ke localStorage', e);
  }
  // TODO(API): sinkronkan juga ke server, misal POST/PUT ke /api/progress
}

let journal = loadJournal();
let journalIdCounter = journal.reduce((max,j)=>Math.max(max, j.id||0), 0) + 1;

function calcKkal(sport, durasi){
  const rate = sportCalRate[sport] || 8;
  return Math.round(rate * durasi);
}

function todayISO(){
  return new Date().toISOString().slice(0,10);
}

function formatTglLabel(iso){
  if(iso === todayISO()) return 'Hari ini';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('id-ID', {day:'numeric', month:'short'});
}

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

// Isi nama/email pengguna di topbar, drawer, halaman profil, & sapaan dashboard
function fillUserInfo(){
  const nama = localStorage.getItem('ro_nama') || 'Budi Santoso';
  const email = localStorage.getItem('ro_email') || 'budi@rajinolahraga.id';
  const initials = nama.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const firstName = nama.split(' ')[0];

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

  const greet = document.getElementById('dash-greeting');
  if(greet) greet.textContent = `Halo, ${firstName} 👋`;
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
// STATISTIK (dipakai dashboard & rapor) — dihitung langsung dari jurnal
// =========================================================================

// Ambil tanggal ISO utk n hari terakhir dihitung dari hari ini (termasuk hari ini)
function isoRangeLastNDays(n, offsetDays){
  offsetDays = offsetDays || 0;
  const end = new Date();
  end.setDate(end.getDate() - offsetDays);
  const start = new Date(end);
  start.setDate(start.getDate() - (n-1));
  return {start: start.toISOString().slice(0,10), end: end.toISOString().slice(0,10)};
}

function entryInRange(entry, range){
  return entry.tgl >= range.start && entry.tgl <= range.end;
}

// Hitung total kalori, jarak, & sesi dari jurnal untuk periode & sport tertentu.
// sport = null artinya semua olahraga digabung.
function computeStats(sport, periodDays, offsetDays){
  periodDays = periodDays || 7;
  offsetDays = offsetDays || 0;
  const range = isoRangeLastNDays(periodDays, offsetDays);
  const rows = journal.filter(j => (!sport || j.sport === sport) && entryInRange(j, range));
  return {
    kalori: rows.reduce((s,j)=> s + (j.kkal||0), 0),
    jarak: rows.reduce((s,j)=> s + (j.jarak||0), 0),
    sesi: rows.length,
    rows,
  };
}

function fmtDelta(curr, prev, unit){
  if(prev === 0 && curr === 0) return `Belum ada data ${unit ? 'minggu ini' : ''}`.trim();
  if(prev === 0) return `▲ data baru minggu ini`;
  const diff = curr - prev;
  const pct = Math.round((diff/prev)*100);
  const arrow = diff >= 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(pct)}% dari minggu lalu`;
}

// =========================================================================
// DASHBOARD
// =========================================================================
function renderDashboardStats(){
  const curr = computeStats(null, 7, 0);
  const prev = computeStats(null, 7, 7);

  const elK = document.getElementById('stat-kalori');
  const elJ = document.getElementById('stat-jarak');
  const elS = document.getElementById('stat-sesi');
  if(elK) elK.textContent = curr.kalori.toLocaleString('id-ID');
  if(elJ) elJ.textContent = curr.jarak.toFixed(1).replace('.', ',') + ' km';
  if(elS) elS.textContent = curr.sesi + ' sesi';

  const dK = document.getElementById('stat-kalori-delta');
  const dJ = document.getElementById('stat-jarak-delta');
  if(dK) dK.textContent = fmtDelta(curr.kalori, prev.kalori);
  if(dJ) dJ.textContent = fmtDelta(curr.jarak, prev.jarak);
}

function renderWeek(){
  const wrap = document.getElementById('week-lanes');
  if(!wrap) return;
  const dayNames = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
  const today = new Date();
  // Cari hari Senin minggu ini
  const dow = (today.getDay() + 6) % 7; // 0=Senin
  const monday = new Date(today);
  monday.setDate(today.getDate() - dow);

  let html = '';
  for(let i=0;i<7;i++){
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0,10);
    const entriesForDay = journal.filter(j => j.tgl === iso);
    const done = entriesForDay.length > 0;
    const sport = done ? entriesForDay[0].sport : null;
    html += `
      <div class="lane ${done ? 'filled' : ''}">
        ${done ? `<div class="fill" style="height:70%; background:${sportColor[sport]};"></div>` : ''}
        ${done ? `<svg class="i check" viewBox="0 0 24 24" style="width:16px;height:16px;color:#fff;"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
        <span class="day-label">${dayNames[i]}</span>
      </div>`;
  }
  wrap.innerHTML = html;
}

function videoCardHTML(v){
  const link = sportVideoLink[v.sport];
  return `
    <div class="card video-card hoverable" role="button" tabindex="0" aria-label="Tonton video: ${v.title}" onclick="window.open('${link}','_blank')" onkeydown="if(event.key==='Enter'){window.open('${link}','_blank')}" style="cursor:pointer;">
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

function tipCardHTML(t){
  return `
    <div class="card tip-card hoverable">
      <div class="tip-ic" style="background:${sportTint[t.sport]}; color:${sportColor[t.sport]};">
        <svg class="i" viewBox="0 0 24 24" style="width:20px;height:20px;"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
      </div>
      <div class="tip-body">
        <span class="tag ${t.sport}" style="margin-bottom:8px;">${sportLabel[t.sport]}</span>
        <h4>${t.title}</h4>
        <p>${t.text}</p>
      </div>
    </div>`;
}

function renderDashTips(){
  const el = document.getElementById('dash-tips');
  if(!el) return;
  // Ambil tips secara acak-ringan (rotasi harian) supaya tidak monoton
  const seed = new Date().getDate();
  const rotated = tips.slice(seed % tips.length).concat(tips.slice(0, seed % tips.length));
  el.innerHTML = rotated.slice(0,3).map(tipCardHTML).join('');
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
// KALORI HARIAN — disinkronkan dengan jurnal progress hari ini
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
  if(!ticks) return;
  let tickSvg = '';
  for(let i=0;i<24;i++){
    const angle = (i/24) * 360;
    const isMajor = i % 6 === 0;
    tickSvg += `<line x1="75" y1="${isMajor?9:11}" x2="75" y2="15" stroke="var(--ink-faint)" stroke-width="${isMajor?2:1}" transform="rotate(${angle} 75 75)"/>`;
  }
  ticks.innerHTML = tickSvg;
}

function renderKaloriPage(){
  const wrap = document.getElementById('kalori-list');
  if(!wrap) return;

  const todayStats = computeStats(null, 1, 0);
  const target = 2500;
  const terbakar = todayStats.kalori;
  const pct = Math.min(100, Math.round((terbakar/target)*100));

  renderKaloriRing(pct);
  const elTerbakar = document.getElementById('kal-terbakar');
  if(elTerbakar) elTerbakar.textContent = terbakar.toLocaleString('id-ID') + ' kkal';
  const elSisa = document.getElementById('kal-sisa');
  if(elSisa) elSisa.textContent = Math.max(0, target-terbakar).toLocaleString('id-ID') + ' kkal';

  if(todayStats.rows.length === 0){
    wrap.innerHTML = `<div class="card" style="text-align:center; color:var(--ink-soft);">Belum ada aktivitas tercatat hari ini. Tambahkan lewat halaman Jurnal Progress.</div>`;
    return;
  }
  wrap.innerHTML = todayStats.rows.map(j => `
    <div class="journal-item">
      <div class="j-ic" style="background:${sportTint[j.sport]}; color:${sportColor[j.sport]};">
        <svg class="i" viewBox="0 0 24 24" style="width:20px;height:20px;"><path d="M12 21c4.4 0 7-2.8 7-6.4 0-4-3-6.6-4.6-9.6-.4 2-1.4 3-2.6 3-1.6 0-2-1.6-1.6-3.4C7.6 6.6 5 9.6 5 14.6 5 18.2 7.6 21 12 21z"/></svg>
      </div>
      <div class="j-body"><h4>${sportLabel[j.sport]} · ${j.jarak} km</h4><p>${j.durasi} menit</p></div>
      <span class="j-num">${j.kkal} kkal</span>
    </div>
  `).join('');
}

// =========================================================================
// JURNAL PROGRESS (simpan, edit, hapus + undo) — per olahraga
// =========================================================================
let pendingDeleteId = null;
let lastDeleted = null;
let undoTimer = null;
let journalFilter = 'semua';
let editingJournalId = null;

function renderJournal(){
  const wrap = document.getElementById('journal-list');
  if(!wrap) return;
  const list = journalFilter === 'semua' ? journal : journal.filter(j => j.sport === journalFilter);

  if(list.length === 0){
    wrap.innerHTML = `<div class="card" style="text-align:center; color:var(--ink-soft);">Belum ada catatan${journalFilter!=='semua' ? ' untuk '+sportLabel[journalFilter] : ''}. Tambahkan latihan pertamamu di atas.</div>`;
    return;
  }
  wrap.innerHTML = list.map(j => `
    <div class="journal-item ${editingJournalId===j.id ? 'editing' : ''}">
      <div class="j-ic" style="background:${sportTint[j.sport]}; color:${sportColor[j.sport]};">
        <svg class="i" viewBox="0 0 24 24" style="width:20px;height:20px;"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>
      </div>
      <div class="j-body">
        <h4>${sportLabel[j.sport]} · ${j.jarak} km</h4>
        <p>${j.durasi} menit &middot; ${formatTglLabel(j.tgl)} &middot; ${j.kkal} kkal</p>
      </div>
      <div class="j-actions">
        <button class="icon-btn" aria-label="Ubah catatan" title="Ubah" onclick="startEditJournal(${j.id})">
          <svg class="i" viewBox="0 0 24 24" style="width:18px;height:18px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
        </button>
        <button class="icon-btn" aria-label="Hapus catatan" title="Hapus" style="color:var(--warn);" onclick="askDelete(${j.id})">
          <svg class="i" viewBox="0 0 24 24" style="width:18px;height:18px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function setJournalFilter(filter){
  journalFilter = filter;
  renderJournal();
}

function resetJournalForm(){
  editingJournalId = null;
  document.getElementById('j-jenis').value = 'lari';
  document.getElementById('j-jarak').value = '';
  document.getElementById('j-durasi').value = '';
  const btn = document.getElementById('journal-submit-btn');
  if(btn) btn.textContent = '+ Catat';
  const cancelBtn = document.getElementById('journal-cancel-btn');
  if(cancelBtn) cancelBtn.style.display = 'none';
}

function startEditJournal(id){
  const item = journal.find(j => j.id === id);
  if(!item) return;
  editingJournalId = id;
  document.getElementById('j-jenis').value = item.sport;
  document.getElementById('j-jarak').value = item.jarak;
  document.getElementById('j-durasi').value = item.durasi;
  const btn = document.getElementById('journal-submit-btn');
  if(btn) btn.textContent = 'Simpan Perubahan';
  const cancelBtn = document.getElementById('journal-cancel-btn');
  if(cancelBtn) cancelBtn.style.display = 'inline-flex';
  renderJournal();
  document.getElementById('j-jarak').scrollIntoView({behavior:'smooth', block:'center'});
}

function cancelEditJournal(){
  resetJournalForm();
  renderJournal();
}

function addJournalEntry(){
  const sport = document.getElementById('j-jenis').value;
  const jarak = parseFloat(document.getElementById('j-jarak').value) || 0;
  const durasi = parseInt(document.getElementById('j-durasi').value) || 0;
  if(jarak<=0 || durasi<=0){ document.getElementById('j-jarak').focus(); return; }
  const kkal = calcKkal(sport, durasi);

  if(editingJournalId){
    const item = journal.find(j => j.id === editingJournalId);
    if(item){
      item.sport = sport; item.jarak = jarak; item.durasi = durasi; item.kkal = kkal;
      // TODO(API): PUT ke /api/progress/:id
    }
  }else{
    journal.unshift({id: journalIdCounter++, sport, jarak, durasi, kkal, tgl: todayISO()});
    // TODO(API): POST ke /api/progress
  }
  saveJournal();
  resetJournalForm();
  renderJournal();
  renderAllSyncedViews();
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
    if(editingJournalId === pendingDeleteId) resetJournalForm();
    saveJournal();
    renderJournal();
    renderAllSyncedViews();
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
    saveJournal();
    renderJournal();
    renderAllSyncedViews();
  }
  document.getElementById('undo-bar').classList.remove('show');
  clearTimeout(undoTimer);
  lastDeleted = null;
}

// Panggil ulang semua tampilan yang datanya bergantung pada jurnal, supaya
// dashboard, kalori, dan rapor selalu singkron begitu jurnal berubah.
function renderAllSyncedViews(){
  renderDashboardStats();
  renderWeek();
  renderKaloriPage();
  renderRaporPage();
}

// =========================================================================
// RAPOR KEBUGARAN — dihitung dari jurnal progress 7 hari terakhir, per olahraga
// =========================================================================
let raporFilter = 'semua';

function scoreToGrade(score){
  if(score >= 90) return 'A';
  if(score >= 80) return 'A-';
  if(score >= 70) return 'B+';
  if(score >= 60) return 'B';
  if(score >= 50) return 'C+';
  if(score > 0)   return 'C';
  return '—';
}

function noteForScore(sport, score, sesi){
  if(sesi === 0) return `Belum ada catatan latihan ${sportLabel[sport]} minggu ini. Yuk mulai catat di Jurnal Progress!`;
  if(score >= 85) return `Konsistensi ${sportLabel[sport]} kamu sangat baik minggu ini. Pertahankan ya!`;
  if(score >= 60) return `Progres ${sportLabel[sport]} kamu cukup baik. Coba tambah 1-2 sesi lagi minggu ini.`;
  return `Latihan ${sportLabel[sport]} kamu masih di bawah target minggu ini, coba lebih rutin lagi.`;
}

function computeSportRapor(sport){
  const stats = computeStats(sport, 7, 0);
  const target = sportTarget[sport];
  const sesiScore = Math.min(100, Math.round((stats.sesi / target.sesi) * 100));
  const jarakScore = Math.min(100, Math.round((stats.jarak / target.jarak) * 100));
  const score = stats.sesi === 0 ? 0 : Math.round(sesiScore*0.6 + jarakScore*0.4);
  return {
    sport, score, sesi: stats.sesi, jarak: stats.jarak, kalori: stats.kalori,
    grade: scoreToGrade(score),
    note: noteForScore(sport, score, stats.sesi),
  };
}

function subjectCardHTML(r){
  return `
    <div class="subject-card">
      <div class="subject-top">
        <div class="left">
          <div class="s-ic" style="background:${sportTint[r.sport]}; color:${sportColor[r.sport]};">
            <svg class="i" viewBox="0 0 24 24" style="width:20px;height:20px;"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>
          </div>
          <div><h4>${sportLabel[r.sport]}</h4><small>${r.sesi} sesi minggu ini &middot; ${r.jarak.toFixed(1)} km</small></div>
        </div>
        <span class="subject-score" style="color:${sportColor[r.sport]};">${r.score}</span>
      </div>
      <div class="progress-track"><div class="fill" style="width:${r.score}%; background:${sportColor[r.sport]};"></div></div>
    </div>`;
}

function renderRaporPage(){
  const gradeEl = document.getElementById('rapor-grade-text');
  const noteEl = document.getElementById('rapor-note-text');
  const subjectsEl = document.getElementById('rapor-subjects');
  if(!gradeEl || !subjectsEl) return;

  const sports = ['lari','sepeda','renang'];
  const results = sports.map(computeSportRapor);

  if(raporFilter === 'semua'){
    const active = results.filter(r => r.sesi > 0);
    const avgScore = active.length ? Math.round(active.reduce((s,r)=>s+r.score,0)/active.length) : 0;
    gradeEl.textContent = scoreToGrade(avgScore);
    noteEl.textContent = active.length
      ? 'Rata-rata dihitung otomatis dari seluruh catatan jurnal progres 7 hari terakhir, tiap olahraga punya rapor sendiri di bawah.'
      : 'Belum ada catatan jurnal minggu ini. Tambahkan aktivitas di Jurnal Progress supaya rapor bisa dihitung.';
    subjectsEl.innerHTML = results.map(subjectCardHTML).join('');
  }else{
    const r = computeSportRapor(raporFilter);
    gradeEl.textContent = r.grade;
    noteEl.textContent = r.note;
    subjectsEl.innerHTML = subjectCardHTML(r);
  }
}

function setRaporFilter(filter){
  raporFilter = filter;
  renderRaporPage();
}

// =========================================================================
// REFRESH
// =========================================================================
function refreshData(btn, page){
  btn.classList.add('spinning');
  // TODO(API): GET data terbaru dari worker sesuai `page`
  setTimeout(() => {
    if(page === 'dashboard') renderDashboardStats();
    if(page === 'kalori') renderKaloriPage();
    btn.classList.remove('spinning');
  }, 500);
}

// =========================================================================
// INIT
// =========================================================================
document.addEventListener('DOMContentLoaded', function(){
  guardAuth();
  fillUserInfo();
  highlightActiveNav();

  // Dashboard
  renderDashboardStats();
  renderWeek();
  renderDashTips();

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
  renderKaloriPage();

  // Jurnal progress
  const journalTabs = document.getElementById('journal-tabs');
  if(journalTabs){
    journalTabs.addEventListener('click', function(e){
      const btn = e.target.closest('button[data-filter]');
      if(!btn) return;
      this.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setJournalFilter(btn.dataset.filter);
    });
  }
  renderJournal();

  // Rapor kebugaran
  const raporTabs = document.getElementById('rapor-tabs');
  if(raporTabs){
    raporTabs.addEventListener('click', function(e){
      const btn = e.target.closest('button[data-filter]');
      if(!btn) return;
      this.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setRaporFilter(btn.dataset.filter);
    });
  }
  renderRaporPage();


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
