import {factory} from './reactish.js';
import {router} from './router.js';

let Input = ({todo, tab}) => `
  <input
    class="TodoInput Item" type="text" placeholder="What needs to be done?"
    onchange="action(event, 'newItem')">
`;

let List = ({todo, tab}) => `
  <ul class="List">
    ${todo.filter(item => tab === 'all' || item.status === tab).map((item) => `
      <li class="Item flex">
        <input
          type="checkbox" name="" id="id-${item.id}"
          ${item.status === 'completed' ? 'checked': ''}
          onclick="action(event, 'toggleItem', ${item.id})">
        <label
          for="id-${item.id}"
          action(event, 'toggleItem', ${item.id})>${item.name}</label>
        <button
          class="Item-remove flex-alignSelf--right" aria-label="Remove"
          onclick="action(event, 'deleteItem', ${item.id})">&times;</button>
      </li>
    `).join('')}
  </ul>
`;

let Footer = ({todo, tab}) => `
  <footer class="Item Item--full flex flex-justify--between text-small">
    <span>${todo.filter(item => item.status === 'active').length} items left</span>
    <ul class="flex flex-gapRight--small">
      <li><a class="Tab ${tab === 'all' ? 'is-selected' : ''}" id="all" href="#all">All</a></li>
      <li><a class="Tab ${tab === 'active' ? 'is-selected' : ''}" id="active" href="#active">Active</a></li>
      <li><a class="Tab ${tab === 'completed' ? 'is-selected' : ''}" id="completed" href="#completed">Completed</a></li>
    </ul>
    ${
      todo.length > 0 ?
        `<button
          class="text-decoration:hover"
          onclick="action(event, 'clearCompleted')">Clear completed</button>`
        : ''
    }
  </footer>
`;

// Somehow inherit from reactish and combine with state
let Todo = {
  find(list, id) {
    return list.find(li => li.id === id);
  },

  toggleItem(list, id) {
    let item = Todo.find(list, id);
    item.status = item.status === 'active' ? 'completed' : 'active';
  },

  deleteItem(todo, id) {
    let item = Todo.find(todo, id);
    let idx = todo.indexOf(item);
    todo.splice(idx, 1);
    return todo;
  },

  newItem(todo, name){
    let newItem = {id: Math.random(), name: name, status: 'active'};
    todo.push(newItem);
    return todo;
  },

  getActive(todo) {
    return todo.filter(item => item.status === 'active');
  }
};

let R = factory({
  components: {Input, List, Footer},
  actions: {toggleItem, deleteItem, clearCompleted, newItem}
});

window.addEventListener('load', () => {
  R.setState(() => ({
    todo: [
      {id: 1, name: "Sleep", status: 'active'},
      {id: 2, name: "Shopping", status: 'completed'},
      {id: 3, name: "Bank", status: 'active'}
    ],
    tab: router.hash() || 'all'
  }), onRender);
})

router.hashchange((e, {from, to}) => {
  R.setState(() => ({tab: to}), onRender);
});

function toggleItem(event, id) {
  let onTransitionEnd = () => {
    R.setState(prevState => {
      Todo.toggleItem(prevState.todo, id);
      return {todo: prevState.todo};
    }, onRender);
    event.target.removeEventListener('transitionend', onTransitionEnd);
  }
  event.target.addEventListener('transitionend', onTransitionEnd);
}

function deleteItem(event, id) {
  R.setState(prevState => ({todo: Todo.deleteItem(prevState.todo, id)}), onRender);
}

function clearCompleted(event) {
  R.setState(prevState => ({todo: Todo.getActive(prevState.todo)}), onRender);
}

function newItem(event) {
  R.setState(prevState => ({todo: Todo.newItem(prevState.todo, event.target.value)}), onRender);
}

function onRender(state) {
  if (router.hash() !== state.tab) {
    router.hash(state.tab);
  }
  document.querySelector('input').focus();
}