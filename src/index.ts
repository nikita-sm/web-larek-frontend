import { Api } from './components/base/api';
import { Card } from './components/Card';
import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

/* console.log(API_URL, CDN_URL);
const endPoint_productList = "/product/";

const api = new Api(API_URL, CDN_URL);
type Result = {
    total: number;
    items: any[];
}
api.getListCard()
    .then((res: Result) => {
        const {total, items} = res; Получение массива карточек
        console.log(items);
    })

 */

type Result = {
    total: number;
    items: any[];
}
const api = new Api(API_URL);
api.get("/product/")
    .then((res: Result) => {
        const {total, items} = res; //Получение массива карточек без нормального адреса карточек
        const cards = items.map((card) => {
            return {
                ...card,
                image: CDN_URL + card.image,
            }
        });
        console.log(cards);
    })

/* const listELement = document.querySelector(".gallery__list") as HTMLUListElement;
const cardTemplate = document.querySelector("#card-catalog") as HTMLTemplateElement;
const card1 = new Card(cloneTemplate(cardTemplate));

listELement.appendChild(card1.render());
card1.categoryValue = "Тест"; */