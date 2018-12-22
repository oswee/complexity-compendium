
import { LitElement, html } from '@polymer/lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// We are lazy loading its reducer.
import user from '../reducers/user.js';
store.addReducers({
  user
});

import {
  signIn,
  signInSuccess,
  signOutSuccess,
  signOut
} from '../actions/user.js';

class UserChip extends connect(store)(LitElement) {
  render() {
    return html`
      <style>
        div {
          display:flex;
          justify-content:center;
          align-items:center;
        }
        img {
          --user-image-size: 48px;
          height:var(--user-image-size);
          width: var(--user-image-size);
          border-radius:calc(var(--user-image-size) / 2);
          margin: calc(var(--user-image-size) / 4);
          cursor:pointer;
        }
      </style>
      <div>
        ${this._pending ? '***' : ''}
        ${this._user
          ? html`<img title='${this._user.displayName + ' - ' + this._user.email + ' - Click to sign out'}' src='${this._user.photoURL}' @click=${this._handleSignOutClick}>`
          : html`<button @click=${this._handleSignInClick}>Sign In</button>`
        }
      </div>
      `;
  }

  firstUpdated() {
    firebase.auth().onAuthStateChanged(this._handleAuthStateChanged);
  }

  _handleAuthStateChanged(user) {
    if (user) {
      store.dispatch(signInSuccess(user))
    } else {
      store.dispatch(signOutSuccess());
    }
  }

  _handleSignInClick(e) {
    store.dispatch(signIn());
  }

  _handleSignOutClick(e) {
    store.dispatch(signOut());
  }

  static get properties() {
    return {
      _pending: { type: Boolean },
      _user: { type: Object },
      _error: { type: Object }
    }
  }

  stateChanged(state) {
    this._pending = state.user.pending;
    this._user = state.user.user;
    this._error = state.user.error;
  }


}

window.customElements.define('user-chip', UserChip);