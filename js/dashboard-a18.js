// Дашборд для сотрудника A18
export function initDashboard(allData, userId) {
    const employeeData = getEmployeeData(userId);
    renderDashboard(employeeData);
    setupEventListeners();
    updateUI();
}

function getEmployeeData(userId) {
    return {
        name: 'А18-Сотрудник',
        position: 'Другая должность', 
        avatarUrl: `https://raw.githubusercontent.com/a28-denis/Test-1/main/images/${userId}.jpg`
    };
}

function renderDashboard(employeeData) {
    const container = document.getElementById('dashboard-container');
    
    container.innerHTML = `
        <div class="content">
            <div class="card">
                <div class="header-section">
                    <div class="employee-block">
                        <div class="header">
                            <div class="avatar" id="avatar"></div>
                            <div class="info">
                                <h2 class="name" id="name">${employeeData.name}</h2>
                                <p class="position">${employeeData.position}</p>
                            </div>
                        </div>
                        <div class="metric no-border oklad-metric">
                            <span>Оклад</span>
                            <span id="oklad">-- ₽</span>
                        </div>
                        <div class="period-select">
                            <select id="monthSelect"></select>
                            <select id="yearSelect"></select>
                        </div>
                    </div>
                    <div class="total-block">
                        <div class="metric no-border">
                            <span class="total-sum">Бонус</span>
                            <div class="total-row">
                                <span class="total-amount" id="bonus">-- ₽</span>
                            </div>
                        </div>
                        <div class="bonus-divider"></div>
                        <div class="metric no-border">
                            <span class="total-sum">Выплата</span>
                            <div class="total-row">
                                <span class="total-amount" id="total">-- ₽</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="sprint-container">
                    <div class="sprint-content">
                        <div class="sprint-block-wrapper">
                            <h3 class="sprint-title">Закрытия</h3>
                            <div class="sprint-block">
                                <div class="closes-block">
                                    <div class="metric no-border">
                                        <span>План</span>
                                        <span id="closesPlan">--</span>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Факт</span>
                                        <span id="closesFact">--</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="closesProgress" style="width:0%"></div>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Бонус план</span>
                                        <span id="closesBonusPlan">-- ₽</span>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Бонус факт</span>
                                        <span id="closesBonusFact">-- ₽</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sprint-block-wrapper">
                            <h3 class="sprint-title">Рейтинг</h3>
                            <div class="sprint-block">
                                <div class="rating-block">
                                    <div class="metric no-border">
                                        <span>План</span>
                                        <span id="ratingPlan">--</span>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Факт</span>
                                        <span id="ratingFact">--</span>
                                    </div>
                                    <div class="progress-bar rating">
                                        <div class="progress-fill rating" id="ratingProgress" style="width:0%"></div>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Бонус план</span>
                                        <span id="ratingBonusPlan">-- ₽</span>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Бонус факт</span>
                                        <span id="ratingBonusFact">-- ₽</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('avatar').style.backgroundImage = `url("${employeeData.avatarUrl}")`;
}

function setupEventListeners() {
    document.getElementById('monthSelect').addEventListener('change', updateUI);
    document.getElementById('yearSelect').addEventListener('change', updateUI);
}

function updateUI() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const period = `${monthSelect.value}-${yearSelect.value}`;
    updateMetrics(period);
}

function updateMetrics(period) {
    const data = allData[period] || {};
    const closes = data.closes || {};
    const rating = data.rating || {};
    
    const formatNum = (num) => Number.isFinite(num) ? num.toLocaleString('ru-RU') : '--';
    const formatPercent = (num) => Number.isFinite(num) ? `${Math.round(num)}%` : '--';
    
    // Основные метрики
    document.getElementById('oklad').textContent = `${formatNum(data.oklad)} ₽`;
    document.getElementById('bonus').textContent = `${formatNum(data.bonus)} ₽`;
    document.getElementById('total').textContent = `${formatNum(data.total)} ₽`;
    
    // Закрытия
    document.getElementById('closesPlan').textContent = closes.plan ?? '--';
    document.getElementById('closesFact').textContent = closes.fact ?? '--';
    document.getElementById('closesProgress').style.width = `${closes.percent || 0}%`;
    document.getElementById('closesProgress').textContent = formatPercent(closes.percent);
    document.getElementById('closesBonusPlan').textContent = `${formatNum(closes.bonus_plan)} ₽`;
    document.getElementById('closesBonusFact').textContent = `${formatNum(closes.bonus_fact)} ₽`;
    
    // Рейтинг
    document.getElementById('ratingPlan').textContent = rating.plan ?? '--';
    document.getElementById('ratingFact').textContent = rating.fact ?? '--';
    document.getElementById('ratingProgress').style.width = `${rating.percent || 0}%`;
    document.getElementById('ratingProgress').textContent = formatPercent(rating.percent);
    document.getElementById('ratingBonusPlan').textContent = `${formatNum(rating.bonus_plan)} ₽`;
    document.getElementById('ratingBonusFact').textContent = `${formatNum(rating.bonus_fact)} ₽`;
}

// Инициализация селекторов
const now = new Date();
const currentMonth = Object.keys(monthsMap)[now.getMonth()];
const currentYear = now.getFullYear().toString();

function initializeSelectors() {
    const years = [...new Set(Object.keys(allData).map(p => p.split('-')[1]))].sort((a, b) => a - b);
    const yearSelect = document.getElementById('yearSelect');
    years.forEach(year => yearSelect.appendChild(new Option(year, year)));
    yearSelect.value = currentYear;
    
    const monthSelect = document.getElementById('monthSelect');
    Object.keys(monthsMap).forEach(month => {
        monthSelect.appendChild(new Option(month.charAt(0).toUpperCase() + month.slice(1), month));
    });
    monthSelect.value = currentMonth;
    
    updateMetrics(`${monthSelect.value}-${yearSelect.value}`);
}
