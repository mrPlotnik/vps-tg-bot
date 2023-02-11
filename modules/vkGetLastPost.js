// Библиотеки
const { Console } = require('console');
const fs = require('fs');
const axios = require('axios').default;
const { VK } = require('vk-io');
const showDateOrTime = require('../helpers/showDataOrTime'); // Вывод времени в консоль


// Подключение всех токенов, все ID
const config = require('./config.js');

// Создаем VK бота
const vk = new VK({ token: config.vkAnohinaUserToken });

let currentOffset = 0;

// Берем посты со стены группы VK 
async function vkGetLastPost() {    
    
    console.log(`${showDateOrTime.time()} VK бот запущен...`);

    // Опрашиваем стену сообщества
    post = await vk.api.wall.get ({       
        owner_id: config.vkGroupID, // идентификатор сообщества
        offset: currentOffset, // смещение     
        count: 1, // сколько записей получаем     
        extended: 1, // дополнительные поля
    });        
    
    // Если это Анохина или еще кто-то,
    if (post.profiles[0].id === config.vkAnohinaID) {                 
        console.log(`${showDateOrTime.time()} Это ${post.profiles[0].last_name}, пропускаем`);  
        // то смещаем подмножество и рекурсивно вызываем еще
        currentOffset++;    
        vkGetLastPost();       
        currentOffset = 0;       
    }; 


    // Директория для файлов VK
    const dir = 'tmp';
    // ID пользователя VK
    const userID = post.profiles[0].id;
    // Имя пользователя VK
    const firstName = post.profiles[0].first_name;
    // Фамилия пользователя VK
    const lastName = post.profiles[0].last_name;
    // Фамилия пользователя VK
    const text = post.items[0].text;
    
    // Проверяем наличие директории
    if (fs.existsSync(dir)) {
        console.log(`${showDateOrTime.time()} Директория для файлов есть`);
    } else {
        console.log(`${showDateOrTime.time()} Директории для файлов нет, создаю...`);
        fs.mkdirSync(dir);  
        downloadFiles();     
    }            

    // Записываем файл в директорию хоста 
    async function downloadFiles() {

        // Ссылки файлов поста VK
        const fileLinks = await getPhotoLinks();

        // 
        reduceWay((result) => {
            console.log(`Итог: ${result}`);
        });

        // Определяем ссылки файлов поста
        async function getPhotoLinks() {
            const attachPhoto = post.items[0].attachments.filter((e) => e.type === 'photo');
            const links = attachPhoto.map((e) => e.photo.sizes.find((el) => el.type === 's').url);
            return links;
        }   

        // 
        function reduceWay(callback) {
            // Итерируемся по массиву
            // По цепочке запускаем следующий downloadFile из метода then
            // Promise.resolve(), в качестве значения по-умолчанию, используем для первой итерации, 
            // когда никакого обещания(Promise) у нас еще нет
            fileLinks.reduce((acc, item, index) => acc           
                .then((param) => downloadFile(item, param, index)), Promise.resolve(`1й выполнен`))
                .then((result) => { callback(result); });
        };                
        
        // Записываем скаченный файл в директорию
        async function downloadFile(urls, param, index) {              
            // GET-запрос для файла
            await axios({
                method: 'get',
                url: urls,
                responseType: 'stream'
            })
                .then((response) => { 
                    response.data.pipe(fs.createWriteStream(`${dir}/${index}.jpg`));
                })
                .catch((error) => {                
                    console.log(error);
                });        
    
            // этот вывод в консоль покажет порядок вызовов
            console.log(`${index + 1}й запрос ${param}`);
            return new Promise((resolve) => { resolve('выполнен'); });   
        };   

        console.log(`${showDateOrTime.time()} VK файлы скачаны...`);

    };    
    
    // fs.rmdirSync('tmp', err => {
    //     if(err) throw err; // не удалось удалить папку
    //     console.log('Папка успешно удалена');
    // }); 

    return {
        userID,
        firstName,
        lastName,
        text
    }

};

module.exports = vkGetLastPost;