const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const users = [
    {id: 1, firstName: 'Thailyn', lastName: 'Diaz', email: 'thaylindiaz70@gmail.com' },
    {id: 2, firstName: 'Daniel', lastName: 'Calvo', email: 'dcalvo@polpocr.com' },
    {id: 3, firstName: 'Katherine', lastName: 'Calvo', email: 'kcalvo@polpocr.com' },
];

const todos = [
    {todoId: 1, title1:'Universidad', keywords: ['estudios', 'importante', 'academia'], userId: 1},
    {todoId: 2, title1:'Universidad', keywords: ['estudios', 'importante', 'academia'], userId: 2},
    {todoId: 3, title1: 'Casa', keywords: ['oficio', 'necesario', 'orden'], userId: 3}
];

const tasks = [
    {taskId: 1, title2: 'Estudiar para el examen de programación', completed: 0, todoId: 1, userId: 1},
    {taskId: 2, title2: 'Ir a clases' , completed: 1, todoId: 2, userId: 2},
    {taskId: 3, title2: 'Terminar tesis de grado', completed: 1, todoId: 1, userId: 1}
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (_,res) => {
    res.send('My Express App');
});

// lista de los usuarios, muestra la lista completa
app.get('/users', (_,res) => {
    res.json({ ok: true, users });
});

// Filtra por id de user
app.get('/users/:id', (req, res)=>{ 
    const { id } = req.params;
    const user = users.filter((user) => user.id === Number(id))[0];
    if(user){
        res.json({ok: true, user});
    }
    else res.status(404).json({ok: false, message:`User ${id} not found`})
 });

 // añade un user nuevo
 app.post('/users',(req, res)=>{
    const { firstName, lastName, email } = req.body;
    if(firstName && lastName && email){
        var id = 1;
        do{
            var cont = 0;
            users.forEach(x => {
                if(x.id == id){
                    cont++;
                }
            });
            if(cont == 0){
                cont = -1;
            }
            else id++;
       }while(cont != -1)
       users.push({id, firstName, lastName, email});
       res.json(users[users.length-1]);
    }
});

// Me muestra los todos de un user
app.get('/users/:id/todos',(req,res) => {
    const {id} = req.params;
    const todo = todos.filter((todo) => todo.userId === Number(id))[0];
    if(todo){
        res.json({ ok: true, todo});
    }
    else res.status(404).json({ok: false, message:`User ${id}: to-do not added`})
    
});

//Me muestra una to-do por medio del id
app.get('/users/todos/:todoId',(req,res) => {
    const { todoId } = req.params;
    const todo = todos.find((todo) => todo.todoId === Number(todoId));
    const task = tasks.filter((task) => task.todoId === Number(todoId));
    if(todo){
        res.json({ ok: true, todo, task});
    }
    else res.status(404).json({ok: false, message:`Id ${todoId}: to-do or task not added`})
});

//Crea una tarea en el repositorio
app.post('/todos/:todoId/task',(req,res) => {
    let { todoId } = req.params;
    const { title2, completed } = req.body;
    const todo  = todos.find((todo) => todo.todoId === Number(todoId));
    if(!todo){
        return res.status(404).json({ok: false, message:`to-do Id ${todoId}: Not found`})
    }
    const taskId = tasks.length + 1;
    const userId = todo.userId;
    todoId = parseInt(todoId);
    tasks.push({ taskId,title2,completed,todoId,userId });
    res.json(tasks[tasks.length - 1]);
});

app.listen(port,()=>{
    console.log(`Server: ${port}`);
});