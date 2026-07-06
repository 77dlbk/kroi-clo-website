/* PREMIUM GARMENTS - ANIMATION ENGINE */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const burgerLines = document.querySelectorAll('.burger-line');

  function toggleMenu() {
    mobileMenu.classList.toggle('active');
    
    // Burger animation
    if (mobileMenu.classList.contains('active')) {
      burgerLines[0].style.transform = 'translateY(6px) rotate(45deg)';
      burgerLines[1].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      burgerLines[0].style.transform = 'none';
      burgerLines[1].style.transform = 'none';
    }
  }

  burgerBtn.addEventListener('click', toggleMenu);
  window.toggleMenu = toggleMenu; // Global link for inline onclick

  // Close mobile menu when links are clicked
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      burgerLines[0].style.transform = 'none';
      burgerLines[1].style.transform = 'none';
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
    if (window.scrollY > 50) {
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      header.style.padding = '1rem 2rem';
    } else {
      header.style.backgroundColor = 'transparent';
      header.style.padding = '1.5rem 2rem';
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
          <div style="font-family: 'Playfair Display', serif; font-size: 1.2rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Заявка принята</div>
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
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalFabrics = document.getElementById('modal-fabrics');
    const modalDesc = document.getElementById('modal-desc');

    const catalogMetaData = [
      { // Card 1 (Index 0)
        title: "Укороченное пальто-жакет",
        category: "Верхняя одежда / Пальто",
        fabrics: "Натуральная шерсть, кашемир",
        desc: "Элегантное укороченное пальто асимметричного кроя с воротником-стойкой и крупной декоративной пуговицей. Идеально держит форму, подчеркивает силуэт и обеспечивает комфорт в прохладную погоду.",
        images: [
          "assets/details/catalog-1-1.jpg",
          "assets/details/catalog-1-2.jpg",
          "assets/details/catalog-1-3.jpg"
        ]
      },
      { // Card 2 (Index 1)
        title: "Твидовый костюм в клетку",
        category: "Костюмная группа / Жакеты",
        fabrics: "Премиальная шерсть, вискоза, шелк",
        desc: "Стильный классический женский костюм-двойка из плотной клетчатой ткани. Приталенный жакет с изысканной золотистой фурнитурой и прямые классические брюки со стрелками. Идеальный крой и безупречная обработка швов.",
        images: [
          "assets/details/catalog-2-1.jpg",
          "assets/details/catalog-2-2.jpg"
        ]
      },
      { // Card 3 (Index 2)
        title: "Жакет и Сатиновая юбка",
        category: "Костюмная группа / Жакеты",
        fabrics: "Премиальная шерсть, натуральный шелк",
        desc: "Элегантный укороченный жакет в клетку из тонкой шерсти, застегивающийся на три фактурные золотистые пуговицы. В комплекте со струящейся сатиновой юбкой создает изысканный женственный образ.",
        images: [
          "assets/details/catalog-3-1.jpg",
          "assets/details/catalog-3-2.jpg",
          "assets/details/catalog-3-3.jpg"
        ]
      },
      { // Card 4 (Index 3)
        title: "Пальто алого цвета",
        category: "Верхняя одежда / Пальто",
        fabrics: "Пальтовое сукно, вискозный шелк",
        desc: "Яркое пальто насыщенного алого оттенка приталенного кроя. Износостойкий материал премиум-качества, строгая линия плеч и безукоризненная посадка по фигуре.",
        images: [
          "assets/details/catalog-4-1.jpg",
          "assets/details/catalog-4-2.jpg",
          "assets/details/catalog-4-3.jpg"
        ]
      },
      { // Card 5 (Index 4)
        title: "Костюм из серого шеврона",
        category: "Костюмная группа",
        fabrics: "Шерстяной шеврон, шелковая подкладка",
        desc: "Премиальный женский костюм из твида с шевроновым плетением. Идеальный крой, обеспечивающий строгий деловой силуэт, в сочетании с мягкостью натуральной ткани.",
        images: [
          "assets/details/catalog-5-1.jpg",
          "assets/details/catalog-5-2.jpg"
        ]
      },
      { // Card 6 (Index 5)
        title: "Костюм с отделкой мехом",
        category: "Костюмная группа / Люкс",
        fabrics: "Шерсть, натуральный мех",
        desc: "Эксклюзивный костюм приталенного силуэта с меховой отделкой. Идеальный крой, ручная обработка деталей и благородные ткани.",
        images: [
          "assets/details/catalog-6-1.jpg",
          "assets/details/catalog-6-2.jpg",
          "assets/details/catalog-6-3.jpg"
        ]
      },
      { // Card 7 (Index 6)
        title: "Анималистичный жакет",
        category: "Костюмная группа",
        fabrics: "Жаккард, вискоза",
        desc: "Жакет с выразительным леопардовым принтом. Прорезные карманы, идеальная посадка по фигуре и премиальная фурнитура.",
        images: [
          "assets/details/catalog-7-1.jpg",
          "assets/details/catalog-7-2.jpg"
        ]
      },
      { // Card 8 (Index 7)
        title: "Двубортное mini-пальто",
        category: "Верхняя одежда / Пальто",
        fabrics: "Твид, шерсть",
        desc: "Укороченное двубортное пальто из фактурного твида. Классический английский воротник, декоративные пуговицы и удобный крой.",
        images: [
          "assets/details/catalog-8-1.jpg",
          "assets/details/catalog-8-2.jpg",
          "assets/details/catalog-8-3.jpg"
        ]
      },
      { // Card 9 (Index 8)
        title: "Твидовый жилет и брюки",
        category: "Костюмная группа / Твид",
        fabrics: "Премиум твид",
        desc: "Элегантный комплект из приталенного жилета на пуговицах и классических брюк. Благородная текстура ткани и утонченный стиль.",
        images: ["assets/catalog-10.jpg"]
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
});
