import { LitElement, html } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

import { commentIcon } from './my-icons.js';

import { SharedStyles } from './shared-styles.js';
import { ButtonSharedStyles } from './button-shared-styles.js';

import {
  createThread
} from '../actions/comments.js';

import {
  connectLiveMessages,
  connectLiveThreads
} from '../actions/database.js';

import {
  cardSelector
} from '../reducers/data.js';

class CommentsPanel extends connect(store)(LitElement) {
  render() {
    return html`
      ${SharedStyles}
      ${ButtonSharedStyles}
      <style>
        .container {
          width: 6em;
          height:100%;
          padding:0.5em;
          border-left: 1px solid var(--app-divider-color);
          position:relative;
        }
        h3 {
          margin:0;
          font-weight:normal;
          color: var(--app-dark-text-color-light);
        }
        button {
          position:absolute;
          bottom:1em;
          right:1em;
        }
      </style>
      <div ?hidden=${!this._open} class='container'>
        <h3>Comments</h3>
        <button class='round' @click='${this._handleCreateThreadClicked}'>${commentIcon}</button>
      </div>
    `;
  }

  static get properties() {
    return {
      _open: {type: Boolean},
      _card: {type: Object},
    }
  }

  _handleCreateThreadClicked(e) {
    store.dispatch(createThread(prompt('Message for new thread:')));
  }

  stateChanged(state) {
    this._open = state.comments.panelOpen;
    this._card = cardSelector(state);
  }

  updated(changedProps) {
    if (changedProps.has('_card')) {
      if (this._card && this._card.id) {
        connectLiveMessages(store, this._card.id);
        connectLiveThreads(store, this._card.id);
      }
    }
  }
}

window.customElements.define('comments-panel', CommentsPanel);