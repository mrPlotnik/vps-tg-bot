const TelegramBot = require('node-telegram-bot-api');
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль

// Подключение всех токенов, все ID
const config = require('./config.js');

// Опции telegram ботов
const options = { polling: true };

// Создаем telegram ботов
const weatherBot = new TelegramBot(config.testBotToken, options);
const noticeBot = new TelegramBot(config.noticeTestBotToken, options);


// Запускаем бота погоды
async function tgBotRun() {
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
            noticeBot.sendMessage(config.vkMyChatId, `Чел с ником @${username}, chat_id = ${chatId}\nстартанул бота погоды`);
            return weatherBot.sendMessage(config.chatId, `Дарова, ${first_name}! Этот бот показывает погоду в Юрге. Так-то! :)`)
        };
    
        if (text === '/weather') {
            const data = await getWeather();
            const temp = data.temp;
            const feels_like = data.feels_like;
            
            noticeBot.sendMessage(config.vkMyChatId, `Чел с ником @${username} чекнул погоду`);
            return weatherBot.sendMessage(chatId, `Температура в Юрге ${temp}\nОщущается как ${feels_like}\n`)
        };
        
        noticeBot.sendMessage(config.vkMyChatId, `Чел с ником @${username} что-то написал боту погоды`);
        weatherBot.sendMessage(config.chatId, `Я тебя не понимаю, используй команды!`);
    
        async function getWeather() {
            const URL = 'https://api.weather.yandex.ru/v2/forecast?';
            const lat = '55.703805325125415';
            const lon = '84.90924910742024';
            const lang = 'ru';
            const apiUrl = await fetch(`${URL}lat=${lat}&lon=${lon}&lang=${lang}`, {
                headers: { 'X-Yandex-API-Key': config.weatherToken }
            })
            
            const data = await apiUrl.json();  
        
            const temp = data.fact.temp;
            const feels_like = data.fact.feels_like;
        
            return { temp, feels_like };
        }    
        
    });

    console.log(`${showDateOrTime.time()} Telegram бот погоды запущены...`);

    return 'Telegram бот погоды что-то возврящает\n';
}

module.exports = tgBotRun;