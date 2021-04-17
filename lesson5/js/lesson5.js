const colNumbers = ["a", "b", "c", "d", "e", "f", "g", "h"];
const pawnColumns = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rookColumns = ["a", "h"];
const knightColumns = ["b", "g"]
const bishopColumns = ["c", "f"];
const queenColumns = ["d"];
const kingColumns = ["e"];
const pawnRows = [2, 7];
const figureRows = [1, 8];
const whiteInitialRows = [1, 2];
const blackInitialRows = [7, 8];

/*
Одна из основных функций. Параметры: объект блока-родителя,
содержание, если есть и массив тегов, если есть. Массив тегов является сложным массивом, каждый из элементов которго - тоже массив вида: [название_тега, значение тега]. Соответственно нам неважно, с какими тегами создавать новый div. Фукция дописывает в конец блока - родителя созданный div.
Функция возвращает объект созданного div'а.
*/
function createNewCell(parent, text, attributes) {
    let cell = document.createElement("div");
    //Если с параметрами был переден текст содержимого - записываем его
    if (text) {
        cell.innerText = text;
    }
    //Проверяем, что массив атрибутов - действительно массив
    if (Array.isArray(attributes)) {
        for (let i = 0; i < attributes.length; i++) {
            //И что его элементы - тоже массивы
            if (Array.isArray(attributes[i])) {
                //Записываем для элемента название и значение тега
                cell.setAttribute(attributes[i][0], attributes[i][1]);
            }
        }
    }
    parent.appendChild(cell);
    return cell;
}

/*
Вспомогательная функция. Дважды надо будет записать строку
с названиями столбцов, поэтому выделем в функцию. Предполагается, что больше она ниоткуда вызываться не будет.
*/
function writeColNumbers(parent) {
    createNewCell(parent, null, [["class", "corner"]]);
    for (let i = 0; i < colNumbers.length; i++) {
        createNewCell(parent, colNumbers[i], [["class", "colnumber"]]);
    }
    createNewCell(parent, null, [["class", "corner"]]);
}

/*
Функция создания доски без заполнения. Параметр - id блока-родителя. Функция отрисовывает пустую шахматную доску с названиями строк и столбцов. Возвращает объект нарисованной доски.
*/
function drawChessboard(parentId) {
    let answer = document.getElementById(parentId);
    //Создаем в блоке-родителе блок будущей доски
    let chessboardNew = createNewCell(answer, null, [["class", "chessboard"]]);
    //Заполняем для нее заголовки столбцов сверху
    writeColNumbers(chessboardNew);
    //Отрисовывание идет сверху, соответственно начинаем с 8 строки и идем по декременту
    for (let rows = 8; rows > 0; rows--) {
        //Крайняя левая клетка с номером строки
        createNewCell(chessboardNew, rows, [["class", "rownumber"]]);
        /*
        Четные строки начинаются с белой клетки и заканчиваются черной, нечетные - наоборот. Не придумал ничего умнее такого решения - если строка четная, то четыре раза повторяем создание пары белая-черная клетка, если строка нечетная, создаем пару черная-белая и также повторяем четыре раза.
        */
        for (let i = 0; i < 4; i++) {
            //Вычисляем, какой будет столбец для первой и второй клетки в паре
            let columnFirst = colNumbers[i * 2];
            let columnSecond = colNumbers[i * 2 + 1];
            /*
            Создаем очередную пару клеток без текста с тегами class = "cell white" или "cell black" и дата-атрибутами, в которых будет храниться номер строки и столбца. Это будет нужно для заполнения доски буквами или картинками. Через id было бы сделать проще, но учитываем возможность того, что на странице могут быть 2 или больше досок. Тогда на странице будет несколько элементов с одинаковыми id, что совершенно некорректно.
            */
            if (rows % 2 === 0) {
                createNewCell(chessboardNew, null, [["class", "cell white"], ["data-row", rows], ["data-column", columnFirst]]);
                createNewCell(chessboardNew, null, [["class", "cell black"], ["data-row", rows], ["data-column", columnSecond]]);
            } else {
                createNewCell(chessboardNew, null, [["class", "cell black"], ["data-row", rows], ["data-column", columnFirst]]);
                createNewCell(chessboardNew, null, [["class", "cell white"], ["data-row", rows], ["data-column", columnSecond]]);
            }
        }
        //Краяняя правая клетка с номером строки
        createNewCell(chessboardNew, rows, [["class", "rownumber"]]);
    }
    //Нижняя строка с названиями столбцов
    writeColNumbers(chessboardNew);
    return chessboardNew;
}

