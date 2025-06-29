import { I_CardItem, I_BasketItem, I_PaymentsAndAddress, I_EmailAndPhone} from "../types"

export class Model {

    protected cards: I_CardItem[];
    protected basketItems: I_BasketItem[];
    protected order: I_PaymentsAndAddress;
    protected contacts: I_EmailAndPhone;

    constructor(){
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
    };

    /*Получить массив карточек*/
    getCards(){
        return this.cards;
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

    /*Добавить товар в корзине*/
    addBasketItem(newItem: I_BasketItem):void {
        this.basketItems = [...this.basketItems, newItem];
    }

    /*Удалить товар из корзины*/
    deleteBasketItem(id: number):void {
        this.basketItems = this.basketItems.reduce((acc, current) => {
            return current.id === id ? acc : [...acc, current];
        }, []);
    }

    /*Получить количество товаров в корзине*/
    getBasketItemCount(){
        return this.getBasketItems().length;
    }

    /*===Методы для работы с полями форм===*/
    setOrderValues(params: I_PaymentsAndAddress){
        this.order.payments = params.payments;
        this.order.address = params.address;
    }

    setContactsValues(params: I_EmailAndPhone){
        this.contacts.email = params.email;
        this.contacts.phone = params.phone;
    }





}