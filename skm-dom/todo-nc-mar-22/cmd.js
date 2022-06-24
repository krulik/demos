#!/usr/bin/env node

const { getToDos, setToDos, deleteToDo, updateToDo, addToDo, searchTodo } = require("./todos");

function displayToDos() {
    // const display = getToDos().map(function(todo, index) {
    //         return `  ${index + 1}) ${todo.task}`;
    //     })
    //     .join('\n');
    console.table(getToDos())
}
const [, , crud, ...text] = process.argv;

const [id] = text;

switch (crud) {
    case 'get':
        displayToDos();
        break;
    case 'create':
        addToDo(text.join(' '));
        break;
    case 'delete':
        deleteToDo(id)
        console.log(`removed successfully: task`, id);
        break;
    case 'update':
        const [, par, ...sentence] = text;
        updateToDo(id, par, sentence.join(` `));
        console.log(`the ${par} in task ${id} has been updated to ${sentence.join(` `)}`)
        break;
    case 'search':
        const[, whereToLook] = text;
        console.log(`we found ${searchTodo(text, whereToLook)}.`);

    default:
        console.log('write something valid')


}

// const displayAddToDo = addToDo(); 
// console.log(displayAddToDo)// why the function here works fine. but when written in cmd.js it write to todo twice to the
// file ?