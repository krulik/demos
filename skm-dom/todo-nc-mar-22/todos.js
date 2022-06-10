const { readFileSync, writeFileSync } = require('fs');

function getToDos() {
    const data = readFileSync('todos.json').toString();
    return JSON.parse(data);
}

function addToDo(text) {
    const todos = getToDos();
    todos.push({
        id: Math.random().toString().slice(3, 8),
        task: text,
        created: new Date(),
        isDone: false
    })
    setToDos(todos);
}

function setToDos(todos) {
    return writeFileSync('todos.json', JSON.stringify(todos))
}

function deleteToDo(id) {
    const todos = getToDos();
    const filterdTodos = todos.filter(function(todo) {
        return todo.id !== id;
    });
    setToDos(filterdTodos);
}

function updateToDo(id, todo) {
    const todos = getToDos();
    const updatedToDo = todos.find(function(todo) {
        return todo.id === id;
    });
    updatedToDo.task = todo;
    setToDos(todos);
}

module.exports = { getToDos, setToDos, deleteToDo, updateToDo, addToDo }