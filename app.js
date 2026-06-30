// Interactive Logic for sobhabengaluru.com

// State management
let activeTab = 'all';
let searchQuery = '';
let currentSlide = 0;
const slidesIntervalTime = 6000; // 6 seconds per hero slide

// Hero Images configuration (repurposed from extracted site assets for realistic mockups)
const HERO_SLIDES = [
  "https://www.sobha.com/wp-content/uploads/2026/03/bangalore_sobha_oneworld_desktop_banner_citypage-scaled.webp",
  "https://www.sobha.com/wp-content/uploads/2026/01/Elevation-Evening-View.webp",
  "https://www.sobha.com/wp-content/uploads/2023/09/elevation-night-view.webp"
];

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initNavbarScroll();
  initTabs();
  initSearch();
  initAccordions();
  initModals();
  initContactForms();
  renderProjects();
});

// 1. Hero Cross-fade Slider
function initHeroSlider() {
  const sliderContainer = document.querySelector('.hero-slider');
  if (!sliderContainer) return;

  // Render slides dynamically
  HERO_SLIDES.forEach((imgUrl, index) => {
    const slide = document.createElement('div');
    slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${imgUrl}')`;
    sliderContainer.appendChild(slide);
  });

  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, slidesIntervalTime);
}

// 2. Navbar Scroll Effect
function initNavbarScroll() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 3. Project Filter Tabs
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeTab = e.target.getAttribute('data-tab');
      renderProjects();
    });
  });
}

// 4. Real-time Search Input
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProjects();
  });
}

// 5. Render Project Grid Cards
function renderProjects() {
  const grid = document.querySelector('.projects-grid');
  const countSpan = document.getElementById('count-num');
  if (!grid) return;

  // Filter projects by active tab (region) and search query
  const filtered = PROJECTS_DATA.filter(p => {
    // 1. Filter by Region Tab
    // Tab IDs: 'all', 'contents-1' (Featured), 'contents-2' (North), 'contents-3' (East), 'contents-4' (South), 'contents-5' (Central)
    let regionMatch = false;
    if (activeTab === 'all') {
      // Show only unique projects (avoid listing duplicate entries across regions in the 'All' tab)
      // Ongoing has everything. Let's make sure if we choose all, we show tab_id === 'ongoing' (which contains all 42 projects)
      regionMatch = (p.tab_id === 'ongoing');
    } else {
      regionMatch = (p.tab_id === activeTab);
    }

    // 2. Filter by Search Query
    const searchMatch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery) ||
      p.subheading.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.location.toLowerCase().includes(searchQuery) ||
      p.specs.toLowerCase().includes(searchQuery);

    return regionMatch && searchMatch;
  });

  // Deduplicate by title to ensure clean display
  const seenTitles = new Set();
  const uniqueFiltered = filtered.filter(p => {
    if (seenTitles.has(p.title)) return false;
    seenTitles.add(p.title);
    return true;
  });

  // Update counter
  if (countSpan) {
    countSpan.textContent = uniqueFiltered.length;
  }

  // Clear Grid
  grid.innerHTML = '';

  if (uniqueFiltered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <i class="fa fa-search"></i>
        <h3>No Residences Found</h3>
        <p>No luxury properties match your active search terms or filters. Try adjusting your query.</p>
      </div>
    `;
    return;
  }

  // Render HTML Cards
  uniqueFiltered.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Tag tag HTML
    const tagHTML = project.tag ? `<span class="card-tag">${project.tag}</span>` : '';
    
    // Custom button and link behaviour for SOBHA ONE WORLD
    const isOneWorld = project.title === 'SOBHA ONE WORLD';
    const primaryButtonHTML = isOneWorld ? 
      `<a href="sobhaoneworld/index.html" class="btn-card-primary text-center" style="display: flex; align-items: center; justify-content: center; text-decoration: none;">View Details</a>` : 
      `<button class="btn-card-primary enquire-now-trigger" data-project="${project.title}">Request Details</button>`;
    
    card.innerHTML = `
      <div class="card-image-container">
        ${tagHTML}
        <img class="card-image" src="${project.image}" alt="${project.title}" onerror="this.src='https://www.sobha.com/wp-content/uploads/2026/03/bangalore_sobha_oneworld_desktop_banner_citypage-scaled.webp'">
      </div>
      <div class="card-content">
        <h3 class="card-title">${project.title}</h3>
        <div class="card-subheading">${project.subheading}</div>
        <p class="card-desc">${project.description}</p>
        <div class="card-divider"></div>
        <div class="card-meta">
          <div class="meta-item">
            <i class="fa fa-map-marker"></i>
            <span>${project.location}</span>
          </div>
          <div class="meta-item">
            <i class="fa fa-arrows-alt"></i>
            <span>${project.specs}</span>
          </div>
        </div>
        <div class="card-ctas">
          ${primaryButtonHTML}
          <button class="btn-card-share share-trigger" data-title="${project.title}" data-location="${project.location}">
            <i class="fa fa-share-alt"></i>
          </button>
        </div>
      </div>
    `;
    
    if (isOneWorld) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Prevent redirecting if user clicks the share button
        if (!e.target.closest('.share-trigger')) {
          window.location.href = 'sobhaoneworld/index.html';
        }
      });
    }
    
    grid.appendChild(card);
  });

  // Re-attach triggers on dynamic buttons
  attachDynamicTriggers();
}

// 6. Accordion Toggle Behavior
function initAccordions() {
  const container = document.querySelector('.faq-container');
  if (!container) return;

  // Render FAQs dynamically
  FAQS_DATA.forEach(faq => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <div class="faq-header">
        <h3 class="faq-question">${faq.question}</h3>
        <span class="faq-icon">+</span>
      </div>
      <div class="faq-body">
        <div class="faq-content">
          <p>${faq.answer}</p>
        </div>
      </div>
    `;
    container.appendChild(item);
  });

  const headers = document.querySelectorAll('.faq-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isActive = item.classList.contains('active');

      // Close all accordions
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-body').style.maxHeight = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

// 7. Booking & Callback Modal State
function initModals() {
  const overlay = document.getElementById('booking-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!overlay || !closeBtn) return;

  // Close when close button clicked
  closeBtn.addEventListener('click', closeModal);

  // Close on outer container click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(projectName = '') {
  const overlay = document.getElementById('booking-modal');
  const projectInput = document.getElementById('modal-project');
  const modalTitle = document.querySelector('.modal-title');
  
  if (!overlay) return;

  if (projectName) {
    if (projectInput) {
      projectInput.value = projectName;
    }
    modalTitle.textContent = `Enquire for ${projectName}`;
  } else {
    if (projectInput) projectInput.value = 'General Inquiry';
    modalTitle.textContent = 'Schedule a Site Visit';
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeModal() {
  const overlay = document.getElementById('booking-modal');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Attach event listeners to dynamically rendered elements
function attachDynamicTriggers() {
  // Enquiry buttons
  document.querySelectorAll('.enquire-now-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const projectName = btn.getAttribute('data-project');
      openModal(projectName);
    });
  });

  // Share buttons
  document.querySelectorAll('.share-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const location = btn.getAttribute('data-location');
      const shareUrl = window.location.href;
      
      if (navigator.share) {
        navigator.share({
          title: `Sobha Bengaluru - ${title}`,
          text: `Check out ${title} at ${location}`,
          url: shareUrl
        }).catch(err => console.log('Error sharing:', err));
      } else {
        // Fallback: Copy link
        navigator.clipboard.writeText(`${shareUrl}#${encodeURIComponent(title)}`)
          .then(() => {
            alert(`Link for ${title} copied to clipboard!`);
          })
          .catch(err => console.log('Error copying to clipboard:', err));
      }
    });
  });
}

