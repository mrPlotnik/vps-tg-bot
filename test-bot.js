// Библиотеки
const fs = require('fs');
require('dotenv').config();
const axios = require('axios').default;
const { VK } = require('vk-io');
const TelegramBot = require('node-telegram-bot-api');

// Подключение всех токенов, все ID
const config = require('./modules/config.js');

// Вывод времени в консоль
const showDateOrTime =  require('./helpers/showDataOrTime');

// Опции telegram ботов
const options = { polling: true };

// Создаем telegram ботов
const weatherBot = new TelegramBot(config.testBotToken, options);
const noticeBot = new TelegramBot(config.noticeTestBotToken, options);
// Создаем VK бота
const vk = new VK({ token: config.vkAnohinaUserToken });

// Запускаем бота погоды
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





let currentOffset = 0;

vkPostGet();

// Берем посты со стены группы VK 
async function vkPostGet() {      

    // Опрашиваем стену сообщества
    post = await vk.api.wall.get ({       
        owner_id: config.vkGroupID, // идентификатор сообщества
        offset: currentOffset, // смещение     
        count: 1, // сколько записей получаем     
        extended: 1, // дополнительные поля
    });        
    
    // Если это Анохина или еще кто-то,
    if (post.profiles[0].id === config.vkAnohinaID) {                 
        console.log(`${showDateOrTime.time()} Это ${post.profiles[0].last_name}, пропускаем`);  
        // то смещаем подмножество и рекурсивно вызываем еще
        currentOffset++;    
        vkPostGet();              
    }; 

    // Директория для файлов VK
    const dir = 'tmp';
    // ID пользователя VK
    const userID = post.profiles[0].id;
    // Имя пользователя VK
    const firstName = post.profiles[0].first_name;
    // Фамилия пользователя VK
    const lastName = post.profiles[0].last_name;
    
    // Проверяем наличие директории
    if (fs.existsSync(dir)) {
        console.log(`${showDateOrTime.time()} Директория есть`);
    } else {
        console.log(`${showDateOrTime.time()} Директории нет, создаю...`);
        fs.mkdirSync(dir);  
        downloadFiles();     
    }            

    // Записываем файл в директорию хоста 
    async function downloadFiles() {

        // Ссылки файлов поста VK
        const fileLinks = await getPhotoLinks();

        // 
        reduceWay((result) => {
            console.log(`Итог: ${result}`);
        });

        // Определяем ссылки файлов поста
        async function getPhotoLinks() {
            const attachPhoto = post.items[0].attachments.filter((e) => e.type === 'photo');
            const links = attachPhoto.map((e) => e.photo.sizes.find((el) => el.type === 's').url);
            return links;
        }   

        // 
        function reduceWay(callback) {
            // Итерируемся по массиву
            // По цепочке запускаем следующий downloadFile из метода then
            // Promise.resolve(), в качестве значения по-умолчанию, используем для первой итерации, 
            // когда никакого обещания(Promise) у нас еще нет
            fileLinks.reduce((acc, item, index) => acc           
                .then((param) => downloadFile(item, param, index)), Promise.resolve(`1й выполнен`))
                .then((result) => { callback(result); });
        };                
        
        // Записываем скаченный файл в директорию
        async function downloadFile(urls, param, index) {              
            // GET-запрос для файла
            await axios({
                method: 'get',
                url: urls,
                responseType: 'stream'
            })
                .then((response) => { 
                    response.data.pipe(fs.createWriteStream(`${dir}/${index}.jpg`));
                })
                .catch((error) => {                
                    console.log(error);
                });        
    
            // этот вывод в консоль покажет порядок вызовов
            console.log(`${index + 1}й запрос ${param}`);
            return new Promise((resolve) => { resolve('выполнен'); });   
        };   

    };

    
      
    
    
    // fs.rmdirSync('tmp', err => {
    //     if(err) throw err; // не удалось удалить папку
    //     console.log('Папка успешно удалена');
    // });
        

    console.log(`${showDateOrTime.time()} userID = ${userID}`);
    console.log(`${showDateOrTime.time()} firstName = ${firstName}`);
    console.log(`${showDateOrTime.time()} lastName = ${lastName}`);
    // console.log(`${showDateOrTime.time()} Текст = ${text}`);
    // console.log(`${showDateOrTime.time()} Фотки = ${attachPhotoLinks}`);
};
