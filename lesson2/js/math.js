function validateNumber(msg) {
    let num = +prompt(msg);
    while (isNaN(num)) {
        num = +prompt(`Вы ошиблись и вместо числа ввели другие символы. ${msg}`);
    }

    return num;
}

function validateOperation(msg) {
    let actions = ["+", "-", "*", "/"];
    let action = prompt(msg);
    while (!actions.includes(action)) {
        action = prompt(`Вы ошиблись и вместо арифметического действия ввели другие символы. ${msg}`);
    }
    switch (action) {
        case "+":
            action = "addition";
            break;
        case "-":
            action = "subtraction";
            break;
        case "*":
            action = "multiplication";
            break;
        case "/":
            action = "division";
    }

    return action;
}

function addition(term1, term2) {
    return term1 + term2;
}

function subtraction(decr, ded) {
    return decr - ded;
}

function multiplication(mult1, mult2) {
    return mult1 * mult2;
}

function division(dividend, divisor) {
    return dividend / divisor;
}

function mathOperation(arg1, arg2, operation) {
    switch (operation) {
        case "addition":
            return addition(arg1, arg2);
            break;
        case "subtraction":
            return subtraction(arg1, arg2);
            break;
        case "multiplication":
            return multiplication(arg1, arg2);
            break;
        case "division":
            return division(arg1, arg2);
    }
}

function power(val, pow) {
    let res;
    if (pow === 2) res = val * val;
    else res = val * power(val, pow - 1);

    return res;
}

function runCalc() {
    let num1 = validateNumber("Введите первое число, положительное или отрицательное");
    let num2 = validateNumber("Введите второе число, положительное или отрицательное");

    if ((num1 >= 0) && (num2 >= 0)) {
        alert(`Так как оба числа положительные, выводим их разность. ${num1} минус ${num2} равняется ${subtraction(num1, num2)}`);
    } else if ((num1 < 0) && (num2 < 0)) {
        alert(`Так как оба числа отрицательные, выводим их произведение. ${num1} умножить на ${num2} равняется ${multiplication(num1, num2)}`);
    } else {
        alert(`Так как числа разных знаков, выводим их сумму. ${num1} плюс ${num2} равняется ${addition(num1, num2)}`);
    }
}

function runSum() {
    let term1 = validateNumber("Введите первое слагаемое");
    let term2 = validateNumber("Введите второе слагаемое");

    alert(`${term1} прибавить ${term2} равняется ${addition(term1, term2)}`);
}

function runSubtraction() {
    let decr = validateNumber("Введите уменьшаемое");
    let ded = validateNumber("Введите вычитаемое");

    alert(`${decr} минус ${ded} равняется ${subtraction(decr, ded)}`);
}

function runMult() {
    let mult1 = validateNumber("Введите первый множитель");
    let mult2 = validateNumber("Введите второй множитель");

    alert(`${mult1} умножить на ${mult2} равняется ${multiplication(mult1, mult2)}`);
}

function runDiv() {
    let dividend = validateNumber("Введите делимое");
    let divisor = validateNumber("Введите делитель");

    alert(`${dividend} разделить на ${divisor} равняется ${division(dividend, divisor)}`);
}

function runMathOp() {
    let arg1 = validateNumber("Введите первое число");
    let operation = validateOperation("Введите действие, которое надо совершить над числами. + для сложения, - для вычитания, * для умножения или / для деления");
    let arg2 = validateNumber("Введите второе число");

    alert(`Результат выбранной арифметической операции над введенными двумя числами равняется ${mathOperation(arg1, arg2, operation)}`);
}

function runExp() {
    let val = validateNumber("Введите число, которое нужно возвести в степень");
    let pow = validateNumber("Введите степень, в которую нужно возвести число");

    alert(`${val} в степени ${pow} равняется ${power(val, pow)}`);
}