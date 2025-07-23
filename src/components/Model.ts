import { I_CardItem, I_BasketItem} from "../types"
import { IEvents } from "./base/events";
import { IOrder, IContactsForm, FormErrorsOrder, FormErrorsContacts, IOrderForm } from "../types";
import { Order } from "./Order";

export class Model {

    protected cards: I_CardItem[];
    protected basketItems:  I_CardItem[];
    order: IOrder;

    protected formErrorsOrder: FormErrorsOrder;
    protected formErrorsContacts: FormErrorsContacts;


    constructor(protected events: IEvents){
        this.cards = [];
        this.basketItems = [];
        this.order = {
            payment: "online",
            address: "",
            email: "",
            telephone: "",
            total: 0,
            items: [],
        },
        this.formErrorsOrder = {};
	    this.formErrorsContacts = {};
    };

    /*====Методы для работы с карточками товаров, приходящих с сервара====*/
    /*Установить значение массива*/
    setCards(cards: I_CardItem[]): void {
        this.cards = cards;
        this.events.emit("cards:set", {
            cards: cards,
        })
    };

    /*Получить массив карточек*/
    getCards(){
        return this.cards;
    };

    /*Проверка на наличие элемента в корзине*/
    checkInBaskey(card:I_CardItem) : number {
        return this.basketItems.findIndex(item => {
            return item.id === card.id;
        });
    };

     updateBasket(card: I_CardItem){
        /*Есть или нет в корзине*/
        const index = this.checkInBaskey(card);
        if(index === -1) {
            card.selected = true;
            this.basketItems.push(card);
        }else {
            card.selected = false;
            this.basketItems.splice(index, 1);
        };
        this.events.emit("basket:update", this.getBasketItems());
    }

    /*Количество товаров в корзине*/
     getBasketCount(){
        return this.basketItems.length;
    }

    /*Получить корзину с товарами*/
     getBasketItems(){
        return this.basketItems;
    }

     getBasketTotal(){
        return this.getBasketItems().reduce((acc, current) => {
            if(current.price === null) {
                return acc;
            }
            return acc + current.price;
        }, 0);
    }

    /*Установить значения в Order*/
    setOrderField<K extends keyof IOrderForm>(field: K, value: IOrderForm[K]) {
        this.order[field] = value;

        /*Форма Order готова - кнопка отправки данных активная*/
        if (this.validateOrder()) {
            
			this.events.emit('order:ready', this.order);
		}
    }
    
    /*Валидация в Order*/
    validateOrder() {
		const errors: typeof this.formErrorsOrder = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrorsOrder = errors;
		this.events.emit('formErrorsOrder:change', this.formErrorsOrder);
        
		return Object.keys(errors).length === 0;
	}

    setContactsField<K extends keyof IContactsForm>(field: K, value: IContactsForm[K]) {
		this.order[field] = value;

        /*Форма Contacts готова - кнопка отправки данных активная*/
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateContacts() {
		const errors: typeof this.formErrorsContacts = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.telephone) {
			errors.telephone = 'Необходимо указать телефон';
		}
		this.formErrorsContacts = errors;
		this.events.emit('formErrorsContacts:change', this.formErrorsContacts);

		return Object.keys(errors).length === 0;
	}

    /*Очистка корзины*/
    clearBasket() {
        /*Очищаем корзину*/
		this.basketItems = [];
        /*Внутри массива карточек меняем поле selected на false - нет выбранных карточек*/
        this.getCards().forEach(item => {
            item.selected = false;
        })
	}

    getOrder(){
        return this.order;
    }

    /*=========Методы для работы с товары, находящимися в корзине=========*/

}