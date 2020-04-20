import { html } from 'lit-html';
import {styleMap} from 'lit-html/directives/style-map.js';
import { classMap } from 'lit-html/directives/class-map.js';

import LitRender from '../libs/litRender';
import store from '../libs/store';
import { route, clearCompleted } from '../libs/actions';

class TodoToolbar extends LitRender(HTMLElement) {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.invalidate();
  }

  connectedCallback() {
    this._onStateChanged = () => this.invalidate();
    store.subscribe(this._onStateChanged);

    this._onHashChange = () => route(document.location.hash.split('/')[1]);
    window.addEventListener('hashchange', this._onHashChange);

    this._onClick = event => {
      const target = event.path[0];
      if (target.classList.contains('clear-completed')) {
        clearCompleted();
      }
    };
    this.shadowRoot.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    store.unsubscribe(this._onStateChanged);
    window.removeEventListener('hashchange', this._onHashChange);
    this.shadowRoot.removeEventListener('click', this._onClick);
  }

  render() {
    const state = store.getState();

    const activeItemLength = state.todoList.filter(todo => !todo.completed).length;
    const footerDisplayStyles = { display: state.todoList.length > 0 ? 'block' : 'none' };

    const CLASS_SELECTED = 'selected';
    const currentRoute = state.route;
    const allClass = { [CLASS_SELECTED]: currentRoute === '' };
    const activeClass = { [CLASS_SELECTED]: currentRoute === 'active' };
    const completedClass = { [CLASS_SELECTED]: currentRoute === 'completed' };

    const completedItemLength = state.todoList.length - activeItemLength;
    const btnClearCompleted =
      completedItemLength > 0
        ? html`<button class="clear-completed">Clear completed</button>`
        : '';

    return html`
      ${style}
      <footer class="footer" style=${styleMap(footerDisplayStyles)}>
        <span class="todo-count">${activeItemLength} item left</span>
        <ul class="filters">
          <li>
            <a href="#/" class="${classMap(allClass)}">All</a>
          </li>
          <li>
            <a href="#/active" class="${classMap(activeClass)}">Active</a>
          </li>
          <li>
            <a href="#/completed" class="${classMap(completedClass)}">Completed</a>
          </li>
        </ul>
        ${btnClearCompleted}
      </footer>
		`;
  }
}

const style = html`
  <style>
    host: {
      display: block;
    }
    button {
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      font-size: 100%;
      vertical-align: baseline;
      font-family: inherit;
      font-weight: inherit;
      color: inherit;
      -webkit-appearance: none;
      appearance: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .footer {
      color: #777;
      padding: 10px 15px;
      height: 20px;
      text-align: center;
      border-top: 1px solid #e6e6e6;
    }

    .footer:before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 50px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
        0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
        0 17px 2px -6px rgba(0, 0, 0, 0.2);
    }

    .clear-completed,
    .clear-completed:active {
      float: right;
      position: relative;
      line-height: 20px;
      text-decoration: none;
      cursor: pointer;
    }

    .clear-completed:hover {
      text-decoration: underline;
    }

    .todo-count {
      float: left;
      text-align: left;
    }

    .todo-count strong {
      font-weight: 300;
    }

    .filters {
      margin: 0;
      padding: 0;
      list-style: none;
      position: absolute;
      right: 0;
      left: 0;
    }

    .filters li {
      display: inline;
    }

    .filters li a {
      color: inherit;
      margin: 3px;
      padding: 3px 7px;
      text-decoration: none;
      border: 1px solid transparent;
      border-radius: 3px;
    }

    .filters li a:hover {
      border-color: rgba(175, 47, 47, 0.1);
    }

    .filters li a.selected {
      border-color: rgba(175, 47, 47, 0.2);
    }
  </style>
`;

customElements.define('todo-toolbar', TodoToolbar);
