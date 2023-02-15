// Подключение всех токенов, все ID
const config = require('./modules/config.js');
// Вывод времени в консоль
const showDateOrTime = require('./helpers/showDataOrTime'); 

// Бот VK
const vkGetLastPost = require('./modules/vkGetLastPost.js')
// Бот Telegram Погода
const tgWeatherBot = require('./modules/tgWeatherBot.js')
// Бот Telegram Постер
const tgPostBot = require('./modules/tgPostBot.js')

run();

async function run() {
    
    const tgWeatherBotData = await tgWeatherBot();
    console.log(`${showDateOrTime.time()} ${tgWeatherBotData}`);

    const pData = await vkGetLastPost();
    console.log('');
    console.log(`${showDateOrTime.time()} userID = ${pData.userID}`);
    console.log(`${showDateOrTime.time()} firstName = ${pData.firstName}`);
    console.log(`${showDateOrTime.time()} lastName = ${pData.lastName}`);
    console.log(`${showDateOrTime.time()} Текст = \n${pData.text}`);
    console.log('');

    //
    const messageText = `${pData.text}
<a href='https://vk.com/id${pData.userID}'>${pData.firstName} ${pData.lastName}</a>`;

    //
    await tgPostBot.sendMessage(messageText);

    //
    await tgPostBot.deleteDir(config.tempDir);

};

