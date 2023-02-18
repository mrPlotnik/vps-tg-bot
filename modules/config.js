// Токен запроса погоды
const weatherToken = process.env.WEATHER_TOKEN;

// Токен тестового telegram бота погоды
const testBotToken = process.env.TG_TEST_BOT_TOKEN;
// Токен тестового telegram бота уведомлений
const noticeTestBotToken = process.env.TG_NOTICE_TEST_BOT_TOKEN;
// Токен telegram бота постинга в группу
const postBotToken = process.env.TG_POST_BOT_TOKEN;

const tgGroupID = process.env.TG_GROUP_ID;

// VK ID Анохиной
const vkAnohinaID = process.env.VK_ID_ANOHINA;
// Токен VK Анохиной
const vkAnohinaUserToken = process.env.VK_ANOHINA_USER_TOKEN;
// ID группы куплю/продам
const vkGroupID = process.env.VK_GROUP_ID;

// Мой telegram
const vkMyChatId = process.env.MY_CHAT_ID;

const tempDir = 'tmp';

module.exports = {
  weatherToken,
  testBotToken,
  postBotToken,
  tgGroupID,
  noticeTestBotToken,
  vkAnohinaID,
  vkAnohinaUserToken,
  vkGroupID,
  vkMyChatId,
  tempDir,
};
