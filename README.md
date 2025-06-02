# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Документация
Класс модели данных для списка карточек, которые приходят с сервера
Он же является Model
class ProductList implements ProductList{
    total: Общее количество карточек
    items: массив карточек каждый в виде объекта
}

Данный класс явояется имплементацией интерфейса PresenterProductList.
Он является Presenter в модели MVP
class PresenterProductList implements PresenterProductList {
    clickCard: - Функция клика по карточке. Происходит открытие и закрытие карточки товара
    fetch: - Функция получения списка карточек товаро с сервера при инициализации (загрузки) приложения в браузере
}

Данный класс явояется имплементацией интерфейса ViewProductList
Он является View в модели MVP
class ViewProductList implements ViewProductList{
    render: - Отрисовка обновленных данных на странице
}

class Basket implements Basket { /*Вся корзина*/
    priducts: - список выбранных в корзине товаров к покупке. Данные хранятся здесь в массиве
    totalPrice: - Суммарная стоимость всех товаров в корзине
}

interface PresenterBasket {
    addItem: Function, /* Добавление товара в корзину */
    removeItem: Function, /* Удаление товара из корзины */ 
    calculateTotalPrice: Function /* Расчитать суммарную стоимость товаров в корзине */
}

interface ViewBasket {
    render: Function, /* Отрисовка корзины. Срабатывает при каждом изменении массива данных корзины, то есть при срабатывании методов addItem и removeItem */
}

Класс, описывающий данные в форме со Способами оплаты
Class Payment implements Payment {
    methods: - Способ оплаты
    address: - Адрес доставки
}

Класс Presenter для формысо Способами оплаты
class PresenterPayment implements PresenterPayment {
    selectMethod: - Функция позваоляющая выбирать способ оплаты
    addAddress: - Функция, позволяющая изменять поле с адресом
    submitPayment: Фунция отправки данных на сервер, если форма валидная
}

interface ViewPayment {
    render: Function, /* Отрисовка формы со способами оплаты. Срабатывает при каждом срабатывании методов selectMethod и addAddress */
}

Класс, описывающий данные для формы Контактных данных
Class Contacts implements Contacts {
    email: - Значение электронной почты
    telephone: - Значение номера телефона
}

Класс Presenter для формы с контактами
Class PresenterContacts implements PresenterContacts {
    addEmail: - Функция изменения поля с электронной почтой
    addTelephone: - Функция изменения поля с номером телефона
    submitContacts: - Функция, позволяющая отправить заполненную форму на сервер, если данные валидные
}

Класс View для формы с контактами
Class ViewContacts implement ViewContacts {
    render: - Функция для отрисовки обновленных данных после изменения полей внутри формы
}



