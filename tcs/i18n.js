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
        edit: 'Редактировать',
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
        label_phone: 'Телефон',
        label_rate: 'Ставка',
        label_name: 'Имя',
        label_surname: 'Фамилия',
        label_position: 'Должность',
        label_direction: 'Направление',
        label_direction_full: 'Направление деятельности',
        label_language: 'Язык',
        label_contact: 'Дополнительная контактная информация',
        optional: 'необязательно',
        select_rate: 'Выберите ставку',
        select_direction: 'Выберите направление',
        saving: 'Сохранение...',
        save_failed: 'Не удалось сохранить данные',
        save_error_retry: 'Ошибка при сохранении. Попробуйте ещё раз.',
        status_active: 'Активен',
        status_inactive: 'Неактивен',
        rate_label_format: '{price} грн/час — {position}',

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

        // employees.html
        employees_doctitle: 'Сотрудники',
        employees_heading: 'Сотрудники',
        employees_sub: 'Активация новых регистраций и редактирование данных сотрудников',
        employees_section_pending: 'Ожидают активации',
        employees_section_active: 'Активные сотрудники',
        employees_section_inactive: 'Неактивные сотрудники',
        employees_activate_title: 'Активация сотрудника',
        employees_fill_required: 'Заполните обязательные поля',
        employees_placeholder_position: 'Например, Каменщик',
        employees_activated_title: 'Сотрудник активирован',
        employees_activated_sub: '{name} теперь может начать работу',
        employees_edit_title: 'Редактирование сотрудника',
        employees_edit_sub: 'Изменить данные сотрудника',
        employees_toggle_active: 'Активен',
        employees_placeholder_contact: 'Например, второй номер телефона',
        employees_toggle_admin: 'Права администратора',
        employees_toggle_admin_sub: 'Получает уведомления о новых регистрациях',
        employees_saved_title: 'Данные сохранены',
        employees_deactivated_suffix: ' — деактивирован',
        employees_load_failed: 'Не удалось загрузить список сотрудников. Попробуйте обновить страницу.',
        employees_empty_pending: 'Нет сотрудников, ожидающих активации',
        employees_empty_active: 'Нет активных сотрудников',
        employees_empty_inactive: 'Нет неактивных сотрудников',
        employees_badge_pending: 'Ожидает активации',
        employees_label_registration: 'Регистрация',
        employees_btn_activate: 'Активировать',
        employees_label_phone_colon: 'Телефон:',
        employees_label_telegram_colon: 'Telegram:',
        employees_label_telegram_id_colon: 'Telegram ID:',
        employees_label_telegram_username_colon: 'Telegram username:',

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
        edit: 'Редагувати',
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
        label_phone: 'Телефон',
        label_rate: 'Ставка',
        label_name: "Ім'я",
        label_surname: 'Прізвище',
        label_position: 'Посада',
        label_direction: 'Напрямок',
        label_direction_full: 'Напрямок діяльності',
        label_language: 'Мова',
        label_contact: 'Додаткова контактна інформація',
        optional: 'необов’язково',
        select_rate: 'Виберіть ставку',
        select_direction: 'Виберіть напрямок',
        saving: 'Збереження...',
        save_failed: 'Не вдалося зберегти дані',
        save_error_retry: 'Помилка при збереженні. Спробуйте ще раз.',
        status_active: 'Активний',
        status_inactive: 'Неактивний',
        rate_label_format: '{price} грн/год — {position}',

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

        // employees.html
        employees_doctitle: 'Співробітники',
        employees_heading: 'Співробітники',
        employees_sub: 'Активація нових реєстрацій і редагування даних співробітників',
        employees_section_pending: 'Очікують активації',
        employees_section_active: 'Активні співробітники',
        employees_section_inactive: 'Неактивні співробітники',
        employees_activate_title: 'Активація співробітника',
        employees_fill_required: "Заповніть обов'язкові поля",
        employees_placeholder_position: 'Наприклад, Муляр',
        employees_activated_title: 'Співробітника активовано',
        employees_activated_sub: '{name} тепер може почати роботу',
        employees_edit_title: 'Редагування співробітника',
        employees_edit_sub: 'Змінити дані співробітника',
        employees_toggle_active: 'Активний',
        employees_placeholder_contact: 'Наприклад, другий номер телефону',
        employees_toggle_admin: 'Права адміністратора',
        employees_toggle_admin_sub: 'Отримує сповіщення про нові реєстрації',
        employees_saved_title: 'Дані збережено',
        employees_deactivated_suffix: ' — деактивовано',
        employees_load_failed: 'Не вдалося завантажити список співробітників. Спробуйте оновити сторінку.',
        employees_empty_pending: 'Немає співробітників, які очікують активації',
        employees_empty_active: 'Немає активних співробітників',
        employees_empty_inactive: 'Немає неактивних співробітників',
        employees_badge_pending: 'Очікує активації',
        employees_label_registration: 'Реєстрація',
        employees_btn_activate: 'Активувати',
        employees_label_phone_colon: 'Телефон:',
        employees_label_telegram_colon: 'Telegram:',
        employees_label_telegram_id_colon: 'Telegram ID:',
        employees_label_telegram_username_colon: 'Telegram username:',

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
