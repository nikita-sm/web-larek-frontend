import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

interface I_Preview {
    category: string,
    title: string,
    description: string,
    image: string,
    price: number,
    visible: boolean,
    id: string,
    inBasket: boolean, /*Находится ли товар в корзине*/
};

export class Preview extends Component<I_Preview> {
    protected previewImage: HTMLImageElement; /*Картинка на Превью*/
    protected previewCategory: HTMLElement; /*Категория*/
    protected previewTitle: HTMLElement; /*Заголовок*/
    protected previewDescription: HTMLElement; /*Описание*/
    protected previewPrice: HTMLElement; /*Цена*/
    protected btnBuyPreview: HTMLElement;  /*Кнопка купить*/
    protected btnClosePreview: HTMLElement; /*Кнопка закрыть*/
    protected idCard: string;
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.previewImage = ensureElement(".card__image", this.container) as HTMLImageElement;
        this.previewCategory = ensureElement(".card__image", this.container) as HTMLElement;
        this.previewTitle = ensureElement(".card__title", this.container) as HTMLElement;
        this.previewDescription = ensureElement(".card__text", this.container) as HTMLElement;
        this.previewPrice = ensureElement(".card__price", this.container) as HTMLElement;
        this.btnBuyPreview = ensureElement(".card__button", this.container) as HTMLElement;
        this.btnClosePreview = ensureElement(".btn__close", this.container) as HTMLElement;
        this.btnBuyPreview.addEventListener("click", () => {
            events.emit("basket:changed", {
                id: this.idCard
            });
        });
        this.btnClosePreview.addEventListener("click", () => {
            events.emit("card-preview:close", {
                id: this.idCard,
            })
            /* this.toggleClass(this.container, "unvisible");
            this.container.remove(); */
        })
        
    };

    set category(value: string) {
        this.setText(this.previewCategory, value);
    }

    set title(value: string){
        this.setText(this.previewTitle, value);
    }

    set description(value: string){
        this.setText(this.previewDescription, value);
    }

    set image(url: string) {
        this.setImage(this.previewImage, url);
    }

    set price(value: number) {
        this.setText(this.previewPrice, `${value} синапсов`);
    }

    set visible(value: boolean) {
        const preview = document.querySelector(".card__overlay");
        if(!preview) {
            document.querySelector(".page").append(this.container);
        }
        this.toggleClass(this.container, "unvisible");
    }

    set id(value: string) {
        this.idCard = value;
    }

    set inBasket(inBasket: boolean) {
        this.setText(this.btnBuyPreview, inBasket ? "Удалить из корзины" : "В корзину");
    }


    render(data: Partial<I_Preview>) : HTMLElement {
        console.log(data);
        Object.assign(this as object, data);
        return this.container;
    }
}