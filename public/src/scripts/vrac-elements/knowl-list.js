import { BaseKCElement } from '../abstract-elements/kc-base-element.js';
import { html, css } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import { onPushData } from '../helper-scripts/lit-directiv.js';
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

    get selfStyles() {
        return `
        .list{
            background: #e2e1e0;
        }`
    }

    render() {
        return html`
        ${this.styles}
        <div class="list content-box wrap horizontal">
        ${onPushData(
            Dao.getListRef("cards"),
            cardlist => cardlist.map(card => html`<knowl-card .card="cards/${card}"></knowl-card>`),
            html`loading`,
            html`error loading the list`
        )}
        </div>`
    }
}