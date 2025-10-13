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
  const closes = data.closes || {};
  const rating = data.rating || {};
  const formatNum = num => Number.isFinite(num) ? num.toLocaleString('ru-RU') : '--';
  document.getElementById('oklad').textContent = `${formatNum(data.oklad)} ₽`;
  document.getElementById('closes-plan').textContent = closes.plan ?? '--';
  document.getElementById('closes-fact').textContent = closes.fact ?? '--';
  const closesPercent = Math.round(closes.percent * 100) || 0;
  document.getElementById('progressFill-closes').style.width = `${closesPercent}%`;
  document.getElementById('progressFill-closes').textContent = `${closesPercent}%`;
  document.getElementById('closes-bonus-plan').textContent = `${formatNum(closes.bonus_plan)} ₽`;
  document.getElementById('closes-bonus-fact').textContent = `${formatNum(closes.bonus_fact)} ₽`;
  document.getElementById('rating-plan').textContent = rating.plan ?? '--';
  document.getElementById('rating-fact').textContent = rating.fact ?? '--';
  const ratingPercent = Math.round(rating.percent * 100) || 0;
  document.getElementById('progressFill-rating').style.width = `${ratingPercent}%`;
  document.getElementById('progressFill-rating').textContent = `${ratingPercent}%`;
  document.getElementById('rating-bonus-plan').textContent = `${formatNum(rating.bonus_plan)} ₽`;
  document.getElementById('rating-bonus-fact').textContent = `${formatNum(rating.bonus_plan)} ₽`; // В JSON два bonus_plan, предполагаем второй - bonus_fact
  document.getElementById('bonus').textContent = `${formatNum(data.bonus)} ₽`;
  document.getElementById('total').textContent = `${formatNum(data.total)} ₽`;
}
