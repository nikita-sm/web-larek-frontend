import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface I_Page {
    cards: HTMLElement[];
    counter: number,
};

export class Page extends Component<I_Page> {
    protected cardsContainer: HTMLElement; /*Элемент для вывода списка карточек*/
    protected basketButton: HTMLElement; /*Иконка корзины*/
    protected basketCount: HTMLElement; /*Span с количеством товаров в корзине*/
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.cardsContainer = ensureElement(".gallery", this.container);
        this.basketButton = ensureElement(".header__basket", this.container);
        this.basketCount = ensureElement(".header__basket-counter", this.container)
        this.basketButton.addEventListener("click", function(){
            events.emit("basket:open");
        })
    };

    /*Отрисовываю карточки на главной странице*/
    set cards(cardsArray: HTMLElement[]){
        this.cardsContainer.replaceChildren(...cardsArray)
    }

    set counter(value: number) {
        this.setText(this.basketCount, value);
    }

    render(data: Partial<I_Page>) : HTMLElement {
        Object.assign(this as object, data);
        return this.container;
    }
}