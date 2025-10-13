function initDashboard() {
  document.getElementById('name').textContent = userConfig.name;
  document.getElementById('position').textContent = userConfig.position;
  const years = [...new Set(Object.keys(allData).map(p => p.split('-')[1]))].sort((a, b) => a - b);
  const yearSelect = document.getElementById('yearSelect');
  years.forEach(year => yearSelect.appendChild(new Option(year, year)));
  yearSelect.value = currentYear;
  const monthSelect = document.getElementById('monthSelect');
  monthsNames.forEach(month => monthSelect.appendChild(new Option(month.charAt(0).toUpperCase() + month.slice(1), month)));
  monthSelect.value = currentMonth;
  updateMetrics(`${monthSelect.value}-${yearSelect.value}`);
  monthSelect.addEventListener('change', () => updateMetrics(`${monthSelect.value}-${yearSelect.value}`));
  yearSelect.addEventListener('change', () => updateMetrics(`${monthSelect.value}-${yearSelect.value}`));
}

function updateMetrics(period) {
  const data = allData[period] || {};
  const sprint1 = data.sprint1 || {};
  const sprint2 = data.sprint2 || {};
  const formatNum = num => Number.isFinite(num) ? num.toLocaleString('ru-RU') : '--';
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
