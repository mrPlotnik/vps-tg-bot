const showDateOrTime = require('./helpers/showDataOrTime'); // Вывод времени в консоль
const vkBot = require('./modules/vkGetLastPost'); // Бот vk
const tgBot = require('./modules/tgPostBot'); // Бот tg "Постер"

const interval = 30000; // 60000 миллисекунд = 1 минута

let lastPostText = ''; // Для проверки уникальности поста

// Прослушка пользователей
// await tgBot.listenUsers();

setInterval(async () => {
  // Берем пост из vk
  const data = await vkBot.getLastPost();

  let { text } = data;

  if (text.length > 970) {
    text = `${text.slice(0, 970)} (...)`;
  }

  // Формируем для tg текст для поста
  const messageText = `${text}\n<a href='https://vk.com/id${data.userID}'>${data.firstName} ${data.lastName}</a>`;

  // Проверка, что это не тот же самый пост
  if (lastPostText === messageText) {
    console.log(`${showDateOrTime.time()} Тот же самый пост`);

  // Если пост уникальный
  } else {
    lastPostText = messageText;

    // Если есть изображения, то скачиваем их
    if (data.photoLinks) {
      await vkBot.download(data.photoLinks);
    }

    // Постим в tg
    await tgBot.sendMessage(messageText, data.photoLinks);
  }
}, interval);
