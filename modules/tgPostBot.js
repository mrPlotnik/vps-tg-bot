const TelegramBot = require('node-telegram-bot-api');
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль

// Подключение всех токенов, все ID
const config = require('./config.js');

// Опции telegram ботов
const options = { polling: true };

const postBot = new TelegramBot(config.postBotToken, options);

function tgPostBotRun() {

    postBot.on('message', msg => {
        // Текст сообщения. Приводим к нижнему регистру
        const text = msg.text !== undefined ? msg.text.toLowerCase() : undefined;
        // ID чата с пользователем
        const chatId = msg.chat.id;   
        // Имя пользователя
        const first_name = msg.from.first_name;   
    
        // username пользователя для моих уведомлений
        const username = msg.from.username; 

        // console.log(text);
        // console.log(chatId);
        // console.log(first_name);
        // console.log(username);     

        console.log(msg);

    });    

    postBot.sendMessage(config.tgGrounID, 'Дарова');
    
    console.log(`${showDateOrTime.time()} Telegram бот постинга запущены...`);

    return 'Telegram бот постинга что-то возврящает\n';

};

module.exports = tgPostBotRun;