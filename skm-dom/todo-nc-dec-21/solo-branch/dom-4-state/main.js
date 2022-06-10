var Input = document.querySelector('.TodoInput');

var state = {
  allTodo: [
    { id: getItemId("Sleep"), name: "Sleep", active: true},
    { id: getItemId("Shopping"), name: "Shopping", active: false},
    { id: getItemId("Bank"), name: "Bank", active: true}
  ],
  selectedTab: 'all',
  filteredTodo: [],
}

state.filteredTodo = getItemsByStatus(state.allTodo, state.selectedTab);

render(state);

Input.addEventListener('change', onInputChange);


// - Actions ------------------------------------------------

function onInputChange() {
  // add item to the array list
  addItemToList(state.allTodo, Input.value);

  // use existing method of rendering the full array list
  render(state);
}

function onCheckboxChange(eventObject) {
  // toggle item status in array
  for (var i = 0; i < state.allTodo.length; i++) {
    if (state.allTodo[i].id === eventObject.target.id) {
      toggleItemStatus(state.allTodo[i]);
    }
  }
  // render the updated array
  render(state);
}

function onRemoveButtonClick(eventObject) {
  // remove item from array
  for (var i = 0; i < state.allTodo.length; i++) {
    if (state.allTodo[i].id === eventObject.target.id) {
      deleteItemFromList(state.allTodo, state.allTodo[i]);
    }
  }
  // render the updated array
  render(state);
}

// 1. action
function onTabClick(eventObject) {
  // 2. payload (event data): find out which tab was clicked

  // 3. update our state
  // update selected tab based on the payload
  state.selectedTab = eventObject.target.id;

  // filter the todo array according to selectedTab
  state.filteredTodo = getItemsByStatus(state.allTodo, state.selectedTab);

  // 4. render
  // render only the filtered todo array
  render(state);
}


// - View ------------------------------------------------
function render(state) {
  var ListContainer = document.querySelector('.ListContainer');
  var FooterContainer = document.querySelector('.FooterContainer');
  var List = document.querySelector('.List');
  if (List) {
    ListContainer.removeChild(List);
  }
  ListContainer.appendChild(TodoList(state));
  var Footer = document.querySelector('footer');
  if (Footer) {
    FooterContainer.removeChild(Footer);
  }
  FooterContainer.appendChild(TodoFooter(state));
}

function TodoFooter(state) {
  // <footer class="Item Item--full flex flex-justify--between text-small">
  //   <span>2 items left</span>
  //   <ul class="flex flex-gapRight--small">
  //     <li><a class="Tab" id="all" href="#all">All</a></li>
  //     <li><a class="Tab" id="active" href="#active">Active</a></li>
  //     <li><a class="Tab" id="completed" href="#completed">Completed</a></li>
  //   </ul>
  //   <button class="text-decoration:hover">Clear completed</button>
  // </footer>

  var footer = document.createElement('footer');
  footer.className = 'Item Item--full flex flex-justify--between text-small';

  var span = document.createElement('span');
  span.innerText = getItemsByStatus(state.allTodo, 'active').length + ' items left';

  var ul = document.createElement('ul');
  ul.className = 'flex flex-gapRight--small';

  var tabs = ['All', 'Active', 'Completed'];
  for (var i = 0; i < tabs.length; i++) {
    var tabId = tabs[i].toLowerCase();
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'Tab';
    if (tabId === state.selectedTab) {
      a.className += ' is-selected';
    }
    a.innerText = tabs[i];
    a.id = tabId;
    a.href = '#' + tabId;
    a.addEventListener('click', onTabClick);
    li.appendChild(a);
    ul.appendChild(li);
  }

  var button = document.createElement('button');
  button.className = 'text-decoration:hover';
  button.innerText = 'Clear completed';

  footer.appendChild(span);
  footer.appendChild(ul);
  footer.appendChild(button);
  return footer;
}

function TodoList(state) {
  // <ul class="List">
  var ul = document.createElement('ul');
  ul.className = 'List';
  for (var i = 0; i < state.filteredTodo.length; i++) {
    ul.appendChild(TodoItem(state.filteredTodo[i]))
  }
  return ul;
}

function TodoItem(todoItem) {
  // <li class="Item flex">
  //   <input type="checkbox" name="" id="id-1">
  //   <label for="id-1">foo</label>
  //   <button class="Item-remove flex-alignSelf--right" aria-label="Remove">&times;</button>
  // </li>

  var li = document.createElement('li');
  li.className = 'Item flex'

  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = getItemId(todoItem.name);
  checkbox.checked = todoItem.active === false;
  checkbox.addEventListener('change', onCheckboxChange);

  var label = document.createElement('label');
  label.htmlFor = getItemId(todoItem.name);
  label.innerText = todoItem.name;

  var removeButton = document.createElement('button');
  removeButton.id = getItemId(todoItem.name);
  removeButton.className = 'Item-remove flex-alignSelf--right';
  removeButton.setAttribute('aria-label', 'Remove');
  removeButton.innerHTML = '&times;';
  removeButton.addEventListener('click', onRemoveButtonClick);

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(removeButton);
  return li;
}


// - Todo Model ------------------------------------------------

function getItemId(name) {
  return 'id-' + name;
}

function getItemsByStatus(todo, status) {
  var filteredItems = [];
  for (var i = 0; i < todo.length; i++) {
    if (status === 'all' || status === 'active' && todo[i].active) {
      filteredItems.push(todo[i]);
    } else if (status === 'all' || status === 'completed' && !todo[i].active) {
      filteredItems.push(todo[i]);
    }
  }
  return filteredItems;
}

function addItemToList(todo, name){
  var newItem = {name: name, active: true, id: getItemId(name)};
  todo.push(newItem);
}

function deleteItemFromList(todo, item){
  // getting the item's index
  var idx = todo.indexOf(item);
  // deleting the item from the array
  todo.splice(idx, 1);
}

function renameItem(item, newName){
  item.name = newName;
}

function toggleItemStatus (item){
  item.active = !item.active;
}