// 8. Global Modals and Buttons
function initContactForms() {
  // Bind global CTA buttons
  document.querySelectorAll('.visit-btn-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal();
    });
  });

  // Handle contact form and modal form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const successBanner = form.querySelector('.success-banner') || createSuccessBanner(form);
      
      // Determine form context
      const isModal = form.id === 'modal-booking-form';
      const prefix = isModal ? 'modal-' : 'main-';
      
      const firstName = document.getElementById(prefix + 'first-name').value.trim();
      const lastName = document.getElementById(prefix + 'last-name').value.trim();
      const phoneNum = document.getElementById(prefix + 'phone').value.trim();
      const email = document.getElementById(prefix + 'email').value.trim();

      if (!/^[a-zA-Z\s]{2,50}$/.test(firstName)) {
        alert('Please enter a valid first name (2-50 letters).');
        return;
      }
      if (!/^\d{7,15}$/.test(phoneNum)) {
        alert('Please enter a valid phone number (7-15 digits).');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      try {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const apiUrl = isLocal ? 'http://localhost:3001/api/enquiry' : '/api/enquiry';
        
        const payload = {
          firstName: firstName,
          lastName: lastName,
          phone: "+91" + phoneNum, // Default to +91 if no code selector exists on main form
          email: email,
          leadSource: "Sobha Website",
          company: "Not Provided",
          message: "Enquiry from sobhabengaluru.com root page"
        };

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to submit lead');
        }

        if (successBanner) {
          successBanner.style.display = 'block';
          successBanner.textContent = 'Thank you! Your inquiry has been submitted. A relationship manager will contact you shortly.';
        }
        form.reset();

        // Close modal if form is inside a modal
        if (form.closest('.modal-overlay')) {
          setTimeout(() => {
            closeModal();
            successBanner.style.display = 'none';
          }, 2000);
        }
      } catch (err) {
        alert('Submission failed: ' + err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Enquire now';
        }
      }
    });
  });
}

function createSuccessBanner(form) {
  const banner = document.createElement('div');
  banner.className = 'success-banner';
  form.insertBefore(banner, form.firstChild);
  return banner;
}

// Automatically open modal after 2 seconds
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    openModal();
  }, 2000);
});
