// =============================================
//  সৌর কথন — Main JavaScript
//  Navigation, rendering, animations
// =============================================

// ========================
// STATE
// ========================
let currentPage = 'home';

// ========================
// DOM READY
// ========================
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbarScroll();
    renderAllSections();
    showPage('home');
    initScrollAnimations();
});

// ========================
// PARTICLES
// ========================
function initParticles() {
    const container = document.getElementById('particles');
    const count = 20;
    for (let i = 0; i < count; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0;
    `;
    container.appendChild(p);
}

// ========================
// NAVBAR SCROLL
// ========================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scroll = window.scrollY;
        if (scroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = scroll;
    });
}

// ========================
// HAMBURGER MENU
// ========================
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    menu.classList.toggle('open');
    hamburger.classList.toggle('active');
}

// Close menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('open');
        hamburger.classList.remove('active');
    }
});

// ========================
// PAGE NAVIGATION
// ========================
function showPage(pageKey) {
    currentPage = pageKey;

    // Hide hero if not home
    const hero = document.getElementById('page-home');
    if (pageKey === 'home') {
        hero.style.display = 'flex';
    } else {
        hero.style.display = 'none';
    }

    // Toggle sections
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`section-${pageKey}`);
    if (target) target.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navLink = document.getElementById(`nav-${pageKey}`);
    if (navLink) navLink.classList.add('active');

    // Close mobile menu
    document.getElementById('nav-menu').classList.remove('open');

    // Scroll to top (smooth)
    window.scrollTo({ top: pageKey === 'home' ? 0 : document.querySelector('.main-content').offsetTop - 80, behavior: 'smooth' });

    // Re-trigger animations
    triggerSectionAnimations(pageKey);
}

function scrollToPosts() {
    const mainContent = document.querySelector('.main-content');
    mainContent.scrollIntoView({ behavior: 'smooth' });
}

// ========================
// RENDER ALL SECTIONS
// ========================
function renderAllSections() {
    renderPosts('posts-container', BLOG_DATA.posts);
    renderPosts('khoshgalpo-container', BLOG_DATA.posts.filter(p => p.categoryKey === 'khoshgalpo'));
    renderPosts('kobita-container', BLOG_DATA.posts.filter(p => p.categoryKey === 'kobita'));
    renderPosts('travel-container', BLOG_DATA.posts.filter(p => p.categoryKey === 'travel'));
    renderPhotos('photos-container', BLOG_DATA.photos);
    renderPortfolio('portfolio-container', BLOG_DATA.portfolio);
    renderPosts('selected-container', BLOG_DATA.posts.filter(p => BLOG_DATA.selectedIds.includes(p.id)));
}

// ========================
// RENDER POSTS
// ========================
function renderPosts(containerId, posts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = `<div class="empty-state" style="text-align:center;padding:4rem;color:var(--text-muted);grid-column:1/-1;">
            <p style="font-size:3rem;margin-bottom:1rem;">📝</p>
            <p>এখানে এখনো কোনো লেখা নেই।</p>
        </div>`;
        return;
    }

    container.innerHTML = posts.map(post => createPostCard(post)).join('');

    // Add click events
    container.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', () => {
            const postId = parseInt(card.dataset.id);
            openPost(postId);
        });
    });
}

function createPostCard(post) {
    const thumbnail = `
        <div class="post-thumbnail">
            <div class="post-thumbnail-placeholder">${post.emoji}</div>
            <span class="post-category-badge">${post.category}</span>
        </div>
    `;

    const tags = post.tags ? post.tags.slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join('') : '';

    return `
        <article class="post-card" data-id="${post.id}" tabindex="0" 
                 role="button" aria-label="${post.title} পড়ুন">
            ${thumbnail}
            <div class="post-body">
                <div class="post-date">${post.date}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags" style="margin-bottom:0.8rem;display:flex;flex-wrap:wrap;gap:0.35rem;">${tags}</div>
                <span class="read-more-btn">পড়ুন <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
            </div>
        </article>
    `;
}

// ========================
// RENDER PHOTOS
// ========================
function renderPhotos(containerId, photos) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const heights = [180, 220, 160, 240, 200, 180, 220, 160, 200];

    container.innerHTML = photos.map((photo, i) => `
        <div class="photo-item" onclick="showPhotoToast('${photo.caption}')">
            <div class="photo-placeholder" 
                 style="height:${heights[i % heights.length]}px; background: linear-gradient(135deg, ${photo.color}, var(--bg-card))">
                <span style="font-size:3rem">${photo.emoji}</span>
                <span style="font-size:0.75rem;color:var(--text-muted)">${photo.caption}</span>
            </div>
            <div class="photo-caption">${photo.caption}</div>
        </div>
    `).join('');
}

// ========================
// RENDER PORTFOLIO
// ========================
function renderPortfolio(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="portfolio-card" ${item.link ? `onclick="window.open('${item.link}', '_blank')" style="cursor:pointer"` : ''}>
            <div class="portfolio-icon">${item.icon}</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="portfolio-tags">
                ${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            ${item.link ? `<div style="margin-top:1rem"><a href="${item.link}" target="_blank" class="read-more-btn">দেখুন ↗</a></div>` : ''}
        </div>
    `).join('');
}

