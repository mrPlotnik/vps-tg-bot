
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const TG_TOKEN = process.env.TG_TOKEN;
const WEATHER_TOKEN = process.env.WEATHER_TOKEN;

console.log(TG_TOKEN);

const bot = new TelegramBot(TG_TOKEN, { polling: true });

bot.on('message', async msg => {
    const text = msg.text.toLowerCase();
    const chatId = msg.chat.id;   
    const first_name = msg.from.first_name;   
    // console.log(msg);

    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/weather', description: 'Узнать погоду' },
    ]);
    
    if (text === '/start') {
        return bot.sendMessage(chatId, `Дарова, ${first_name}! Этот бот показывает погоду в Юрге. Так-то! :)`)
    }

    if (text === '/weather') {
        const URL = 'https://api.weather.yandex.ru/v2/forecast?';
        const lat = '55.703805325125415';
        const lon = '84.90924910742024';
        const lang = 'ru';
        const apiUrl = await fetch(`${URL}lat=${lat}&lon=${lon}&lang=${lang}`, {
            headers: { 'X-Yandex-API-Key': WEATHER_TOKEN }
        })
        
        const data = await apiUrl.json();            

        const temp = data.fact.temp;
        const feels_like = data.fact.feels_like           

        return bot.sendMessage(chatId, `Температура в Юрге ${temp}\nОщущается как ${feels_like}\n`)
    }  

    return bot.sendMessage(chatId, `Я тебя не понимаю, используй команды!`)
});

