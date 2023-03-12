/* eslint-disable no-console */
// Библиотеки
const fs = require('fs');
const axios = require('axios').default;
const { VK } = require('vk-io');
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль

// Подключение всех токенов, все ID
const config = require('./config');

// Создаем VK бота
const vk = new VK({ token: config.vkAnohinaUserToken });

// Берем посты со стены группы vk
async function getLastPost() {
  // Берем один пост из vk
  const post = await vk.api.wall.get({
    owner_id: config.vkGroupID, // идентификатор сообщества
    count: 1, // сколько записей получаем
    extended: 1, // дополнительные поля
  });

  // Если это Анохина или еще кто-то,
  if (post.profiles[0].id === config.vkAnohinaID) {
    console.log(`${showDateOrTime.time()} Это ${post.profiles[0].last_name}, пропускаем`);
  }

  // Hash
  const { hash } = post.items[0];
  // ID пользователя VK
  const userID = post.items[0].signer_id;
  // Вложения
  const allAttach = post.items[0].attachments;
  const allAttachLength = allAttach.length;
  // Текст поста
  const tempText = post.items[0].text ? post.items[0].text : '';

  // Имя пользователя VK
  const firstName = post.profiles.find((x) => x.id === userID).first_name;
  // Фамилия пользователя VK
  const lastName = post.profiles.find((x) => x.id === userID).last_name;
  // Текст поста. Обрезаем до звездочки, убираем пробелы
  const text = tempText.split('**')[0].trim();

  function getMaxPhotoSize(sizes) {
    // console.log(sizes);
    let maxPhotoSize = 0;
    let maxPhoto = null;

    sizes.forEach((x) => {
      if (x.width > maxPhotoSize) {
        maxPhotoSize = x.width;
        maxPhoto = x.url;
      }
    });
    return maxPhoto;
  }

  //
  function getPhotoLinks() {
    if (allAttachLength) {
      const attachPhoto = allAttach.filter((e) => e.type === 'photo');
      const links = [];
      attachPhoto.forEach((x) => {
        links.push(getMaxPhotoSize(x.photo.sizes));
      });
      return links;
    } return false;
  }

  // Определяем ссылки изображений поста
  const photoLinks = getPhotoLinks();

  return {
    userID,
    firstName,
    lastName,
    text,
    photoLinks,
    hash,
  };
}

// Записываем изображения в директорию хоста
async function downloadFiles(photoLinks) {
  // Записываем скачанный файл в директорию
  async function writeStream(urls, param, index) {
    await axios({
      method: 'get',
      url: urls,
      responseType: 'stream',
    })
      .then(async (response) => {
        const wStream = response.data.pipe(fs.createWriteStream(`${config.tempDir}/${index}.jpg`));

        // Дожидаемся конца потока
        await new Promise((resolve, reject) => {
          wStream.on('finish', resolve);
          wStream.on('error', reject);
        });
      })
      .catch(() => {
        console.log('Ошибка axios');
      });

    // этот вывод в консоль покажет порядок скачивания
    // console.log(`${showDateOrTime.time()} ${index + 1}й файл ${param}`);
    return new Promise((resolve) => { resolve('скачан'); });
  }

  // Итерируемся по массиву
  // По цепочке запускаем следующий downloadFile из метода then
  // Promise.resolve(), в качестве значения по-умолчанию, используем для первой итерации,
  // когда никакого обещания(Promise) у нас еще нет
  await photoLinks.reduce((acc, item, index) => acc
    .then((param) => writeStream(item, param, index)), Promise.resolve('скачан'));
}

// Сохраняем изображения
async function download(photoLinks) {
  // Создаем директорию
  fs.mkdirSync(config.tempDir);
  // Скачиваем все файлы по ссылкам
  await downloadFiles(photoLinks);
  // console.log(await fs.promises.readdir('./tmp'));
  console.log(`${showDateOrTime.time()} VK файлы скачаны...`);
}

module.exports.getLastPost = getLastPost;
module.exports.download = download;
