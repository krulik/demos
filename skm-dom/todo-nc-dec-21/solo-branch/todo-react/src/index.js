import React from 'react';
import ReactDOM from 'react-dom';
import {useState, useEffect} from 'react';

ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);

function TodoApp() {
  let [state, setState] = useState({todo: [], selectedTab: 'all'});
  // useEffect(() => {
  //   setState(getSavedState() || {todo: [], selectedTab: 'all'});
  // }, []);
  if (!state) {
    return 'no state';
  }
  return <div className="column">
    <h1>Todos</h1>
    <main>
      <div className="InputContainer"><TodoInput onChange={onInputChange} /></div>
      <div className="ListContainer"><TodoList state={state} /></div>
      <div className="FooterContainer"><TodoFooter state={state} onClearCompletedClick={onClearCompletedClick} /></div>
    </main>
  </div>;

  function onInputChange(event) {
    console.log(event);
  }
  function onClearCompletedClick(event) {}
}

function TodoInput({state, onChange}) {
  return <header>
    <input className="TodoInput Item" type="text" placeholder="What needs to be done?"
           onChangeText={onChange} />
    </header>;
}

function TodoFooter({state, onClearCompletedClick}) {
  let numItems = getItemsByStatus(state.todo, 'active').length;
  let id = tab => tab.toLowerCase();
  return <footer className="Item Item--full flex flex-justify--between text-small">
    <span>{numItems} items left</span>
    <ul className="flex flex-gapRight--small">
      {['All', 'Active', 'Completed'].map((tab) =>
      <li>
        <a className={`Tab ${id(tab) === state.selectedTab ? 'is-selected' : ''}`}
          id={id(tab)} href={`#${id(tab)}`}
          onClick="onTabClick(event)">{tab}</a>
      </li>
    )}
    </ul>
    <button className="text-decoration:hover" onClick={onClearCompletedClick}>
      Clear completed
    </button>
  </footer>;
}

function TodoList({state, onNameChange}) {
  let id = todoItem => getItemId(todoItem.name);
  let filteredTodo = getItemsByStatus(state.todo, state.selectedTab);
  return <ul className="List">
    {filteredTodo.map(todoItem => <li className="Item flex">
        <input type="checkbox" name="" id={id(todoItem)} data-id={id(todoItem)}
              onChange="onCheckboxChange(event)" />
              {/* ${todoItem.active === false && 'checked'} */}

        {todoItem.isEditable ?
          <input type="text" className="TodoInput" data-id={id(todoItem)} value={todoItem.name}
                onChange={onNameChange} />
         :
          <label for={id(todoItem)} data-id={id(todoItem)} tabindex="0"
            onClick="onNameClick(event)"
            ondblclick="onNameDoubleClick(event)"
            onkeypress="onNameKeyPress(event)">{todoItem.name}</label>
        }

        <button className="Item-remove flex-alignSelf--right" aria-label="Remove"
                data-id={id(todoItem)}
                onClick="onRemoveButtonClick(event)">&times;</button>
      </li>)}
  </ul>;
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