const GAME_STATUS_STARTED = 'started';
const GAME_STATUS_PAUSED = 'paused';
const GAME_STATUS_STOPPED = 'stopped';

const SNAKE_DIRECTION_UP = 'up';
const SNAKE_DIRECTION_DOWN = 'down';
const SNAKE_DIRECTION_LEFT = 'left';
const SNAKE_DIRECTION_RIGHT = 'right';

/**
 * Объект с настройками конфигурации игры
 */
const config = {
    /**
     * Размер поля.
     */
    size: 20
};

/**
 * Основной объект игры.
 */
const game = {

    /**
     * Функция ищет HTML элемент контейнера игры на странице.
     *
     * @returns {HTMLElement} Возвращает HTML элемент.
     */
    getElement() {
        return document.getElementById('game');
    },

    /**
     * Функция возвращает текущий счет игры
     * @returns {number} возвращает текущий счет
     */
    getScore() {
        let scoreObj = document.getElementById("score-value");
        return Number(scoreObj.innerHTML);
    },

    /**
     * Функция записывает счет игры
     * @param {number} score 
     */
    setScore(score) {
        let scoreObj = document.getElementById("score-value");
        scoreObj.innerHTML = score;
    },

    /**
     * Функция выполняет старт игры.
     */
    start() {
        this.setGameStatus(GAME_STATUS_STARTED);
        /* При начале игры скорость движения минимальная */
        this.repeat = 500;
        /* Включаем реакцию на нажатие клавиш 
           Так как bind передает все время разные ссылки
           на объект функции надо записать ссылку
        */
        this.keydownHandler = this.startMoving.bind(this);
        window.addEventListener('keydown', this.keydownHandler);

        board.render();
        snake.init();
        snake.render();
        food.init();
        food.render();
        /* Обнуляем счет */
        this.setScore(0);
    },

    /**
     * Функция выполняет паузу игры.
     */
    pause() {
        const pauseButton = document.getElementById('button-pause');
        if (this.getGameStatus() === GAME_STATUS_STARTED) {
            this.stopMoving();
            this.setGameStatus(GAME_STATUS_PAUSED);
            window.removeEventListener('keydown', this.keydownHandler);
            pauseButton.innerHTML = "продолжить";
        } else if (this.getGameStatus() === GAME_STATUS_PAUSED) {
            this.setGameStatus(GAME_STATUS_STARTED);
            this.keydownHandler = this.startMoving.bind(this);
            window.addEventListener('keydown', this.keydownHandler);
            pauseButton.innerHTML = "пауза";
            this.startMoving();
        }
    },

    /**
     * Функция останавливает игру.
     */
    stop() {
        this.setGameStatus(GAME_STATUS_STOPPED);
        this.stopMoving();
        board.clear();
        window.removeEventListener('keydown', this.keydownHandler);
    },

    /**
     * Сохраненное значение id для функции setInterval
     * Будет необходимо для приостановки и продолжения игры
     */
    intervalId: null,

    /**
     * Значение delay для setInterval
     * Фактически - скорость движения змейки
     */
    repeat: 500,

    /**
     * Функция уменьшает delay для setInterval
     * Фактически - увеличивается скорость движения змейки
     */
    increaseSpeed() {
        if (this.repeat > 100) {
            this.repeat -= 10;
        }
    },

    /**
     * Функция включает движение змейки
     * @param event {KeyboardEvent} Событие нажатия на клавишу
     * 
     */

    /*
        От Кирилла - здесь попробовал реализовть замыкание, перенес функцию move
        внутрь функции startMoving и хотя далее идет вызов move через
        setInterval, она обращается к контексту startMoving и видит переменную
        event
    */
    startMoving(event) {
        this.stopMoving();
        this.intervalId = window.setInterval(move.bind(this), this.repeat);
        /**
         * Функция выполняет передвижение змейки по полю.
         */
        function move() {
            let direction = null;
            /* Движение возможно как по нажатию на клавишу, 
               так и если не нажата другая клавиша направления
               Если event не пустое
            */
            if (event) {
                /* смотрим на код клавиши и
                * устанавливаем соответсвующее направление движения */
                switch (event.keyCode) {
                    case 38:
                        direction = SNAKE_DIRECTION_UP;
                        break;
                    case 40:
                        direction = SNAKE_DIRECTION_DOWN;
                        break;
                    case 37:
                        direction = SNAKE_DIRECTION_LEFT;
                        break;
                    case 39:
                        direction = SNAKE_DIRECTION_RIGHT;
                        break;
                    default:
                        return;
                }
                /* Иначе сохраняем текущее направление движения */
            } else {
                direction = snake.getDirection();
            }

            /* устанавливаем позицию для змейки
             * и запрашиваем координаты следующей позиции */
            snake.setDirection(direction);
            const nextPosition = snake.getNextPosition();
            //Проверка, не врезалась ли змейка сама в себя
            if (snake.hasPosition(nextPosition)) {
                this.stop();
                return;
            }

            /* проверяем совпадает ли следующая позиция с какой-нибудь едой */
            const foundFood = food.foundPosition(nextPosition);

            /* если найден индекс еды (то есть позиция совпадает) */
            if (foundFood !== -1) {
                /* устанавливаем следующую позицию змейки с вторым параметром "не удалять хвост змейки",
                 * змейка съев еду вырастает на одну клетку */
                snake.setPosition(nextPosition, false);

                /* удаляем еду с поля */
                food.removeItem(foundFood);

                /* генерируем новую еду на поле */
                food.generateItem();

                /* перерендериваем еду */
                food.render();
                /* увеличиваем счет */
                this.setScore(this.getScore() + 1);
                /* увеличиваем скорость */
                this.increaseSpeed();
            } else {
                /* если индекс не найден, то просто устанавливаем новую координату для змейки */
                snake.setPosition(nextPosition);
            }

            /* перерендериваем змейку */
            snake.render();
        }

    },

    /**
     * Функция прекращает движение змейки
     */
    stopMoving() {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
    },

    /**
     * Функция устанавливает текущий статус игры,
     * раскрашивая контейнер игры в нужный цвет.
     *
     * @param status {GAME_STATUS_STARTED | GAME_STATUS_PAUSED | GAME_STATUS_STOPPED} Строка представляющая статус.
     */
    setGameStatus(status) {
        const element = this.getElement();

        element.classList.remove(this.getGameStatus());
        element.classList.add(status);
    },

    /**
     * Функция определяет текущий статус игры
     * @returns {string} Возвращает строку с состоянием статуса
     */
    getGameStatus() {
        const classes = this.getElement();
        const GAME_STATUSES = [GAME_STATUS_STARTED, GAME_STATUS_PAUSED, GAME_STATUS_STOPPED];
        for (let item of classes.classList) {
            if (GAME_STATUSES.includes(item)) {
                return item;
            }
        }
    }
};

