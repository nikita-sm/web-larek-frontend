/*Интерфейс для 1-й карточки, приходящей с сервера. Эти данные отрисовываются внутри карточки на главной странице*/
interface I_CardItem {
    categoty: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
};

/*Интерфейс для массива всех карточек, приходящих с сервера. Этот массив карточек отрисовывается на главной странице сайта*/
interface I_CardItemList {
    list: I_CardItem[]
}

/*Интерфейс для 1-го товара, находящегося в корзине*/
interface I_BasketItem {
    title: string;
    price: number;
}

/*Интерфейс для всех товаров в корзине - они хранятся в виде массива*/
interface I_BasketItemList {
    list: I_BasketItem[];
}

/*Интерфейс для модального окна (формы) со способами оплаты и адресом доставки*/
interface I_PaymentsAndAddress {
    payments: string;
    address: string;
}

/*Интерфейс для модального окна (формы) c номером телефона и электронным адресом*/
interface I_EmailAndPhone {
    email: string;
    phone: string;
}









