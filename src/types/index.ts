/*Интерфейс для 1-й карточки, приходящей с сервера. Эти данные отрисовываются внутри карточки на главной странице*/
export interface I_CardItem {
    category: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
};

/*Интерфейс для 1-го товара, находящегося в корзине*/
export interface I_BasketItem {
    id: string;
    title: string;
    price: number;
}

/*Интерфейс для модального окна (формы) со способами оплаты и адресом доставки*/
export interface I_PaymentsAndAddress {
    payments?: string;
    address?: string;
}

/*Интерфейс для модального окна (формы) c номером телефона и электронным адресом*/
export interface I_EmailAndPhone {
    email?: string;
    phone?: string;
}









