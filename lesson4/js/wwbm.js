const questions = {

    questionsTotal: 15,

    /*
    Опрашивает пользователя, на каком вопросе сумма станет несгораемой. Ответ пользователя проверяется на то, что это число и попадает в диапазон от 1 до общего количества вопросов. Если пользователь вводит валидный номер вопроса - устанвливает значение unburnable соответствующего вопроса в true, возвращает true , если пользователь нажал "Отмена" возвращает false
    */
    setUnburnable() {
        //На случай, если игра повторяется без обновления страницы - обнуляем unburnable для всех вопросов
        for (let key in this) {
            this[key].unburnable = false;
        }
        let questionNumber = validateNumber('Введите номер вопроса, на котором выигрыш станет несгораемым');
        if (!questionNumber) return false;
        else {
            while (!this[questionNumber]) {
                questionNumber = validateNumber('В этой игре всего 15 вопросов. Вы ошиблись и ввели номер вопроса, который не входит в диапазон от 1 до 15. Введите номер вопроса, от 1 до 15, который станет несгораемым.');
            }
            this[questionNumber].unburnable = true;
            return true;
        }
    },

    //Возвращает насгораемую сумму
    getUnburnable() {
        for (let key in this) {
            if (this[key].unburnable === true) return this[key].points;
        }
    },

    /*
    Основной метод работы с вопросами и ответами. Получает номер вопроса, задает пользователю соответствующий вопрос, проверяет, что ответ пользователя - это один из предложенных вариантов. Если нажата "Отмена" - возвращает true, если ответ был неверный - возвращает false, если ответ был верный - возвращает очки за верный ответ.
    */
    getQuestion(number) {
        let userAnswer = prompt(`Вопрос номер ${number}. На кону ${this[number].points} очков.
        ${this[number].question} Выберите вариант ответа:
        A: ${this[number].A}
        B: ${this[number].B}
        C: ${this[number].C}
        D: ${this[number].D}`);
        let answers = ['a', 'b', 'c', 'd'];
        while ((!answers.includes(userAnswer)) && (userAnswer)) {
            userAnswer = prompt(`Вы ошиблись и вместо варианта ответа 'a', 'b', 'c' или 'd' ввели какой-то другой символ. Пожалуйста, введите  'a', 'b', 'c' или 'd' для выбора варианта ответа на вопрос либо 'Отмена' для выхода из игры. Повторяем вопрос:
            ${this[number].question}
            A: ${this[number].A}
            B: ${this[number].B}
            C: ${this[number].C}
            D: ${this[number].D}`);
        }
        if (!userAnswer) return true;
        else {
            userAnswer = userAnswer.toLowerCase();
            if (userAnswer === this[number].correctAnswer) return this[number].points;
            else return false;
        }
    },

    1: {
        question: 'Сколько будет дважды два?',
        A: '1',
        B: '2',
        C: '4',
        D: '8',
        correctAnswer: 'c',
        points: 500,
        unburnable: false,
    },

    2: {
        question: 'Сколько будет трижды три?',
        A: '77',
        B: '9',
        C: '4',
        D: '5',
        correctAnswer: 'b',
        points: 1000,
        unburnable: false,
    },

    3: {
        question: 'Сколько будет четырежды четыре?',
        A: '16',
        B: '64',
        C: '8',
        D: '1024',
        correctAnswer: 'a',
        points: 2000,
        unburnable: false,
    },

    4: {
        question: 'Сколько будет пятью пять?',
        A: '125',
        B: '88',
        C: '0',
        D: '25',
        correctAnswer: 'd',
        points: 3000,
        unburnable: false,
    },

    5: {
        question: 'Сколько будет шестью шесть?',
        A: '123',
        B: '36',
        C: '456',
        D: '789',
        correctAnswer: 'b',
        points: 5000,
        unburnable: false,
    },

    6: {
        question: 'Сколько будет семью семь?',
        A: '123',
        B: '456',
        C: '49',
        D: '789',
        correctAnswer: 'c',
        points: 10000,
        unburnable: false,
    },

    7: {
        question: 'Сколько будет восемью восемь?',
        A: '123',
        B: '456',
        C: '789',
        D: '64',
        correctAnswer: 'd',
        points: 15000,
        unburnable: false,
    },

    8: {
        question: 'Сколько будет девятью девять?',
        A: '81',
        B: '123',
        C: '456',
        D: '789',
        correctAnswer: 'a',
        points: 25000,
        unburnable: false,
    },

    9: {
        question: 'Сколько будет десятью десять?',
        A: '123',
        B: '100',
        C: '456',
        D: '789',
        correctAnswer: 'b',
        points: 50000,
        unburnable: false,
    },

    10: {
        question: 'Сколько будет одиннадцатью одиннадцать?',
        A: '123',
        B: '456',
        C: '121',
        D: '789',
        correctAnswer: 'c',
        points: 100000,
        unburnable: false,
    },

    11: {
        question: 'Сколько будет двенадцатью двенадцать?',
        A: '123',
        B: '456',
        C: '789',
        D: '144',
        correctAnswer: 'd',
        points: 200000,
        unburnable: false,
    },

    12: {
        question: 'Сколько будет тринадцатью тринадцать?',
        A: '169',
        B: '123',
        C: '456',
        D: '789',
        correctAnswer: 'a',
        points: 400000,
        unburnable: false,
    },

    13: {
        question: 'Сколько будет четырнадцатью четырнадцать?',
        A: '123',
        B: '196',
        C: '456',
        D: '789',
        correctAnswer: 'b',
        points: 800000,
        unburnable: false,
    },

    14: {
        question: 'Сколько будет пятнадцатью пятнадцать?',
        A: '123',
        B: '456',
        C: '225',
        D: '789',
        correctAnswer: 'c',
        points: 1500000,
        unburnable: false,
    },

    15: {
        question: 'Сколько будет шестнадцатью шестнадцать?',
        A: '123',
        B: '456',
        C: '789',
        D: '256',
        correctAnswer: 'd',
        points: 3000000,
        unburnable: false,
    }
}

//Объект игрока. Имя player у нас уже использовано, поэтому назовем его участником
const participant = {
    score: 0,
}
//wwbm - Who Wants to Become a Millionare
let wwbm = {
    run() {
        //Википедия говорит, что сейчас игрок до начала игры выбирает несгораемую сумму
        if (!questions.setUnburnable()) {
            this.msgToConsole('Игра окончена не начавшись!');
            return;
        }

        for (let i = 1; i <= questions.questionsTotal; i++) {
            let answer = questions.getQuestion(i);
            if (!answer) {
                /*
                Ответ неверный. Если набранное игроком число очков больше несгораемой суммы, то очки сбрсываются до несгораемой суммы.
                */
                if (participant.score >= questions.getUnburnable()) participant.score = questions.getUnburnable()
                    //Если игрок не набрал несгораемую сумму все очки сгорают
                    ; else participant.score = 0;
                this.msgToConsole('Ответ неверный.');
                return;
            } else if (answer === true) {
                this.msgToConsole('Вы решили закончить игру.');
                return;
            } else {
                participant.score = answer;
            }
        }

        this.msgToConsole('Вы выиграли!');
    },

    msgToConsole(msg) {
        console.log(`${msg} Ваши очки - ${participant.score}`)
    }
}