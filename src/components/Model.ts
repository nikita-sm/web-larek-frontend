import { I_CardItem, I_BasketItem, I_PaymentsAndAddress, I_EmailAndPhone} from "../types"
import { IEvents } from "./base/events";

export class Model {

    protected cards: I_CardItem[];
    protected basketItems: I_BasketItem[];
    protected order: I_PaymentsAndAddress;
    protected contacts: I_EmailAndPhone;


    constructor(protected events: IEvents){
        this.cards = [];
        this.basketItems = [];
        this.order = {
            payments: "",
            address: "",
        }
        this.contacts = {
            email: "",
            phone: "",
        }
    };

    /*====Методы для работы с карточками товаров, приходящих с сервара====*/
    /*Установить значение массива*/
    setCards(cards: I_CardItem[]): void {
        this.cards = cards;
        this.events.emit("cards:set"); /*Установили карточки с сервера*/
    };

    /*Получить массив карточек*/
    getCards(){
        return this.cards;
    }

    getCard(id: string) {
        return this.getCards().find(el => el.id === id);
    }

    /*=========Методы для работы с товары, находящимися в корзине=========*/
    /*Установить массив товаров в корзине*/
    setBasketItems(basketItems: I_BasketItem[]): void {
        this.basketItems = basketItems;
    };

    /*Получить массив товаро в корзине*/
    getBasketItems(){
        return this.basketItems;
    }

    /*Сбросить очистить массив товаров в корзине*/

    /*Обновить корзину. Если элемент есть  в корзине, то удалить из корзины иначе - добавить*/
    updateBasketItems(item: I_BasketItem):boolean {
        let res: boolean = true
        const itemInBasket = this.basketItems.find(el => el.id === item.id);
        if(itemInBasket === undefined) { /*Если не переданного item, то добавить в корзину*/
            this.basketItems = [...this.basketItems, item];
            res = true;
        } else { /*Если есть в корзине, то удалить*/ 
            this.basketItems = this.basketItems.filter(el => el.id !== item.id);
            res = false;
        };
        return res;
    }

    /**Проверка на эленмент в корзине*/
    inBasket(id: string) : boolean {
        return !!this.getBasketItems().filter(value => value.id === id).length;
    }
    /*Получить количество товаров в корзине*/
    getBasketItemCount(){
        return this.getBasketItems().length;
    }

    /*Стоимость товаров в корзине*/
    getTotalPrice(){
        return this.basketItems.reduce((acc, current) => {
            return acc + current.price;
        }, 0);
    }

    /*===Методы для работы с полями форм===*/
    setOrderValues(params: I_PaymentsAndAddress){
        for(let key in params) {
            if(key in this.order) {
                const key_ = key as keyof I_PaymentsAndAddress
                this.order[key_] = params[key_];
            }
        };
        console.log(this.order);
    }

    setContactsValues(params: I_EmailAndPhone){
        for(let key in params) {
            if(key in this.contacts) {
                const key_ = key as keyof I_EmailAndPhone
                this.contacts[key_] = params[key_];
            }
        };
        console.log(this.contacts);
    }

    getOrder(){
        return this.order;
    }

    isValidOrder(){
        const {address, payments} = this.getOrder();
        return address.length > 5 && payments.length > 0;
    }

    getContacts(){
        return this.contacts;
    }

    isValidContacts(){
        const {email, phone} = this.getContacts();
        return email.length > 5 && phone.length > 10;
    }

    /*Сбросить данные*/
    resetData(){
        this.basketItems = [];
        this.order = {
            payments: "",
            address: "",
        }
        this.contacts = {
            email: "",
            phone: "",
        }
    }




}