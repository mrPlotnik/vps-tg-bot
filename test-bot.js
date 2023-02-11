// Подключение всех токенов, все ID
const config = require('./modules/config.js');
// Вывод времени в консоль
const showDateOrTime = require('./helpers/showDataOrTime'); 

// Бот VK
const vkGetLastPost = require('./modules/vkGetLastPost.js')
// Бот Telegram
const tgWeatherBot = require('./modules/tgWeatherBot.js')

run();

async function run() {
    const tgBot = await tgWeatherBot();
    console.log(tgBot);

    const postData = await vkGetLastPost();
    console.log('');
    console.log(`${showDateOrTime.time()} userID = ${postData.userID}`);
    console.log(`${showDateOrTime.time()} firstName = ${postData.firstName}`);
    console.log(`${showDateOrTime.time()} lastName = ${postData.lastName}`);
    console.log(`${showDateOrTime.time()} Текст = \n${postData.text}`);
    console.log('');

};

