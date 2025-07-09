import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";
import { I_BasketItem } from "../types";

interface I_BasketItem1 extends I_BasketItem {
    index: number; /*Внес индекс что-бы была нумерция в корзине*/
}

export class BasketItem extends Component<I_BasketItem1> {
    protected basketItemIndex: HTMLElement; /*ПОрядковый номер*/
    protected basketItemTitle: HTMLElement; /*Заголовок*/
    protected basketItemPrice: HTMLElement; /*Цена*/
    protected basketItemDelete: HTMLButtonElement;
    protected itemId: string;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.basketItemIndex = ensureElement(".basket__item-index", this.container) as HTMLElement;
        this.basketItemTitle = ensureElement(".card__title", this.container) as HTMLElement;
        this.basketItemPrice = ensureElement(".card__price", this.container) as HTMLElement;
        this.basketItemDelete = ensureElement(".basket__item-delete", this.container) as HTMLButtonElement;
        this.basketItemDelete.addEventListener("click", () => {
            events.emit("basket:changed", {id: this.itemId});
            events.emit("basket:update");
        })
    };

    set id(id: string) {
        this.itemId = id;
    }

    set title(title: string) {
        this.setText(this.basketItemTitle, title);
    }

    set price(price: number) {
        this.setText(this.basketItemPrice, price);
    }

    set index(index: number) {
        this.setText(this.basketItemIndex, `${index+1}`);
    }

    render(data: Partial<I_BasketItem1>) : HTMLElement {
        console.log(data);
        Object.assign(this as object, data);
        return this.container;
    }
}