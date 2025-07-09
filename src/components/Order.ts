import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface I_Order {
    active: number,
    isValid: boolean,
    payments: string, /*Отвечает за то какая именно кнопка нажата - Оплата наличными ли по карте*/
}


export class Order extends Component<I_Order> {
    protected orderPaymentOnline: HTMLButtonElement;
    protected orderPaymentCash:HTMLButtonElement;
    protected orderCloseBtn: HTMLElement;
    protected orderInput: HTMLInputElement;
    protected orderButton: HTMLButtonElement;
    protected orderForm: HTMLFormElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.orderPaymentOnline = ensureElement(".payment_online", this.container) as HTMLButtonElement;
        this.orderPaymentCash = ensureElement(".payment_cash", this.container) as HTMLButtonElement;
        this.orderCloseBtn = ensureElement(".modal__close", this.container) as HTMLButtonElement;
        this.orderInput = ensureElement(".form__input", this.container) as HTMLInputElement;
        this.orderButton = ensureElement(".order__button", this.container) as HTMLButtonElement;
        this.orderForm = ensureElement(".form", this.container) as HTMLFormElement;

        this.orderPaymentCash.addEventListener("click", (event) => {
            const target = event.target as HTMLButtonElement;
            const paymentCash = target.dataset.payment;
            events.emit("order:set", {
                payments: paymentCash,
            })
        });

        this.orderPaymentOnline.addEventListener("click", (event) => {
            const target = event.target as HTMLButtonElement;
            const paymentOnline = target.dataset.payment;
            events.emit("order:set", {
                payments: paymentOnline,
            })
        });

        this.orderCloseBtn.addEventListener("click", () => {
            events.emit("order:close");
        });

        this.orderInput.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;
            events.emit("order:set", {
                address: value,
            })
        });

        this.orderButton.addEventListener("click", () => {
            events.emit("order:close");
            events.emit("contacts:open");
        });

        this.orderForm.addEventListener("submit", (event) => {
            event.preventDefault();
        })

    };

    set active(active: number) {
       this.toggleClass(this.container, "modal_active");
    }

    set isValid(isValid: boolean){
        this.setDisabled( this.orderButton, !isValid);
    }

    set payments(payments: string) {
        if(payments === "cash") {
            this.addClass(this.orderPaymentCash, "button_alt-active");
            this.removeClass(this.orderPaymentOnline, "button_alt-active");
        } else if (payments === "online") {
            this.removeClass(this.orderPaymentCash, "button_alt-active");
            this.addClass(this.orderPaymentOnline, "button_alt-active");
        } else {
            this.removeClass(this.orderPaymentCash, "button_alt-active");
            this.removeClass(this.orderPaymentOnline, "button_alt-active");
        }
    }

    render(data: Partial<I_Order>) : HTMLElement {
        console.log(data);
        Object.assign(this as object, data);
        return this.container;
    }
}