// ==========================================================
// Auth
// ==========================================================
const AUTH_TOKEN_KEY = 'tcs_token';
const AUTH_USER_KEY = 'tcs_user';
const LOGOUT_URL = 'https://n8n.vseproi.de/webhook/tcs2-logout';

function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
    } catch (e) {
        return null;
    }
}

function setAuthSession(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuthSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

// Call at the top of every protected page's init. Returns false (and redirects) if not logged in.
function requireAuth() {
    if (!getAuthToken()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Drop-in replacement for fetch() that attaches the auth token and redirects to login on 401.
async function authFetch(url, options) {
    options = options || {};
    const token = getAuthToken();
    const headers = Object.assign({}, options.headers || {}, token ? { 'Authorization': 'Bearer ' + token } : {});
    const res = await fetch(url, Object.assign({}, options, { headers }));
    if (res.status === 401) {
        clearAuthSession();
        window.location.href = 'login.html';
        throw new Error(t('auth_required'));
    }
    return res;
}

async function logout() {
    const token = getAuthToken();
    clearAuthSession();
    if (token) {
        try {
            await fetch(LOGOUT_URL, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
        } catch (e) { /* ignore — session is cleared client-side regardless */ }
    }
    window.location.href = 'login.html';
}

// ==========================================================
// Collapsible filters row (mobile)
// ==========================================================
function toggleFiltersRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) row.classList.toggle('expanded');
}

// Call after populating/changing filter values so the mobile badge reflects active filter count.
function updateFiltersBadge(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;
    const badge = row.querySelector('.filters-badge');
    if (!badge) return;
    let count = 0;
    row.querySelectorAll('.filters-content select, .filters-content input').forEach(el => {
        if (el.value) count++;
    });
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

// ==========================================================
// Shared navigation
// ==========================================================
// Add an entry here whenever a new page is added to the admin site.
const NAV_PAGES = [
    { href: 'dashboard.html', key: 'nav_dashboard' },
    { href: 'employees.html', key: 'nav_employees' },
    { href: 'objects.html', key: 'nav_objects' },
    { href: 'sessions.html', key: 'nav_sessions' },
    { href: 'payments.html', key: 'nav_payments' },
    { href: 'references.html', key: 'nav_references' },
    { href: 'users.html', key: 'nav_users', adminOnly: true }
];

let currentNavHref = null;

function renderNav(activeHref) {
    if (activeHref) currentNavHref = activeHref;
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;
    const user = getCurrentUser();
    const isAdmin = !!user && user.role === 'admin';
    nav.innerHTML = NAV_PAGES.filter(p => !p.adminOnly || isAdmin).map(p =>
        `<a href="${p.href}" class="sidebar-link${p.href === currentNavHref ? ' active' : ''}">${t(p.key)}</a>`
    ).join('');
    initMobileNav();
    renderSidebarUser();

    if (!renderNav._langListenerAdded) {
        renderNav._langListenerAdded = true;
        document.addEventListener('tcs-lang-change', () => renderNav(currentNavHref));
    }
}

function renderSidebarUser() {
    const el = document.getElementById('sidebarUser');
    if (!el) return;
    const user = getCurrentUser();
    if (!user) { el.innerHTML = ''; return; }
    const label = user.full_name || user.username || '?';
    const ini = label.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const avatar = user.avatar_url
        ? `<img class="sidebar-user-avatar" src="${escapeHtml(user.avatar_url)}" alt="">`
        : `<div class="sidebar-user-avatar">${escapeHtml(ini)}</div>`;
    el.innerHTML = `
        <div class="sidebar-footer-row">
            <div class="sidebar-user-info">
                ${avatar}
                <div class="sidebar-user-text">
                    <div class="sidebar-user-name">${escapeHtml(label)}</div>
                    <div class="sidebar-user-role">${user.role === 'admin' ? t('role_admin') : t('role_viewer')}</div>
                </div>
            </div>
            <button class="sidebar-logout-btn" onclick="logout()" title="${t('logout_title')}" type="button">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 14l4-4-4-4M17 10H7M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3"/></svg>
            </button>
        </div>
        ${langSwitchHtml()}`;
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
    toggleBtn.setAttribute('aria-label', t('mobile_nav_open'));
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
    return d.toLocaleDateString(getLang() === 'uk' ? 'uk-UA' : 'ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
