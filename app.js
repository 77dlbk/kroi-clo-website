/* PREMIUM GARMENTS - ANIMATION ENGINE */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const burgerLines = document.querySelectorAll('.burger-line');

  function toggleMenu() {
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Burger animation
    if (mobileMenu.classList.contains('active')) {
      burgerLines[0].style.transform = 'translateY(7px) rotate(45deg)';
      burgerLines[1].style.opacity = '0';
      burgerLines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      burgerLines[0].style.transform = 'none';
      burgerLines[1].style.opacity = '1';
      burgerLines[2].style.transform = 'none';
    }
  }

  burgerBtn.addEventListener('click', toggleMenu);
  window.toggleMenu = toggleMenu; // Global link for inline onclick

  // Close mobile menu when links are clicked
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
      burgerLines[0].style.transform = 'none';
      burgerLines[1].style.opacity = '1';
      burgerLines[2].style.transform = 'none';
    });
  });

  // 2. Preloader handler
  function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      document.body.classList.add('site-loaded');
      
      // Trigger initial animations
      document.querySelectorAll('.hero .scale-up').forEach(el => {
        el.classList.add('active');
      });

      // Remove from view completely after transition (0.8s)
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    }
  }

  // Trigger removal after page loads (allowing logo animation to complete)
  window.addEventListener('load', () => {
    setTimeout(removePreloader, 1000);
  });

  // Backup preloader removal in case load takes too long (3s fallback)
  setTimeout(removePreloader, 3000);

  // 3. Scroll Reveal (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .scale-up');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
  });

  revealElements.forEach(el => {
    // Skip hero elements as they trigger manually on preloader hide
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });

  // 4. Parallax Scroll Effect for Hero Collage
  const collageItems = document.querySelectorAll('.collage-item');
  let lastScrollY = window.pageYOffset;
  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset;
    
    // Parallax intensities for each image to create depth
    // Photo 1 (Red coat): normal
    // Photo 2 (umbrella): shifts up
    // Photo 3 (tweed suit): shifts down
    // Photo 4 (vest/hat): shifts up slowly
    const speeds = [0.07, -0.09, 0.12, -0.05];

    collageItems.forEach((item, idx) => {
      const speed = speeds[idx] || 0;
      const yValue = scrollY * speed;
      const img = item.querySelector('.collage-img');
      
      if (img) {
        // Keep the minor scale transition if hovered, apply parallax translate
        img.style.transform = `translate3d(0, ${yValue}px, 0) scale(${item.matches(':hover') ? 1.05 : 1})`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.pageYOffset;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
      });
      ticking = true;
    }
  });

  // Re-apply hover scaling with parallax compensation
  collageItems.forEach((item, idx) => {
    const speeds = [0.07, -0.09, 0.12, -0.05];
    const speed = speeds[idx] || 0;

    item.addEventListener('mouseenter', () => {
      const img = item.querySelector('.collage-img');
      if (img) {
        const yValue = window.pageYOffset * speed;
        img.style.transform = `translate3d(0, ${yValue}px, 0) scale(1.05)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      const img = item.querySelector('.collage-img');
      if (img) {
        const yValue = window.pageYOffset * speed;
        img.style.transform = `translate3d(0, ${yValue}px, 0) scale(1)`;
      }
    });
  });

  // 5. Header Visual Scroll Styling
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
      header.style.webkitBackdropFilter = 'blur(10px)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
      header.style.padding = '0.6rem 2rem';
    } else {
      header.style.backgroundColor = '#ffffff';
      header.style.backdropFilter = 'none';
      header.style.webkitBackdropFilter = 'none';
      header.style.boxShadow = 'none';
      header.style.padding = '0.75rem 2rem';
    }
  });

  // 6. Interactive Product Rows Click-Reveal
  const productRows = document.querySelectorAll('.product-row');
  productRows.forEach(row => {
    row.addEventListener('click', () => {
      // Smooth scroll to the contact form to begin ordering
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pre-fill type input
        const typeName = row.querySelector('.product-name').textContent.trim();
        const typeInput = document.getElementById('client-type');
        if (typeInput) {
          typeInput.value = typeName;
          typeInput.focus();
          typeInput.placeholder = "";
        }
      }
    });
  });

  // 7. High-Fashion Form Submission Feedback
  const form = document.getElementById('order-form');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Visual submitting state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Отправка... <span class="btn-arrow">→</span>';
      
      // Simulate API delay
      setTimeout(() => {
        // Show classy custom notification overlay
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '2rem';
        notification.style.right = '2rem';
        notification.style.backgroundColor = '#ffffff';
        notification.style.color = '#000000';
        notification.style.border = '1px solid #000000';
        notification.style.padding = '1.5rem 2.5rem';
        notification.style.zIndex = '99999';
        notification.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        notification.innerHTML = `
          <div style="font-family: var(--font-serif); font-size: 1.2rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Заявка принята</div>
          <div style="font-size: 0.85rem; font-weight: 300; opacity: 0.8;">Мы свяжемся с вами в течение 30 минут.</div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger show animation
        setTimeout(() => {
          notification.style.opacity = '1';
          notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Reset form
        form.reset();
        
        // Reset labels alignment
        document.querySelectorAll('.form-input').forEach(input => {
          input.placeholder = " ";
        });
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Отправить <span class="btn-arrow">→</span>';
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transform = 'translateY(20px)';
          setTimeout(() => {
            notification.remove();
          }, 600);
        }, 5000);
        
      }, 1000);
    });
  }

  // 8. Catalog Roulette Slider (Drag, Scroll, Active Card Tracking)
  const viewport = document.getElementById('catalog-viewport');
  const track = document.getElementById('catalog-track');
  const prevBtn = document.getElementById('catalog-prev-btn');
  const nextBtn = document.getElementById('catalog-next-btn');
  const cards = document.querySelectorAll('.catalog-card');
  const dotsContainer = document.getElementById('catalog-dots');

  if (viewport && track) {
    let currentIdx = 0;

    // Generate dots dynamically
    if (dotsContainer) {
      cards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('catalog-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          scrollToCard(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    function scrollToCard(index) {
      const targetCard = cards[index];
      if (targetCard) {
        viewport.scrollTo({
          left: targetCard.offsetLeft - (viewport.clientWidth - targetCard.clientWidth) / 2,
          behavior: 'smooth'
        });
      }
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIdx > 0) {
          currentIdx--;
          scrollToCard(currentIdx);
        }
      });

      nextBtn.addEventListener('click', () => {
        if (currentIdx < cards.length - 1) {
          currentIdx++;
          scrollToCard(currentIdx);
        }
      });
    }

    // Drag-to-scroll functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    viewport.addEventListener('mousedown', (e) => {
      isDown = true;
      viewport.style.cursor = 'grabbing';
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
    });

    viewport.addEventListener('mouseleave', () => {
      isDown = false;
      viewport.style.cursor = 'grab';
    });

    viewport.addEventListener('mouseup', () => {
      isDown = false;
      viewport.style.cursor = 'grab';
    });

    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - viewport.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed multiplier
      viewport.scrollLeft = scrollLeft - walk;
    });

    // Track active card in center (Roulette feel)
    function checkCenterCard() {
      const viewportRect = viewport.getBoundingClientRect();
      const viewportCenter = viewportRect.left + (viewportRect.width / 2);
      
      let closestCard = null;
      let minDistance = Infinity;
      let closestIdx = 0;

      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + (cardRect.width / 2);
        const distance = Math.abs(viewportCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
          closestIdx = idx;
        }
      });

      currentIdx = closestIdx;

      cards.forEach(card => {
        if (card === closestCard) {
          card.classList.add('active-card');
        } else {
          card.classList.remove('active-card');
        }
      });

      // Update active dot indicator
      const dots = document.querySelectorAll('.catalog-dot');
      dots.forEach((dot, idx) => {
        if (idx === closestIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Debounce center check on scroll
    let scrollTimeout;
    viewport.addEventListener('scroll', () => {
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = window.requestAnimationFrame(checkCenterCard);
    });

    // Run initially to set first card active
    checkCenterCard();

    // Order buttons click handlers inside catalog cards
    const orderButtons = document.querySelectorAll('.catalog-card-order-btn');
    orderButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering card click
        const productName = btn.getAttribute('data-product');
        const contactSection = document.getElementById('contact');
        
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          
          const typeInput = document.getElementById('client-type');
          if (typeInput) {
            typeInput.value = productName;
            typeInput.focus();
            typeInput.placeholder = "";
          }
        }
      });
    });

    // 5. Catalog Detail Modal Logic
    const catalogModal = document.getElementById('catalog-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalMainImg = document.getElementById('modal-main-img');
    const modalMainView = document.querySelector('.modal-main-view');
    if (modalMainView && modalMainImg) {
      modalMainView.addEventListener('mousemove', (e) => {
        const rect = modalMainView.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        modalMainImg.style.transformOrigin = `${x}% ${y}%`;
        modalMainImg.style.transform = 'scale(2.2)';
      });

      modalMainView.addEventListener('mouseleave', () => {
        modalMainImg.style.transformOrigin = 'center center';
        modalMainImg.style.transform = 'scale(1)';
      });
    }
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalFabrics = document.getElementById('modal-fabrics');
    const modalDesc = document.getElementById('modal-desc');
      const catalogMetaData = [
      { // Card 1
        title: "Укороченный жакет в клетку",
        category: "Костюмная группа / Жакеты",
        fabrics: "Премиальная шерсть, шелк",
        desc: "Эксклюзивный укороченный женский жакет в мелкую черно-белую клетку. Модель оригинального кроя с короткими свободными рукавами, приталенным силуэтом и акцентной крупной золотой пуговицей по центру. Отлично сочетается с юбками из фатина и вечерними образами.",
        images: [
          "assets/details/catalog-cropped-jacket-1.jpg",
          "assets/details/catalog-cropped-jacket-2.jpg",
          "assets/details/catalog-cropped-jacket-3.jpg",
          "assets/details/catalog-cropped-jacket-4.jpg",
          "assets/details/catalog-cropped-jacket-5.jpg"
        ]
      },
      { // Card 2
        title: "Приталенное полупальто без воротника",
        category: "Костюмная группа / Пальто",
        fabrics: "Премиальная шерсть, кашемир",
        desc: "Стильное женское полупальто приталенного силуэта без воротника. Выполнено из высококачественной шерсти и кашемира в ярко-красном цвете, дополнено фактурными золотистыми пуговицами и элегантным кроем. Идеальная посадка по фигуре.",
        images: [
          "assets/details/catalog-red-coat-1.jpg",
          "assets/details/catalog-red-coat-2.jpg",
          "assets/details/catalog-red-coat-3.jpg",
          "assets/details/catalog-red-coat-4.jpg"
        ]
      },
      { // Card 3
        title: "Костюм с приталенным жакетом в клетку",
        category: "Костюмная группа / Жакеты",
        fabrics: "Премиальная шерсть, вискоза",
        desc: "Элегантный женский костюм из плотной ткани в клетку. В комплекте приталенный двубортный жакет на оригинальной пуговице и широкие классические брюки палаццо. Безупречный крой подчеркивает талию и визуально удлиняет силуэт.",
        images: [
          "assets/details/catalog-plaid-suit-1.jpg",
          "assets/details/catalog-plaid-suit-2.jpg",
          "assets/details/catalog-plaid-suit-3.jpg",
          "assets/details/catalog-plaid-suit-4.jpg",
          "assets/details/catalog-plaid-suit-5.jpg"
        ]
      },
      { // Card 4
        title: "Костюм с мини-юбкой в ёлочку",
        category: "Костюмная группа / Жакеты",
        fabrics: "Премиальная шерсть, шеврон",
        desc: "Стильный и утонченный костюм-двойка в классическую серую ёлочку (шеврон). Включает в себя оригинальный жакет с рукавами 3/4, отложным белым воротничком и акцентными золотыми пуговицами, а также элегантную мини-юбку. Идеально садится по фигуре.",
        images: [
          "assets/details/catalog-herringbone-suit-1.jpg",
          "assets/details/catalog-herringbone-suit-2.jpg",
          "assets/details/catalog-herringbone-suit-3.jpg",
          "assets/details/catalog-herringbone-suit-4.jpg",
          "assets/details/catalog-herringbone-suit-5.jpg"
        ]
      },
      { // Card 5
        title: "Полупальто с накладными карманами",
        category: "Костюмная группа / Пальто",
        fabrics: "Премиальная шерсть, шеврон",
        desc: "Современное женское полупальто свободного силуэта в мелкую серую елочку. Модель оснащена стильным отложным воротником, крупными накладными карманами, контрастными темными пуговицами и аккуратными прямыми рукавами. Отлично дополняется аксессуарами в виде черных кожаных перчаток и элегантных головных уборов.",
        images: [
          "assets/details/catalog-pocket-coat-1.jpg",
          "assets/details/catalog-pocket-coat-2.jpg",
          "assets/details/catalog-pocket-coat-3.jpg",
          "assets/details/catalog-pocket-coat-4.jpg",
          "assets/details/catalog-pocket-coat-5.jpg"
        ]
      },
      { // Card 6
        title: "Костюм с жакетом на защипах",
        category: "Костюмная группа / Жакеты",
        fabrics: "Премиальная шерсть, вискоза",
        desc: "Изысканный женский костюм-двойка глубокого бежево-коричневого оттенка. Однобортный приталенный жакет с воротником-стойкой дополнен элегантным откосом, изящными защипами на талии спереди и сзади, а также золотистыми пуговицами. Прямые брюки-клеш с идеальной посадкой подчеркивают длину ног.",
        images: [
          "assets/details/catalog-pintuck-suit-1.jpg",
          "assets/details/catalog-pintuck-suit-2.jpg",
          "assets/details/catalog-pintuck-suit-3.jpg",
          "assets/details/catalog-pintuck-suit-4.jpg",
          "assets/details/catalog-pintuck-suit-5.jpg"
        ]
      },
      { // Card 7
        title: "Костюм с жилетом на защипах",
        category: "Костюмная группа / Жилеты",
        fabrics: "Премиальная шерсть, вискоза",
        desc: "Элегантный женский костюм-тройка с приталенным жилетом. Жилет выполнен на оригинальных пуговицах с защипами на талии спереди и сзади, подчеркивая женственный силуэт. Комплект дополнен прямыми классическими брюками в тон, создавая утонченный и строгий образ.",
        images: [
          "assets/details/catalog-pintuck-vest-suit-1.jpg",
          "assets/details/catalog-pintuck-vest-suit-2.jpg",
          "assets/details/catalog-pintuck-vest-suit-3.jpg",
          "assets/details/catalog-pintuck-vest-suit-4.jpg",
          "assets/details/catalog-pintuck-vest-suit-5.jpg"
        ]
      },
      { // Card 8
        title: "Двубортное полупальто с английским воротником",
        category: "Костюмная группа / Пальто",
        fabrics: "Премиальная шерсть, кашемир",
        desc: "Классическое двубортное женское полупальто в благородном коричневом оттенке. Модель выполнена со стильным английским воротником, широкими прямыми рукавами с патами на пуговицах и прорезными карманами. Отлично сочетается с шелковыми нашейными платками и деловыми костюмами.",
        images: [
          "assets/details/catalog-double-coat-1.jpg",
          "assets/details/catalog-double-coat-2.jpg",
          "assets/details/catalog-double-coat-3.jpg",
          "assets/details/catalog-double-coat-4.jpg",
          "assets/details/catalog-double-coat-5.jpg"
        ]
      },
      { // Card 9
        title: "Жакет с леопардовым принтом",
        category: "Костюмная группа / Жакеты",
        fabrics: "Премиальный хлопковый жаккард",
        desc: "Элегантный женский жакет приталенного кроя с выразительным анималистичным леопардовым принтом. Модель без воротника с круглым вырезом, дополненная оригинальными крупными золотыми пуговицами по центру. Превосходно смотрится как с классическими черными брюками, так и с вечерними образами.",
        images: [
          "assets/details/catalog-leopard-jacket-new-1.jpg",
          "assets/details/catalog-leopard-jacket-new-2.jpg",
          "assets/details/catalog-leopard-jacket-new-3.jpg",
          "assets/details/catalog-leopard-jacket-new-4.jpg",
          "assets/details/catalog-leopard-jacket-new-5.jpg"
        ]
      },
      { // Card 10
        title: "Полупальто с архитектурной застежкой",
        category: "Костюмная группа / Пальто",
        fabrics: "Премиальная шерсть",
        desc: "Современное и лаконичное женское полупальто свободного силуэта в меланжевом сером оттенке. Модель отличается оригинальной архитектурной застежкой на одну крупную пуговицу у воротника-стойки, рукавами реглан и лаконичным кроем. Идеально дополняет как деловые образы с широкими брюками, так и повседневные городские комплекты.",
        images: [
          "assets/details/catalog-asymmetric-coat-1.jpg",
          "assets/details/catalog-asymmetric-coat-2.jpg",
          "assets/details/catalog-asymmetric-coat-3.jpg",
          "assets/details/catalog-asymmetric-coat-4.jpg",
          "assets/details/catalog-asymmetric-coat-5.jpg"
        ]
      }
    ];

    function openCardModal(idx) {
      if (!catalogModal) return;
      
      const data = catalogMetaData[idx];
      if (!data) return;

      // Populate text
      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalFabrics.textContent = data.fabrics;
      modalDesc.textContent = data.desc;

      // Set main view image
      modalMainImg.src = data.images[0];
      modalMainImg.alt = data.title;

      // Generate thumbnails dynamically
      modalThumbnails.innerHTML = '';
      if (data.images.length > 1) {
        data.images.forEach((imgUrl, tIdx) => {
          const thumb = document.createElement('div');
          thumb.classList.add('modal-thumb');
          if (tIdx === 0) thumb.classList.add('active');
          
          const thumbImg = document.createElement('img');
          thumbImg.src = imgUrl;
          thumbImg.alt = `${data.title} - превью ${tIdx + 1}`;
          thumb.appendChild(thumbImg);

          thumb.addEventListener('click', () => {
            modalMainImg.src = imgUrl;
            document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
          });

          modalThumbnails.appendChild(thumb);
        });
        modalThumbnails.style.display = 'flex';
      } else {
        modalThumbnails.style.display = 'none';
      }

      // Show modal
      catalogModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCardModal() {
      if (!catalogModal) return;
      catalogModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Bind card clicks
    cards.forEach((card, idx) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        openCardModal(idx);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeCardModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeCardModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCardModal();
      }
    });

    // Modal CTA (Order sewing) button
    const modalCtaBtn = document.getElementById('modal-cta-btn');
    if (modalCtaBtn) {
      modalCtaBtn.addEventListener('click', () => {
        closeCardModal();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          setTimeout(() => {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            const typeInput = document.getElementById('client-type');
            if (typeInput) {
              typeInput.value = modalTitle.textContent;
              typeInput.focus();
              typeInput.placeholder = "";
            }
          }, 450);
        }
      });
    }
  }

  // 9. Catalog Magnifier Lens Tool
  const cardImgWraps = document.querySelectorAll('.catalog-card-img-wrap');
  
  cardImgWraps.forEach(wrap => {
    const card = wrap.closest('.catalog-card');
    const img = wrap.querySelector('.catalog-card-img');
    const zoomBtn = wrap.querySelector('.card-zoom-btn');
    
    if (!img || !zoomBtn) return;
    
    // Create lens element
    const lens = document.createElement('div');
    lens.classList.add('magnifier-lens');
    wrap.appendChild(lens);
    
    let isLensActive = false;
    
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent opening card detail modal
      isLensActive = !isLensActive;
      zoomBtn.classList.toggle('active', isLensActive);
      card.classList.toggle('lens-mode-active', isLensActive);
      
      if (isLensActive) {
        // Set lens background to card image source
        lens.style.backgroundImage = `url('${img.src}')`;
        // We set background size to zoom in (e.g. 2.5x the width and height of the image wrapper)
        lens.style.backgroundSize = `${wrap.offsetWidth * 2.5}px ${wrap.offsetHeight * 2.5}px`;
      } else {
        lens.style.display = 'none';
      }
    });
    
    // Deactivate lens mode when mouse leaves the card
    card.addEventListener('mouseleave', () => {
      if (isLensActive) {
        isLensActive = false;
        zoomBtn.classList.remove('active');
        card.classList.remove('lens-mode-active');
        lens.style.display = 'none';
      }
    });
    
    function moveLens(e) {
      if (!isLensActive) return;
      
      const rect = wrap.getBoundingClientRect();
      
      // Get cursor position relative to the image wrapper
      let x, y;
      if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      
      // Prevent lens from going outside the boundaries
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        lens.style.display = 'none';
        return;
      }
      
      lens.style.display = 'block';
      
      // Position the lens (centered on cursor)
      const lensWidth = lens.offsetWidth;
      const lensHeight = lens.offsetHeight;
      
      const posX = x - (lensWidth / 2);
      const posY = y - (lensHeight / 2);
      
      lens.style.left = `${posX}px`;
      lens.style.top = `${posY}px`;
      
      // Calculate background position of zoomed image inside the lens
      const bgX = (x * 2.5) - (lensWidth / 2);
      const bgY = (y * 2.5) - (lensHeight / 2);
      
      lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    }
    
    wrap.addEventListener('mousemove', moveLens);
    wrap.addEventListener('touchmove', moveLens, { passive: true });
    wrap.addEventListener('touchstart', (e) => {
      if (isLensActive) {
        moveLens(e);
      }
    }, { passive: true });
  });
});
