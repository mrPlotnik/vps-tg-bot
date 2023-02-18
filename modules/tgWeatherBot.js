const TelegramBot = require('node-telegram-bot-api');
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль

// Подключение всех токенов, все ID
const config = require('./config');

// Опции telegram ботов
const options = { polling: true };

// Создаем telegram ботов
const weatherBot = new TelegramBot(config.testBotToken, options);
const noticeBot = new TelegramBot(config.noticeTestBotToken, options);

// Запускаем бота погоды
async function tgBotRun() {
  weatherBot.on('message', async (msg) => {
    // Текст сообщения. Приводим к нижнему регистру
    const text = msg.text !== undefined ? msg.text.toLowerCase() : undefined;
    // ID чата с пользователем
    const chatId = msg.chat.id;
    // Имя пользователя
    const { firstName } = msg.from;

    // username пользователя для моих уведомлений
    const { username } = msg.from;

    weatherBot.setMyCommands([
      { command: '/start', description: 'Начальное приветствие' },
      { command: '/weather', description: 'Узнать погоду' },
    ]);

    if (text === '/start') {
      noticeBot.sendMessage(config.vkMyChatId, `Чел с ником @${username}, chat_id = ${chatId}\nстартанул бота погоды`);
      return weatherBot.sendMessage(config.chatId, `Дарова, ${firstName}! Этот бот показывает погоду в Юрге. Так-то! :)`);
    }

    async function getWeather() {
      const URL = 'https://api.weather.yandex.ru/v2/forecast?';
      const lat = '55.703805325125415';
      const lon = '84.90924910742024';
      const lang = 'ru';
      const apiUrl = await fetch(`${URL}lat=${lat}&lon=${lon}&lang=${lang}`, {
        headers: { 'X-Yandex-API-Key': config.weatherToken },
      });

      const data = await apiUrl.json();

      const { temp } = data.fact;
      const { feelsLike } = data.fact;

      return { temp, feelsLike };
    }

    if (text === '/weather') {
      const data = await getWeather();
      const { temp } = data;
      const { feelsLike } = data;

      noticeBot.sendMessage(config.vkMyChatId, `Чел с ником @${username} чекнул погоду`);
      return weatherBot.sendMessage(chatId, `Температура в Юрге ${temp}\nОщущается как ${feelsLike}\n`);
    }

    noticeBot.sendMessage(config.vkMyChatId, `Чел с ником @${username} что-то написал боту погоды`);
    weatherBot.sendMessage(config.chatId, 'Я тебя не понимаю, используй команды!');

    return '';
  });

  console.log(`${showDateOrTime.time()} Telegram бот погоды запущены...`);

  return 'Telegram бот погоды что-то возврящает\n';
}

module.exports = tgBotRun;
