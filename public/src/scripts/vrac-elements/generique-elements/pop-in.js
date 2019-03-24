import { BaseKCElement } from '../../abstract-elements/kc-base-element.js'
import { html, css } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';

export class PopIn extends BaseKCElement {
    static get is() { return 'pop-in' }
        //we need to init values in constructor
    constructor() {
        super();
        this.hide = true;
    }

    static get properties() {
        return {
            hide: Boolean
        }
    }

    get selfStyles() {
        return `
        .backdrop{
            z-index:100;
            position:absolute;
            background-color: rgba(0,0,0,0.6);
            justify-content:center;
            width:100%;
            height:100vh;
            position:fixed;
            top:0;
            left:0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        .backdrop:not([hidden]){
            display: flex;
            align-items: center;
        }
        .backdrop > div{
            z-index:101;
            padding:1em;
            background-color:white;
            margin:0.5em;
        }`
    }

    click(e) {
        if (e.target.className.indexOf("backdrop") !== -1) {
            let event = new CustomEvent('close-popin', {
                detail: false
            });
            this.dispatchEvent(event);
        }
    }

    render() {
        return html `
        ${this.styles}
        <div ?hidden="${this.hide}" class="backdrop" @click="${this.click}">
            <div>
                <slot></slot>
            </div>
        </div>`
    }
}