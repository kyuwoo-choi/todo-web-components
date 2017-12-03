import createStore from 'redux-zero';

const initialState = { route: '', todoList: [] };
const store = createStore(initialState);

export default store;
