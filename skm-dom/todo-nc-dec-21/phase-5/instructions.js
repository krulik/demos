/*
  We are going to create a TODO list!
  Based on this example: https://todomvc.com/examples/vanilla-es6/#/

  Our initial JS functionality:

  1) Add item to the list
  2) Mark item as done
  3) Unmark item as done
  4) Rename item
  5) Delete Item

  Your task right now is:
  a) Create a data object for this list

  b) Plan which functions you need for the functionality,
     write down for each function:
    - function name
    - input parameters
    - return value

  c) Start implementing the functions

*/


function addItemToList(name){
  var newItem = {name: name, active: true};
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

function toggleItemStatus (item){
  /*if (item.active){
    item.active = false;
  } else {
    item.active = true;
  }*/

  item.active = !item.active;
}


var todo = [
  { name: "Sleep", active: true},
  { name: "Shopping", active: false},
  { name: "Bank", active: true}
];

addItemToList("Work!");
//console.log(todo);

deleteItemFromList(todo[1]);
//console.log(todo);

renameItem(todo[0], 'Wake up');
//console.log(todo);

toggleItemStatus(todo[0]);
console.log(todo);
