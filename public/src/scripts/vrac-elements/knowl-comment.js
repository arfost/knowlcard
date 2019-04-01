import {
    BaseKCElement
} from '../abstract-elements/kc-base-element.js';
import {
    html,
    css
} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import Dao from '../../data.js';


export class KnowlComment extends BaseKCElement {
    static get is() {
        return 'knowl-comment'
    }
    //we need to init values in constructor
    constructor() {
        super();
        this.editing = false;
        this.loginRef = Dao.getLoginRef();
        this.user = this.loginRef.getDefaultValue();
        this.loginRef.on("value", user => {
            this.user = user;
        })
    }

    static get properties() {
        return {
            comment: Object
        }
    }

    get selfStyles() {
        return css `
        :host{
            
        }`
    }

    render() {
        return html `
        ${this.styles}
        <div><span class="poster">${this.comment.poster} : </span>${this.comment.comment}</div>`
    }
}