// ========================
// POST MODAL
// ========================
function openPost(postId) {
    const post = BLOG_DATA.posts.find(p => p.id === postId);
    if (!post) return;

    const modalContent = document.getElementById('modal-content');
    const overlay = document.getElementById('modal-overlay');

    modalContent.innerHTML = `
        <div class="modal-post-emoji" style="font-size:4rem;text-align:center;padding:2rem 0 1rem;background:linear-gradient(135deg,var(--bg-mid),var(--bg-card));margin:-2.5rem -2.5rem 2rem;border-radius:20px 20px 0 0">
            ${post.emoji}
        </div>
        <div class="modal-post-category">${post.category}</div>
        <h2 class="modal-post-title">${post.title}</h2>
        <div class="modal-post-meta">
            <span>${post.date}</span>
            <span>voruoso!</span>
            ${post.tags ? `<span>${post.tags.slice(0,2).map(t => '#'+t).join(' ')}</span>` : ''}
        </div>
        <div class="modal-post-body">${post.content}</div>
        <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                ${post.tags ? post.tags.map(t => `<span class="tag">#${t}</span>`).join('') : ''}
            </div>
            <a href="https://sourokothon.wordpress.com" target="_blank" style="color:var(--accent-primary);font-size:0.85rem;text-decoration:none;">
                মূল ব্লগে পড়ুন ↗
            </a>
        </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Also allow keyboard nav on cards
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('post-card')) {
        const postId = parseInt(e.target.dataset.id);
        openPost(postId);
    }
});

// ========================
// CONTACT FORM
// ========================
function submitForm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    btn.textContent = 'পাঠানো হচ্ছে...';
    btn.disabled = true;

    setTimeout(() => {
        showToast('✅ বার্তাটি পাঠানো হয়েছে! ধন্যবাদ।');
        e.target.reset();
        btn.textContent = 'পাঠিয়ে দিন ✉';
        btn.disabled = false;
    }, 1500);
}

// ========================
// TOAST
// ========================
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3100);
}

function showPhotoToast(caption) {
    showToast(`📸 ${caption}`);
}

// ========================
// SCROLL ANIMATIONS
// ========================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.post-card, .portfolio-card, .photo-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

function triggerSectionAnimations(pageKey) {
    setTimeout(() => {
        const section = document.getElementById(`section-${pageKey}`);
        if (!section) return;
        section.querySelectorAll('.post-card, .portfolio-card, .photo-item').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 80);
        });
    }, 50);
}

// ========================
// SMOOTH TYPING EFFECT for hero
// ========================
(function addGlowEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    setInterval(() => {
        title.style.filter = `drop-shadow(0 0 ${30 + Math.random() * 20}px rgba(47, 159, 167, ${0.3 + Math.random() * 0.2}))`;
    }, 2000);
})();
