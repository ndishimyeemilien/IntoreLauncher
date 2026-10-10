const clockGrid = document.getElementById('clockGrid');
const statusPill = document.getElementById('status');

function renderClocks(clocks) {
  clockGrid.innerHTML = '';

  clocks.forEach((clock) => {
    const card = document.createElement('article');
    card.className = 'clock-card';

    const zone = document.createElement('p');
    zone.className = 'clock-zone';
    zone.textContent = clock.label;

    const time = document.createElement('p');
    time.className = 'clock-time';
    time.textContent = clock.localTime;

    const date = document.createElement('p');
    date.className = 'clock-date';
    date.textContent = clock.localDate;

    const offset = document.createElement('span');
    offset.className = 'clock-offset';
    offset.textContent = `Timezone ${clock.offset || 'UTC'}`;

    card.appendChild(zone);
    card.appendChild(time);
    card.appendChild(date);
    card.appendChild(offset);
    clockGrid.appendChild(card);
  });
}

async function refreshClocks() {
  try {
    const response = await fetch('/api/timezones');
    const data = await response.json();
    renderClocks(data.zones);
    statusPill.textContent = `Updated ${new Date(data.updatedAt).toLocaleTimeString()}`;
  } catch (error) {
    statusPill.textContent = 'Sync failed';
    console.error('Error fetching time zones:', error);
  }
}

refreshClocks();
setInterval(refreshClocks, 1000);
