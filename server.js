import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Todo API Server is running', apiEndpoint: 'http://localhost:3001/api/todos' });
});

// In-memory storage for todos
let todos = [
  { id: 1, title: 'Learn React', completed: false },
  { id: 2, title: 'Build a Vite project', completed: false },
  { id: 3, title: 'Connect Node backend', completed: false }
];

let nextId = 4;

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST - Add a new todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTodo = {
    id: nextId++,
    title,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT - Update todo (toggle completion)
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed, title } = req.body;
  
  const todo = todos.find(t => t.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (completed !== undefined) todo.completed = completed;
  if (title !== undefined) todo.title = title;
  
  res.json(todo);
});

// DELETE - Remove a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex(t => t.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  const deletedTodo = todos.splice(index, 1);
  res.json(deletedTodo[0]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
