import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface I_CardItem {
    categoty: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
};


export class Card extends Component<I_CardItem> {
    protected category: HTMLSpanElement;
    protected title: HTMLTitleElement;
    protected image: HTMLImageElement;
    protected price: HTMLSpanElement;

    constructor(container: HTMLElement) {
        super(container);
        this.category = ensureElement(".card__category", this.container)  as HTMLSpanElement;
        this.title = ensureElement(".card__title", this.container)  as HTMLTitleElement;
        this.image = ensureElement(".card__image", this.container)  as HTMLImageElement;
        this.price = ensureElement(".card__price", this.container)  as HTMLSpanElement;
        container.addEventListener("click", function(){
            console.log(this);
        });
    }

    set categoryValue(value: string){
        this.setText(this.category, value);
    }
    set titleValue(value: String){
        this.setText(this.title, value);
    }
    set imageValue(url: string) {
        this.setImage(this.image, url);
    }
    set priceValue(value: number) {
        this.setText(this.price, value);
    }

    render(){
        return this.container;
    }
}