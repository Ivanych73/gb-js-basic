function getObjOfNumbers(val) {
	let objOfNumbers = {};
	if ((val > 999) || (val < 0)) return objOfNumbers
	else {
		objOfNumbers['единицы'] = val % 10;
		val = (val - objOfNumbers['единицы']) / 10;
		/* Не стал отбрасывание разрядов в отдельную функцию выносить намеренно
		Так как всего пара строчек кода*/
		objOfNumbers['десятки'] = val % 10;
		val = (val - objOfNumbers['десятки']) / 10;
		objOfNumbers['сотни'] = val % 10;
		return objOfNumbers;
	}
}

function runGetObjOfNumbers() {
	let val = document.getElementById("task1-input").value;
	if (val === '') console.log('Вы не ввели никакого числа, введите число от 0 до 999');
	else if ((val > 999) || (val < 0)) {
		console.log('Введенное число не входит в допустимый диапазон чисел, программа работает с числами от 0 до 999');
		console.log(getObjOfNumbers(val));
	} else console.log(getObjOfNumbers(val));
}