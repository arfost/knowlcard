import {
    BaseKCElement
} from '../abstract-elements/kc-base-element.js'
import {
    html,
    css
} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import {
    onPushData
} from '../helper-scripts/lit-directiv.js';
import Dao from '../../data.js';

export class KnowlCard extends BaseKCElement {
    static get is() {
        return 'knowl-card'
    }
    //we need to init values in constructor
    constructor() {
        super();
    }

    static get properties() {
        return {
            cardId: String,
            cardBase: Object
        }
    }

    affCard(card) {
        return html `
        <div class="title">${card.name}</div>
        <div class="body">${card.desc}</div>
        <div class="comments">${card.comments.map(part => html`<span>${part}</span>`)}</div>
        <div class="votes">${card.votes.map(part => html`<span>${part}</span>`)}</div>
        <div class="dependancies">${card.dependancies.map(part => html`<span>${part}</span>`)}</div>`;

    }

    get selfStyles() {
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

          .card .title{
            display: flex;
            justify-content: center;
            padding: 0.5em;
            font-size: 1.5em;
            font-weight: bolder;
          }

          .card .body{
            display: flex;
            padding: 0.5em;
          }

          .card .comment{
            display: flex;
            padding: 0.5em;
          }

          .card .votes{
            display: flex;
            padding: 0.5em;
          }

          .card .dependancies{
            display: flex;
            padding: 0.5em;
          }
          
          .card:hover {
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          }`
    }

    render() {
        if (!this.ref) {
            this.ref = Dao.getCardRef(this.cardId, this.cardBase);
        }
        return html `
        ${this.styles}
        <div class="card">
            ${onPushData(
            this.ref,
            card => this.affCard(card),
            html`loading`,
            html`card has no datas`
        )}
        </div>`
    }
}