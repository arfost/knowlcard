import { BaseKCElement } from '../abstract-elements/kc-base-element.js';
import { html } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import { onPushList, onPushData } from '../helper-scripts/lit-directiv.js';
import Dao from '../../data.js';


export class KnowlList extends BaseKCElement {
    static get is() { return 'knowl-list' }
        //we need to init values in constructor
    constructor() {
        super();
    }

    static get properties() {
        return {
            cardList: Array
        }
    }

    get selfStyle() {
        return `
        .list{
            background: #e2e1e0;
            display:flex;
          }`
    }

    render() {
            return html `
        <style>
            ${this.selfStyle}
        </style>
        <div class="list">
        ${onPushList(
                Dao.getListRef("cards"),
                cardlist=>cardlist.map(card=>html`<knowl-card .card="cards/${card}"></knowl-card>`),
                html`loading`,
                html`error loading the list`
            )}
        </div>`
    }
}