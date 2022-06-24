const { getToDos, getToDo, setToDos, deleteToDo, updateToDo, addToDo, searchTodo } = require("./todos");
const express = require('express');
const app = express();
app.use(express.json());


app.get('/api/todos', function(req, res) {
    res.send(getToDos()).end();
})


app.delete('/api/todos/:todoId', function(req, res) {
    const { todoId } = req.params;
    const deletedToDo = getToDo(todoId);
    deleteToDo(todoId);
    res.send(deletedToDo).end();
})

app.post('/api/todos', function(req, res) {
    const todo = req.body;
    res.send(addToDo(todo));
})

app.put('/api/todos/:todoId', function(req, res) {
    const { todoId } = req.params;
    res.send(updateToDo(todoId, req.body));
})
app.listen(5000, () => console.log('app is running'));