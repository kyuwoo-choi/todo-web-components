import { html } from 'lit-html';

import LitRender from '../libs/litRender';
import store from '../libs/store';
import {
  add,
  toggle,
  remove,
  toggleAll,
  clearCompleted,
  replace
} from '../libs/actions';

import './todoInput';
import './todoToolbar';
import './todoList';

class TodoApp extends LitRender(HTMLElement) {
  constructor(name) {
    super();

    this.attachShadow({ mode: 'open' });

    this.invalidate();
  }

  add(title) {
    add(title);
  }

  toggle(index) {
    const todoList = store.getState().todoList;
    toggle(todoList[index].id);
  }

  replace(index, title) {
    const todoList = store.getState().todoList;
    replace(todoList[index].id, title);
  }

  toggleAll() {
    toggleAll();
  }

  remove(index) {
    const todoList = store.getState().todoList;
    remove(todoList[index].id);
  }

  clearCompleted() {
    clearCompleted();
  }

  get length() {
    const todoList = store.getState().todoList;

    return todoList.length;
  }

  render() {
    return html`
      <style>
        host: {
          display: block;
        }
        section {
          background: #fff;
          margin: 130px 0 40px 0;
          position: relative;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
        }
      </style>
      <section>
        <todo-input></todo-input>
        <todo-list></todo-list>
        <todo-toolbar></todo-toolbar>
      </section>
    `;
  }
}

customElements.define('todo-app', TodoApp);
