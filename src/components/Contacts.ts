import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface I_Contacts {
    isValid: boolean, /*Отвечает за то, что все поля валидные и кнопка оформления валидная*/
    active: number, /*Отвечает за видимость на странице. Переключает класс видимости*/
}


export class Contacts extends Component<I_Contacts> {   
    protected contactsCloseBtn: HTMLButtonElement;
    protected contactsEmail: HTMLInputElement;
    protected contactsPhone: HTMLInputElement;
    protected contactsBtn: HTMLButtonElement;
    protected contactForm: HTMLFormElement;
    
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.contactsCloseBtn = ensureElement(".modal__close", this.container) as HTMLButtonElement;
        this.contactsEmail = ensureElement(".email", this.container) as HTMLInputElement;
        this.contactsPhone = ensureElement(".phone", this.container) as HTMLInputElement;
        this.contactsBtn = ensureElement(".button", this.container) as HTMLButtonElement;
        this.contactForm = ensureElement(".form", this.container) as HTMLFormElement;

        this.contactsCloseBtn.addEventListener("click", () => {
            events.emit("contacts:close");
        });

        this.contactsEmail.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            const email = target.value;
            events.emit("contacts:set", {
                email: email,
            })
        });

        this.contactsPhone.addEventListener("input", (event) => {
            const target = event.target as HTMLInputElement;
            const phone = target.value;
            events.emit("contacts:set", {
                phone: phone,
            })
        });

        this.contactsBtn.addEventListener("click", () => {
            events.emit("contacts:close");
            events.emit("order:request");
           /*  events.emit("success:open"); */
        });

        this.contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
        });

    };

    set active(active: number){
        console.log(active);
        this.toggleClass(this.container, "modal_active");;
    }

    set isValid(isValid: boolean){
        this.setDisabled( this.contactsBtn, !isValid);
    }


    render(data: Partial<I_Contacts>) : HTMLElement {
       /*  console.log(data); */
        Object.assign(this as object, data);
        return this.container;
    }
}