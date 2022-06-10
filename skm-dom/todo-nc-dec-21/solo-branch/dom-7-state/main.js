var state = {
  todo: [],
  selectedTab: ''
};

onPageLoad();


// - Actions ------------------------------------------------

function onPageLoad() {
  setState({
    todo: getSavedTodo(),
    selectedTab: 'all'
  });
}

function onInputChange(eventObject) {
  setState({
    todo: addItemToList(state.todo, eventObject.target.value)
  }, function(state) {
    save(state.todo);
  });
}

function onCheckboxChange(eventObject) {
  document.addEventListener('transitionend', onTransitionEnd);

  function onTransitionEnd() {
    setState({
      todo: toggleItemStatus(state.todo, eventObject.target.dataset.id)
    }, function(state) {
      save(state.todo);
    });
    document.removeEventListener('transitionend', onTransitionEnd);
  }
}

function onRemoveButtonClick(eventObject) {
  setState({
    todo: deleteItemFromList(state.todo, eventObject.target.dataset.id)
  }, function(state) {
    save(state.todo);
  });
}

function onTabClick(eventObject) {
  setState({
    selectedTab: eventObject.target.id,
  });
}

function onClearCompletedClick() {
  setState({
    todo: getItemsByStatus(state.todo, 'active')
  }, function(state) {
    save(state.todo);
  });
}

function onNameClick(eventObject) {
  eventObject.preventDefault();
}

function onNameDoubleClick(eventObject) {
  eventObject.preventDefault();

  setState({
    todo: toggleEditableState(state.todo, eventObject.target.dataset.id)
  }, function(state) {
    save(state.todo);
  });
}

function onNameKeyPress(eventObject) {
  if (eventObject.key === 'Enter') {
    onNameDoubleClick(eventObject);
  }
}

function onNameChange(eventObject) {
  toggleEditableState(state.todo, eventObject.target.dataset.id);
  renameItem(state.todo, eventObject.target.dataset.id, eventObject.target.value);
  setState({
    todo: state.todo
  }, function(state) {
    save(state.todo);
  });
}

// - State -----------------------------------------------
function setState(newState, callback) {
  Object.assign(state, newState);
  render(state);
  if (typeof callback === 'function') {
    callback(state);
  }
}

// - View ------------------------------------------------
function render(state) {
  var InputContainer = document.querySelector('.InputContainer');
  var ListContainer = document.querySelector('.ListContainer');
  var FooterContainer = document.querySelector('.FooterContainer');

  var Input = document.querySelector('header');
  if (Input) {
    InputContainer.removeChild(Input);
  }
  InputContainer.appendChild(TodoInput(state));
  TodoInputAfterRender(document.querySelector('header'));

  var List = document.querySelector('.List');
  if (List) {
    ListContainer.removeChild(List);
  }
  ListContainer.appendChild(TodoList(state));
  TodoListAfterRender(document.querySelector('.List'));

  var Footer = document.querySelector('footer');
  if (Footer) {
    FooterContainer.removeChild(Footer);
  }
  FooterContainer.appendChild(TodoFooter(state));
  TodoFooterAfterRender(document.querySelector('footer'));
}

function TodoInput(state) {
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
  span.innerText = getItemsByStatus(state.todo, 'active').length + ' items left';

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

function TodoList(state) {
  // <ul class="List">
  var ul = document.createElement('ul');
  ul.className = 'List';
  var filteredTodo = getItemsByStatus(state.todo, state.selectedTab);
  for (var i = 0; i < filteredTodo.length; i++) {
    ul.appendChild(TodoItem(filteredTodo[i]))
  }
  return ul;
}
function TodoListAfterRender(ul) {
  var editInput = ul.querySelector('input[type="text"]');
  if (editInput) {
    editInput.focus();
  }
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
  checkbox.dataset.id = getItemId(todoItem.name);
  checkbox.checked = todoItem.active === false;
  checkbox.addEventListener('change', onCheckboxChange);
  li.appendChild(checkbox);

  if (todoItem.isEditable) {
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'TodoInput';
    input.dataset.id = getItemId(todoItem.name);
    input.value = todoItem.name;
    input.addEventListener('change', onNameChange);
    li.appendChild(input);
  } else {
    var label = document.createElement('label');
    label.htmlFor = getItemId(todoItem.name);
    label.dataset.id = getItemId(todoItem.name);
    label.innerText = todoItem.name;
    label.tabIndex = 0;
    label.addEventListener('click', onNameClick);
    label.addEventListener('dblclick', onNameDoubleClick);
    label.addEventListener('keypress', onNameKeyPress);
    li.appendChild(label);
  }

  var removeButton = document.createElement('button');
  removeButton.dataset.id = getItemId(todoItem.name);
  removeButton.className = 'Item-remove flex-alignSelf--right';
  removeButton.setAttribute('aria-label', 'Remove');
  removeButton.innerHTML = '&times;';
  removeButton.addEventListener('click', onRemoveButtonClick);
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
  return todo;
}

function deleteItemFromList(todo, id) {
  var item;
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === id) {
      item = todo[i];
    }
  }
  // getting the item's index
  var idx = todo.indexOf(item);
  // deleting the item from the array
  todo.splice(idx, 1);
  return todo;
}

function renameItem(todo, id, newName) {
  var item;
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === id) {
      item = todo[i];
    }
  }
  item.name = newName;
  item.id = getItemId(newName);
  return todo;
}

function toggleItemStatus(todo, id) {
  var item;
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === id) {
      item = todo[i];
    }
  }
  item.active = !item.active;
  return todo;
}

function toggleEditableState(todo, id) {
  var item;
  for (var i = 0; i < todo.length; i++) {
    if (todo[i].id === id) {
      item = todo[i];
    }
  }
  if (!item) {
    throw 'no item ' + id
  }
  item.isEditable = !item.isEditable;
  return todo;
}

// - Storage ------------------------------------------------
function save(todoArray) {
  localStorage.setItem('todoArray', JSON.stringify(todoArray));
}

function getSavedTodo() {
  var value = localStorage.getItem('todoArray');
  if (value) {
    return JSON.parse(value);
  } else {
    return [];
  }
}