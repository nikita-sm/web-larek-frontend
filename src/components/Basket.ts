import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface I_Basket {
    items: HTMLElement[],
    total: number,
    visible: boolean,
}


export class Basket extends Component<I_Basket> {   
    protected basketList: HTMLUListElement;
    protected basketPrice: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketCloseBtn: HTMLElement;
    protected visibleValue: boolean;
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.basketList = ensureElement(".basket__list", this.container) as HTMLUListElement;
        this.basketPrice = ensureElement(".basket__price", this.container) as HTMLUListElement;
        this.basketButton = ensureElement(".basket__button", this.container) as HTMLButtonElement;
        this.basketButton.addEventListener("click", () => {
            events.emit("basket:close")
            events.emit("order:open")
        });

        this.basketCloseBtn = ensureElement(".basket__close", this.container) as HTMLElement;
        this.basketCloseBtn.addEventListener("click", function(){
            events.emit("basket:close")
        })
    };

    set items(items: HTMLElement[]) {
        if(items.length > 0) {
            this.basketList.replaceChildren(...items);
        }else {
            this.basketList.replaceChildren("Пусто");
        }
        /* let res: string | HTMLElement[];
        if(items.length === 0) {
            res = "Пусто";
        }else {
            res = items;
        }
        this.basketList.replaceChildren(...items) */
    }

    set total(total: number) {
        this.setText(this.basketPrice, total);
        this.setDisabled(this.basketButton, total ? false : true);
    }

    set visible(visible: boolean){
        const basket = document.querySelector(".basket__overlay");
        if(!basket) {
            document.querySelector(".page").append(this.container);
        }
        this.toggleClass(this.container, "unvisible");
    }

    render(data: Partial<I_Basket>) : HTMLElement {
       /*  console.log(data); */
        Object.assign(this as object, data);
        return this.container;
    }
}