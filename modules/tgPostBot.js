process.env.NTBA_FIX_350 = 1;

const fs = require('fs');

const TelegramBot = require('node-telegram-bot-api');
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль

// Подключение всех токенов, все ID
const config = require('./config');

// Опции telegram ботов
const options = { polling: true };

//
const postBot = new TelegramBot(config.postBotToken, options);

//
async function listenUsers() {
  // Прослушимаем сообщения группы
  postBot.on('message', (msg) => {
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

    // console.log(`${showDateOrTime.time()} messageThreadId = ${messageThreadId}`);
    // console.log(`${showDateOrTime.time()} topicName = ${topicName}`);

    return {
      text,
      chatId,
      firstName,
      messageThreadId,
      topicName,
      username,
    };
  });

  // postBot.sendMessage(config.tgGroupID, 'Дарова', { messageThreadId: 48});

  console.log(`${showDateOrTime.time()} Прослушка telegram бота постинга запущена...`);
}

//
async function sendMessage(text) {
  // Проверяем наличие директории
  if (fs.existsSync(config.tempDir)) {
    console.log(`${showDateOrTime.time()} Директория для файлов есть`);

    const media = [
      {
        type: 'photo', media: './tmp/0.jpg', caption: text, parse_mode: 'HTML',
      },
    ];

    await postBot.sendMediaGroup(config.tgGroupID, media);

    console.log(`${showDateOrTime.time()} Запостил в Telegram...`);
  } else {
    console.log(`${showDateOrTime.time()} Директории для файлов нет...`);
  }
}

//
async function deleteDir() {
  // delete directory recursively
  fs.rm(config.tempDir, { recursive: true }, (err) => {
    if (err) throw err;

    console.log(`${config.tempDir} is deleted!`);
  });
}

module.exports.listenUsers = listenUsers;
module.exports.sendMessage = sendMessage;
module.exports.deleteDir = deleteDir;
