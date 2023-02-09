function getDate(format) {
    var date = new Date(),
        Year = date.getFullYear(),
        Month = date.getMonth(),
        Day = date.getDate(),
        Hour = date.getHours(),
        Minutes = date.getMinutes(),
        Seconds = date.getSeconds(),
        fMonth;
    // Преобразуем месяца   
    switch (Month) {
        case 0: fMonth="января"; break;
        case 1: fMonth="февраля"; break;
        case 2: fMonth="марта"; break;
        case 3: fMonth="апреля"; break;
        case 4: fMonth="мае"; break;
        case 5: fMonth="июня"; break;
        case 6: fMonth="июля"; break;
        case 7: fMonth="августа"; break;
        case 8: fMonth="сентября"; break;
        case 9: fMonth="октября"; break;
        case 10: fMonth="ноября"; break;
        case 11: fMonth="декабря"; break;
    }
    if (format == 'date') return Hour + ":" + Minutes + ":" + Seconds + ' => ';
    else if (format == 'time') return Day + " " + fMonth + " " + Year + " года" + ' => ';
    else return 'Неправильный запрос';
}


module.exports = {
    time: function () {  
        var date = getDate('date');      
        return date;        
    },
    date: function () {      
        var time = getDate('time');       
        return time;        
    }
};