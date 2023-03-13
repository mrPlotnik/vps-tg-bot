/* eslint-disable no-console */
// Библиотеки
const fs = require('fs');
const config = require('../modules/config'); // Подключение всех токенов и IDconst showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль
const showDateOrTime = require('./showDataOrTime'); // Вывод времени в консоль

module.exports = {
  // Рекурсивное удаление директории
  async deleteDir() {
    fs.stat(config.tempDir, (err) => {
      if (!err) {
        fs.rmSync(config.tempDir, { recursive: true });
        console.log(`${showDateOrTime.time()} ${config.tempDir} is deleted!`);
      }
    });
  },

  // Создание директории
  async createDir() {
    fs.mkdirSync(config.tempDir, { recursive: true }, (err) => {
      if (err) {
        console.log('Ошибка!');
        // console.log(err.code);
      }
    });
  },

  // Скачивание файлов
  async downloadImgs(response, index) {
    const wStream = response.data.pipe(fs.createWriteStream(`${config.tempDir}/${index}.jpg`));
    // Дожидаемся конца потока
    await new Promise((resolve, reject) => {
      wStream.on('finish', resolve);
      wStream.on('error', reject);
    });
  },
};
