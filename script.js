/* ── DOM refs ── */
let cover, mainEl;

/* ── Initialize on DOM ready ── */
document.addEventListener('DOMContentLoaded', function() {
  cover  = document.getElementById('cover');
  mainEl = document.getElementById('main');

  /* Handle URL param for guest name */
  const params = new URLSearchParams(window.location.search);
  const tamu = params.get('to');
  if(tamu) {
    const namaTamuEl = document.getElementById('nama-tamu');
    if(namaTamuEl) namaTamuEl.textContent = decodeURIComponent(tamu);
  }

  /* Start countdown */
  startCountdown();

  /* Music toggle button listener */
  const musicToggle = document.getElementById('music-toggle');
  if(musicToggle) {
    musicToggle.addEventListener('click', function() {
      const bgMusic = document.getElementById('bg-music');
      if(bgMusic) {
        if(bgMusic.paused) {
          bgMusic.play();
          musicToggle.classList.remove('music-off');
        } else {
          bgMusic.pause();
          musicToggle.classList.add('music-off');
        }
      }
    });
  }
});

/* ── BUKA UNDANGAN ── */
function bukaUndangan(){
  if(!cover || !mainEl) {
    console.error('DOM elements not ready');
    return;
  }
  
  /* Hide cover with fade animation */
  cover.classList.add('hiding');
  setTimeout(() => { 
    cover.style.display = 'none'; 
  }, 600);

  /* Show main content */
  mainEl.classList.add('show');

  /* PLAY BACKGROUND MUSIC */
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  if(bgMusic) {
    bgMusic.volume = 0.7; /* 70% volume */
    bgMusic.play().catch(err => console.log('Audio play failed:', err));
    if(musicToggle) {
      musicToggle.style.display = 'flex'; /* Show music toggle button */
    }
  }

  /* Scroll to top */
  window.scrollTo(0, 0);

  /* Animate text elements dengan stagger */
  setTimeout(() => {
    animateTextElements();
  }, 100);

  /* Init ContainerScroll setelah main muncul */
  requestAnimationFrame(() => {
    initContainerScroll();
  });

  /* Init scroll animations */
  initScrollAnimations();
}

/* ── ANIMATE TEXT ELEMENTS ── */
function animateTextElements(){
  /* Get all text elements */
  const textElements = mainEl.querySelectorAll(
    'p, h1, h2, h3, span, blockquote, cite, a, button, .timer-box, .acara-card, .person-card, .gift-card, .wish-item'
  );
  
  let delay = 0;
  textElements.forEach((el) => {
    el.classList.add('text-animate');
    el.style.animationDelay = delay + 'ms';
    delay += 50; /* 50ms stagger antar element */
  });
}

/* ── COUNTDOWN ── */
function startCountdown(){
  const target = new Date('2025-12-25T08:00:00');
  
  function tick(){
    const diff = target - new Date();
    
    if(diff <= 0){ 
      ['t-hari','t-jam','t-menit','t-detik'].forEach(id=>{
        const el = document.getElementById(id);
        if(el) el.textContent='00';
      }); 
      return; 
    }
    
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    const tHari  = document.getElementById('t-hari');
    const tJam   = document.getElementById('t-jam');
    const tMenit = document.getElementById('t-menit');
    const tDetik = document.getElementById('t-detik');
    
    if(tHari)  tHari.textContent  = String(d).padStart(2, '0');
    if(tJam)   tJam.textContent   = String(h).padStart(2, '0');
    if(tMenit) tMenit.textContent = String(m).padStart(2, '0');
    if(tDetik) tDetik.textContent = String(s).padStart(2, '0');
  }
  
  tick(); 
  setInterval(tick, 1000);
}

/* ── COPY FUNCTION ── */
function salinRek(id, btn){
  const el = document.getElementById(id);
  if(!el) return;
  
  navigator.clipboard.writeText(el.textContent).then(()=>{
    btn.textContent = '✓ Tersalin!'; 
    btn.classList.add('copied');
    
    setTimeout(()=>{ 
      btn.textContent = 'Salin Nomor'; 
      btn.classList.remove('copied'); 
    }, 2000);
  }).catch(err => console.error('Copy failed:', err));
}

