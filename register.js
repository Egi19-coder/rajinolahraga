<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Daftar — Rajin Olahraga</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="auth-screen">
  <div class="auth-visual">
    <div class="track-strip"><span></span><span></span><span></span></div>
    <div class="brandmark">
      <div class="badge-mark"><svg class="i" viewBox="0 0 24 24"><path d="M4 12h4l2-7 4 14 2-7h4"/></svg></div>
      <strong style="font-family:'Space Grotesk',sans-serif;">Rajin Olahraga</strong>
    </div>
    <div class="tagline">
      <h1>Mulai kebiasaan sehatmu hari ini.</h1>
      <p>Daftar gratis dan langsung dapat akses ke pelacak kalori, video latihan, dan rapor kebugaran.</p>
    </div>
  </div>

  <div class="auth-form-wrap">
    <div class="auth-card">
      <a href="index.html" class="back-link">
        <svg class="i" viewBox="0 0 24 24" style="width:16px;height:16px;"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Kembali ke beranda
      </a>
      <h2>Buat Akun Baru</h2>
      <p class="sub">Gratis, tidak perlu kartu kredit.</p>

      <form id="form-register" onsubmit="return handleRegister(event)">
        <div class="field">
          <label for="reg-nama">Nama lengkap</label>
          <input id="reg-nama" type="text" placeholder="Nama kamu" required>
        </div>
        <div class="field">
          <label for="reg-email">Email</label>
          <input id="reg-email" type="email" placeholder="kamu@email.com" required>
        </div>
        <div class="field">
          <label for="reg-sport">Fokus olahraga utama</label>
          <select id="reg-sport">
            <option value="lari">Lari</option>
            <option value="sepeda">Bersepeda</option>
            <option value="renang">Berenang</option>
          </select>
        </div>
        <div class="field">
          <label for="reg-pass">Buat kata sandi</label>
          <div class="password-wrap">
            <input id="reg-pass" type="password" placeholder="Minimal 6 karakter" required minlength="6">
            <button type="button" class="password-toggle" aria-label="Tampilkan sandi" onclick="togglePasswordVisibility('reg-pass', this)">
              <svg class="i" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div class="field-hint">Password akan disimpan ter-enkripsi di server.</div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Buat Akun</button>
        <p class="auth-foot">Sudah punya akun? <a href="login.html">Masuk di sini</a></p>
      </form>
    </div>
  </div>
</div>

<script src="js/main.js"></script>
</body>
</html>
