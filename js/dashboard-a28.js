// Дашборд для сотрудника A28
export function initDashboard(allData, userId) {
    const employeeData = getEmployeeData(userId);
    renderDashboard(employeeData);
    setupEventListeners();
    updateUI();
}

function getEmployeeData(userId) {
    return {
        name: 'А28-Денис',
        position: 'Аналитик данных',
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
                        <div class="metric no-border bonus">
                            <span class="bonus-label">Бонус</span>
                            <div class="bonus-row">
                                <div>
                                    <span class="period-title">1 период</span>
                                    <span class="bonus-amount" id="bonus1">-- ₽</span>
                                </div>
                                <div>
                                    <span class="period-title">2 период</span>
                                    <span class="bonus-amount" id="bonus2">-- ₽</span>
                                </div>
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
                <div id="epics-block-wrapper" class="epics-block-wrapper" style="display:none">
                    <h3 class="epics-title">Закрытые эпики</h3>
                    <div id="epics-block" class="epics-block">
                        <div id="epics-list"></div>
                    </div>
                </div>
                <div class="sprint-container">
                    <div class="sprint-content">
                        <div class="sprint-block-wrapper">
                            <h3 class="sprint-title">1-й спринт</h3>
                            <div class="sprint-block">
                                <div class="task-progress-block">
                                    <div class="metric no-border">
                                        <span>Задачи</span>
                                        <span id="tasks1">--</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progressFill1" style="width:0%"></div>
                                    </div>
                                </div>
                                <div class="epic-bonus-block">
                                    <div class="metric no-border">
                                        <span>Эпики</span>
                                        <span id="epics1">--</span>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Бонус</span>
                                        <span id="sprintBonus1">-- ₽</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sprint-block-wrapper">
                            <h3 class="sprint-title">2-й спринт</h3>
                            <div class="sprint-block">
                                <div class="task-progress-block">
                                    <div class="metric no-border">
                                        <span>Задачи</span>
                                        <span id="tasks2">--</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progressFill2" style="width:0%"></div>
                                    </div>
                                </div>
                                <div class="epic-bonus-block">
                                    <div class="metric no-border">
                                        <span>Эпики</span>
                                        <span id="epics2">--</span>
                                    </div>
                                    <div class="metric no-border">
                                        <span>Бонус</span>
                                        <span id="sprintBonus2">-- ₽</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Устанавливаем аватар
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
    const sprint1 = data.sprint1 || {};
    const sprint2 = data.sprint2 || {};
    
    const formatNum = (num) => Number.isFinite(num) ? num.toLocaleString('ru-RU') : '--';
    
    document.getElementById('oklad').textContent = `${formatNum(data.oklad)} ₽`;
    document.getElementById('tasks1').textContent = `${sprint1.tasks_done ?? '--'} / ${sprint1.total_tasks ?? '--'}`;
    document.getElementById('progressFill1').style.width = `${Math.round(sprint1.percent) || 0}%`;
    document.getElementById('progressFill1').textContent = `${Math.round(sprint1.percent) || 0}%`;
    document.getElementById('epics1').textContent = sprint1.epics_closed ?? '--';
    document.getElementById('sprintBonus1').textContent = `${formatNum(sprint1.bonus)} ₽`;
    document.getElementById('tasks2').textContent = `${sprint2.tasks_done ?? '--'} / ${sprint2.total_tasks ?? '--'}`;
    document.getElementById('progressFill2').style.width = `${Math.round(sprint2.percent) || 0}%`;
    document.getElementById('progressFill2').textContent = `${Math.round(sprint2.percent) || 0}%`;
    document.getElementById('epics2').textContent = sprint2.epics_closed ?? '--';
    document.getElementById('sprintBonus2').textContent = `${formatNum(sprint2.bonus)} ₽`;
    document.getElementById('bonus1').textContent = `${formatNum(sprint1.total_bonus)} ₽`;
    document.getElementById('bonus2').textContent = `${formatNum(sprint2.total_bonus)} ₽`;
    document.getElementById('total').textContent = `${formatNum(data.total)} ₽`;
    
    const epicsWrapper = document.getElementById('epics-block-wrapper');
    const epicsList = document.getElementById('epics-list');
    epicsList.innerHTML = '';
    
    if (data.epic_names?.trim() && data.epic_names !== 'нет закрытых эпиков') {
        epicsWrapper.style.display = 'block';
        data.epic_names.split('::').forEach(epic => {
            if (epic.trim()) {
                const div = document.createElement('div');
                div.className = 'epic-item';
                div.textContent = epic.trim();
                epicsList.appendChild(div);
            }
        });
    } else {
        epicsWrapper.style.display = 'none';
    }
}

// Инициализация селекторов
const now = new Date();
const currentMonth = monthsNames[now.getMonth()];
const currentYear = now.getFullYear().toString();

function initializeSelectors() {
    const years = [...new Set(Object.keys(allData).map(p => p.split('-')[1]))].sort((a, b) => a - b);
    const yearSelect = document.getElementById('yearSelect');
    years.forEach(year => yearSelect.appendChild(new Option(year, year)));
    yearSelect.value = currentYear;
    
    const monthSelect = document.getElementById('monthSelect');
    monthsNames.forEach(month => {
        monthSelect.appendChild(new Option(month.charAt(0).toUpperCase() + month.slice(1), month));
    });
    monthSelect.value = currentMonth;
    
    updateMetrics(`${monthSelect.value}-${yearSelect.value}`);
}
