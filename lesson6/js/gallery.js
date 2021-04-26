const seedMin = 1;
const seedMax = 3;

/*
 От Кирилла - не очень понял смысл первого задания,
  в итоге решил, что должно обрабатываться событие
  ошибки загрузки изображения.
  Ниже обработчик ошибки.
  Создаем элемент с текстом ошибки и дописываем его к
  блоку-родителю изображения.
  Проверял, заблокировав доступ к сайту picsum.photos
  через брандмауэр
*/

function alertError () {
    const errorMsg = document.createElement("div");
    errorMsg.innerHTML = "<p>Произошла ошибка при загрузке изображения! Возможно указанный файл отсутствует на сервере.</p>";
    this.parentNode.appendChild(errorMsg);
}

function openImage(event) {

    /* получаем div элемент галерии */
    const gallery = document.getElementsByClassName("gallery-large-img")[0];

    /* От Кирилла - для слайдера в 3 задании записываем seed текущей картинки */

    const currentSeed = gallery.querySelectorAll('[data-seed]')[0].dataset.seed;

    /* очищаем галерею */
    gallery.innerHTML = "";

    /* получаем пораждающий событие объект
        От Кирилла - для 3 задания, поскольку в кнопках есть внутренние элементы - 
        текст - обрабатываем всплытие, обработка события click должна
        срабатывать не для текста кнопки, а для всей кнопки.
    */
    const target = this;

    /* получаем data-атрибут с номером картинки */
    let seed = target.dataset.seed;

    /* если номер пустой, то прерываем выполнение */
    if (!seed) {
        /*
            От Кирилла - если событие сработало на кнопках слайдера,
            у которых нет data-seed, обрабатываем возможные действия.
            Для кнопки previous уменьшаем значение seed, либо, если 
            достигнуто минимальное значение меняем его на максимальное
        */
        if (target.className === "gallery__button") {
            if (target.id === "gallery-previous") {
                if (parseInt(currentSeed) === seedMin) {
                    seed = seedMax;
                } else {
                    seed = parseInt(currentSeed) - 1;
                }
        /* Для кнопки next обратные действия  */
            } else {
                if (parseInt(currentSeed) === seedMax) {
                    seed = seedMin;
                } else {
                    seed = parseInt(currentSeed) + 1;
                }
            }
        } else return;
    }

    /* создаем картинку */
    const image = document.createElement("img");

    /* От Кирилла - добавляем обработчик события ошибки загрузки*/
    image.addEventListener('error', alertError);

    /* добавляем атрибуты к картинке */
    image.id = `image-${seed}`;
    image.src = `https://picsum.photos/seed/${seed}/800`;
    image.alt = `Изображение ${seed}`;
    image.dataset.seed = seed;

    /* добавляем новый блок в галерею */
    gallery.appendChild(image);
}

function galleryInit() {
    const images = document.querySelectorAll(".thumbnails > img");
    const galleryButtons = document.querySelectorAll(".gallery__button");

    for (let image of images) {
        image.addEventListener('click', openImage);
    }

    for (let button of galleryButtons) {
        button.addEventListener("click", openImage);
    }
}

window.addEventListener('load', galleryInit);