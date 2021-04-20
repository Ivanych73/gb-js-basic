/*Для списка товаров использовал работу из прошлого курса
  Там довольно сложная структура, поэтому код тоже получился чуть сложноватым.
  Функция добавления товара в корзину, срабатывает при нажатии на кнопку 
  "Add To Cart".
*/
function addToCart(event) {
	let elem = this;
	/*Ищем карточку товара, в ней уже будем искать название и цену.
	  Поднимаемся вверх по родительским элементам от кнопки, 
	  пока не найдем div с классом products__item - это карточка товара
	  в списке.
	*/
	while (!elem.className.includes('products__item')) {
		elem = elem.parentElement;
	}
	//Начинаем формировать блок нового товара в корзине
	const newProduct = document.createElement("div");
	//Первый текстовый элемент нового товара - название
	//Ищем его в карточке товара по названию класса
	newProduct.innerHTML = `${elem.querySelectorAll(".product-card__title")[0].innerText}, цена: `;
	//Дописываем новому товару свой класс - это нужно будет при подсчете общей стоимости
	newProduct.className = "cart-item";
	/*Создаем текстовый подблок цены для товара
	  Это также нужно будет для подсчета общей стоимости
	  Цену также ищем в карточке товара
	*/
	const priceInCart = document.createElement("span");
	priceInCart.className = "cart-price";
	priceInCart.innerText = elem.querySelectorAll(".product-card__price")[0].innerText;
	//Формируем вспомогательный текст про количество
	const quantityText = document.createElement("span");
	quantityText.innerHTML = ", количество: ";
	//Формируем непосредственно блок с количеством
	//Также будет нужен при подсчете общей суммы
	const quantityNumber = document.createElement("span");
	quantityNumber.innerHTML = 1;
	quantityNumber.className = "cart-quantity";
	//Начинаем непосредственно работу с корзиной - ищем блок корзины в документе
	const shoppingCart = document.querySelectorAll(".shopping-cart")[0];
	//Проверка, есть ли уже в корзине товар с таким названием
	let existingProduct = {};
	let productExists = false;
	//Получаем все дочерние элементы корзины
	let items = shoppingCart.querySelectorAll(".cart-item");
	for (let item of items) {
		//Если товар с таким названием есть, получаем ссылку на него
		//И флажок существования
		if (item.innerText.includes(newProduct.innerText)) {
			existingProduct = item;
			productExists = true;
		}
	}
	if (productExists) {
		//Если добавляется уже существующий товар - увеличиваем его количество
		currentQuantity = existingProduct.querySelectorAll(".cart-quantity")[0];
		currentQuantity.innerHTML = parseInt(currentQuantity.innerHTML) + 1;
	} else {
		//Иначе добавляем новый товар с названием, ценой и количеством 1
		shoppingCart.appendChild(newProduct);
		newProduct.appendChild(priceInCart);
		newProduct.appendChild(quantityText);
		newProduct.appendChild(quantityNumber);
	}
}

/*Из текста задания я так понял, что подсчет общей суммы не автоматом,
  а по желанию пользователя. Можно вызов функции подсчета вызывать из 
  функции добавления, тогда автоматом считать будет
*/

function countCartTotal() {
	//Ищем объект корзины в документе
	const shoppingCart = document.querySelectorAll(".shopping-cart")[0];
	//Получаем выборку всех элементов корзины
	const shoppingCartItems = shoppingCart.querySelectorAll(".cart-item");
	let total = 0;
	for (let item of shoppingCartItems) {
		//Ищем цену очередного товара
		let itemPrice = item.querySelectorAll(".cart-price")[0].innerHTML;
		//Ищем количество очередного товара
		let itemQuantity =  item.querySelectorAll(".cart-quantity")[0].innerHTML;
		//Цену умножаем на количество и плюсуем к общей сумме
		total = total + (parseFloat(itemPrice) * parseFloat(itemQuantity));
	}
	//Записываем общую сумму в соответствующее поле в документе
	let totalHTML = shoppingCart.querySelectorAll(".shopping-cart__total-price")[0];
	totalHTML.innerHTML = "";
	totalHTML.innerHTML = `Полная стоимость: ${total}`;
}

function cartInit() {
	const addToCartButtons = document.querySelectorAll(".product-card__button");
	for (let button of addToCartButtons) {
		button.addEventListener('click', addToCart);
	}
	const countCartButtons = document.querySelectorAll(".count-total-button");
	for (let button of countCartButtons) {
		button.addEventListener('click', countCartTotal);
	}
}

window.addEventListener('load', cartInit);