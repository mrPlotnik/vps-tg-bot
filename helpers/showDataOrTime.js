function getDate(format) {
  const date = new Date();
  const Year = date.getFullYear();
  const Month = date.getMonth();
  const Day = date.getDate();
  const Hour = date.getHours();
  const Minutes = date.getMinutes();
  const Seconds = date.getSeconds();
  let fMonth;
  // Преобразуем месяца
  // eslint-disable-next-line default-case
  switch (Month) {
    case 0: fMonth = 'января'; break;
    case 1: fMonth = 'февраля'; break;
    case 2: fMonth = 'марта'; break;
    case 3: fMonth = 'апреля'; break;
    case 4: fMonth = 'мае'; break;
    case 5: fMonth = 'июня'; break;
    case 6: fMonth = 'июля'; break;
    case 7: fMonth = 'августа'; break;
    case 8: fMonth = 'сентября'; break;
    case 9: fMonth = 'октября'; break;
    case 10: fMonth = 'ноября'; break;
    case 11: fMonth = 'декабря'; break;
  }
  if (format === 'date') return `${Hour}:${Minutes}:${Seconds} => `;
  if (format === 'time') return `${Day} ${fMonth} ${Year} года => `;
  return 'Неправильный запрос';
}

module.exports = {
  time() {
    const date = getDate('date');
    return date;
  },
  date() {
    const time = getDate('time');
    return time;
  },
};
