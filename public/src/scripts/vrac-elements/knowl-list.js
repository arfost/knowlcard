import {
    BaseKCElement
} from '../abstract-elements/kc-base-element.js';
import {
    html,
    css
} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import {
    onPushData
} from '../helper-scripts/lit-directiv.js';
import Dao from '../../data.js';


export class KnowlList extends BaseKCElement {
    static get is() {
        return 'knowl-list'
    }
    //we need to init values in constructor
    constructor() {
        super();
        this.editing = false;
    }

    static get properties() {
        return {
            cardList: Array,
            editing: Boolean,
            editedId: String,
            editedBase: Object

        }
    }

    get selfStyles() {
        return `
        .list{
            background: #e2e1e0;
        }`
    }

    beginEdition() {
        this.editing = true;
        this.editedId = '--new--';
        this.editedBase = {
            name: "new"
        }
    }

    stopEditing() {
        this.editing = false;
        this.editedId = undefined;
        this.editedBase = undefined;
    }

    render() {
        return html `
        ${this.styles}
        <div class="list content-box wrap horizontal">
        ${onPushData(
            Dao.getListRef(),
            cardlist => cardlist.map(card => html`<knowl-card .cardId="${card.id}" .cardBase="${card.base}"></knowl-card>`),
            html`loading`,
            html`error loading the list`
            )}
        <fab-button @click="${this.beginEdition}"></fab-button>
        </div>
        <pop-in .hide="${!this.editing}" @close-popin="${this.stopEditing}">
            <knowl-card-edit .cardid="${this.editedId}" .cardBase="${this.editedBase}"></knowl-card-edit>
        </pop-in>`
    }
}