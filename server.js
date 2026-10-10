const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const timeZones = [
  'UTC',
  'Africa/Kigali',
  'Africa/Johannesburg',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney'
];

function formatZoneDate(timeZone) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const map = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));

  const date = `${map.year}-${map.month}-${map.day}`;
  const time = `${map.hour}:${map.minute}:${map.second}`;
  const offset = getTimeZoneOffset(now, timeZone);

  return {
    zone: timeZone,
    label: formatDisplayName(timeZone),
    localDate: date,
    localTime: time,
    iso: new Date(now.toLocaleString('en-US', { timeZone })).toISOString(),
    offset
  };
}

function getTimeZoneOffset(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const tzName = parts.find(part => part.type === 'timeZoneName')?.value || 'UTC';
  return tzName.replace('GMT', 'UTC').replace('UTC', 'UTC');
}

function formatDisplayName(value) {
  return value
    .replace('UTC', 'UTC')
    .replace('_', ' ')
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' / ');
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/timezones', (req, res) => {
  const payload = {
    updatedAt: new Date().toISOString(),
    zones: timeZones.map(formatZoneDate)
  };

  res.json(payload);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Intore Clock server running on http://localhost:${PORT}`);
});
