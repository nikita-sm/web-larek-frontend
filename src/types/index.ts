/*Интерфейс для 1-й карточки, приходящей с сервера. Эти данные отрисовываются внутри карточки на главной странице*/
export interface I_CardItem {
    category: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
/*     selected: boolean; данное поле удаляем*/
};


/*Интерфейс для состояния формы*/
export interface IFormState {
	valid: boolean;
	errors: string[];
}

// Интерфейс для состояния формы Order: способы оплаты и адрес доставки
export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

// Интерфейс для состояния формы Order: способы оплаты и адрес доставки
export interface IContactsForm {
    email: string,
    telephone: string,
}

/*Интерфейс для описания полей заказа, которые уходят на сервер*/
export interface IOrder {
  items: string[];
  payment: string;
  total: number;
  address: string;
  email: string;
  phone: string;
}

/*Интерфейс полей формы*/
export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

/*Тип для описани ошибок в форме*/
/*Частичнвй набор свойств из Интерфейса iOrderForm*/
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IActions  {
    onClick: (evt: Event) => void;
}








