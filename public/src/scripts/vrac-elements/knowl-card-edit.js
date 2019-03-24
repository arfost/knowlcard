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

export class KnowlCardEdit extends BaseKCElement {
    static get is() {
        return 'knowl-card-edit'
    }
    //we need to init values in constructor
    constructor() {
        super();
    }

    static get properties() {
        return {
            cardBase: String,
            cardid: String,
        }
    }

    affCard(card) {
        return html `
        <input value="${card.name}" class="title" id="name"></input>
        <textarea class="body" id="desc">${card.desc}</textarea>
        <div>
            <input value="${card.dependancies.join(', ')}" class="footer" id="dependancies"></input>
        </div>
        <button @click="${this.saveCard}">save</button>`
    }

    saveCard() {
        let values = {
            name: this.shadowRoot.getElementById("name").value,
            desc: this.shadowRoot.getElementById("desc").value,
            dependancies: this.shadowRoot.getElementById("dependancies").value.split(', ')
        }
        this.ref.actions.save(values);
    }

    get selfStyles() {
        return `
        .card {
            display: inline-block;
            height: 300px;
            position: relative;
            width: 300px;
          }`
    }

    render() {
        console.log(this.cardBase, this.cardid)
        if (this.cardid === undefined || this.cardBase === undefined) {
            return html `<div class="card">no card selected</div>`
        }
        if (!this.ref) {
            this.ref = Dao.getCardRef(this.cardid, this.cardBase);
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