/*
Также одна из основных функций. Параметры: объект блока-родителя, массив номеров строк, массив названий столбцов, текст - картинка или буква, обозначающая фигуру или пешку.
Функция записывает переданный текст в клетки, которые находятся на указанных столбцах И указанных строках.
*/
function writeFiguresToCells(parent, rows, columns, text) {
    if ((!Array.isArray(rows)) || (!Array.isArray(columns))) {
        return
    }
    for (row of rows) {
        for (column of columns) {
            let cell = parent.querySelectorAll(`[data-row = '${row}'][data-column = '${column}']`)[0];
            cell.innerHTML = text;
        }

    }
}
/*
Вспомогательная функция. Для первоначального расположения фигур, задаем, какие должны быть черными, а какие - белыми.
Параметры: объект блока-родителя, массив из номеров строк, к котрым будет применяться класс и название класса, который будет применяться. Используются классы color-white для белых и color-black для черных
*/
function setInitialRowColors(parent, rows, className) {
    if (!Array.isArray(rows)) {
        return;
    }
    //Формируем строку запроса для выборки всех элементов указанных строк
    let queryStr = '';
    for (item of rows) {
        if (queryStr === '') {
            queryStr = `[data-row = '${item}']`;
        } else {
            queryStr = `${queryStr}, [data-row = '${item}']`
        }
    }
    //Делаем выборку элементов
    let selectedRows = parent.querySelectorAll(queryStr);
    //Для каждого элемента в выборке прописываем указанный класс
    for (item of selectedRows) {
        item.classList.add(className);
    }
}

//Рисуем доску и заполняем ее буквами, обозначающими фигуры и пешки
function fillChessboardLetters(parentId) {
    let chessBoard = drawChessboard(parentId);
    setInitialRowColors(chessBoard, whiteInitialRows, "color-white");
    setInitialRowColors(chessBoard, blackInitialRows, "color-black");
    writeFiguresToCells(chessBoard, pawnRows, pawnColumns, "п");
    writeFiguresToCells(chessBoard, figureRows, rookColumns, "л");
    writeFiguresToCells(chessBoard, figureRows, knightColumns, "к");
    writeFiguresToCells(chessBoard, figureRows, bishopColumns, "с");
    writeFiguresToCells(chessBoard, figureRows, queenColumns, "ф");
    writeFiguresToCells(chessBoard, figureRows, kingColumns, "кр");
}

//Рисуем доску и заполняем ее картинками, обозначающими фигуры и пешки
function fillChessboardPics(parentId) {
    let chessBoard = drawChessboard(parentId);
    setInitialRowColors(chessBoard, whiteInitialRows, "color-white");
    setInitialRowColors(chessBoard, blackInitialRows, "color-black");
    writeFiguresToCells(chessBoard, pawnRows, pawnColumns, "<i class='fas fa-chess-pawn'></i>");
    writeFiguresToCells(chessBoard, figureRows, rookColumns, "<i class='fas fa-chess-rook'></i>");
    writeFiguresToCells(chessBoard, figureRows, knightColumns, "<i class='fas fa-chess-knight'></i>");
    writeFiguresToCells(chessBoard, figureRows, bishopColumns, "<i class='fas fa-chess-bishop'></i>");
    writeFiguresToCells(chessBoard, figureRows, queenColumns, "<i class='fas fa-chess-queen'></i>");
    writeFiguresToCells(chessBoard, figureRows, kingColumns, "<i class='fas fa-chess-king'></i>");
}