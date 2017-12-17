import { html } from 'lit-html';

import LitRender from '../libs/litRender';
import { toggle, remove, replace } from '../libs/actions';

class TodoItem extends LitRender(HTMLElement) {
  constructor() {
    super();

    this._editing = false;
    this._handlers = {};

    this.attachShadow({ mode: 'open' });
    this.invalidate(true);
  }

  connectedCallback() {
    const root = this.shadowRoot;
    const handlers = this._handlers;
    const label = root.querySelector('label');
    const edit = root.querySelector('.edit');

    handlers.onClick = this._onClick.bind(this);
    handlers.onDoubleClick = this._onDoubleClick.bind(this);
    handlers.onFocusOut = this._onFocusOut.bind(this);
    handlers.onKeyUp = this._onKeyUp.bind(this);

    root.addEventListener('click', handlers.onClick);
    label.addEventListener('dblclick', handlers.onDoubleClick);
    edit.addEventListener('focusout', handlers.onFocusOut);
    edit.addEventListener('keyup', handlers.onKeyUp);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;
    const label = root.querySelector('label');
    const edit = root.querySelector('.edit');

    root.removeEventListener('click', this._handlers.onClick);
    label.removeEventListener('dblclick', this._handlers.onDblClick);
    edit.removeEventListener('focusout', this._handlers.onFocusOut);
    edit.removeEventListener('keyup', this._handlers.onKeyUp);
  }

  _onClick(event) {
    const id = this.todo.id;
    const classList = event.path[0].classList;

    if (classList.contains('toggle')) {
      toggle(id);
    } else if (classList.contains('destroy')) {
      remove(id);
    }
  }

  async _onDoubleClick() {
    const edit = this.shadowRoot.querySelector('.edit');
    this._editing = true;

    await this.invalidate();

    edit.value = this.todo.title;
    edit.focus();
  }

  _onFocusOut() {
    const edit = this.shadowRoot.querySelector('.edit');
    this._setTodoTitle(edit.value);
  }

  _onKeyUp(event) {
    const edit = this.shadowRoot.querySelector('.edit');
    const title = edit.value.trim();

    if (event.keyCode === 13 /* KEYCODE_ENTER */ && title.length > 0) {
      this._setTodoTitle(title);
      event.preventDefault();
    }
  }

  _setTodoTitle(title) {
    this._editing = false;
    replace(this.todo.id, title);
    this.invalidate();
  }

  set todo(todo) {
    this._todo = todo;
    this.invalidate();
  }

  get todo() {
    return this._todo || {};
  }

  render() {
    const todo = this.todo;
    const classCompleted = todo.completed ? ' completed' : '';
    const inputToggle = todo.completed
      ? html`<input class="toggle" type="checkbox" checked>`
      : html`<input class="toggle" type="checkbox">`;

    const classEditing = this._editing ? ' editing' : '';

    return html`
      ${style}
      <div data-id$="${todo.id}" class$="${'item' +
      classCompleted +
      classEditing}">
        <div class="view">
          ${inputToggle}
          <label>${todo.title}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" type="text" />
      </div>
    `;
  }
}

const style = html`
  <style>
    host: {
      display: block;
    }
    .item {
      position: relative;
      font-size: 24px;
      border-bottom: 1px solid #ededed;
    }

    .item:last-child {
      border-bottom: none;
    }

    .item.editing {
      border-bottom: none;
      padding: 0;
    }

    .item.editing .edit {
      display: block;
      width: 506px;
      padding: 12px 16px;
      margin: 0 0 0 43px;
    }

    .item.editing .view {
      display: none;
    }

    .item .toggle {
      text-align: center;
      width: 40px;
      /* auto, since non-WebKit browsers doesn't support input styling */
      height: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto 0;
      border: none; /* Mobile Safari */
      -webkit-appearance: none;
      appearance: none;
    }

    .item .toggle {
      opacity: 0;
    }

    .item .toggle + label {
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
      background-repeat: no-repeat;
      background-position: center left;
    }

    .item .toggle:checked + label {
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
    }

    .item label {
      word-break: break-all;
      padding: 15px 15px 15px 60px;
      display: block;
      line-height: 1.2;
      transition: color 0.4s;
    }

    .item.completed label {
      color: #d9d9d9;
      text-decoration: line-through;
    }

    .item .destroy {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      bottom: 0;
      width: 40px;
      height: 40px;
      margin: auto 0;
      font-size: 30px;
      color: #cc9a9a;
      margin-bottom: 11px;
      transition: color 0.2s ease-out;
      background-color: transparent;
      border: none;
    }

    .item .destroy:hover {
      color: #af5b5e;
    }

    .item .destroy:after {
      content: '×';
    }

    .item:hover .destroy {
      display: block;
    }

    .item .edit {
      display: none;
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 24px;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.4em;
      border: 0;
      outline: none;
      color: inherit;
      padding: 6px;
      border: 1px solid #999;
      box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-font-smoothing: antialiased;
      font-smoothing: antialiased;
    }

    .item.editing:last-child {
      margin-bottom: -1px;
    }
  </style>
`;

customElements.define('todo-item', TodoItem);
