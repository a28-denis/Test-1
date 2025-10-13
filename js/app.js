// Конфигурация - здесь указываем user.id для тестирования
const CONFIG = {
    // Для теста меняйте этот ID
    USER_ID: '7018103762', // или '6783339307'
    
    // Маппинг user.id -> тип дашборда
    DASHBOARD_TYPES: {
        '7018103762': 'a28',
        '6783339307': 'a18'
    },
    
    // Данные сотрудников
    EMPLOYEE_DATA: {
        '7018103762': {
            name: 'А28-Денис',
            position: 'Аналитик данных',
            dashboardType: 'a28'
        },
        '6783339307': {
            name: 'А18-Сотрудник', 
            position: 'Другая должность',
            dashboardType: 'a18'
        }
    }
};

// Глобальные переменные
let allData = {};
const monthsMap = {
    'январь':1,'февраль':2,'март':3,'апрель':4,'май':5,'июнь':6,
    'июль':7,'август':8,'сентябрь':9,'октябрь':10,'ноябрь':11,'декабрь':12
};
const monthsNames = Object.keys(monthsMap);

// Инициализация приложения
Telegram.WebApp.ready();
const webApp = Telegram.WebApp;
const platform = webApp.platform;
if (platform === 'android' || platform === 'ios') { 
    webApp.expand(); 
}

// Получаем user.id из Telegram или используем конфиг
function getUserId() {
    const user = webApp.initDataUnsafe.user;
    return user ? user.id.toString() : CONFIG.USER_ID;
}

// Определяем тип дашборда
function getDashboardType(userId) {
    return CONFIG.DASHBOARD_TYPES[userId] || 'a28'; // по умолчанию A28
}

// Загружаем нужный дашборд
async function loadDashboard() {
    const userId = getUserId();
    const dashboardType = getDashboardType(userId);
    
    try {
        // Динамически импортируем нужный модуль дашборда
        const dashboardModule = await import(`./dashboard-${dashboardType}.js`);
        
        // Загружаем данные
        await loadData(userId);
        
        // Инициализируем дашборд
        dashboardModule.initDashboard(allData, userId);
        
    } catch (error) {
        console.error('Ошибка загрузки дашборда:', error);
        webApp.showAlert('Ошибка загрузки дашборда');
    }
}

// Загрузка данных
async function loadData(userId) {
    const loader = document.getElementById('loader');
    
    try {
        const dataUrl = `https://raw.githubusercontent.com/a28-denis/Test-1/main/BD/${userId}.json`;
        const response = await fetch(dataUrl);
        
        if (!response.ok) throw new Error('Network error');
        
        allData = await response.json();
        if (!allData || typeof allData !== 'object') {
            throw new Error('Invalid data format');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        webApp.showAlert('Ошибка загрузки данных. Попробуйте обновить.');
        throw error;
    } finally {
        loader.style.display = 'none';
    }
}

// Утилиты
function formatNum(num) {
    return Number.isFinite(num) ? num.toLocaleString('ru-RU') : '--';
}

function deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Запуск приложения
loadDashboard();
