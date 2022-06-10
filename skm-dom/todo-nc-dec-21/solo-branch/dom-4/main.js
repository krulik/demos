var Input = document.querySelector('.TodoInput');
var ListContainer = document.querySelector('.ListContainer');

var todo = [
  { id: 'id-Sleep', name: "Sleep", active: true},
  { id: 'id-Shopping', name: "Shopping", active: false},
  { id: 'id-Bank', name: "Bank", active: true}
];

render(todo, 'onLoad');

Input.addEventListener('change', onInputChange);


// - Actions ------------------------------------------------

function onInputChange() {
  addItemToList(Input.value);
  render(todo, 'onInputChange');
}

function onItemToggle(e) {
  for (var item of todo) {
    if (item.id === e.target.id) {
      toggleItemStatus(item);
    }
  }
  render(todo, 'onItemToggle');
}

function onItemRemove(e) {
  for (var item of todo) {
    if (item.id === e.target.id) {
      deleteItemFromList(item);
    }
  }
  render(todo, 'onItemRemove');
}

function onLabelClick(e) {
  // e.stopPropagation();
  for (var item of todo) {
    if (item.id === e.target.id) {
      item.isEditing = true;
    }
  }
  render(todo, 'onLabelClick');
}

function onLabelChange(e) {
  // e.stopPropagation();
  console.log(e);
  for (var item of todo) {
    if (item.id === e.target.id) {
      item.isEditing = false;
    }
  }
  render(todo, 'onLabelChange');
}

// - View ------------------------------------------------

function render(todo, actionName) {
  console.log(actionName, JSON.stringify(todo));
  var List = document.querySelector('.List');
  if (List) {
    ListContainer.removeChild(List);
  }
  ListContainer.appendChild(TodoList(todo));
}

function TodoList(todoArray) {
  // <ul class="List">
  var ul = document.createElement('ul');
  ul.className = 'List';
  for (var i = 0; i < todoArray.length; i++) {
    ul.appendChild(TodoItem(todoArray[i]))
  }
  return ul;
}

function TodoItem(todoItem) {
  // <li class="Item flex">
  //   <input type="checkbox" name="" id="id-1">
  //   <label for="id-1">foo</label>
  //   <button class="Item-remove flex-alignSelf--right" aria-label="Remove">&times;</button>
  // </li>
  var newId = 'id-' + todoItem.name;
  var li = document.createElement('li');
  li.className = 'Item flex'
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.id = newId;
  input.disabled = todoItem.isEditing;
  input.checked = todoItem.active === false;
  input.addEventListener('click', onItemToggle)
  var label = document.createElement('label');
  label.htmlFor = newId;
  label.innerText = todoItem.name;
  label.contentEditable = true;
  if (todoItem.isEditing) {
    setTimeout(() => {
      label.focus();
    });
  }
  label.id = newId;
  label.addEventListener('click', onLabelClick);
  label.addEventListener('input', onLabelChange);
  var button = document.createElement('button');
  button.className = 'Item-remove flex-alignSelf--right';
  button.setAttribute('aria-label', 'Remove');
  button.innerHTML = '&times;';
  button.id = newId;
  button.addEventListener('click', onItemRemove);
  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(button);
  return li;
}

// - Store ------------------------------------------------
function addItemToList(name){
  var newItem = {id: 'id-' + name, name: name, active: true};
  todo.push(newItem);
}

function deleteItemFromList(item){
  // getting the item's index
  var idx = todo.indexOf(item);

  // deleting the item from the array
  todo.splice(idx, 1);
}

function renameItem(item, newName){
  item.name = newName;
}

function toggleItemStatus(item){
  item.active = !item.active;
}