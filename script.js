// 建議放在 script.js
document.addEventListener('DOMContentLoaded', function () {
  const userName = document.querySelector('.user-name');
  const dropdown = document.querySelector('.dropdown');

  // 切換下拉選單顯示
  userName.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // 點擊外部自動關閉
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // 鍵盤支援（Esc 關閉）
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('active');
    }
  });

  // === 進場動畫 ===
  function animateOnScroll(selector, visibleClass = 'visible') {
    const elements = document.querySelectorAll(selector);
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add(visibleClass));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          // 只針對 brand-item 移除 transform
          if (entry.target.classList.contains('brand-item')) {
            entry.target.style.transform = '';
          }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    elements.forEach(el => observer.observe(el));
  }

  // 1. top-bar 內元件
  animateOnScroll('.top-bar > *', 'visible');
  document.querySelectorAll('.top-bar > *').forEach(el => el.classList.add('slide-in-left'));

  // 2. hero-section 內元件由下往上淡入
  animateOnScroll('.hero-content', 'visible');
  document.querySelectorAll('.hero-content').forEach(el => el.classList.add('fade-in-up'));

  // 2. articles-content 內元件由下往上淡入
  animateOnScroll('.featured-article, .secondary-articles', 'visible');
  document.querySelectorAll('.featured-article, .secondary-articles').forEach(el => el.classList.add('fade-in-up'));

  // 3. brand-logos 由下往上淡入
  animateOnScroll('.brand-item', 'visible');
  const brandItems = document.querySelectorAll('.brand-item');
  brandItems.forEach((el, i) => {
    el.classList.add('fade-in-up');
    // 不再做 translateX 動畫
    el.style.transform = '';
    el.style.transitionDelay = '';
    el.dataset.offset = '';
  });

  // 4. philosophy-section 由下往上淡入
  animateOnScroll('.philosophy-section', 'visible');
  document.querySelectorAll('.philosophy-section').forEach(el => el.classList.add('fade-in-up'));

  // 5. values-container 由下往上淡入
  animateOnScroll('.values-container', 'visible');
  document.querySelectorAll('.values-container').forEach(el => el.classList.add('fade-in-up'));

  // 6. philosophy-container 由下往上淡入
  animateOnScroll('.philosophy-container', 'visible');
  document.querySelectorAll('.philosophy-container').forEach(el => el.classList.add('fade-in-up'));

  // 7. main-footer 內元件由左往右淡入
  animateOnScroll('.main-footer > *', 'visible');
  document.querySelectorAll('.main-footer > *').forEach(el => el.classList.add('slide-in-left'));

  // 將 section-title 及其他標題的每個字包進 span
  const blurHeadings = [
    '.section-title',
    '.philosophy-heading',
    '.values-heading',
    '.articles-heading',
    '.articles-subheading'
  ];
  blurHeadings.forEach(selector => {
    document.querySelectorAll(selector).forEach(title => {
      const chars = title.textContent.split('');
      title.innerHTML = chars.map((char, i) =>
        `<span class="char" style="transition-delay:${i * 0.04}s">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
    });
  });

  // 讓 notification-input focus 時 placeholder 立即清空，blur 時恢復
  function bindNotificationInputPlaceholder() {
    setTimeout(() => { // 確保 DOM 已插入
      const input = document.getElementById('notification-input');
      if (input) {
        const originalPlaceholder = input.getAttribute('data-original-placeholder') || input.getAttribute('placeholder');
        input.setAttribute('data-original-placeholder', originalPlaceholder);
        input.addEventListener('focus', function() {
          input.setAttribute('placeholder', '');
        });
        input.addEventListener('blur', function() {
          input.setAttribute('placeholder', originalPlaceholder);
        });
      }
    }, 0);
  }

  bindNotificationInputPlaceholder();

  const welcomeContainer = document.querySelector('.welcome-container');
  if (welcomeContainer) {
    const originalContent = welcomeContainer.innerHTML;
    welcomeContainer.addEventListener('click', function(e) {
      const iconLink = e.target.closest('.icon-container a');
      if (iconLink) {
        e.preventDefault();
        const oldContent = welcomeContainer.firstElementChild;
        if (oldContent) {
          oldContent.classList.add('fade-switch', 'fade-out');
          setTimeout(() => {
            welcomeContainer.innerHTML = `
              <div class="overlap-group fade-switch fade-in">
                <input 
                  type="text" 
                  id="notification-input" 
                  name="notification" 
                  class="input-field" 
                  placeholder="點數可兌換通知我" 
                />
                <div class="btn-create-bot">
                  <button type="button" class="btn-text">我的需求</button>
                </div>
              </div>
            `;
            // 綁定 button 點擊事件
            const btn = welcomeContainer.querySelector('.btn-create-bot .btn-text');
            if (btn) {
              btn.addEventListener('click', function() {
                const overlap = welcomeContainer.firstElementChild;
                if (overlap) {
                  overlap.classList.remove('fade-in');
                  overlap.classList.add('fade-out');
                  setTimeout(() => {
                    welcomeContainer.innerHTML = originalContent;
                    bindNotificationInputPlaceholder();
                  }, 400);
                } else {
                  welcomeContainer.innerHTML = originalContent;
                  bindNotificationInputPlaceholder();
                }
              });
            }
            bindNotificationInputPlaceholder();
          }, 400);
        } else {
          // fallback: 沒有舊內容直接切
          welcomeContainer.innerHTML = `
            <div class="overlap-group fade-switch fade-in">
              <input 
                type="text" 
                id="notification-input" 
                name="notification" 
                class="input-field" 
                placeholder="點數可兌換通知我" 
              />
              <div class="btn-create-bot">
                <button type="button" class="btn-text">我的需求</button>
              </div>
            </div>
          `;
          bindNotificationInputPlaceholder();
        }
      }
    });
  }
});

// Parallax scrolling effect for .parallax-bg
window.addEventListener('scroll', function() {
  const bg = document.querySelector('.parallax-bg');
  if (bg) {
    const scrolled = window.scrollY;
    bg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});