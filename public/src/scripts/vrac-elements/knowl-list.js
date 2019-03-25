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
        this.loginRef = Dao.getLoginRef();
        this.loginRef.on("value", user=>{
            this.user = user;
        })
    }

    static get properties() {
        return {
            cardList: Array,
            editing: Boolean,
            editedId: String,
            editedBase: Object,
            user:Object
        }
    }

    get selfStyles() {
        return `
        .list{
            background: #e2e1e0;
        }`
    }

    beginCreation() {
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

    toggleLogin(){
        //console.log("toutoutout")
        this.loginRef.actions.toggleLogin();
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
        <fab-button @click="${this.beginCreation}"></fab-button>
        <fab-img @click="${this.toggleLogin}"></fab-img>
        </div>
        <pop-in .hide="${!this.editing}" @close-popin="${this.stopEditing}">
            <knowl-card-edit .cardid="${this.editedId}" .cardBase="${this.editedBase}"></knowl-card-edit>
        </pop-in>`
    }
}