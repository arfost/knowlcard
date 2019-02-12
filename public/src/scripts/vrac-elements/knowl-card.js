import { BaseKCElement } from '../abstract-elements/kc-base-element.js'
import { html } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import { onPushData } from '../helper-scripts/lit-directiv.js';
import Dao from '../../data.js';

export class KnowlCard extends BaseKCElement {
    static get is() { return 'knowl-card' }
        //we need to init values in constructor
    constructor() {
        super();
    }

    static get properties() {
        return {
            card: String
        }
    }

    get selfStyle() {
        return `
        .card {
            background: #fff;
            border-radius: 2px;
            display: inline-block;
            height: 300px;
            margin: 1rem;
            position: relative;
            width: 300px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            transition: all 0.3s cubic-bezier(.25,.8,.25,1);
          }
          
          .card:hover {
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          }`
    }

    render() {
            return html `
        <style>
            ${this.selfStyle}
        </style>
        <div class="card">
            ${onPushData(
                Dao.getCardRef(this.card),
                card=>html`${card}`,
                html`loading`,
                html`error loading the card`
            )}
        </div>`
    }
}