function salinAlamat(){
  const el = document.getElementById('alamat-gift');
  if(!el) return;
  
  navigator.clipboard.writeText(el.textContent).then(()=>{
    alert('Alamat tersalin!');
  }).catch(err => console.error('Copy failed:', err));
}

/* ── RSVP & WISHES ── */
function kirimUcapan(){
  const namaEl   = document.getElementById('wish-name');
  const pesanEl  = document.getElementById('wish-msg');
  const hadirEl  = document.querySelector('input[name="hadir"]:checked');
  
  if(!namaEl || !pesanEl) {
    alert('Mohon isi nama dan ucapan terlebih dahulu.');
    return;
  }
  
  const nama = namaEl.value.trim();
  const pesan = pesanEl.value.trim();
  
  if(!nama || !pesan) {
    alert('Mohon isi nama dan ucapan terlebih dahulu.');
    return;
  }
  
  const status = hadirEl ? hadirEl.value : 'Belum Konfirmasi';
  
  /* Create wish item */
  const item = document.createElement('div');
  item.className = 'wish-item';
  item.innerHTML = `<span class="wish-name">${nama}</span><span class="wish-status">✓ ${status}</span><p class="wish-text">${pesan}</p>`;
  
  const list = document.getElementById('wishes-list');
  if(!list) return;
  
  /* Add to top of list */
  list.insertBefore(item, list.firstChild);
  
  /* Clear form */
  namaEl.value = '';
  pesanEl.value = '';
  if(hadirEl) hadirEl.checked = false;
  
  /* Scroll to new item */
  item.scrollIntoView({behavior: 'smooth', block: 'center'});
}


/* ═══════════════════════════════════════════════════════════════
   CONTAINER SCROLL ANIMATION
   Mereplikasi efek Aceternity UI ContainerScroll dengan Vanilla JS

   Cara kerja:
   - Saat user scroll melewati .couple-scroll-container,
     progress scroll (0→1) dihitung relatif terhadap container.
   - rotateX card: dari 20deg → 0deg
   - scale card:   dari 1.05  → 1
   - translateY header: dari 0 → -100px
   ═══════════════════════════════════════════════════════════════ */

function initContainerScroll() {
  const container = document.getElementById('couple-scroll-container');
  const header    = document.getElementById('couple-scroll-header');
  const card      = document.getElementById('couple-scroll-card');

  if (!container || !header || !card) return;

  /* Cek mobile */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  /* Linear interpolation */
  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  /* Clamp 0–1 */
  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function onScroll() {
    const rect        = container.getBoundingClientRect();
    const containerH  = container.offsetHeight;
    const viewH       = window.innerHeight;

    /*
      progress = 0 saat container mulai masuk viewport dari bawah
      progress = 1 saat container sudah habis terscroll (bagian bawah di top viewport)
      
      Titik awal animasi: saat top container = viewport height (baru muncul)
      Titik akhir animasi: saat top container = -(containerH - viewH)
    */
    const scrolled   = -rect.top; // berapa px sudah di-scroll dari titik mulai
    const totalTravel = containerH - viewH;
    const progress   = clamp01(scrolled / totalTravel);

    /* ── Scale dimensions sesuai device ── */
    const scaleStart = isMobile() ? 0.7 : 1.05;
    const scaleEnd   = isMobile() ? 0.9 : 1.0;

    /* ── Animasi card: rotateX + scale ── */
    const rotateX = lerp(20, 0, progress);
    const scale   = lerp(scaleStart, scaleEnd, progress);

    card.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;

    /* ── Animasi header: translateY ke atas ── */
    const translateY = lerp(0, -100, progress);
    header.style.transform = `translateY(${translateY}px)`;
  }

  /* Pasang event listener */
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Jalankan sekali saat init */
  onScroll();
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS FOR SECTIONS
   Trigger animations when sections enter viewport on scroll
   ═══════════════════════════════════════════════════════════════ */

function initScrollAnimations() {
  const sections = document.querySelectorAll('#main section');
  if (!sections.length) return;

  function onScrollCheck() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
      
      /* Add scroll-animate class when section comes into view */
      if (isInView && !section.classList.contains('scroll-animate')) {
        section.classList.add('scroll-animate');
      }
    });
  }

  window.addEventListener('scroll', onScrollCheck, { passive: true });
  
  /* Check on init */
  onScrollCheck();
}
