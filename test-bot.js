// Библиотеки
const fs = require("fs");
require('dotenv').config();
const axios = require('axios').default;
const { VK } = require('vk-io');
const TelegramBot = require('node-telegram-bot-api');

const showDateOrTime =  require('./helpers/showDataOrTime');
const { url } = require("inspector");

// Токен запроса погоды
const weatherToken = process.env.WEATHER_TOKEN;

// Токен тестового telegram бота погоды
const testBotToken = process.env.TG_TEST_BOT_TOKEN;
// Токен тестового telegram бота уведомлений
const noticeTestBotToken = process.env.TG_NOTICE_TEST_BOT_TOKEN;
// Токен VK Анохиной
const vkAnohinaUserToken = process.env.VK_ANOHINA_USER_TOKEN
// ID группы куплю/продам
const vkGroupID = process.env.VK_GROUP_ID

// Мой telegram
const myChatId = process.env.MY_CHAT_ID;

// Опции telegram ботов
const options = { polling: true };

// Запускаем telegram ботов
const weatherBot = new TelegramBot(testBotToken, options);
const noticeBot = new TelegramBot(noticeTestBotToken, options);
const vk = new VK({ token: vkAnohinaUserToken });

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
        noticeBot.sendMessage(myChatId, `Чел с ником @${username}, chat_id = ${chatId}\nстартанул бота погоды`);
        return weatherBot.sendMessage(chatId, `Дарова, ${first_name}! Этот бот показывает погоду в Юрге. Так-то! :)`)
    };

    if (text === '/weather') {
        const data = await getWeather();
        const temp = data.temp;
        const feels_like = data.feels_like;
        
        noticeBot.sendMessage(myChatId, `Чел с ником @${username} чекнул погоду`);
        return weatherBot.sendMessage(chatId, `Температура в Юрге ${temp}\nОщущается как ${feels_like}\n`)
    };
    
    noticeBot.sendMessage(myChatId, `Чел с ником @${username} что-то написал боту погоды`);
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



let currentOffset = 0;

vkPostGet();

// Берем посты со стены группы VK 
async function vkPostGet() {      
    post = await vk.api.wall.get ({       
        owner_id: vkGroupID, // идентификатор сообщества
        offset: currentOffset, // смещение     
        count: 1, // сколько записей получаем     
        extended: 1, // доп поля
    });        
    
    // Если это Анохина, 
    if (post.profiles[0].id === 330397077) {                 
        console.log(`${showDateOrTime.time()} Это ${post.profiles[0].last_name}, пропускаем`);  
        // то смещаем подмножество и рекурсивно вызываем еще
        currentOffset++;    
        vkPostGet();              
    };

    

    // if (err) return console.log(err);
    // fs.writeFile("hello.png", body, "binary", (err) => {
    //     if (err) return console.log(err);
    //     console.log("The file was saved!");
    // });

    const userID = post.profiles[0].id;
    const firstName = post.profiles[0].first_name;
    const lastName = post.profiles[0].last_name;
    // const text = post.items[0].text;;
    const attachPhotoLinks = getPhotoLinks();

    function getPhotoLinks() {
        const attachPhoto = post.items[0].attachments.filter((e) => e.type === 'photo');
        const links = attachPhoto.map((e) => e.photo.sizes.find((el) => el.type === 's').url);
        return links;
    } 

    function downloadFile(urls, path) {      
        console.log(urls);
        axios({
            method: 'get',
            url: urls,
            responseType: 'stream'
        })
            .then(function (response) {
                response.data.pipe(fs.createWriteStream('something.jpg'));
            })
            .catch(function (error) {                
                console.log(error);
            });
    }
       
    downloadFile(attachPhotoLinks[0], '1.jpg');
        

    console.log(`${showDateOrTime.time()} userID = ${userID}`);
    console.log(`${showDateOrTime.time()} firstName = ${firstName}`);
    console.log(`${showDateOrTime.time()} lastName = ${lastName}`);
    // console.log(`${showDateOrTime.time()} Текст = ${text}`);
    // console.log(`${showDateOrTime.time()} Фотки = ${attachPhotoLinks}`);
};
