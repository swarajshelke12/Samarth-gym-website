/* ==========================================
   SAMARTH GYM - PREMIUM INTERACTION SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Sticky Navigation & Scroll Styles ---
  const header = document.querySelector('.header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // --- 2. Staggered Sidebar Menu (Mobile Nav) ---
  const menuToggle = document.querySelector('.menu-toggle');
  const menuPanel = document.querySelector('.menu-panel');
  const menuOverlay = document.querySelector('.menu-overlay');
  const prelayer1 = document.querySelector('.menu-prelayer-1');
  const prelayer2 = document.querySelector('.menu-prelayer-2');
  const menuLabelText = document.querySelector('.menu-label-text');
  const closeLabelText = document.querySelector('.close-label-text');
  const navItems = document.querySelectorAll('.menu-nav li');
  const socials = document.querySelector('.menu-socials');
  
  let menuIsOpen = false;
  let menuTimeline = null;

  const openMenu = () => {
    if (menuTimeline) menuTimeline.kill();
    menuIsOpen = true;
    
    menuToggle.classList.add('is-open');
    menuOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    menuTimeline = gsap.timeline();

    // Swap label: MENU slides up, CLOSE follows
    menuTimeline.to(menuLabelText, { yPercent: -100, duration: 0.4, ease: 'power3.inOut' }, 0);
    menuTimeline.to(closeLabelText, { yPercent: -100, duration: 0.4, ease: 'power3.inOut' }, 0);

    // Pre-layers flash in (staggered 80ms apart)
    menuTimeline.to(prelayer1, { x: 0, duration: 0.6, ease: 'power4.out' }, 0);
    menuTimeline.to(prelayer2, { x: 0, duration: 0.6, ease: 'power4.out' }, 0.08);

    // Main panel slides in
    menuTimeline.to(menuPanel, { x: 0, duration: 0.8, ease: 'power4.out' }, 0.15);

    // Pre-layers retreat behind panel
    menuTimeline.to([prelayer1, prelayer2], { x: '-100%', duration: 0.5, ease: 'power3.in' }, 0.5);

    // Nav items stagger up from below their clip container
    menuTimeline.fromTo(navItems,
      { yPercent: 140, rotate: 10, opacity: 0 },
      { yPercent: 0, rotate: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power4.out' },
      0.3
    );

    // Socials fade in
    menuTimeline.fromTo(socials,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      0.6
    );
  };

  const closeMenu = () => {
    if (menuTimeline) menuTimeline.kill();
    menuIsOpen = false;

    menuToggle.classList.remove('is-open');
    menuOverlay.classList.remove('is-active');
    document.body.style.overflow = '';

    menuTimeline = gsap.timeline();

    // Swap label back
    menuTimeline.to(menuLabelText, { yPercent: 0, duration: 0.4, ease: 'power3.inOut' }, 0);
    menuTimeline.to(closeLabelText, { yPercent: 0, duration: 0.4, ease: 'power3.inOut' }, 0);

    // Socials + items exit
    menuTimeline.to(socials, { opacity: 0, y: 20, duration: 0.3, ease: 'power3.in' }, 0);
    menuTimeline.to(navItems, { yPercent: 140, rotate: -5, opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power3.in' }, 0);

    // Panel slides out
    menuTimeline.to(menuPanel, { x: '100%', duration: 0.6, ease: 'power3.inOut' }, 0.15);

    // Reset pre-layers off-screen
    menuTimeline.set([prelayer1, prelayer2], { x: '100%' });
  };

  const toggleMenu = () => {
    if (menuIsOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Close menu when a link is clicked
  const menuLinks = document.querySelectorAll('.menu-nav a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuIsOpen) {
        closeMenu();
      }
    });
  });

  // Auto-close menu if resized to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && menuIsOpen) {
      closeMenu();
    }
  });

  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // --- 3. Hero Background Video Scroll Scrubming ---
  const canvas = document.getElementById('hero-canvas');
  const fallbackImg = document.querySelector('.hero-bg-img');
  
  if (canvas && fallbackImg) {
    const ctx = canvas.getContext('2d');
    const totalFrames = 210;
    const frames = [];
    let loadedCount = 0;
    let initialized = false;
    
    // Preload loop for the 210 frames
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `video frames hero/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Initialize once first 30 frames are loaded to give immediate visual feedback
        if (loadedCount >= 30 && !initialized) {
          initialized = true;
          drawFrame(frames[0]);
          canvas.classList.add('playing');
          fallbackImg.classList.add('fade-out');
        }
      };
      frames.push(img);
    }
    
    // Scrubbing controller object
    const videoScrubber = { frame: 0 };
    
    gsap.to(videoScrubber, {
      frame: totalFrames - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        invalidateOnRefresh: true
      },
      onUpdate: () => {
        const currentFrame = Math.round(videoScrubber.frame);
        let frameImg = frames[currentFrame];
        if (frameImg && frameImg.complete && frameImg.naturalWidth !== 0) {
          drawFrame(frameImg);
        }
      }
    });

    // Fade out text elements as user scrolls down the hero
    gsap.to(".hero-content", {
      opacity: 0,
      y: -50,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom 30%",
        scrub: true
      }
    });
    
    function drawFrame(img) {
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      
      const imgW = img.width;
      const imgH = img.height;
      
      const scale = Math.max(w / imgW, h / imgH);
      const newW = imgW * scale;
      const newH = imgH * scale;
      
      const x = (w - newW) / 2;
      const y = (h - newH) / 2;
      
      ctx.drawImage(img, x, y, newW, newH);
    }
    
    window.addEventListener('resize', () => {
      const currentFrame = Math.round(videoScrubber.frame);
      let frameImg = frames[currentFrame];
      if (frameImg && frameImg.complete && frameImg.naturalWidth !== 0) {
        drawFrame(frameImg);
      }
    });
  }

  // --- 4. GSAP Reveal Scroll Animations ---

  // Page Load Hero Text stagger
  gsap.fromTo('.animate-text', 
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      stagger: 0.2, 
      ease: "power3.out",
      delay: 0.3
    }
  );

  // Fade In Section Headers
  gsap.utils.toArray('.reveal-fade').forEach(elem => {
    gsap.fromTo(elem,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Slide Up Cards & Elements
  gsap.utils.toArray('.reveal-up').forEach(elem => {
    const delay = parseFloat(elem.getAttribute('data-delay')) || 0;
    gsap.fromTo(elem,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: delay,
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Slide In from Left
  gsap.utils.toArray('.reveal-left').forEach(elem => {
    gsap.fromTo(elem,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Slide In from Right
  gsap.utils.toArray('.reveal-right').forEach(elem => {
    gsap.fromTo(elem,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // --- 5. Interactive Mouse Spotlight & Glow Followers ---

  // Spotlight effect for cards
  const cards = document.querySelectorAll('.pillar-card, .program-card, .pricing-card, .testimonial-card, .trust-quote-card, .service-category-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Full-screen cursor ambient glow follower
  const glow = document.querySelector('.cursor-glow');
  if (glow) {
    window.addEventListener('mousemove', (e) => {
      // Use requestAnimationFrame for fluid frame updates
      requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    });
  }

  // --- 6. Rotating Testimonial Slider ---
  const trustSlides = document.querySelectorAll('.trust-slider-container .trust-quote-card');
  if (trustSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      // Deactivate current slide
      trustSlides[currentSlide].classList.remove('active-slide');
      // Increment
      currentSlide = (currentSlide + 1) % trustSlides.length;
      // Activate next slide
      trustSlides[currentSlide].classList.add('active-slide');
    }, 4500);
  }

  // --- 7. Liquid Ripple Trail ---
  const POOL_SIZE = 80;
  const MIN_DISTANCE = 45;
  const EXPAND_FROM = 10;
  const EXPAND_TO = 140;
  const AGE_INCREMENT = 0.025;

  const rippleContainer = document.getElementById('ripple-container');
  if (rippleContainer) {
    const ripples = Array.from({ length: POOL_SIZE }, () => ({ active: false, x: 0, y: 0, age: 0 }));
    const pool = [];
    let nextIndex = 0;
    let lastPos = { x: 0, y: 0 };
    let rafId = null;

    // Create the divs dynamically
    for (let i = 0; i < POOL_SIZE; i++) {
      const el = document.createElement('div');
      el.className = 'ripple-element';
      rippleContainer.appendChild(el);
      pool.push(el);
    }

    const handleMove = (x, y) => {
      const dx = x - lastPos.x;
      const dy = y - lastPos.y;
      if (Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE) return;

      lastPos = { x, y };
      const idx = nextIndex % POOL_SIZE;
      ripples[idx] = { active: true, x, y, age: 0 };
      nextIndex++;
    };

    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const animateRipples = () => {
      for (let i = 0; i < POOL_SIZE; i++) {
        const r = ripples[i];
        const el = pool[i];
        if (!el) continue;

        if (r.active) {
          r.age += AGE_INCREMENT;
          if (r.age >= 1) {
            r.active = false;
            el.style.opacity = '0';
            continue;
          }
          const size = EXPAND_FROM + r.age * (EXPAND_TO - EXPAND_FROM);
          const opacity = (1 - Math.pow(r.age, 1.2)) * 0.35;
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.left = `${r.x - size / 2}px`;
          el.style.top = `${r.y - size / 2}px`;
          el.style.opacity = `${opacity}`;
        }
      }
      rafId = requestAnimationFrame(animateRipples);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    rafId = requestAnimationFrame(animateRipples);
  }
});
