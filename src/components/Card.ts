import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface I_CardItem {
    category: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
};


export class Card extends Component<I_CardItem> {
    protected categoryCard: HTMLSpanElement;
    protected titleCard: HTMLTitleElement;
    protected imageCard: HTMLImageElement;
    protected priceCard: HTMLSpanElement;
    protected idValue: string;
    constructor(container: HTMLElement, protected event: EventEmitter) {
        super(container);
        this.categoryCard = ensureElement(".card__category", this.container)  as HTMLSpanElement;
        this.titleCard = ensureElement(".card__title", this.container)  as HTMLTitleElement;
        this.imageCard = ensureElement(".card__image", this.container)  as HTMLImageElement;
        this.priceCard = ensureElement(".card__price", this.container)  as HTMLSpanElement;
        /* console.log(this.id);
        container.addEventListener("click", function(){
           console.log("Открыть модальное окно");
        }); */
        this.container.addEventListener("click", () => {
            this.event.emit("card-preview:open", {
                id: this.idValue,
            })
        })
    }

    set category(value: string){
        /* console.log("Свойство категории"); */
        this.setText(this.categoryCard, value);
    }
    set title(value: String){
        /* console.log("Свойство Заголовка"); */
        this.setText(this.titleCard, value);
    }
    set image(url: string) {
        /* console.log("Свойство Изображени"); */
        this.setImage(this.imageCard, url);
    }
    set price(value: number) {
        console.log("Свойство цены внутри карточки");
        this.setText(this.priceCard, `${value} синапсов`);
    }

    set id(value: string) {
        this.idValue = value;
       /*  this.container.addEventListener("click", () => {
            this.event.emit("card-preview:open", {
                id: value,
            })
        }) */

    }

    render(data: Partial<I_CardItem>) : HTMLElement{
        Object.assign(this as object, data);
        return this.container;
    }
}