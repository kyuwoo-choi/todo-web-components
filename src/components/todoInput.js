import { html } from 'lit-html';

import LitRender from '../libs/litRender';
import { add } from '../libs/actions';

class TodoInput extends LitRender(HTMLElement) {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.invalidate(true);
  }

  connectedCallback() {
    const input = this.shadowRoot.querySelector('input');
    this._onKeyUp = event => {
      event.preventDefault();

      const title = input.value.trim();

      if (event.keyCode === 13 /* KEYCODE_ENTER */ && title.length > 0) {
        add(title);
        input.value = '';
      }
    };
    input.addEventListener('keyup', this._onKeyUp);
  }

  disconnectedCallback() {
    const input = this.shadowRoot.querySelector('input');
    input.removeEventListener('keyup', this._onKeyUp);
  }

  render() {
    return html`
      ${style}
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" autofocus>
      </header>
    `;
  }
}

const style = html`
  <style>
    host: {
      display: block;
    }
    input::-webkit-input-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #4d4d4d;
    }

    input::-moz-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #4d4d4d;
    }

    input::input-placeholder {
      font-style: italic;
      font-weight: 300;
      color: #4d4d4d;
    }

    :focus {
      outline: 0;
    }

    h1 {
      position: absolute;
      top: -140px;
      width: 100%;
      font-size: 100px;
      font-weight: 100;
      text-align: center;
      color: rgba(175, 47, 47, 0.15);
      -webkit-text-rendering: optimizeLegibility;
      -moz-text-rendering: optimizeLegibility;
      text-rendering: optimizeLegibility;
    }

    .new-todo,
    .edit {
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 24px;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.4em;
      border: 0;
      color: inherit;
      padding: 6px;
      border: 1px solid #999;
      box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .new-todo {
      padding: 16px 16px 16px 60px;
      border: none;
      background: rgba(0, 0, 0, 0.003);
      box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }
  </style>
`;

customElements.define('todo-input', TodoInput);