/**
 * Объект, представляющий поле, где ползает змейка.
 */
const board = {

    /**
     * Функция ищет HTML элемент поля на странице.
     *
     * @returns {HTMLElement} Возвращает HTML элемент.
     */
    getElement() {
        return document.getElementById('board');
    },

    /**
     * Функция отрисовывает поле с клетками для игры.
     */
    render() {
        const board = this.getElement();
        this.clear();
        /* рисуем на странице 20*20 клеток */
        for (let i = 0; i < config.size ** 2; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            /* высчитываем и записываем в data атрибуты
             * координаты от верхней и левой границы */
            cell.dataset.top = Math.trunc(i / config.size);
            cell.dataset.left = i % config.size;

            board.appendChild(cell);
        }
    },

    /**
     * Функция очищает доску от предыдущей игры
     */
    clear() {
        const board = this.getElement();
        let cells = board.querySelectorAll(".cell");
        for (let cell of cells) {
            cell.remove();
        }
    },
};

/**
 * Объект, представляющий клетку на поле.
 */
const cells = {

    /**
     * Функция ищет HTML элементы клеток на странице.
     *
     * @returns { HTMLCollectionOf.<Element>} Возвращает набор HTML элементов.
     */
    getElements() {
        return document.getElementsByClassName('cell');
    },

    /**
     * Функция задает класс для клетки по заданным координатам.
     *
     * @param coordinates {Array.<{top: number, left: number}>} Массив координат клеток для изменения.
     * @param className {string} Название класса.
     */
    renderItems(coordinates, className) {
        const cells = this.getElements();

        /* для всех клеток на странице удаляем переданный класс */
        for (let cell of cells) {
            cell.classList.remove(className);
        }

        /* для заданных координат ищем клетку и добавляем класс */
        for (let coordinate of coordinates) {
            const cell = document.querySelector(`.cell[data-top="${coordinate.top}"][data-left="${coordinate.left}"]`);
            cell.classList.add(className);
        }
    }
};

