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

  // --- 2. Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    menuToggle.classList.toggle('menu-toggle-active');
    mobileNav.classList.toggle('mobile-nav-active');
    // Toggle body scroll lock
    document.body.style.overflow = mobileNav.classList.contains('mobile-nav-active') ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('mobile-nav-active')) {
        toggleMobileMenu();
      }
    });
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
});
