var todo = [];
var selectedTab;

onPageLoad();


// - Actions ------------------------------------------------

function onPageLoad() {
  todo = [
    { id: getItemId("Sleep"), name: "Sleep", active: true},
    { id: getItemId("Shopping"), name: "Shopping", active: false},
    { id: getItemId("Bank"), name: "Bank", active: true}
  ];

  selectedTab = 'all';

  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onInputChange(eventObject) {
  // add item to the array list
  addItemToList(todo, eventObject.target.value);

  // use existing method of rendering the full array list
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onCheckboxChange(eventObject) {
  // toggle item status in array
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === eventObject.target.dataset.id) {
      toggleItemStatus(todo[i]);
    }
  }
  // render the updated array
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

function onRemoveButtonClick(eventObject) {
  // remove item from array
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === eventObject.target.dataset.id) {
      deleteItemFromList(todo, todo[i]);
    }
  }
  // render the updated array
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

// 1. action
function onTabClick(eventObject) {
  // 2. payload (event data): find out which tab was clicked

  // 3. update our state
  // update selected tab based on the payload
  selectedTab = eventObject.target.id;

  // filter the todo array according to selectedTab
  var filteredArray = getItemsByStatus(todo, selectedTab);

  // 4. render
  // render only the filtered todo array
  render(todo, filteredArray, selectedTab);
}

function onClearCompletedClick() {
  // update the all todo list to be only active
  todo = getItemsByStatus(todo, 'active');

  // render
  render(todo, getItemsByStatus(todo, selectedTab), selectedTab);
}

// - View ------------------------------------------------
function render(allTodo, filteredTodo, selectedTab) {
  var InputContainer = document.querySelector('.InputContainer');
  var ListContainer = document.querySelector('.ListContainer');
  var FooterContainer = document.querySelector('.FooterContainer');

  var Input = document.querySelector('header');
  if (Input) {
    InputContainer.removeChild(Input);
  }
  InputContainer.appendChild(TodoInput(allTodo, filteredTodo, selectedTab));
  TodoInputAfterRender(document.querySelector('header'));

  var List = document.querySelector('.List');
  if (List) {
    ListContainer.removeChild(List);
  }
  ListContainer.appendChild(TodoList(allTodo, filteredTodo, selectedTab));
  TodoListAfterRender(document.querySelector('.List'));

  var Footer = document.querySelector('footer');
  if (Footer) {
    FooterContainer.removeChild(Footer);
  }
  FooterContainer.appendChild(TodoFooter(allTodo, filteredTodo, selectedTab));
  TodoFooterAfterRender(document.querySelector('footer'));
}

function TodoInput() {
  // <header>
  //   <input class="TodoInput Item" type="text" placeholder="What needs to be done?">
  // </header>
  var header = document.createElement('header');
  var input = document.createElement('input');
  input.className = 'TodoInput Item';
  input.type = 'text';
  input.placeholder = 'What needs to be done?';
  input.addEventListener('change', onInputChange);

  header.appendChild(input);
  return header;
}

function TodoInputAfterRender(header) {
  header.querySelector('input').focus();
}

function TodoFooter(allTodo, filteredTodo, selectedTab) {
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
  span.innerText = getItemsByStatus(allTodo, 'active').length + ' items left';

  var ul = document.createElement('ul');
  ul.className = 'flex flex-gapRight--small';

  var tabs = ['All', 'Active', 'Completed'];
  for (var i = 0; i < tabs.length; i++) {
    var tabId = tabs[i].toLowerCase();
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.className = 'Tab';
    if (tabId === selectedTab) {
      a.className += ' is-selected';
    }
    a.innerText = tabs[i];
    a.id = tabId;
    a.href = '#' + tabId;
    a.addEventListener('click', onTabClick);
    li.appendChild(a);
    ul.appendChild(li);
  }

  var clearCompletedButton = document.createElement('button');
  clearCompletedButton.className = 'text-decoration:hover';
  clearCompletedButton.innerText = 'Clear completed';
  clearCompletedButton.addEventListener('click', onClearCompletedClick);

  footer.appendChild(span);
  footer.appendChild(ul);
  footer.appendChild(clearCompletedButton);
  return footer;
}
function TodoFooterAfterRender() {}

function TodoList(allTodo, filteredTodo, selectedTab) {
  // <ul class="List">
  var ul = document.createElement('ul');
  ul.className = 'List';
  for (var i = 0; i < filteredTodo.length; i++) {
    ul.appendChild(TodoItem(filteredTodo[i]))
  }
  return ul;
}
function TodoListAfterRender() {}

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
  checkbox.dataset.id = getItemId(todoItem.name);
  checkbox.checked = todoItem.active === false;
  checkbox.addEventListener('change', onCheckboxChange);

  var label = document.createElement('label');
    label.htmlFor = getItemId(todoItem.name);
    label.innerText = todoItem.name;

  var removeButton = document.createElement('button');
  removeButton.dataset.id = getItemId(todoItem.name);
  removeButton.className = 'Item-remove flex-alignSelf--right';
  removeButton.setAttribute('aria-label', 'Remove');
  removeButton.innerHTML = '&times;';
  removeButton.addEventListener('click', onRemoveButtonClick);

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(removeButton);
  return li;
}
function TodoItemAfterRender() {}


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