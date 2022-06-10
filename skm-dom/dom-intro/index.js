const title = document.querySelector('h1');
title.style.color = 'hotpink';

const dateTime = new Date();
const heIL = new Intl.Locale('he-IL', {hourCycle: 'h12'});
title.textContent = title.textContent + ' ' + dateTime.toLocaleString(heIL);