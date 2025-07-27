import { Api } from './components/base/api';
import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL, PaymentMethods } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';
import { Model } from './components/Model';
import { I_CardItem, IOrderForm, IOrder, IContactsForm } from './types';
import { Card, CardItem, CardItemPreview, CardItemBasket } from './components/Card';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';


const api = new Api(API_URL);
const events = new EventEmitter();
const model = new Model(events);

type Result = {
    total: number;
    items: any[];
}


/*Получить все шаблоны*/
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketItemTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");

/*Глобальный контейнер*/
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); /*Модальное окно*/
const page = new Page(document.body, events); /*Страница*/

/**Переиспользуемые части приложения*/
const basket = new Basket(cloneTemplate(basketItemTemplate), events)
/* const order = new Form(cloneTemplate(orderTemplate), events); Можно пока не использовать данный элемент */
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), { onClick: () => modal.close()});

/*Загрузка данных с сервера*/
api.get("/product/")
    .then((res: Result) => {
        const {items} = res; 
        const cards = items.map((card) => {
            return {
                ...card,
                image: CDN_URL + card.image,
            }
        });
        model.setCards(cards);

    })
    .catch(err => {
        console.log(err);
    });


/*Сохранить карточки, пришедшие с сервера в массив*/
events.on("cards:set", (data: {cards: I_CardItem[]}) => {
    console.log(data.cards);
    const cardsHtmlArray = data.cards.map(item => new CardItem('card', cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit("card:open", item)
    }).render({
        title: item.title,
        price: item.price,
        img: item.image,
        id: item.id,
        category: item.category,
    }));
    page.render({
        catalog: cardsHtmlArray,
    });
});

/*Открыть карточку товара - Превью*/
events.on("card:open", (card: I_CardItem) => {
    const preview = new CardItemPreview("card", cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit("preview:toggle", card);
            preview.selected = model.checkInBasket(card);
        }
    });
    
    modal.render({
        content: preview.render({
            ...card,
            selected: model.checkInBasket(card),
        }),
    })
});

/*Переключение в карточке Превью: Добавить в корзину - Удалить из корзины*/ 
events.on('preview:toggle', (card: I_CardItem)=> {
    model.updateBasket(card);
    page.render({
        counter: model.getBasketCount(),
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', (card) => {
    page.locked = true;
});

// Разблокируем
events.on('modal:close', (card) => {
    page.locked = false;
});


events.on("basket:open", () => {
    console.log(model.getBasketItems());
    modal.render({
        content: basket.render({
            /* total: model.getBasketTotal(), */
        }),
    });
});

events.on("basket:update", (items: I_CardItem[]) => {
    const updatesBasketHHTMLItems = items.map((item, i) => new CardItemBasket("card", cloneTemplate(cardBasketTemplate), {
        onClick: () => events.emit("preview:toggle", item)
    })
    .render({
        index: i + 1,
        title: item.title,
        price: item.price,
    }));
    
    basket.render({
        items: updatesBasketHHTMLItems,
        total: model.getBasketTotal(),
    })
});

events.on("order:open", () => {
    const {address, payment} = model.order;
    modal.render({
        content: order.render({
            valid: address !== "" && payment !== "",
            errors: [],
        }),
    })
});

events.on('orderInput:change', (data: { field: keyof IOrderForm, value: string }) => {
  model.setOrderField(data.field, data.value);
});

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address }).filter(i => !!i).join(',');
});

// Изменилось состояние валидации контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ phone, email }).filter(i => !!i).join(',');
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            valid: false,
            errors: [],
        })
    })
});

events.on('contacts:submit', () => {
    const {payment, address, phone, email} = model.order;
    /*Полный заказ*/
    const data = {
        payment,
        address,
        phone,
        email,
        items: model.getItemsBasketForOrder(),
        total: model.getBasketTotal(),
    };

    /*ОТправили заказ на сервер*/
    api.post("/order", data)
        .then(res => {
            model.clearBasket(); /*Очистили корзину*/
            model.clearOrder(); /*Сбросили поля данных покупателя addres, email и т.д.*/
            order.disableButtons() /*Сбросил все поля внутри форма Order*/
            contacts.resetInputs(); /*Сбросил все поля внутри форма Contacts*/
            page.counter = 0; /*Обнулили икнонку корзины на главной странице*/
            basket.items = []; /*Обновили корзину - стерли все товары в ней*/
            basket.total = 0; /*Обновили сумму в корзине*/
            events.emit('order:success', res);
        })
});

events.on('order:success', (data: {id: string, total: number}) => {
  modal.render({
    content: success.render({
        total: data.total,
    })
  })
});


