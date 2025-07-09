import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface I_Success {
    total: number;
    active: 1
}


export class Success extends Component<I_Success> {
    protected successClose: HTMLButtonElement; /*Кнопка крестика*/
    protected successBtn: HTMLButtonElement; /*Кнопка - За новыми покупками*/
    protected successTotal: HTMLElement; /*Суммарная стоимость покупки*/

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.successClose = ensureElement(".modal__close", this.container) as HTMLButtonElement;
        this.successBtn = ensureElement(".order-success__close", this.container) as HTMLButtonElement;
        this.successTotal = ensureElement(".order-success__close", this.container) as HTMLElement;

        this.successClose.addEventListener("click", (event) => {
            events.emit("success:close");
        });

        this.successBtn.addEventListener("click", () => {
            events.emit("success:close");
        });

    };

    set total(total: number) {
        console.log(total);
    }

    set active(active: number){
        this.toggleClass(this.container, "modal_active");
    }

    render(data: Partial<I_Success>) : HTMLElement {
       /*  console.log(data); */
        Object.assign(this as object, data);
        return this.container;
    }
}