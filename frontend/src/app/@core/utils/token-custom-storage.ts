import { Injectable } from '@angular/core';
import {
  NbAuthToken,
  NbTokenStorage,
  NbAuthTokenParceler,
} from '@nebular/auth';

@Injectable()
export class NbTokenCustomStorage extends NbTokenStorage {
  protected key = 'hon_auth_token_aion';

  constructor(private parceler: NbAuthTokenParceler) {
    super();
  }

  /**
   * Returns token from localStorage
   * @returns {NbAuthToken}
   */
  get(): NbAuthToken {
    const raw = localStorage.getItem(this.key);
    return this.parceler.unwrap(raw);
  }

  /**
   * Sets token to localStorage
   * @param {NbAuthToken} token
   */
  set(token: NbAuthToken) {
    const raw = this.parceler.wrap(token);
    localStorage.setItem(this.key, raw);
  }

  /**
   * Clears token from localStorage
   */
  clear() {
    localStorage.removeItem(this.key);
  }
}
