// Подключение всех токенов, все ID
const config = require('./modules/config');
// Вывод времени в консоль
const showDateOrTime = require('./helpers/showDataOrTime');

// Бот VK
const vkGetLastPost = require('./modules/vkGetLastPost');
// Бот Telegram "Постер"
const tgPostBot = require('./modules/tgPostBot');

const interval = 60000; // 60000 миллисекунд = 1 минута

let lastPostText = '';

// Прослушка пользователей
// await tgPostBot.listenUsers();

async function rePoster() {
  console.log(`${showDateOrTime.time()} Запустил (снова) rePoster`);

  setInterval(async () => {
    // Берем пост из vk
    const pData = await vkGetLastPost();

    // if (pData.text === '') {
    //   console.log('pro');
    // }

    // Формируем для tg текст для поста
    const messageText = `${pData.text}<a href='https://vk.com/id${pData.userID}'> ${pData.firstName} ${pData.lastName}</a>`;

    // Проверка, что это не тот же самый пост
    if (lastPostText === messageText) {
      console.log(`${showDateOrTime.time()} Тот же самый пост`);
      rePoster();
    } else {
      lastPostText = messageText;
      // Постим в tg
      await tgPostBot.sendMessage(messageText);
      console.log(`${showDateOrTime.time()} Пост опубликован`);
    }
    // Очищаем временную папкe для изображений
    await tgPostBot.deleteDir(config.tempDir);
  }, interval);
}

rePoster();
