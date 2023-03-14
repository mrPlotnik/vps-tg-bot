/* eslint-disable no-console */
const showDateOrTime = require('./helpers/showDataOrTime'); // Вывод времени в консоль
const { foundWord } = require('./helpers/exceptionWords');
const config = require('./modules/config');// Подключение всех токенов, все ID
const vkBot = require('./modules/vkBot'); // Бот vk
const tgBot = require('./modules/tgBot'); // Бот tg "Постер"

let lastPostHash = ''; // Для проверки уникальности поста

// Прослушка пользователей
// tgBot.listenUsers();

async function startBots() {
  // Берем пост из vk
  const post = await vkBot.getLastPost();

  // Текст поста
  let { text } = post;

  // Проверка, что это не тот же самый пост
  if (lastPostHash === post.hash) {
    console.log(`${showDateOrTime.time()} Тот же самый пост`);
  } else {
    lastPostHash = post.hash;

    // Проверяем на слова-исключения
    const exeptionWord = await foundWord(text);

    // Если слов-исключений нет
    if (exeptionWord.length === 0) {
      // Если длина текста превышает допустимое количесво символов
      if (text.length > config.symbols) {
        // То обрезаем текст
        text = `${text.slice(0, config.symbols)} (...)`;
      }

      // Если есть изображения
      if (post.photoLinks) {
        // То скачиваем их
        await vkBot.download(post.photoLinks);
      }

      // Формируем для tg текст поста
      const messageText = `${text}\n<a href='https://vk.com/id${post.userID}'>${post.firstName} ${post.lastName}</a>`;

      // Постим в tg
      await tgBot.sendMessage(messageText, post.photoLinks);
    } else {
      // Если есть слова исключение, отправляем уведомление
      console.log(exeptionWord);
      await tgBot.noticeMessage(`Не прошло, искл: ${exeptionWord.join(', ')}.`);
    }
  }
}

async function run() {
  await startBots();
  setInterval(startBots, config.interval);
}

run();
