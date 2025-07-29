import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { EventEmitter, IEvents } from "./base/events";
import { categoryColour } from "../utils/constants";

/*Коллбэк для передачи как параметр*/
interface ICardActions {
    /* onClick: (event: MouseEvent) => void; */
    [key: string] : (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    price: number;
    id: string;
}

export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    /* protected _id: string; */

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container); 
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if(value === null) {
            this.setText(this._price, `Бесценно`);
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    /* set id(value: string) {
        this._id = value;
    } */
}

export interface ICardItem extends ICard{
    img: string;
    category: string;
}


export class CardItem extends Card<ICardItem> {
    protected _img: HTMLImageElement;
    protected _category: HTMLElement;
    protected _id: string;
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container);
        this._img = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category= ensureElement<HTMLElement>(`.${blockName}__category`, container);
        if(actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        } 
    };

    set img(value: string) {
        this.setImage(this._img, value);
    };

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(categoryColour[value]);
    }

    set id(value: string) {
        this._id = value;
    }

}

export interface ICardItemPreview extends ICard{
    image: string;
    category: string;
    description: string;
    selected: boolean;
}

export class CardItemPreview extends Card<ICardItemPreview> {
    protected _img: HTMLImageElement;
    protected _category: HTMLElement;
    protected _description: HTMLElement;
    protected _buttonBasket: HTMLButtonElement;
    protected _selected: boolean;
    constructor(protected blockName: string, container: HTMLElement, action?: ICardActions) {
        super(blockName, container);
        this._img = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category = ensureElement<HTMLImageElement>(`.${blockName}__category`, container);
        this._description = ensureElement<HTMLElement>(`.${blockName}__text`, container);
        this._buttonBasket = ensureElement<HTMLButtonElement>(`.${blockName}__button`, container);
        if (action?.onClick) {
			this._buttonBasket.addEventListener('click', action.onClick);
		}
        
    }

    set image(value: string) {
        this.setImage(this._img, value);
    };

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(categoryColour[value]);
    };

    set description(value: string) {
        this.setText(this._description, value);
        
    };

    set price(value: number | null){
        super.price = value;
        if(value === null) {
            this.setDisabled(this._buttonBasket, true);
        };
        
    }

    set selected(value: boolean) {
        this.setText(this._buttonBasket, value ? "Удалить" : "Купить");
    }

}

interface ICardItemBasket extends ICard {
    index: number;

}

/*Строка товара внутри корзины*/
export class CardItemBasket extends Card<ICardItemBasket> {
    protected _index: HTMLImageElement;
    protected _buttonDelete: HTMLButtonElement;
    constructor(protected blockName: string, container: HTMLElement, action?: ICardActions) {
        super(blockName, container);
        this._index = ensureElement<HTMLImageElement>(`.${blockName}__index`, container);
        this._buttonDelete= ensureElement<HTMLButtonElement>(`.${blockName}__button`, container);
        if(action?.onClick) {
            this._buttonDelete.addEventListener("click", action.onClick)
        }
        
    };

    set index(value: string) {
        this.setText(this._index, value);
    };

}

