
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');

// Токен запроса погоды
const weatherToken = process.env.WEATHER_TOKEN;
// Основной бот погоды
const mainBotToken = process.env.TG_MAIN_BOT_TOKEN;
// Тестовый бот погоды
const testBotToken = process.env.TG_TEST_BOT_TOKEN;
// Бот уведомлений
const noticeBotToken = process.env.TG_NOTICE_BOT_TOKEN;
// Текущий бот погоды
const currentToken = mainBotToken;

// Диалог со мной
const myChatId = process.env.MY_CHAT_ID;
// Максимов
const maksimovUserName = process.env.MAKSIMOV_USER_NAME;
const maksimovChatId = process.env.MAKSIMOV_CHAT_ID;

// Опции бота
const options = { polling: true };

// Запускаем ботов
const weatherBot = new TelegramBot(currentToken, options);
const noticeBot = new TelegramBot(noticeBotToken, options);

cron.schedule('30 03 * * *', async function() {
    const data = await getWeather();
    const temp = data.temp;
    const feels_like = data.feels_like;

    noticeBot.sendMessage(myChatId, `Отправил ${maksimovUserName} шобы вставал`);
    await weatherBot.sendMessage(maksimovChatId, "Спишь? Вставай, ленивая жопа! :)");
    await weatherBot.sendMessage(maksimovChatId, `Температура в Юрге ${temp}\nОщущается как ${feels_like}\n`)
});

weatherBot.on('message', async msg => {
    // Текст сообщения. Приводим к нижнему регистру
    const text = msg.text !== undefined ? msg.text.toLowerCase() : undefined;
    // ID чата с пользователем
    const chatId = msg.chat.id;   
    // Имя пользователя
    const first_name = msg.from.first_name;   

    // username пользователя для моих уведомлений
    const username = msg.from.username;  

    weatherBot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/weather', description: 'Узнать погоду' },
    ]);
    
    if (text === '/start') {
        noticeBot.sendMessage(myChatId, `Чел с ником @${username} ${chatId} стартанул бота погоды`);
        return weatherBot.sendMessage(chatId, `Дарова, ${first_name}! Этот бот показывает погоду в Юрге. Так-то! :)`)
    };

    if (text === '/weather') {
        const data = await getWeather();
        const temp = data.temp;
        const feels_like = data.feels_like;
        
        noticeBot.sendMessage(myChatId, `Чел с ником @${username} ${chatId} чекнул погоду`);
        return weatherBot.sendMessage(chatId, `Температура в Юрге ${temp}\nОщущается как ${feels_like}\n`)
    };
    
    noticeBot.sendMessage(myChatId, `Чел с ником @${username} ${chatId} что-то написал боту погоды`);
    weatherBot.sendMessage(chatId, `Я тебя не понимаю, используй команды!`);
});

async function getWeather() {
    const URL = 'https://api.weather.yandex.ru/v2/forecast?';
    const lat = '55.703805325125415';
    const lon = '84.90924910742024';
    const lang = 'ru';
    const apiUrl = await fetch(`${URL}lat=${lat}&lon=${lon}&lang=${lang}`, {
        headers: { 'X-Yandex-API-Key': weatherToken }
    })
    
    const data = await apiUrl.json();            

    const temp = data.fact.temp;
    const feels_like = data.fact.feels_like;

    return { temp, feels_like };
}
