require('dotenv').config();
// tg токен бота постинга в группу "Куплю Продам"
const tgPostBotToken = process.env.TG_POST_BOT_TOKEN;
// id группы "Куплю Продам" в tg
const tgGroupID = process.env.TG_GROUP_ID;

const myChatId = process.env.MY_CHAT_ID;

// vk id Анохиной
const vkAnohinaID = process.env.VK_ID_ANOHINA;
// vk токен Анохиной
const vkAnohinaUserToken = process.env.VK_ANOHINA_USER_TOKEN;
// vk id группы куплю/продам
const vkGroupID = process.env.VK_GROUP_ID;

// Куда сохраняем временные файлы
const tempDir = 'tmp';
// Переодичность опроса стены. 60000 миллисекунд = 1 минута
const interval = 30000;
// Обрезка текста. Максимально 1024 символа
const symbols = 970;

module.exports = {
  tgPostBotToken,
  tgGroupID,
  myChatId,
  vkAnohinaID,
  vkAnohinaUserToken,
  vkGroupID,
  tempDir,
  interval,
  symbols,
};
