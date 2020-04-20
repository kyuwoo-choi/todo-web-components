import { html } from 'lit-html';

import LitRender from '../libs/litRender';
import store from '../libs/store';
import { toggleAll } from '../libs/actions';

import './todoItem';

class TodoList extends LitRender(HTMLElement) {
  constructor(name) {
    super();

    this.attachShadow({ mode: 'open' });

    this.invalidate();
  }

  connectedCallback() {
    this._onStateChanged = () => this.invalidate();
    store.subscribe(this._onStateChanged);

    this._onClick = event => {
      const target = event.path[0];
      if (target.classList.contains('toggle-all')) {
        toggleAll(target.checked);
      }
    };
    this.shadowRoot.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    store.unsubscribe(this._onStateChanged);
    this.shadowRoot.removeEventListener('click', this._onClick);
  }

  render() {
    const state = store.getState();
    const todoList = state.todoList;
    const route = state.route;
    const hasActive = todoList.find(todo => !todo.completed) !== undefined;

    const btnToggleAll =
      todoList.length > 0
        ? !hasActive
          ? html`<input class="toggle-all" type="checkbox" checked>`
          : html`<input class="toggle-all" type="checkbox">`
        : '';

    const todoItems = todoList
      .filter(todo => {
        return (
          route === '' ||
          (route === 'completed' && todo.completed) ||
          (route === 'active' && !todo.completed)
        );
      })
      .map(todo => html`<todo-item .todo=${todo}></todo-item>`);

    return html`
      ${style}
      <div class="todo">
        ${btnToggleAll}
        <div class="todo-list">
          ${todoItems}
        </div>
      </div>
    `;
  }
}

const style = html`
  <style>
    host: {
      display: block;
    }
    .todo {
      position: relative;
      z-index: 2;
      border-top: 1px solid #e6e6e6;
    }
    .toggle-all {
      position: absolute;
      top: -55px;
      left: -12px;
      width: 60px;
      height: 34px;
      text-align: center;
      outline: none;
      border: none; /* Mobile Safari */
    }
    .toggle-all:before {
      content: '❯';
      font-size: 22px;
      color: #e6e6e6;
      padding: 10px 27px 10px 27px;
    }
    .toggle-all:checked:before {
      color: #737373;
    }
    .todo-list {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .toggle-all {
        background: none;
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
        -webkit-appearance: none;
        appearance: none;
      }
    }
  </style>
`;

customElements.define('todo-list', TodoList);
