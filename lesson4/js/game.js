/**
 * Объект с настройками игры.
 * @property {int} rowsCount Количество строк в карте.
 * @property {int} colsCount Количество колонок в карте.
 */
const config = {
    rowsCount: 10,
    colsCount: 10,
};

/*От Кирилла - объект для хранения ходов с методами проверки существования, счетчиком ходов, сеттером и геттером исходной и конечной позиции*/
const moves = {
    count: 0,

    getValidMoveNumber() {
        let res = validateNumber('Хотите просмтреть один из ходов в игре? Если да, то введите номер хода');
        while ((res < 0) || (res > this.count)) {
            res = validateNumber(`В игре всего было ${this.count} ходов. Вы ввели номер, не попадающий в диапазон от 1 до ${this.count}. Введите номер хода повторно`)
        }

        return res;
    },

    setInitialPosition(position) {
        this.count++;
        this[this.count] = {
            initialX: position.x,
            initialY: position.y,
        }
    },

    setResPosition(position) {
        this[this.count].resX = position.x;
        this[this.count].resY = position.y;
    },

    getInitialPosition(moveNumber) {
        let position = {
            x: this[moveNumber].initialX,
            y: this[moveNumber].initialY,
        };
        return position;
    },

    getResPosition(moveNumber) {
        let position = {
            x: this[moveNumber].resX,
            y: this[moveNumber].resY,
        };
        return position;
    }
}

/**
 * Объект игрока, здесь будут все методы и свойства связанные с ним.
 * @property {int} x Позиция по X-координате.
 * @property {int} y Позиция по Y-координате.
 */
const player = {
    x: 0,
    y: 0,

    /**
     * Двигает игрока по переданному направлению.
     * @param {{x: int, y: int}} nextPoint Следующая точка пользователя.
     */
    move(nextPoint) {
        this.x = nextPoint.x;
        this.y = nextPoint.y;
    },
};

let renderer = {
    // Сюда запишем все что надо отобразить.
    map: "",

    /**
     * Отображает игру в консоли.
     */
    render() {
        // Цикл перебирает все строки, которые надо отобразить.
        for (let row = 0; row < config.rowsCount; row++) {
            // В каждой строке отображаем для каждой колонки (x - клетка, o - игрок).
            for (let col = 0; col < config.colsCount; col++) {
                // Проверяем, если на данной позиции должен быть и игрок, отображаем игрока, если нет - клетку.
                if (player.y === row && player.x === col) {
                    this.map += 'o ';
                } else {
                    this.map += 'x ';
                }
            }
            // После того как отобразили всю строку делаем переход на следующую строку.
            this.map += '\n';
        }

        // Выводим все что надо отобразить в игре.
        console.log(this.map);
    },

    clear() {
        // Чистим консоль.
        console.clear();
        // Чистим карту.
        this.map = "";
    }
};

let mover = {
    /**
     * Получает и отдает направление от пользователя.
     * @returns {int} Возвращаем направление, введенное пользователем.
     */
    getDirection() {
        // Доступные значения ввода.
        const availableDirections = ['w', 'a', 's', 'd'];

        while (true) {
            // Получаем от пользователя направление.
            let direction = prompt('Введите букву (w, a, s или d), куда вы хотите переместиться, "Отмена" для выхода.');
            if (!direction) {
                return null;
            }

            // Если направление не одно из доступных, то сообщаем что надо ввести корректные данные
            // и начинаем новую итерацию.
            if (!availableDirections.includes(direction)) {
                alert('Для перемещения необходимо ввести одну из букв w, a, s или d.');
                continue;
            }

            // Если пользователь ввел корректное значение - отдаем его.
            return direction;
        }
    },

    /**
     * Отдает следующую точку в которой будет находиться пользователь после движения.
     * @param {int} direction Направление движения игрока.
     * @returns {{x: int, y: int}} Следующая позиция игрока.
     */
    getNextPosition(direction) {
        // Следующая точка игрока, в самом начале в точке будут текущие координаты игрока.
        const nextPosition = {
            x: player.x,
            y: player.y,
        };
        //От Кирилла - запоминаем исходную позицию на текущем ходу
        moves.setInitialPosition(nextPosition);
        // Определяем направление и обновляем местоположение игрока в зависимости от направления.
        //От Кирилла - добавил контроль положения на поле, с 10 позиции, если движение в сторону увеличения, то переход на первую позицию
        switch (direction) {
            case 's':
                if (nextPosition.y === config.colsCount - 1) nextPosition.y = 0;
                else nextPosition.y++;
                break;
            case 'a':
                if (nextPosition.x === 0) nextPosition.x = config.rowsCount - 1;
                else nextPosition.x--;
                break;
            case 'd':
                if (nextPosition.x === config.rowsCount - 1) nextPosition.x = 0;
                else nextPosition.x++;
                break;
            case 'w':
                if (nextPosition.y === 0) nextPosition.y = config.colsCount - 1;
                else nextPosition.y--;
                break;
        }
        //От Кирилла - дописываем в объект хода конечные позиции
        moves.setResPosition(nextPosition);

        return nextPosition;
    },
};

let game = {
    /**
     * Запускает игру.
     */
    run() {
        // Бесконечный цикл
        while (true) {
            // Получаем направление от игрока.
            const direction = mover.getDirection();
            //От Кирилла - я nextPoint использую в отображении записанных ходов, поэтому не константа, а переменная и определяется здесь
            let nextPoint = {};
            // Если игрок сказал что хочет выйти, то игра заканчивается.
            if (direction === null) {
                //От Кирилла - если игрок согласился на просмотр хода, проверяем, был ли вообще в игре ход с таким номером
                let moveNumber = moves.getValidMoveNumber();
                //От Кирилла - повторяем вывод ходов, пока не нажата отмена
                while (moveNumber) {
                    nextPoint = moves.getInitialPosition(moveNumber);
                    alert(`Исходная позиция на ${moveNumber} ходу. По горизонтали - ${nextPoint.x + 1}, по вертикали - ${nextPoint.y + 1}.`);
                    this.move(nextPoint);
                    nextPoint = moves.getResPosition(moveNumber);
                    alert(`Конечная позиция на ${moveNumber} ходу. По горизонтали - ${nextPoint.x + 1}, по вертикали - ${nextPoint.y + 1}.`);
                    this.move(nextPoint);
                    moveNumber = moves.getValidMoveNumber();
                }
                console.log("Игра окончена.");
                return;
            }
            // Получаем следующую точку пользователя в зависимости от направления.
            nextPoint = mover.getNextPosition(direction);
            this.move(nextPoint);
        }
    },

    //От Кирилла - поскольку использую также в отображении записанных ходов, то выделил в отдельный метод
    move(nextPoint) {
        renderer.clear();
        player.move(nextPoint);
        renderer.render();
    },

    //От Кирилла - этот метод выполняется при нажатии кнопки, а не открытии страницы
    init() {
        console.log('Ваше положение на поле в виде о.');
        // Отображаем нашу игру.
        renderer.render();
        console.log('Чтобы начать игру наберите game.run() и нажмите Enter.');
    }
};

function validateNumber(msg) {
    let num = +prompt(msg);
    while (isNaN(num)) {
        num = +prompt(`Вы ошиблись и вместо числа ввели другие символы. ${msg}`);
    }

    return num;
}