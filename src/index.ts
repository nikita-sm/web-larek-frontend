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
const order = new Order(cloneTemplate(orderTemplate), events, {
    onClick: (evt: Event) => events.emit('payment:toggle', evt.target),
});

const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

/*Загрузка данных с сервера*/
api.get("/product/")
    .then((res: Result) => {
        const {items} = res; 
        const cards = items.map((card) => {
            return {
                ...card,
                image: CDN_URL + card.image,
                selected: false,
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

/*Открыть карточку товара - открыть Превью*/
events.on("card:open", (card: I_CardItem) => {
    const preview = new CardItemPreview("card", cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit("preview:toggle", card);
            preview.selected = model.checkInBaskey(card) > -1 ? true : false;
        }
    });
    
    modal.render({
        content: preview.render(card),
    })
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', (card) => {
    
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', (card) => {
    page.locked = false;
});

events.on('preview:toggle', (card: I_CardItem)=> {
    model.updateBasket(card);
    page.render({
        counter: model.getBasketCount(),
    });
});

events.on("basket:open", () => {
    const basketHTMLItems = model.getBasketItems().map((item, i) => new CardItemBasket("card", cloneTemplate(cardBasketTemplate), {
        onClick: () => events.emit("preview:toggle", item)
    })
    .render({
        index: i + 1,
        title: item.title,
        price: item.price,
    }));
    
    modal.render({
        content: basket.render({
            items: basketHTMLItems,
            total: model.getBasketTotal(),
            selected: model.getBasketTotal(),
        })
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
    /*Перерисовка корзины: строка товара, количество и активная кнопка*/
    basket.render({
        items: updatesBasketHHTMLItems,
        total: model.getBasketTotal(),
        selected: model.getBasketTotal(),
    })
});

events.on("order:open", () => {
    modal.render({
        content: order.render({
            address: "",
            valid: false,
			errors: [],
        }),
    })
});

// Смена способа оплаты
events.on('payment:toggle', (name: HTMLElement) => {
	if (!name.classList.contains('button_alt-active')) {
		order.selectPaymentMethod(name);
		model.order.payment = PaymentMethods[name.getAttribute('name')];
	}
});

events.on(
	/^order\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
		model.setOrderField(data.field, data.value);
	}
);

/*Валидация формы Order*/
events.on('formErrorsOrder:change', (errors: Partial<IOrder>) => {
	const { address } = errors;
	order.valid = !address;
	order.errors = Object.values({ address }).filter(Boolean).join('; ');
});

/*Закрыть Order и открыть Contacts*/
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			telephone: '',
			valid: false,
			errors: [],
		}),
	});
	model.order.items = model.getBasketItems().map((item) => item.id);
    model.order.total = model.getBasketTotal();
});

// Изменилось одно из полей формы контактов
events.on(
	/^contacts\.[^:]*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		model.setContactsField(data.field, data.value);
        console.log(data);
	}
);

// Изменилось состояние валидации формы контактов
events.on('formErrorsContacts:change', (errors: Partial<IOrder>) => {
	const { email, telephone } = errors;
	contacts.valid = !email && !telephone;
	contacts.errors = Object.values({ email, telephone }).filter(Boolean).join('; ');
});

events.on('contacts:submit', () => {
    const {payment, address, items, total, telephone, email} = model.getOrder();
    const data = {
        payment,
        address, 
        items,
        total,
        phone: telephone,
        email,
    };
    api.post("/order", data)
        .then((res: {id: string, total: number})  => {
            model.clearBasket();
			page.counter = model.getBasketItems().length;
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.total = res.total;

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});



