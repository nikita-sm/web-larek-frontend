/*Интерфейс для 1-й карточки, приходящей с сервера. Эти данные отрисовываются внутри карточки на главной странице*/
export interface I_CardItem {
    category: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
    selected: boolean;
};

/*Интерфейс для 1-го товара, находящегося в корзине*/
export interface I_BasketItem {
    id: string;
    title: string;
    price: number;
}


/*Интерфейс для состояния формы*/
export interface IFormState {
	valid: boolean;
	errors: string[];
}

// Интерфейс для состояния формы Order: способы оплаты и адрес доставки
export interface IOrderForm {
	payment: string;
	address: string;
}

// Интерфейс для состояния формы Order: способы оплаты и адрес доставки
export interface IContactsForm {
    email: string,
    telephone: string,
}

/*Интерфейс, который объединяет все свойства из IOrderForm + IOrderForm + total, items*/
export interface IOrder extends IOrderForm, IContactsForm {
    total: number,
    items: string[],
}

/*Интерфейс, которые объединяет все свойства из IContactsForm + items*/
export interface IContacts extends IContactsForm {
	items: string[];
}

/*Интерфейс для события клика на html-элементах [на модальных окнах]*/
export interface IActions {
	onClick: (event: MouseEvent) => void;
}

/*Интерфейс для события клика по Success*/
export interface ISuccessActions {
	onClick: () => void;
}

// Оформление заказа
export interface ISuccess {
	id: string;
	total: number;
}
/*Тип (интерфейс) объекта для описания ошибок при валидации формы Order*/ 
export type FormErrorsOrder = Partial<Record<keyof IOrder, string>>;

/*Тип (интерфейс) объекта для описания ошибок при валидации формы Contacts*/
export type FormErrorsContacts = Partial<Record<keyof IContacts, string>>;








