// ==========================================================
// i18n — RU/UK dictionary + helpers, shared across all pages.
// Usage: <script src="i18n.js"></script> loaded after/with app.js.
// Static text: <span data-i18n="key">fallback</span>
// Attributes:  data-i18n-placeholder / data-i18n-title (same key lookup)
// Dynamic JS:  t('key') or t('key', {name: 'X'}) for {name}-style vars
// Document title: set data-i18n-doctitle="key" on <html>
// ==========================================================

const I18N_STORAGE_KEY = 'tcs_lang';
const I18N_SUPPORTED = ['ru', 'uk'];

const I18N_DICT = {
    ru: {
        // Shared
        lang_ru: 'RU',
        lang_uk: 'UA',

        // login.html
        login_doctitle: 'Вход — TCS2',
        login_heading: 'Вход в систему',
        login_sub: 'Панель управления TimeCalculateSystem',
        login_username_label: 'Логин',
        login_password_label: 'Пароль',
        login_submit: 'Войти',
        login_submit_loading: 'Вход...',
        login_error_required: 'Введите логин и пароль',
        login_error_generic: 'Ошибка входа. Попробуйте ещё раз.',
    },
    uk: {
        lang_ru: 'RU',
        lang_uk: 'UA',

        login_doctitle: 'Вхід — TCS2',
        login_heading: 'Вхід у систему',
        login_sub: 'Панель керування TimeCalculateSystem',
        login_username_label: 'Логін',
        login_password_label: 'Пароль',
        login_submit: 'Увійти',
        login_submit_loading: 'Вхід...',
        login_error_required: 'Введіть логін і пароль',
        login_error_generic: 'Помилка входу. Спробуйте ще раз.',
    }
};

function getLang() {
    const stored = localStorage.getItem(I18N_STORAGE_KEY);
    return I18N_SUPPORTED.includes(stored) ? stored : 'ru';
}

function setLang(lang) {
    if (!I18N_SUPPORTED.includes(lang)) return;
    localStorage.setItem(I18N_STORAGE_KEY, lang);
    applyI18n();
    document.dispatchEvent(new CustomEvent('tcs-lang-change', { detail: lang }));
}

function t(key, vars) {
    const lang = getLang();
    let str = (I18N_DICT[lang] && I18N_DICT[lang][key]) || (I18N_DICT.ru && I18N_DICT.ru[key]) || key;
    if (vars) {
        Object.keys(vars).forEach(k => {
            str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
        });
    }
    return str;
}

function applyI18n(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });

    const doctitleKey = document.documentElement.getAttribute('data-i18n-doctitle');
    if (doctitleKey) document.title = t(doctitleKey);

    document.querySelectorAll('.lang-switch [data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === getLang());
    });
}

function langSwitchHtml() {
    return `<div class="lang-switch">
        <button type="button" data-lang="ru" onclick="setLang('ru')">${t('lang_ru')}</button>
        <button type="button" data-lang="uk" onclick="setLang('uk')">${t('lang_uk')}</button>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => applyI18n());
