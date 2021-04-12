const MINNUMBER = 0;
const MAXNUMBER = 100;

const QUANTITYORDERNUMBER = 4;
const PRICEORDERNUMBER = 5;

const MINLOOPNUMBER = 0;
const MAXLOOPNUMBER = 9;

const PYRAMIDEMIN = 1;
const PYRAMIDEMAX = 20;
const PYRAMIDESYMBOL = 'x';

let basket = [
    ['02020202', 'Cotton t-shirt', 'white', 'XXL', '3', '200'],
    ['03030303', 'Denim pants', 'light-blue', '38', '1', '2000'],
    ['04040404', 'Denim jacket', 'blue', 'XXL', '1', '1500'],
    ['02020202', 'Cross-country shoes', 'grey', '43', '1', '3000']
]

function countPrimeNumbers(min, max) {
    let source = [];
    let res = [];
    for (let i = min; i <= max; i++) {
        source.push(i);
    }

    for (i = 0; i < source.length; i++) {
        if ((source[i] >= 2) && (source[i] <= 3)) {
            res.push(source[i]);
            continue;
        }

        for (let divisor = 2; divisor < source[i]; divisor++) {
            if (divisor + 1 === source[i]) {
                res.push(source[i]);
            }

            if (source[i] % divisor === 0) {
                break;
            }
        }
    }

    return res.join(', ');
}

function countBasketPrice(basket) {
    let total = 0;
    for (let i = 0; i < basket.length; i++) {
        total = total + basket[i][QUANTITYORDERNUMBER] * basket[i][PRICEORDERNUMBER]
    }

    return total;
}

function loopWithoutBody(min, max) {
    let arr = [];
    for (let i = min; i <= max; arr.push(i++)) { }
    return arr.join(', ');
}

function drawPyramide(min, max, symbol) {
    let str = '';
    let res = [];
    for (let i = min; i <= max; i++) {
        str = str + symbol;
        res.push(str);
    }

    return res;
}

function runCountPrimeNumbers() {
    document.getElementById("task1-answer").innerHTML = countPrimeNumbers(MINNUMBER, MAXNUMBER);
}

function runCountBasketPrice() {
    document.getElementById("task2-3-answer").innerHTML = `Стоимость всех товаров в корзине составит ${countBasketPrice(basket)}`;
}

function runLoopWithoutBody() {
    document.getElementById("task4-answer").innerHTML = `Вывод чисел от ${MINLOOPNUMBER} до ${MAXLOOPNUMBER}: ${loopWithoutBody(MINLOOPNUMBER, MAXLOOPNUMBER)}`;
}

function runDrawPyramide() {
    let arr = drawPyramide(PYRAMIDEMIN, PYRAMIDEMAX, PYRAMIDESYMBOL);
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i] + '\n')
    }
}