import { Form } from './common/Form';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export interface IOrder {
  address: string;
  payment: string;
}

export class Order extends Form<IOrder> {
    protected _cardButton: HTMLButtonElement; /*Оплата картой*/
    protected _cashButton: HTMLButtonElement; /*Оплата при получении*/

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._cardButton = ensureElement<HTMLButtonElement>(
            'button[name="card"]',
            this.container
        );
        
        this._cashButton = ensureElement<HTMLButtonElement>(
            'button[name="cash"]',
            this.container
        );


        if (this._cashButton) {
            this._cashButton.addEventListener('click', (event) => {
                this.onInputChange('payment', 'cash');
            })
        }
        if (this._cardButton) {
            this._cardButton.addEventListener('click', (event) => {
                this.onInputChange('payment', 'card');
            })
        }
    }

    /*Смена способа оплаты*/
    set payment(value: string){
        if(value === "cash") {
            this._cashButton.classList.add('button_alt-active');
            this._cardButton.classList.remove('button_alt-active');
        }else if (value === "card") {
            this._cashButton.classList.remove('button_alt-active');
            this._cardButton.classList.add('button_alt-active');
        }
    }

    /*Метод для сброса обводки кнопок и значений внутри input после отправки заказа на сервер*/
    disableButtons() {
        this._cashButton.classList.remove('button_alt-active');
        this._cardButton.classList.remove('button_alt-active');
        (this.container.elements.namedItem('address') as HTMLInputElement).value = "";
    }
}