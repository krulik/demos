const { readFileSync, writeFileSync } = require('fs');

function getToDos() {
    const data = readFileSync('todos.json').toString();
    return JSON.parse(data);
}

function getToDo(todoId) {
    const todos = getToDos();
    return todos.find(function(todo) {
        return todoId === todo.id;
    })
}

function addToDo(todo) {
    const todos = getToDos();
    const newTodo = {
        id: Math.random().toString().slice(3, 8),
        task: todo.task || 'no task',
        created: new Date(),
        isDone: todo.isDone || false,
        priority: todo.priority || 1
    }
    todos.push(newTodo);
    setToDos(todos);
    return newTodo;
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

// function updateToDo(id, todo) {
//     const todos = getToDos();
//     const updatedToDo = todos.find(function(todo) {
//         return todo.id === id;
//     });
//     updatedToDo.task = todo;
//     setToDos(todos);
// }

function updateToDo(todoId, { task, isDone, priority }) {
    const todos = getToDos();
    const updatedToDo = todos.find(function(todo) {
        return todo.id === todoId;
    });
    if (task) {
        updatedToDo.task = task;
    }
    if (typeof isDone === 'boolean') {
        updatedToDo.isDone = isDone;
    }
    if (typeof priority === 'number' && !isNaN(priority)) {
        updatedToDo.priority = priority;
    }
    setToDos(todos);
    return updatedToDo;
}



function searchTodo(keyword, whereToLook) {
    const todos = getToDos();
    const foundKewword = todos.find(function(keyword) {
        switch (whereToLook) {
            case `in id`:
                keyword === todos.id;
                break;
            case `in task`:
                keyword === todos.task;
                break;
            case `in created`:
                keyword === todos.created;
                break;
            case `in isDone`:
                return todos.isDone;
                break;
            default:
                return (`not a vaild parameter`);
                break;
        };
    })
    return foundKewword;
}
module.exports = { getToDos, getToDo, setToDos, deleteToDo, updateToDo, addToDo, searchTodo }