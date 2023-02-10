// Токен запроса погоды
const weatherToken = process.env.WEATHER_TOKEN;

// Токен тестового telegram бота погоды
const testBotToken = process.env.TG_TEST_BOT_TOKEN;
// Токен тестового telegram бота уведомлений
const noticeTestBotToken = process.env.TG_NOTICE_TEST_BOT_TOKEN;

// VK ID Анохиной
const vkAnohinaID = process.env.VK_ID_ANOHINA
// Токен VK Анохиной
const vkAnohinaUserToken = process.env.VK_ANOHINA_USER_TOKEN
// ID группы куплю/продам
const vkGroupID = process.env.VK_GROUP_ID

// Мой telegram
const vkMyChatId = process.env.MY_CHAT_ID;

module.exports = {
    weatherToken,
    testBotToken,
    noticeTestBotToken,
    vkAnohinaID,
    vkAnohinaUserToken,
    vkGroupID,
    vkMyChatId,
};