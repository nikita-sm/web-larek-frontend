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
Архитектура приложения соответствует мобели MVP (Model - View - Presenter)
Слои модели данных [Model]

**Component**
Это самый базовый класс, от которого будут наследоваться все другие классы. Это класс нужен для работы с элементами разметки.
container: HTMLElement: Это элемент DOM, который будет использоваться как контейнер для компонента. Здесь будет происходить работа непосредственного с элементом.
У этого класса будут следующие поля:
toggleClass(element: HTMLElement, className: string, force?: boolean) - переключить класс.
setText(element: HTMLElement, value: unknown) - установить текстовое содержимое.
setDisabled(element: HTMLElement, state: boolean) - сменить статус блокировки.
setHidden(element: HTMLElement) - скрыть элемент.
setVisible(element: HTMLElement) - показать элемент.
setImage(element: HTMLImageElement, src: string, alt?: string) - установить изображение с алтернативным текстом.
render(data?: Partial): HTMLElement - вернуть корневой DOM-элемент.

**Класс EventEmiter**
Это класс - брокер событий всего приложения.
Базовый класс, центральный брокер событий, данный класс позволяет подписываться на события и реагировать на них. 

on(eventName: EventName, callback: (event: T) => void) - установить обработчик на событие.
off(eventName: EventName, callback: Subscriber) - снять обработчик с события.
emit(eventName: string, data?: T) - инициировать событие с данными.
onAll(callback: (event: EmitterEvent) => void) - слушать все события.
offAll() - сбросить все обработчики.
trigger(eventName: string, context?: Partial) - сделать коллбек триггер, генерирующий событие при вызове.

1. событие cards:set - Отрисовка на главной странице всех карточек, после того как они пришли с сервера
2. card:open - открыть Превью-товара после клика на карточку товара
3. model:open и model:close - заблокировать и разблокировать прокрутку при открытом модальном окне
4. preview:toggle - переключение кнопки в Превью. Здесь меняется надпись на самой кнопке
5. basket:open - Открыть корзину с товарами в модальном окне
6. basket:update - Перерисовка корзины при удалении или добавлении товара
7. order:open - открытие модального окна с формой Order
8. payment:toggle - смена способа оплаты
9. order:change - изменение полей в форме Order
10. formErrorsOrder:change - изменение ошибок в форме Order
11. order:submit - закрыть форму Order и открыть форму Contacts в одном и том же модальном окне
12. contacts:change - изменение полей в форме Contacts
13. formErrorsContacts:change - измненеи состояния валидации полей формы Contacts
14. contacts:submit - отправка готового заказа на сервер

**Класс Api**
Это класс для работы с внешними данными и сервером.


**View - классы представления**

Класс **Card** - базовый класс для всевозможных карточек, которые есть в приложении
1. Наследуется от Component
2. Содержит поля _title, _price
3. Принимает в конструкторе blockname - название блока и container - html элемент
4. Содержит соответствующие сеттеры title, price


Класс **CardItem** - класс для работы c карточками товаров на главной странице, которые приходят с сервера
1. Наследуется от Card
2. Содержит поля _img, _category, _id,
3. Принимает в конструкторе blockname - название блока и container - html элемент, actions - объект экшенов с событиями
4. Содержит соответствующие сеттеры img, category, id

Класс **CardItemPreview** - класс для работы c карточками товаров на главной странице, которые приходят с сервера
1. Наследуется от Card
2. Содержит поля _img, _category, _description, _buttonBasket, _selected
3. Принимает в конструкторе blockname - название блока и container - html элемент, actions - объект экшенов с событиями
4. Содержит соответствующие сеттеры img, category, description, selected

Класс **CardItemBasket** - класс для работы c карточками товаров в корзине
1. Наследуется от Card
2. Содержит поля _index
3. Принимает в конструкторе blockname - название блока и container - html элемент, actions - объект экшенов с событиями
4. Содержит соответствующие index

Класса **Form** - класс для работы с формами
1. Наследуется от Component
2. Содержит поля _submit, _errors
3. Принимает в конструкторе container - html элемент, events - экземпляр класса Event Emitter
4. Содержит соответствующие сеттеры valid, error
5. Содержит методы onInputChange - для события onInput на полях формы, toogleClass - переключение кнопок со способами оплаты, render - возвращает сам элемент

Класс **Order** - класс для работы с формой Order
1. Наследуется от Form
2. Содержит поля _cardButton, _cashButton
3. Принимает в конструкторе container - html элемент, events - экземпляр класса Event Emitter, actions - объекс событий
4. Содержит соответствующие сеттеры address
5. Содержит методы selectedPaymentMethod - Выбор способа оплаты [Переключение классов]

Класс **Contacts** - класс для работы с формой Contacts
1. Наследуется от Form
2. Содержит поля _cardButton, _cashButton
3. Принимает в конструкторе container - html элемент, events - экземпляр класса Event Emitter, 
4. Содержит соответствующие сеттеры phone, email


Класс **Basket** - класс для работы с корзиной
1. Наследуется от Component
2. Содержит поля _list_, _total, _button
3. Принимает в конструкторе container - html элемент, events - экземпляр класса Event Emitter, 
4. Содержит соответствующие сеттеры items, selected [Отвечает для активную или неактивную кнопку], total


Класс **Modal** - класс для работы  модальными окнами
1. Наследуется от Component
2. Содержит поля _closeButton_, _content
3. Принимает в конструкторе container - html элемент, events - экземпляр класса Event Emitter, 
4. Содержит соответствующие сеттеры content [для отрисовки внутри Превью, корзины, Order или Contacts, Success]
5. Содержим методы open, close, render


Класс **Page** - класс для работы с главной странице приложения
1. Наследуется от Component
2. Содержит поля _counter, _catalog, -wrapper, _basket
3. Принимает в конструкторе container - html элемент, events - экземпляр класса Event Emitter, 
4. Содержит соответствующие сеттеры counter[Счетчик корзины], catalog[Каталог карточек], locked[Блокировка прокрутки страницы]


Класс **Success** - Класс для работы с отображение об успешной отправки заказа на сервер
1. Наследуется от Component
2. Содержит поля _close, _total
3. Принимает в конструкторе container - html элемент, events - экземпляр класса Event Emitter, 
4. Содержит соответствующие сеттеры total [Сумма заказа]


**Класс Model - модель данных**
Класс Model - содержит следующие поля и методы
1. protected cards - карточки с сервера
2. protected basketItems - карточки в корзине
3. order - заказ, уходящий на сервер
4. метод setCard - установить карточки с сервера
5. метод getCards - получить карточки
6. checkInBasket - проверка на то  - есть ли карточка в корзине
7. updateBasket - обновить корзину
8. getBasketCount - количество товаров корзине
9. getBasketItems - получить товар в корзине
10. getBasketTotal - получить сумму товаров в корзине
11. setOrderField - установить поля в order из формы Order
12. validateOrder - Проверить поля в форме Order на валидность
13. setContactsField - установить поля в order из формы Contacts
14. validateContacts - Проверка поля в форму Contacts на валидность
15. clearBasket - очистить корзину от товаров после отправки заказа на сервер
16. getOrder - получить order [заказа]