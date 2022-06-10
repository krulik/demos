let state = {
  todo: [],
  selectedTab: ''
};

onPageLoad();


// - State ------------------------------------------------
function setState(newState) {
  Object.assign(state, newState);

  render(state);

  save(state);
}


// - Actions ------------------------------------------------

function onPageLoad() {
  setState(getSavedState() || {todo: [], selectedTab: 'all'});
}

function onInputChange(eventObject) {
  setState({todo: addItemToList(state.todo, eventObject.target.value)});
}

function onCheckboxChange(eventObject) {
  document.addEventListener('transitionend', onTransitionEnd);

  function onTransitionEnd() {

    setState({todo: toggleItemStatus(state.todo, eventObject.target.dataset.id)});

    document.removeEventListener('transitionend', onTransitionEnd);
  }
}

function onRemoveButtonClick(eventObject) {
  setState({todo: deleteItemFromList(state.todo, eventObject.target.dataset.id)});
}

function onTabClick(eventObject) {
  setState({todo: state.todo, selectedTab: eventObject.target.id});
}

function onClearCompletedClick() {
  setState({todo: getItemsByStatus(state.todo, 'active')});
}

function onNameClick(eventObject) {
  eventObject.preventDefault();
}

function onNameDoubleClick(eventObject) {
  eventObject.preventDefault();

  setState({todo: toggleEditableState(state.todo, eventObject.target.dataset.id)})
}

function onNameKeyPress(eventObject) {
  if (eventObject.key === 'Enter') {
    onNameDoubleClick(eventObject);
  }
}

function onNameChange(eventObject) {
  let id = eventObject.target.dataset.id;
  let todo = toggleEditableState(state.todo, id);
  todo = renameItem(todo, id, eventObject.target.value);

  setState({todo});
}

// - View ------------------------------------------------
function render(state) {
  let InputContainer = document.querySelector('.InputContainer');
  let ListContainer = document.querySelector('.ListContainer');
  let FooterContainer = document.querySelector('.FooterContainer');

  InputContainer.innerHTML = TodoInput(state);
  TodoInputAfterRender(document.querySelector('header'));

  ListContainer.innerHTML = TodoList(state);
  TodoListAfterRender(document.querySelector('.List'));

  FooterContainer.innerHTML = TodoFooter(state);
  TodoFooterAfterRender(document.querySelector('footer'));
}

function TodoInput() {
  return `
    <header>
      <input class="TodoInput Item" type="text" placeholder="What needs to be done?"
             onchange="onInputChange(event)">
    </header>`;
}

function TodoInputAfterRender(header) {
  header.querySelector('input').focus();
}

function TodoFooter(state) {
  let numItems = getItemsByStatus(state.todo, 'active').length;
  let id = tab => tab.toLowerCase();
  return `<footer class="Item Item--full flex flex-justify--between text-small">
    <span>${numItems} items left</span>
    <ul class="flex flex-gapRight--small">
      ${['All', 'Active', 'Completed'].map((tab) => `
      <li>
        <a class="Tab ${id(tab) === state.selectedTab ? 'is-selected' : ''}"
          id="${id(tab)}" href="#${id(tab)}"
          onclick="onTabClick(event)">${tab}</a>
      </li>`
    ).join('')}
    </ul>
    <button class="text-decoration:hover" onclick="onClearCompletedClick(event)">
      Clear completed
    </button>
  </footer>`;
}
function TodoFooterAfterRender() {}

function TodoList(state) {
  let id = todoItem => getItemId(todoItem.name);
  let filteredTodo = getItemsByStatus(state.todo, state.selectedTab);
  return `<ul class="List">
    ${filteredTodo.map(todoItem => `
      <li class="Item flex">
        <input type="checkbox" name="" id="${id(todoItem)}" data-id="${id(todoItem)}"
              ${todoItem.active === false && 'checked'}
              onchange="onCheckboxChange(event)">

        ${todoItem.isEditable ? `
          <input type="text" class="TodoInput" data-id="${id(todoItem)}" value="${todoItem.name}"
                onchange="onNameChange(event)"
        ` : `
          <label for="${id(todoItem)}" data-id="${id(todoItem)}" tabindex="0"
            onclick="onNameClick(event)"
            ondblclick="onNameDoubleClick(event)"
            onkeypress="onNameKeyPress(event)">${todoItem.name}</label>
        `}

        <button class="Item-remove flex-alignSelf--right" aria-label="Remove"
                data-id="${id(todoItem)}"
                onclick="onRemoveButtonClick(event)">&times;</button>
      </li>`).join('')}
  </ul>`;
}
function TodoListAfterRender(ul) {
  let editInput = ul.querySelector('input[type="text"]');
  if (editInput) {
    editInput.focus();
  }
}


// - Todo Model ------------------------------------------------

function getItemId(name) {
  return 'id-' + name;
}

function getItemsByStatus(todo, status) {
  return status === 'all' ? todo : todo.filter(item => {
    return status === 'active' && item.active || status === 'completed' && !item.active;
  });
}

function addItemToList(todo, name){
  let newItem = {name: name, active: true, id: getItemId(name)};
  todo.push(newItem);
  return todo;
}

function deleteItemFromList(todo, id){
  let item = findById(todo, id);

  let idx = todo.indexOf(item);
  todo.splice(idx, 1);
  return todo;
}

function renameItem(todo, id, newName){
  let item = findById(todo, id);
  item.name = newName;
  item.id = getItemId(newName);
  return todo;
}

function toggleItemStatus(todo, id){
  let item = findById(todo, id);
  item.active = !item.active;
  return todo;
}

function toggleEditableState(todo, id){
  let item = findById(todo, id);
  item.isEditable = !item.isEditable;
  return todo;
}

function findById(todo, id) {
  // return todo.find(item => item.id === id);
  return todo.filter(item => item.id === id)[0];
}

// - Storage ------------------------------------------------
function save(state) {
  localStorage.setItem('state', JSON.stringify(state));
}

function getSavedState() {
  let value = localStorage.getItem('state');
  return value ? JSON.parse(value) : null;
}