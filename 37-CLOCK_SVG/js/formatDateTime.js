'use strict';

// форматирование даты (утилита)
// форматирует дату-время в формате дд.мм.гггг чч:мм:сс
export function formatDateTime(dt) {

    const year=dt.getFullYear();
    const month=dt.getMonth()+1;
    const day=dt.getDate();
    const hours=dt.getHours();
    const minutes=dt.getMinutes();
    const seconds=dt.getSeconds();

    return (
        String(day).padStart(2,"0") + '.' + 
        String(month).padStart(2,"0") + '.' + 
        String(year) + ' ' + 
        String(hours).padStart(2,"0") + ':' + 
        String(minutes).padStart(2,"0") + ':' + 
        String(seconds).padStart(2,"0")
    );
}

// === импорт утилиты ===
// 'use strict';
// import { formatDateTime } from './formatDateTime.js';