/**
 * Объект, представляющий змейку.
 */
const snake = {
    /**
     * Функция инициализирует стартовое положение змейки и направление ее движения
     */
    init() {
        /**
        * Текущее направление движение змейки.
        * По умолчанию: направо, потому что змейка при старте занимает первые три клетки.
        */
        this.direction = SNAKE_DIRECTION_RIGHT;
        /**
         * Содержит массив объектов с координатами частей тела змейки.
         * По умолчанию: первые три клетки.
         */
        this.parts = [
            { top: 0, left: 2 },
            { top: 0, left: 1 },
            { top: 0, left: 0 },
        ];
    },

    /**
     * Функция устанавливает направление движения.
     *
     * @param direction {'up' | 'down' | 'left' | 'right'} Направление движения змейки.
     */
    setDirection(direction) {
        /* проверка не пытается ли пользователь пойти в противоположном направлении,
         * например, змейка ползет вправо, а пользователь нажал стрелку влево */

        const OPPOSITE_DIRECTIONS = [
            [SNAKE_DIRECTION_LEFT, SNAKE_DIRECTION_RIGHT],
            [SNAKE_DIRECTION_DOWN, SNAKE_DIRECTION_UP],
        ];

        for (let directions of OPPOSITE_DIRECTIONS) {
            if (directions.includes(this.direction)
                && directions.includes(direction)) {
                return;
            }
        }

        this.direction = direction;
    },

    /**
     * Функция считает следующую позицию головы змейки,
     * в зависимости от текущего направления.
     *
     * @returns {{top: number, left: number}} Возвращает объект с координатами.
     */
    getNextPosition() {
        /* получаем позицию головы змейки */
        const position = { ...this.parts[0] };

        /* в зависимости от текущего положения
         * высчитываем значение от верхней и левой границы */
        switch (this.direction) {
            case SNAKE_DIRECTION_UP:
                position.top -= 1;
                break;
            case SNAKE_DIRECTION_DOWN:
                position.top += 1;
                break;
            case SNAKE_DIRECTION_LEFT:
                position.left -= 1;
                break;
            case SNAKE_DIRECTION_RIGHT:
                position.left += 1;
                break;
        }

        /* если змейка выходит за верхний или нижний край поля,
         * то изменяем координаты на противоположную сторону,
         * чтобы змейка выходя за границы возвращалась обратно на поле */
        if (position.top === -1) {
            position.top = config.size - 1;
        } else if (position.top > config.size - 1) {
            position.top = 0;
        }

        /* если змейка выходит за левый или правый край поля,
         * то изменяем координаты на противоположную сторону,
         * чтобы змейка выходя за границы возвращалась обратно на поле */
        if (position.left === -1) {
            position.left = config.size - 1;
        } else if (position.left > config.size - 1) {
            position.left = 0;
        }

        return position;
    },

    /**
     * Функция устанавливает позицию для змейки.
     *
     * @param position {{top: number, left: number}} Координаты новой позиции.
     * @param shift Флаг, указывающий, нужно ли отрезать хвост для змейки.
     */
    setPosition(position, shift = true) {
        /* проверяем флаг, указывающий, нужно ли отрезать хвост для змейки,
         * если флаг положительный, то отрезаем хвост змейки (первый элемент в массиве),
         * чтобы длина змейки не изменилась,
         * если флаг будет отрицательным, то при установки позиции, мы не отрезаем хвост,
         * а значит увеличиваем змейку на одну клетку, это будет означать, что она съела еду */
        if (shift) {
            this.parts.pop();
        }

        /* добавляем новые координаты в начало массива (голова змейки) */
        this.parts.unshift(position);
    },

    /**
     * Функция проверяет, есть ли переданная позиция в массиве координат
     * змейки. Используется для определения, не врезалась ли змейка 
     * сама в себя и не находится ли новый елемент еды внутри змейки
     * @param position {{top: number, left: number}} Координаты новой позиции.
     * @returns {boolean} true если позиция есть иначе false
     */
    // От Кирилла - вынес в отдельный метод, в соответствии с замечаниями 
    // к предыдущему заданию
    hasPosition(position) {
        for (let part of this.parts) {
            if (part.top === position.top && part.left === position.left) {
                return true;
            }
        }
        return false;
    },

    /**
     * Функция возвращает текущее направление движения змейки
     * @returns {string} текущее направление движения змейки
     */
    getDirection() {
        return this.direction;
    },

    /**
     * Функция отрисовывает змейку на поле.
     */
    render() {
        cells.renderItems(this.parts, 'snake');
    }
};

