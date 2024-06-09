// src/index.ts
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import bodyParser from 'body-parser';

// express app
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(bodyParser.json());

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// In-memory data storage for tasks
let tasks: Task[] = [
  {
    id: '2ea19522-e6f9-4676-bae9-780a9fa3b2a6',
    title: 'Task 1',
    description: 'Description for Task 1',
    completed: true,
  },
  {
    id: '1eeeea76-36ea-4480-b97c-487d1589cbe1',
    title: 'Task 2',
    description: 'Description for Task 2',
    completed: false,
  }
];

// API Endpoints
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const newTask: Task = { id: uuidv4(), title, description, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { id, title, description, completed };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
