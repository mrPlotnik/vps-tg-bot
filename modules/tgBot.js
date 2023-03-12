/* eslint-disable no-console */
process.env.NTBA_FIX_350 = 1;

const fs = require('fs'); // Библиотека для работы с файловой системой
const TgBot = require('node-telegram-bot-api'); // Библиотека для создания tg бота
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль
const config = require('./config'); // Подключение всех токенов и ID

const options = { polling: true };// Опции telegram ботов

// Создаем экземпляр бота
const bot = new TgBot(config.tgPostBotToken, options);

// Прослушка пользователей
async function listenUsers() {
  // Прослушимаем сообщения группы
  bot.on('message', (msg) => {
    // Текст сообщения. Приводим к нижнему регистру
    const text = msg.text !== undefined ? msg.text.toLowerCase() : undefined;
    // ID чата с пользователем
    const chatId = msg.chat.id;
    // Имя пользователя
    const { firstName } = msg.from;
    // ID темы группы
    let messageThreadId = 'supergroup';
    // Название темы группы
    let topicName = 'supergroup';

    if (msg.messageThreadId !== undefined) {
      messageThreadId = msg.messageThreadId;
      topicName = msg.reply_to_message.forum_topic_created.name;
    }

    // username пользователя для моих уведомлений
    const { username } = msg.from;

    console.log(`${showDateOrTime.time()} messageThreadId = ${messageThreadId}`);
    console.log(`${showDateOrTime.time()} topicName = ${topicName}`);

    return {
      text,
      chatId,
      firstName,
      messageThreadId,
      topicName,
      username,
    };
  });

  // bot.sendMessage(config.tgGroupID, 'Дарова', { messageThreadId: 48 });
  // bot.sendMessage(config.tgGroupID, 'Дарова');

  console.log(`${showDateOrTime.time()} Прослушка telegram бота постинга запущена...`);
}

async function noticeMessage(text) {
  await bot.sendMessage(config.myChatId, text);
}

// Функция для отправки сообщения
async function sendMessage(text, links) {
  // Если ссылки на изображения есть
  if (links) {
    const media = [];
    // Создаем массив для отправки
    links.forEach((x, i) => {
      media.push({
        type: 'photo',
        media: `./tmp/${i}.jpg`,
      });
    });

    media[media.length - 1].caption = text;
    media[media.length - 1].parse_mode = 'HTML';

    // https://core.telegram.org/bots/api#sendmediagroup
    // Отправляем сообщение в группу
    await bot.sendMediaGroup(config.tgGroupID, media);

    // Рекурсивное удаление директории
    fs.rm(config.tempDir, { recursive: true }, (err) => {
      if (err) throw err;
      console.log(`${showDateOrTime.time()} ${config.tempDir} is deleted!`);
    });
    // Отправить мне уведомление
    await noticeMessage('Новый пост!');
  } else {
    await bot.sendMessage(config.tgGroupID, text, { parse_mode: 'HTML' });
    // Отправить мне уведомление
    await noticeMessage('Новый пост!');
  }
}

module.exports.listenUsers = listenUsers;
module.exports.sendMessage = sendMessage;
module.exports.noticeMessage = noticeMessage;
