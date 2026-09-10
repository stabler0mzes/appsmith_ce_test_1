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
    await unsubscribeFromPush();
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
    { href: 'employee-groups.html', key: 'nav_groups' },
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
            <button class="sidebar-notify-btn" id="sidebarNotifyBtn" onclick="toggleAdminNotifications()" title="${t('notify_title')}" type="button" style="display:none;">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 2a5 5 0 00-5 5v3.2c0 .5-.2 1-.5 1.4L3 14h14l-1.5-2.4a2.3 2.3 0 01-.5-1.4V7a5 5 0 00-5-5z"/><path d="M8 17a2 2 0 004 0"/></svg>
            </button>
            <button class="sidebar-logout-btn" onclick="logout()" title="${t('logout_title')}" type="button">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 14l4-4-4-4M17 10H7M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3"/></svg>
            </button>
        </div>
        ${langSwitchHtml()}`;
    refreshNotifyBtn();
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

// Full localized weekday name ("Суббота"/"Субота") for an ISO-ish date(time)
// string. Empty string for a missing/unparsable value.
function weekdayName(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(getLang() === 'uk' ? 'uk-UA' : 'ru-RU', { weekday: 'long' });
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

// ==========================================================
// Service worker — installable PWA + push transport. Registered
// unconditionally so it's active on every page (login included), same
// pattern as TCS2-mobile-app.
// ==========================================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});

        // A new SW version activates in the background on first reopen after
        // a deploy (see sw.js CACHE_NAME) but the already-loaded page keeps
        // running on stale cached assets until it reloads — do that once,
        // automatically, so a deploy takes effect on the very next reopen
        // instead of needing a second manual close+reopen.
        let reloadedForNewWorker = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (reloadedForNewWorker) return;
            reloadedForNewWorker = true;
            window.location.reload();
        });
    }
}

registerServiceWorker();

// ==========================================================
// Push notifications — same VAPID keypair/push-service as
// TCS2-mobile-app (see push-service/index.js there), scoped here to
// admin_users via admin_push_subscriptions instead of employees. Opt-in
// only, via the bell button in the sidebar footer (renderSidebarUser) —
// no auto-subscribe on login/install.
// ==========================================================
const VAPID_PUBLIC_KEY = 'BFFaOoUQ1puHix2kQFFt0k3kDpOxNEt0y2I-QFwE5TYHQeeqohIOU_gO4ybTw2flSOMRfEtrnU-NKvUbaODveX0';
const PUSH_SAVE_URL = 'https://n8n.vseproi.de/webhook/tcs2-admin-save-push-subscription';
const PUSH_DELETE_URL = 'https://n8n.vseproi.de/webhook/tcs2-admin-delete-push-subscription';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

function pushSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
}

async function getPushSubscription() {
    if (!pushSupported()) return null;
    const reg = await navigator.serviceWorker.ready;
    return reg.pushManager.getSubscription();
}

// Returns 'subscribed' | 'denied' | 'unsupported' | 'error'.
async function subscribeToPush() {
    if (!pushSupported()) return 'unsupported';
    try {
        if (Notification.permission === 'denied') return 'denied';
        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
            sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
        }
        await authFetch(PUSH_SAVE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub.toJSON() }),
        });
        return 'subscribed';
    } catch (e) {
        return Notification.permission === 'denied' ? 'denied' : 'error';
    }
}

async function unsubscribeFromPush() {
    if (!pushSupported()) return;
    try {
        const sub = await getPushSubscription();
        if (!sub) return;
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await authFetch(PUSH_DELETE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint }),
        });
    } catch (e) {
        // best-effort — nothing to do if this fails
    }
}

function refreshNotifyBtn() {
    const btn = document.getElementById('sidebarNotifyBtn');
    if (!btn) return;
    if (!pushSupported()) { btn.style.display = 'none'; return; }
    btn.style.display = 'flex';
    getPushSubscription().then((sub) => btn.classList.toggle('active', !!sub));
}

async function toggleAdminNotifications() {
    const sub = await getPushSubscription();
    if (sub) {
        await unsubscribeFromPush();
    } else {
        const result = await subscribeToPush();
        if (result === 'denied') showError(t('notify_denied'));
        else if (result === 'error' || result === 'unsupported') showError(t('notify_error'));
    }
    refreshNotifyBtn();
}

// ==========================================================
// Install banner (every page, persistent, no dismiss) — mirrors
// TCS2-mobile-app's app.js exactly (see that file for the original
// rationale/comments): platform-aware, injected straight into
// document.body, no per-page placeholder markup needed.
// ==========================================================
let deferredInstallPrompt = null;

function isStandaloneDisplay() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIosDevice() {
    const ua = navigator.userAgent;
    return (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS 13+ маскируется под Mac
}

function isIosSafariBrowser() {
    const ua = navigator.userAgent;
    return isIosDevice() && /safari/i.test(ua) && !/crios|fxios|edgios|opios|opr\//i.test(ua);
}

function ensureInstallStepsOverlay() {
    if (document.getElementById('installStepsOverlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'installStepsOverlay';
    overlay.innerHTML = `<div class="modal">
        <div class="modal-header"><div class="modal-title">${escapeHtml(t('install_steps_title'))}</div></div>
        <div class="modal-body">
            <div class="install-step"><div class="install-step-num">1</div><div class="install-step-text">${escapeHtml(t('install_step_1'))}</div></div>
            <div class="install-step"><div class="install-step-num">2</div><div class="install-step-text">${escapeHtml(t('install_step_2'))}</div></div>
            <div class="install-step"><div class="install-step-num">3</div><div class="install-step-text">${escapeHtml(t('install_step_3'))}</div></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-cancel" onclick="closeInstallStepsOverlay()">${escapeHtml(t('close'))}</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);
}

function renderInstallBanner() {
    let banner = document.getElementById('installBanner');
    const shouldShow = !isStandaloneDisplay() && (deferredInstallPrompt || isIosSafariBrowser());

    if (!shouldShow) {
        if (banner) banner.remove();
        document.body.classList.remove('has-install-banner');
        return;
    }

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'installBanner';
        banner.className = 'install-banner';
        document.body.appendChild(banner);
    }
    document.body.classList.add('has-install-banner');

    if (deferredInstallPrompt) {
        banner.innerHTML = `
            <div class="install-banner-text">${escapeHtml(t('install_hint_text_android'))}</div>
            <button type="button" class="install-banner-btn" onclick="triggerInstallPrompt()">${escapeHtml(t('install_hint_install_btn'))}</button>
        `;
        return;
    }

    // isIosSafariBrowser() — гарантировано веткой shouldShow выше
    banner.innerHTML = `
        <div class="install-banner-text">${escapeHtml(t('install_hint_text_ios'))}</div>
        <button type="button" class="install-banner-btn" onclick="openInstallStepsOverlay()">${escapeHtml(t('install_hint_how_btn'))}</button>
    `;
    ensureInstallStepsOverlay();
}

async function triggerInstallPrompt() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    renderInstallBanner();
}

function openInstallStepsOverlay() {
    ensureInstallStepsOverlay();
    document.getElementById('installStepsOverlay').classList.add('show');
}
function closeInstallStepsOverlay() {
    const el = document.getElementById('installStepsOverlay');
    if (el) el.classList.remove('show');
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    renderInstallBanner();
});

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    renderInstallBanner();
});

document.addEventListener('DOMContentLoaded', () => renderInstallBanner());
