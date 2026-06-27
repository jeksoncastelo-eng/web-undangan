document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. EXTRACT GUEST NAME FROM URL
  // ==========================================
  const getGuestName = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to');
    const guestNameEl = document.getElementById('guest-name');
    
    if (guest && guestNameEl) {
      guestNameEl.textContent = decodeURIComponent(guest);
    } else if (guestNameEl) {
      guestNameEl.textContent = 'Bapak/Ibu/Saudara/i';
    }
  };
  
  getGuestName();
  // ==========================================
  // 2. OPEN INVITATION FLOW & AUDIO PLAYBACK
  // ==========================================
  const coverGate = document.getElementById('cover-gate');
  const btnOpen = document.getElementById('btn-open');
  const appContainer = document.getElementById('app-container');
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  
  let isPlaying = false;
  const playAudio = () => {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
      musicIcon.className = 'fas fa-compact-disc';
    }).catch(err => {
      console.log('Audio autoplay blocked by browser, waiting for user interaction:', err);
    });
  };
  const pauseAudio = () => {
    bgMusic.pause();
    isPlaying = false;
    musicToggle.classList.remove('playing');
    musicIcon.className = 'fas fa-pause';
  };
  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      // Show content container
      appContainer.classList.add('visible');
      
      // Slide up cover gate
      coverGate.style.transform = 'translateY(-100vh)';
      coverGate.style.opacity = '0';
      
      // Enable body scroll
      document.body.style.overflowY = 'auto';
      
      // Play wedding background music
      playAudio();
      // Trigger scroll animation check immediately
      setTimeout(checkScrollAnimations, 100);
      
      // Remove cover from layout after transition completes to prevent tab-indexing hidden inputs
      setTimeout(() => {
        coverGate.style.display = 'none';
      }, 1200);
    });
  }
  // Toggle background music play state manually
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }
  // Disable body scroll when cover gate is active
  if (coverGate && coverGate.style.display !== 'none') {
    document.body.style.overflowY = 'hidden';
  }
  // ==========================================
  // 3. COUNTDOWN TIMER TO JUNE 22, 2026
  // ==========================================
  const targetDate = new Date('June 22, 2026 09:00:00').getTime();
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      clearInterval(countdownInterval);
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  };
  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Run once initially
  // ==========================================
  // 4. RSVP & WISHES LOCALSTORAGE GUESTBOOK
  // ==========================================
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');
  const defaultWishes = [
    
  ];
  const getWishes = () => {
    const stored = localStorage.getItem('wedding_wishes');
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem('wedding_wishes', JSON.stringify(defaultWishes));
    return defaultWishes;
  };
  const saveWish = (name, status, message) => {
    const wishes = getWishes();
    const now = new Date();
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const timeString = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    wishes.unshift({ name, status, message, time: timeString });
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
    renderWishes();
  };
  const renderWishes = () => {
    if (!wishesList) return;
    const wishes = getWishes();
    wishesList.innerHTML = '';
    
    wishes.forEach(wish => {
      const item = document.createElement('div');
      item.className = 'wish-item';
      
      let statusText = 'Hadir';
      if (wish.status === 'tidak') statusText = 'Tidak Hadir';
      if (wish.status === 'ragu') statusText = 'Ragu-ragu';
      
      item.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHTML(wish.name)}</span>
          <span class="wish-status ${wish.status}">${statusText}</span>
        </div>
        <p class="wish-content">${escapeHTML(wish.message)}</p>
        <span class="wish-time"><i class="far fa-clock"></i> ${wish.time}</span>
      `;
      wishesList.appendChild(item);
    });
  };
  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  };
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvp-name');
      const statusSelect = document.getElementById('rsvp-status');
      const messageInput = document.getElementById('rsvp-message');
      
      if (nameInput.value.trim() && messageInput.value.trim()) {
        saveWish(nameInput.value.trim(), statusSelect.value, messageInput.value.trim());
        nameInput.value = '';
        messageInput.value = '';
        
        // Show thank you notification
        alert('Terima kasih atas doa restu dan konfirmasi kehadiran Anda!');
      }
    });
  }
  renderWishes();
  // ==========================================
  // 5. GIFT MODAL & COPY TO CLIPBOARD
  // ==========================================
  const giftBtn = document.getElementById('gift-btn');
  const giftModal = document.getElementById('gift-modal');
  const modalClose = document.getElementById('modal-close');
  
  if (giftBtn && giftModal) {
    giftBtn.addEventListener('click', () => {
      giftModal.classList.add('visible');
    });
  }
  
  if (modalClose && giftModal) {
    modalClose.addEventListener('click', () => {
      giftModal.classList.remove('visible');
    });
  }
  
  // Close modal when clicking outside contents
  if (giftModal) {
    giftModal.addEventListener('click', (e) => {
      if (e.target === giftModal) {
        giftModal.classList.remove('visible');
      }
    });
  }
  // Copy account number utility
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-num');
      navigator.clipboard.writeText(num).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Tersalin!';
        btn.style.backgroundColor = 'var(--accent-gold-dark)';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = 'transparent';
          btn.style.color = 'var(--accent-gold-dark)';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
    });
  });
  // ==========================================
  // 6. SCROLL INTERSECTION ANIMATIONS
  // ==========================================
  const animatedElements = document.querySelectorAll('.fade-scroll');
  
  const checkScrollAnimations = () => {
    const triggerBottom = window.innerHeight * 0.9;
    
    animatedElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('in-view');
      }
    });
  };
  window.addEventListener('scroll', checkScrollAnimations);
  // ==========================================
  // 7. FLOATING NAV ACTIVE STATE MANAGEMENT
  // ==========================================
  const sections = document.querySelectorAll('section, footer');
  const navItems = document.querySelectorAll('.nav-item');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
});
