import { I_CardItem} from "../types"
import { IEvents } from "./base/events";
import { IOrder, FormErrors, IOrderForm } from '../types';
import { Order } from "./Order";

export class Model {

    protected cards: I_CardItem[];
    protected basketItems:  I_CardItem[];
    order: IOrderForm;
    formErrors: FormErrors;

    constructor(protected events: IEvents){
        this.cards = [];
        this.basketItems = [];
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        };
        this.formErrors = {};
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
    checkInBasket(card:I_CardItem) : boolean {
        let res: boolean = false;
        const basket = this.getBasketItems();
        const length = this.getBasketCount();
        for(let i = 0; i < length; i++) {
            if(card.id === basket[i].id) {
                res = true;
                break;
            }
        }
        return res;
    };

     updateBasket(card: I_CardItem){
        /*Есть или нет в корзине*/
        const flag = this.checkInBasket(card);
        if(flag) {
            /* Удалить */
            this.basketItems = this.basketItems.filter(item => item.id !== card.id);
        }else {
            /*Добавить*/
            this.basketItems.push(card);
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
            return acc + current.price;
        }, 0);
    }

    /*Получить все id товаров для финального заказа*/
    getItemsBasketForOrder(){
        return this.getBasketItems().map((item) => item.id);
    }

    /*Очистка корзины после отправки заказа*/
    clearBasket(){
        this.basketItems.length = 0;
    }

    clearOrder(){
        this.order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        }
    }

    /*Установить значения в Order*/
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        console.log(this.order);
        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order)
        }
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
        errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
  }

    /*=========Методы для работы с товары, находящимися в корзине=========*/

}