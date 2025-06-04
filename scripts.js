// Theme Toggle Section
const btn = document.getElementById('toggleModeBtn');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedMode = localStorage.getItem('themeMode');
if (savedMode === 'dark' || (!savedMode && prefersDark)) {
  document.body.classList.add('dark-mode');
  btn.textContent = '☀️';
}
btn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  btn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('themeMode', isDark ? 'dark' : 'light');
  btn.blur();
});

// DOMContentLoaded: Gallery, Lightbox, Filter Dropdown/Accordion
document.addEventListener('DOMContentLoaded', () => {
  // Gallery & Lightbox Section
  const galleryImages = document.querySelectorAll('.gallery img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  if (lightbox && lightboxImage) {
    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        const originalUrl = img.getAttribute('data-original');
        lightboxImage.src = originalUrl;
        lightbox.classList.remove('hidden');
        document.body.classList.add('lightbox-active');
      });
    });
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox || e.target === lightboxImage) {
        lightbox.classList.add('hidden');
        document.body.classList.remove('lightbox-active');
      }
    });
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lightbox.classList.add('hidden');
        document.body.classList.remove('lightbox-active');
      });
    }
  }

  // Filter Dropdown/Accordion Section
  const filterAccordion = document.querySelector('.filter-accordion');
  if (filterAccordion) {
    document.querySelectorAll('.filter-group').forEach(g => {
      g.querySelector('.filter-group-toggle').setAttribute('aria-expanded', 'false');
      g.querySelector('.filter-group-icon').textContent = '+';
      g.querySelector('.filter-options').setAttribute('hidden', '');
      g.querySelector('.filter-group-header').classList.remove('active');
    });
    filterAccordion.addEventListener('click', function(e) {
      const target = e.target.closest('button, a');
      if (!target) return;
      if (target.classList.contains('filter-group-toggle')) {
        e.preventDefault();
        const group = target.closest('.filter-group');
        const options = group.querySelector('.filter-options');
        const header = group.querySelector('.filter-group-header');
        document.querySelectorAll('.filter-group').forEach(g => {
          if (g !== group) {
            g.querySelector('.filter-group-toggle').setAttribute('aria-expanded', 'false');
            g.querySelector('.filter-group-icon').textContent = '+';
            g.querySelector('.filter-options').setAttribute('hidden', '');
            g.querySelector('.filter-group-header').classList.remove('active');
          }
        });
        const expanded = target.getAttribute('aria-expanded') === 'true';
        target.setAttribute('aria-expanded', !expanded);
        group.querySelector('.filter-group-icon').textContent = expanded ? '+' : '–';
        if (expanded) {
          options.setAttribute('hidden', '');
          header.classList.remove('active');
        } else {
          options.removeAttribute('hidden');
          header.classList.add('active');
        }
      }
      if (target.classList.contains('filter-select-all')) {
        e.preventDefault();
        const group = target.closest('.filter-group');
        group.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => cb.checked = true);
      }
      if (target.classList.contains('filter-clear-all')) {
        e.preventDefault();
        const group = target.closest('.filter-group');
        group.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => cb.checked = false);
      }
    });
  }
  // Filter Dropdown Toggle Section
  const filterBtn = document.getElementById('filterDropdownBtn');
  const filterDropdown = document.getElementById('filterDropdown');
  if (filterBtn && filterDropdown) {
    let dropdownOpen = false;
    const arrow = filterBtn.querySelector('.filter-arrow');
    filterBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = filterDropdown.style.display === 'block';
      filterDropdown.style.display = isOpen ? 'none' : 'block';
      dropdownOpen = !isOpen;
      if (!isOpen) {
        // Opening: show outline and set arrow up
        filterBtn.classList.add('filter-btn-outline');
        filterBtn.focus();
        if (arrow) arrow.innerHTML = '&#9650;'; // Upward arrow
      } else {
        // Closing: remove outline and set arrow down
        filterBtn.classList.remove('filter-btn-outline');
        filterBtn.blur();
        if (arrow) arrow.innerHTML = '&#9660;'; // Downward arrow
      }
    });
    document.addEventListener('click', function(e) {
      if (!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
        filterDropdown.style.display = 'none';
        dropdownOpen = false;
        filterBtn.classList.remove('filter-btn-outline');
        filterBtn.blur();
        if (arrow) arrow.innerHTML = '&#9660;'; // Downward arrow
      }
    });
    // Remove outline on Escape key
    filterBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        filterDropdown.style.display = 'none';
        dropdownOpen = false;
        filterBtn.classList.remove('filter-btn-outline');
        filterBtn.blur();
        if (arrow) arrow.innerHTML = '&#9660;'; // Downward arrow
      }
    });
  }
});

