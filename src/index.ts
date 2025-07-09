import { Api } from './components/base/api';
import { Card } from './components/Card';
import { Page } from './components/Page';
import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Model } from './components/Model';
import { API_URL } from './utils/constants';
import { CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Preview } from './components/Preview';
import { Basket } from './components/Basket';
import { BasketItem } from './components/BasketItem';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';


const api = new Api(API_URL);
const events = new EventEmitter();
const model = new Model(events);
const cardTemplate = document.querySelector("#card-catalog") as HTMLTemplateElement;
const previewTemplate  = document.querySelector("#card-preview") as HTMLTemplateElement;
const basketItemTemplate = document.querySelector("#card-basket") as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const page = new Page(document.querySelector(".page") as HTMLElement, events);

const order = new Order(document.querySelector(".modal_order"), events);
const contacts = new Contacts(document.querySelector(".modal_contacts"), events)
const success = new Success(document.querySelector(".modal_success"), events);

type Result = {
    total: number;
    items: any[];
}

api.get("/product/")
    .then((res: Result) => {
        const {items} = res; //Получение массива карточек без нормального адреса карточек
        const cards = items.map((card) => {
            return {
                ...card,
                image: CDN_URL + card.image,
                price: !card.price ? 2 : card.price, /*Заменяю значение null на значение 2*/
            }
        });
        model.setCards(cards);
    })
    .catch(err => {
        console.log(err);
    });

events.on("cards:set", () => {
    const cardsHTMLArray = model.getCards().map(item => new Card(cloneTemplate(cardTemplate), events).render(item))
    page.render({
        cards: cardsHTMLArray,
        counter: model.getBasketItemCount(),
    });
});


const preview = new Preview(cloneTemplate(previewTemplate), events);
events.on("card-preview:open", ({id}: {id: string}) => {
    const inBasket = model.inBasket(id);
    const {category, title, description, image, price} = model.getCard(id);
    preview.render({
                category,
                title,
                description,
                image,
                price,
                visible: true,
                id,
                inBasket,
            });
});

events.on("card-preview:close", ({id}: {id: string}) => {
    preview.render({
        visible: false,
    })
});

/*Изменение товаров в корзине*/
events.on("basket:changed", (data: {id: string}) => {
    const idCard = data.id
    const card = model.getCard(idCard);
    const {id, title, price} = card;
    const inBasket = model.updateBasketItems({
        id, title, price
    });
    preview.render({
        inBasket: inBasket,
    })
    page.render({
        counter: model.getBasketItemCount(),
    });

});

/*Событие, которое перерисовывает корзину. Здесь нет взаимодействия с данными*/
events.on("basket:update", () => {
    const itemsHTMLArray = model.getBasketItems().map(({id, title, price}, index) => new BasketItem(cloneTemplate(basketItemTemplate), events).render({id, price, title, index}));
    
    /*Отрисовали массив в корзине*/
    basket.render({
        items:itemsHTMLArray,
        total: model.getTotalPrice(),
        /* visible: true, */
    });
})



const basket = new Basket(cloneTemplate(basketTemplate), events);
events.on("basket:open", () => {
    const cardsHTMLArray = model.getCards().map(item => new Card(cloneTemplate(cardTemplate), events).render(item))
    page.render({
        cards: cardsHTMLArray,
        counter: model.getBasketItemCount(),
    });

    /*Получили массив html на основе данных из корзины*/
    const itemsHTMLArray = model.getBasketItems().map(({id, title, price}, index) => new BasketItem(cloneTemplate(basketItemTemplate), events).render({id, price, title, index}));
    
    /*Отрисовали массив в корзине*/
    basket.render({
        items:itemsHTMLArray,
        total: model.getTotalPrice(),
        visible: true,
    });
});

events.on("basket:close", (data) => {
    basket.render({
        visible: false,
    })
});

events.on("order:open", () => {
    order.render({
        active: 1,
        isValid: model.isValidOrder(),
    });
    console.log(model.getOrder());
});

events.on("order:close", () => {
    order.render({
        active: 1,
    });
})

events.on("order:set", (data) => {
    model.setOrderValues(data);
    order.render({
        isValid: model.isValidOrder(),
        payments: model.getOrder().payments,
    })
});

events.on("contacts:open", () => {
    contacts.render({
        active: 1,
    })
});

events.on("contacts:close", () => {
    contacts.render({
        active: 1,
    });
});

events.on("contacts:set", (data) => {
    model.setContactsValues(data);
    contacts.render({
        isValid: model.isValidContacts(),
    })
});

events.on("order:request", () => {
    const {payments, address} = model.getOrder();
    const {email, phone} = model.getContacts();
    const total = model.getTotalPrice();
    const items = model.getBasketItems().map(item => item.id);
    const data = {
        payment: payments, address, email, phone, total, items
    };
    api.post("/order/", data)
        .then(res => {
           success.render({
                active: 1,
                total: model.getTotalPrice(),
            });
        })
});




events.on("success:close", () => {
    success.render({
        active: 1,
    });
    model.resetData();
    page.render({
        counter: model.getBasketItemCount(),
    });

});

