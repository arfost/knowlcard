import {
  BaseKCElement
} from '../abstract-elements/kc-base-element.js'

import {
  html,
  css
} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
import {
  onPushData,
  unsafeHTML
} from '../helper-scripts/lit-directiv.js';
import Dao from '../../data.js';

export class KnowlCard extends BaseKCElement {
  static get is() {
    return 'knowl-card'
  }
  //we need to init values in constructor
  constructor() {
    super();
    this.loginRef = Dao.getLoginRef();
    this.user = this.loginRef.getDefaultValue();
    this.loginRef.on("value", user => {
      this.user = user;
    })
  }

  static get properties() {
    return {
      cardId: String,
      cardBase: Object,
      user: Object
    }
  }

  affCard(card) {
    return html `
        <div class="title">${card.name}</div>
        <div class="body content-box vertical">${unsafeHTML(card.desc)}</div>
        <div class="comments content-box vertical">${card.comments.map(part => html`<div><span class="poster">${part.poster} : </span>${part.comment}</div>`)}
        ${!this.user.isAnonymous ?
          html`<div class="content-box vertical"><textarea class="body" id="newComment"></textarea><button @click="${this.saveComment}">save</button></div>`
          : ``}
          </div>
        <div class="votes">${card.votes.map(part => html`<span>${part}</span>`)}</div>
        <div class="dependancies">${card.dependancies.map(part => html`<span>${part}</span>`)}</div>`;

  }

  saveComment() {
    this.ref.actions.addComment(this.user.displayName, this.shadowRoot.getElementById("newComment").value);
    this.shadowRoot.getElementById("newComment").value = "";
  }

  get selfStyles() {
    return `
        .card {
            background: #fff;
            border-radius: 2px;
            display: inline-block;
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
            padding: 1em;
          }

          .card .comments{
            padding: 1.5em;
          }

          .card .votes{
            padding: 0.5em;
          }

          .card .dependancies{
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