/**
 * Объект, представляющий еду для змейки.
 */
const food = {
    /**
     * Функция инициализирует первую еду на поле
     */
    init() {
        /**
        * Содержит массив объектов с координатами еды на поле.
        */
        this.items = [];
        this.generateItem();
    },

    /**
     * Функция выполняет поиск переданных координат змейки в массиве с едой.
     *
     * @param snakePosition {{top: number, left: number}} Позиция головы змейки.
     *
     * @returns {number} Возвращает индекс найденного совпадения из массива с едой,
     * если ничего не найдено, то -1.
     */
    foundPosition(snakePosition) {
        const comparerFunction = function (item) {
            return item.top === snakePosition.top && item.left === snakePosition.left;
        };

        /* здесь происходит вызов функции comparerFunction для каждого элемента в массиве,
         * если функция вернет true, то для этого элемента будет возвращен его индекс,
         * если функция ни разу не вернет true, то результатом будет -1 */
        return this.items.findIndex(comparerFunction);
    },

    /**
     * Функция удаляет один элемент по индексу из массива с едой.
     *
     * @param foundPosition Индекс найденного элемента.
     */
    removeItem(foundPosition) {
        this.items.splice(foundPosition, 1);
    },

    /**
     * Функция генерирует объект с координатами новой еды.
     */
    generateItem() {

        let newItem = {};
        //Бесконечный цикл
        while (true) {
            let itemExists = false;
            //Генерим новый объект еды
            newItem.top = getRandomNumber(0, config.size - 1);
            newItem.left = getRandomNumber(0, config.size - 1);
            //Проверяем не было ли уже объекта с такими координатами
            if (this.foundPosition(newItem) !== -1) {
                itemExists = true;
            }
            //Проверяем, чтобы объект не находился на занимаемых сейчас змейкой полях
            if (snake.hasPosition(newItem)) {
                itemExists = true;
            }
            //Выход из цикла, если оба условия не соблюдаются
            if (!itemExists) {
                break;
            }
        }

        this.items.push(newItem);
    },

    /**
     * Функция отрисовывает еду на поле.
     */
    render() {
        cells.renderItems(this.items, 'food');
    }
};

/**
 * Функция, генерирующая случайные числа.
 *
 * @param min {number} Нижняя граница генерируемого числа.
 * @param max {number} Верхняя граница генерируемого числа.
 *
 * @returns {number} Возвращает случайное число.
 */
function getRandomNumber(min, max) {
    return Math.trunc(Math.random() * (max - min) + min);
}


/**
 * Функция инициализирует обработчики событий для кнопок.
 * 
 * От Кирилла - функциональное выражение и передача такой функции как аргумента
 */
window.addEventListener('load', function () {
    function buttonInit(tag) {
        const currentButton = document.getElementById(`button-${tag}`);
        currentButton.addEventListener('click', game[tag].bind(game));
    }
    buttonInit('start');
    buttonInit('pause');
    buttonInit('stop');
});