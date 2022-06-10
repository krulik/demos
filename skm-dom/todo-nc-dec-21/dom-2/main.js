var Input = document.querySelector('.TodoInput');
var ListContainer = document.querySelector('.ListContainer');

var todo = [
  { name: "Sleep", active: true},
  { name: "Shopping", active: false},
  { name: "Bank", active: true}
];

ListContainer.appendChild(List(todo));

Input.addEventListener('change', onInputChange);


// ------------------------------------------------

function onInputChange() {
  var List = document.querySelector('.List');
  var newTodo = {
    name: Input.value,
    active: true
  };
  List.appendChild(Item(newTodo));
}

function List(todoArray) {
  // <ul class="List">
  var ul = document.createElement('ul');
  ul.className = 'List';
  for (var i = 0; i < todoArray.length; i++) {
    ul.appendChild(Item(todoArray[i]))
  }
  return ul;
}

function Item(todoItem) {
  // <li class="Item flex">
  //   <input type="checkbox" name="" id="id-1">
  //   <label for="id-1">foo</label>
  //   <button class="Item-remove flex-alignSelf--right" aria-label="Remove">&times;</button>
  // </li>
  var li = document.createElement('li');
  li.className = 'Item flex'
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.id = 'id-' + todoItem.name;
  input.checked = todoItem.active === false;
  var label = document.createElement('label');
  label.htmlFor = 'id-' + todoItem.name;
  label.innerText = todoItem.name;
  var button = document.createElement('button');
  button.className = 'Item-remove flex-alignSelf--right';
  button.setAttribute('aria-label', 'Remove');
  button.innerHTML = '&times;';
  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(button);
  return li;
}