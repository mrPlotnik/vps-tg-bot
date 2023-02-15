process.env["NTBA_FIX_350"] = 1;

const fs = require('fs');

const TelegramBot = require('node-telegram-bot-api');
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль

// Подключение всех токенов, все ID
const config = require('./config.js');

// Опции telegram ботов
const options = { polling: true };

const postBot = new TelegramBot(config.postBotToken, options);

async function listenUsers() {
    
    // Прослушимаем сообщения группы
    postBot.on('message', msg => {
        // Текст сообщения. Приводим к нижнему регистру
        const text = msg.text !== undefined ? msg.text.toLowerCase() : undefined;
        // ID чата с пользователем
        const chatId = msg.chat.id;   
        // Имя пользователя
        const first_name = msg.from.first_name;   
        // ID темы группы
        let message_thread_id = 'supergroup';
        // Название темы группы
        let topic_name = 'supergroup';        

        if (msg.message_thread_id !== undefined) {           
            message_thread_id = msg.message_thread_id;
            topic_name = msg.reply_to_message.forum_topic_created.name;
        }
        
        // username пользователя для моих уведомлений
        const username = msg.from.username; 

        // console.log(text);
        // console.log(chatId);
        // console.log(first_name);
        // console.log(username);     

        // console.log(`${showDateOrTime.time()} message_thread_id = ${message_thread_id}`);
        // console.log(`${showDateOrTime.time()} topic_name = ${topic_name}`);

        return {
            text,
            chatId,
            first_name,
            message_thread_id,
            topic_name,
            username
        }

    });    

    // postBot.sendMessage(config.tgGroupID, 'Дарова', { message_thread_id: 48});    

    console.log(`${showDateOrTime.time()} Прослушка telegram бота постинга запущена...`);

}

async function sendMessage(text) {   


  
    fs.access("./tmp/0.jpg", function(error){
        if (error) {
            console.log("Файл не найден");
        } else {
            console.log("Файл найден");

            const photo = './tmp/0.jpg';

            postBot.sendPhoto(config.tgGroupID, photo, {
                caption: text
            });

        }
    });
    
    
     
}
    

module.exports.listenUsers = listenUsers;
module.exports.sendMessage = sendMessage;