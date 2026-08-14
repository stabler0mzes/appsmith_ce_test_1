// ==========================================================
// Shared navigation
// ==========================================================
// Add an entry here whenever a new page is added to the admin site.
const NAV_PAGES = [
    { href: 'dashboard.html', label: 'Главная' },
    { href: 'employees.html', label: 'Сотрудники' },
    { href: 'objects.html', label: 'Объекты' },
    { href: 'sessions.html', label: 'Рабочие сессии' },
    { href: 'payments.html', label: 'Оплата' },
    { href: 'references.html', label: 'Справочники' }
];

function renderNav(activeHref) {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    nav.innerHTML = NAV_PAGES.map(p =>
        `<a href="${p.href}" class="sidebar-link${p.href === activeHref ? ' active' : ''}">${p.label}</a>`
    ).join('');
    initMobileNav();
}

// ==========================================================
// Mobile sidebar (hamburger toggle + backdrop)
// ==========================================================
function initMobileNav() {
    if (document.getElementById('mobileNavToggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mobileNavToggle';
    toggleBtn.className = 'mobile-nav-toggle';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', 'Открыть меню');
    toggleBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h14M3 10h14M3 15h14"/></svg>';
    toggleBtn.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
    document.body.appendChild(toggleBtn);

    const backdrop = document.createElement('div');
    backdrop.id = 'sidebarBackdrop';
    backdrop.className = 'sidebar-backdrop';
    backdrop.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    document.body.appendChild(backdrop);

    document.querySelectorAll('#sidebarNav .sidebar-link').forEach(link => {
        link.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    });
}

// ==========================================================
// Shared helpers
// ==========================================================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function initials(entity) {
    const n = (entity.name || '').trim();
    const s = (entity.surname || '').trim();
    return ((n[0] || '') + (s[0] || '')).toUpperCase() || '?';
}

function avatarHtml(entity, cssClass) {
    return entity.avatar_url
        ? `<img class="${cssClass}" src="${escapeHtml(entity.avatar_url)}" alt="">`
        : `<div class="${cssClass}">${escapeHtml(initials(entity))}</div>`;
}

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function emptyStateHtml(text) {
    return `
        <div class="state-box">
            <svg class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>
            ${text}
        </div>`;
}

function showError(msg) {
    const box = document.getElementById('errorBox');
    if (!box) return;
    box.textContent = msg;
    box.style.display = 'block';
}

function hideError() {
    const box = document.getElementById('errorBox');
    if (!box) return;
    box.style.display = 'none';
}
