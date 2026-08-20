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
        // Shared — nav, sidebar, generic states/actions
        lang_ru: 'RU',
        lang_uk: 'UA',
        nav_dashboard: 'Главная',
        nav_employees: 'Сотрудники',
        nav_objects: 'Объекты',
        nav_sessions: 'Рабочие сессии',
        nav_payments: 'Оплата',
        nav_references: 'Справочники',
        nav_users: 'Пользователи',
        role_admin: 'Администратор',
        role_viewer: 'Наблюдатель',
        logout_title: 'Выйти',
        mobile_nav_open: 'Открыть меню',
        auth_required: 'Требуется авторизация',
        refresh: 'Обновить',
        cancel: 'Отмена',
        save: 'Сохранить',
        edit: 'Изменить',
        delete: 'Удалить',
        close: 'Закрыть',
        all: 'Все',
        yes: 'Да',
        no: 'Нет',
        loading: 'Загрузка...',
        error_generic: 'Что-то пошло не так. Попробуйте ещё раз.',
        filters: 'Фильтры',
        filters_reset: 'Сбросить фильтры',
        load_error_generic: 'Ошибка загрузки данных',
        load_failed_retry: 'Не удалось загрузить данные. Попробуйте обновить страницу.',

        // dashboard.html
        dashboard_doctitle: 'Сейчас на объектах',
        dashboard_heading: 'Сейчас на объектах',
        dashboard_sub: 'Сотрудники с активной сменой прямо сейчас, сгруппированные по объектам',
        dashboard_empty: 'Сейчас никто не работает',
        dashboard_stat_objects: 'Объектов сейчас в работе',
        dashboard_stat_employees: 'Сотрудников на смене',
        dashboard_since: 'С {time}',
        dashboard_in_progress: 'В работе',
        dashboard_hours_short: 'ч',
        dashboard_minutes_short: 'м',

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
        nav_dashboard: 'Головна',
        nav_employees: 'Співробітники',
        nav_objects: "Об'єкти",
        nav_sessions: 'Робочі зміни',
        nav_payments: 'Оплата',
        nav_references: 'Довідники',
        nav_users: 'Користувачі',
        role_admin: 'Адміністратор',
        role_viewer: 'Спостерігач',
        logout_title: 'Вийти',
        mobile_nav_open: 'Відкрити меню',
        auth_required: 'Потрібна авторизація',
        refresh: 'Оновити',
        cancel: 'Скасувати',
        save: 'Зберегти',
        edit: 'Змінити',
        delete: 'Видалити',
        close: 'Закрити',
        all: 'Всі',
        yes: 'Так',
        no: 'Ні',
        loading: 'Завантаження...',
        error_generic: 'Щось пішло не так. Спробуйте ще раз.',
        filters: 'Фільтри',
        filters_reset: 'Скинути фільтри',
        load_error_generic: 'Помилка завантаження даних',
        load_failed_retry: 'Не вдалося завантажити дані. Спробуйте оновити сторінку.',

        // dashboard.html
        dashboard_doctitle: 'Зараз на об’єктах',
        dashboard_heading: 'Зараз на об’єктах',
        dashboard_sub: 'Співробітники з активною зміною просто зараз, згруповані за об’єктами',
        dashboard_empty: 'Зараз ніхто не працює',
        dashboard_stat_objects: 'Об’єктів зараз у роботі',
        dashboard_stat_employees: 'Співробітників на зміні',
        dashboard_since: 'З {time}',
        dashboard_in_progress: 'У роботі',
        dashboard_hours_short: 'год',
        dashboard_minutes_short: 'хв',

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