// About Us Carousel Section
(function() {
  const slides = document.querySelectorAll('.about-us-carousel .carousel-box');
  const prevBtn = document.getElementById('aboutPrev');
  const nextBtn = document.getElementById('aboutNext');
  let current = 0;
  let autoSlideInterval;
  const SLIDE_INTERVAL = 5000;
  function updateIndicators(idx) {
    const dot0 = document.getElementById('carouselDot0');
    const dot1 = document.getElementById('carouselDot1');
    if (dot0 && dot1) {
      dot0.classList.toggle('active', idx === 0);
      dot1.classList.toggle('active', idx === 1);
    }
  }
  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
    updateIndicators(idx);
  }
  function nextSlide() {
    const prev = current;
    current = (current + 1) % slides.length;
    animateSlide(prev, current, 'next');
    showSlide(current);
  }
  function prevSlide() {
    const prev = current;
    current = (current - 1 + slides.length) % slides.length;
    animateSlide(prev, current, 'prev');
    showSlide(current);
  }
  prevBtn.addEventListener('click', function() {
    prevSlide();
    resetAutoSlide();
  });
  nextBtn.addEventListener('click', function() {
    nextSlide();
    resetAutoSlide();
  });
  let startX = null;
  const slideContainer = document.getElementById('aboutCarouselSlides');
  if (slideContainer) {
    slideContainer.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    });
    slideContainer.addEventListener('touchend', function(e) {
      if (startX === null) return;
      let endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) prevBtn.click();
      else if (startX - endX > 50) nextBtn.click();
      startX = null;
    });
  }
  function animateSlide(prevIdx, nextIdx, direction) {
    slides.forEach((slide, i) => {
      slide.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
      if (i === prevIdx) {
        slide.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
      } else if (i === nextIdx) {
        slide.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
      }
    });
  }
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }
  showSlide(current);
  startAutoSlide();
  updateIndicators(current);
})();

// Top Customers Carousel Section
(function() {
  const stacksContainer = document.getElementById('topCustomersStacks');
  const stacks = stacksContainer ? stacksContainer.querySelectorAll('.customer-stack') : [];
  const prevBtn = document.getElementById('customersPrev');
  const nextBtn = document.getElementById('customersNext');
  const indicators = document.getElementById('customersIndicators');
  let currentStack = 0;
  let currentCard = 0;
  let autoInterval;
  function isMobile() {
    return window.innerWidth <= 700;
  }
  function updateIndicators() {
    if (!indicators) return;
    indicators.innerHTML = '';
    if (isMobile() && stacks.length) {
      const cards = stacks[0].querySelectorAll('.customer-card');
      cards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (idx === currentCard ? ' active' : '');
        dot.addEventListener('click', () => showCard(idx));
        indicators.appendChild(dot);
      });
    } else {
      stacks.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (idx === currentStack ? ' active' : '');
        dot.addEventListener('click', () => showStack(idx));
        indicators.appendChild(dot);
      });
    }
  }
  function showStack(idx) {
    stacks.forEach((stack, i) => {
      stack.classList.toggle('active', i === idx);
    });
    currentStack = idx;
    updateIndicators();
  }
  function showCard(idx) {
    if (!stacks.length) return;
    const cards = stacks[0].querySelectorAll('.customer-card');
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === idx);
    });
    currentCard = idx;
    updateIndicators();
  }
  function next() {
    if (isMobile()) {
      const cards = stacks[0].querySelectorAll('.customer-card');
      currentCard = (currentCard + 1) % cards.length;
      showCard(currentCard);
    } else {
      currentStack = (currentStack + 1) % stacks.length;
      showStack(currentStack);
    }
  }
  function prev() {
    if (isMobile()) {
      const cards = stacks[0].querySelectorAll('.customer-card');
      currentCard = (currentCard - 1 + cards.length) % cards.length;
      showCard(currentCard);
    } else {
      currentStack = (currentStack - 1 + stacks.length) % stacks.length;
      showStack(currentStack);
    }
  }
  function startAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(next, 2000);
  }
  function handleResize() {
    if (isMobile()) {
      stacks.forEach((stack, i) => stack.classList.toggle('active', i === 0));
      showCard(currentCard);
    } else {
      stacks.forEach((stack, i) => stack.classList.toggle('active', i === currentStack));
    }
    updateIndicators();
    startAuto();
  }
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  window.addEventListener('resize', handleResize);
  if (stacks.length) {
    handleResize();
    startAuto();
  }
})();

