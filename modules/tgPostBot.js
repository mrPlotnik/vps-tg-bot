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

    // console.log(text);
    // console.log(chatId);
    // console.log(firstName);
    // console.log(username);

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

  console.log(`${showDateOrTime.time()} Прослушка telegram бота постинга запущена...`);
}

// Функция для отправки сообщения
async function sendMessage(text, links) {
  // Если ссылки на изображения есть
  if (links) {
    // const media = [
    //   {
    //     type: 'photo', media: './tmp/0.jpg',
    //   },
    //   {
    //     type: 'photo', media: './tmp/1.jpg',
    //   },
    //   {
    //     type: 'photo', media: './tmp/2.jpg',
    //   },
    //   {
    //     type: 'photo', media: './tmp/3.jpg',
    //   },
    //   {
    //     type: 'photo', media: './tmp/4.jpg',
    //   },
    //   {
    //     type: 'photo', media: './tmp/5.jpg', caption: text, parse_mode: 'HTML',
    //   },
    // ];

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
  } else {
    // console.log('Ссылок нет');
    // console.log(`${showDateOrTime.time()} Директории для файлов нет...`);
    await bot.sendMessage(config.tgGroupID, text, { parse_mode: 'HTML' });
    console.log(`${showDateOrTime.time()} Пост опубликован`);
  }
}

module.exports.listenUsers = listenUsers;
module.exports.sendMessage = sendMessage;
