/*Интерфейс одной конкретной карточки. Приходит с сервера*/
interface ProductItem {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number
}

/*Интерфейс всех карточек приходящих с сервера*/
interface ProductList {
    total: number,  /*Общее количество карточек*/
    items: ProductItem[],  /*массив карточек с интерфейсом Item*/
}

interface PresenterProductList {
    clickCard: Function, /* Клик по карточке товара. После клика происходит открытие модального окна для данного товара */
    fetch: Function /* Запрос карточек с сервера */
}

interface ViewProductList {
    render: Function, /* Отрисовка на странице карточек, полученных с сервера */

}

/*======== Интерфейс даннных для Корзины ========*/
interface ItemInBasket { /*Один конкретный товар в корзине*/
    product: ProductItem, /* Товар в корзине. Он соответствует интерфейсу ProductItem */
}

interface Basket { /*Вся корзина*/
    priducts: ItemInBasket[]; /*Товраы в корзине содержатся в виде массива*/
    totalPrice: number, /*Суммарная стоимость всех товаров в корзине*/ 
}

interface PresenterBasket {
    addItem: Function, /* Добавление товара в корзину */
    removeItem: Function, /* Удаление товара из корзины */ 
    calculateTotalPrice: Function /* Расчитать суммарную стоимость товаров в корзине */
}

interface ViewBasket {
    render: Function, /* Отрисовка корзины. Срабатывает при каждом изменении массива данных корзины, то есть при срабатывании методов addItem и removeItem */
}

/*======== Интерфейсы для Формы Способов оплаты ========*/
interface Payment {
    methods: string, /* Способы оплаты */
    address: string, /* Адрес доставки */
}

interface PresenterPayment {
    selectMethod: Function, /* Выбор способа оплаты */
    addAddress: Function, /* Установить адрес доставки */
    submitPayment: Function, /* Отправить формы с выбором способа оплаты на сервер*/
}

interface ViewPayment {
    render: Function, /* Отрисовка формы со способами оплаты. Срабатывает при каждом срабатывании методов selectMethod и addAddress */
}

/*======== Интерфейсы для Формы Контактных данных ========*/
interface Contacts {
    email: string, /* Поле электронной почты */
    telephone: string, /* Поле для номера телефона */
}

interface PresenterContacts {
    addEmail: Function, /* Добавить адрес электронной почты */
    addTelephone: Function, /* Добавить номер телефона*/
    submitContacts: Function, /* Отправить Форму с контактными данными на сервер */
}

interface ViewContacts {
    render: Function, /* Отрисовка формы с контактными даннными. Срабатывает при каждом срабатывании методов addEmail и addTelephone */
}

/*======== Интерфейсы для Карточек товаров, отрисованных на странице ========*/