// Organization JSON-LD Section
(function() {
  var orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sandya Designer Boutique",
    "url": "https://sandyadesignerboutique.github.io/Store/",
    "logo": "https://i.postimg.cc/PrK4fMtb/goldennn-1.png"
  };
  if (!document.querySelector('script[type="application/ld+json"][data-org-jsonld]')) {
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-org-jsonld', 'true');
    script.text = JSON.stringify(orgJsonLd);
    document.head.appendChild(script);
  }
})();

// Reviews Carousel Section
(function() {
  const reviews = [
    { name: "Vipula", text: "Customer satisfaction 100 percent" },
    { name: "Srinidhi", text: "Sandhya aunty gives her 100% for every piece that she picks up for design. What started with my Sister's bridal designs, to my bridal designs and everything after, Sandhya aunty is our go-to person, everything ethnic." },
    { name: "Vemula sridevi", text: "I highly recommend Sandhya Designer Boutique fr high-quality, stylish clothing and especially impressed with their on-time delivery and exclusive designer wear saree Collection" },
    { name: "Kadali Kuntla", text: "Lovely designs and great work." },
    { name: "Polleni Madhav", text: "Smart work 👍" },
    { name: "Sreedevi Deshpandey", text: "I've had the pleasure of working with Sandhya garu for everything from bridal wear to custom stitching. The attention to detail, perfect fitting, and quality are always top-notch. What began as a customer relationship has now become a valued friendship. Highly recommend for expert tailoring and excellent service." },
    { name: "Buzz", text: "elegant stitching. Love it." },
    { name: "Pavanisai Pala", text: "Lovely boutique with a great collection. Amazing work!!!" },
    { name: "Prasana Laxmi", text: "Excellent designs at affordable prices" },
    { name: "Navyasree P", text: "Nice stitching...." },
    { name: "Kruthika", text: "Sandhya Boutique offers elegant, handcrafted designs with a personal touch. Perfect for those seeking unique, traditional styles." }
  ];
  const carouselList = document.getElementById('reviewCarouselList');
  const upBtn = document.querySelector('.review-arrow.up');
  const downBtn = document.querySelector('.review-arrow.down');
  let current = 0;
  let autoScrollTimer = null;
  let isPaused = false;
  function getIndices(center) {
    const n = reviews.length;
    const mid = center % n;
    const top = (mid - 1 + n) % n;
    const bot = (mid + 1) % n;
    return [top, mid, bot];
  }
  function render() {
    const [top, mid, bot] = getIndices(current);
    carouselList.innerHTML = '';
    [top, mid, bot].forEach((idx, i) => {
      const item = document.createElement('div');
      item.className = 'review-item' + (i === 1 ? ' middle' : '');
      item.innerHTML = `<strong class="reviewer-name">${reviews[idx].name}</strong><p>${reviews[idx].text}</p>`;
      carouselList.appendChild(item);
    });
    carouselList.style.transform = 'translateY(0)';
  }
  function next() {
    current = (current + 1) % reviews.length;
    render();
  }
  function prev() {
    current = (current - 1 + reviews.length) % reviews.length;
    render();
  }
  function autoScroll() {
    if (isPaused) return;
    next();
    autoScrollTimer = setTimeout(autoScroll, 3500);
  }
  function pauseAutoScroll() {
    isPaused = true;
    clearTimeout(autoScrollTimer);
    setTimeout(() => { isPaused = false; autoScroll(); }, 9000);
  }
  upBtn.addEventListener('click', () => { prev(); pauseAutoScroll(); });
  downBtn.addEventListener('click', () => { next(); pauseAutoScroll(); });
  let startY = null;
  carouselList.addEventListener('touchstart', e => { startY = e.touches[0].clientY; });
  carouselList.addEventListener('touchend', e => {
    if (startY === null) return;
    const endY = e.changedTouches[0].clientY;
    if (endY - startY > 30) { prev(); pauseAutoScroll(); }
    else if (startY - endY > 30) { next(); pauseAutoScroll(); }
    startY = null;
  });
  render();
  setTimeout(autoScroll, 3500);
})();