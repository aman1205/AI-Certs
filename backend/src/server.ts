import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
//express app
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
}

// In-memory data storage for tasks
let tasks: Task[] = [
  {
    id: '2ea19522-e6f9-4676-bae9-780a9fa3b2a6',
    title: 'Task 1',
    description: 'Description for Task 1',
    status: 'In Progress',
    dueDate: '2024-06-01',
  },
  {
    id:'1eeeea76-36ea-4480-b97c-487d1589cbe1',
    title: 'Task 2',
    description: 'Description for Task 2',
    status: 'Pending',
    dueDate: '2024-06-05',
  }
];

// API Endpoints
app.get('/', (req: Request, res: Response) => {
  res.json(tasks);
});
app.get('/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});
// POST /tasks: Create a new task
app.post('/tasks', (req: Request, res: Response) => {
    const { title, description, status, dueDate } = req.body;
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status,
      dueDate
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });
  
  // PUT /tasks/:id: Update an existing task by ID
  app.put('/tasks/:id', (req: Request, res: Response) => {
    const task = tasks.find(t => t.id ===(req.params.id));
    if (task) {
      const { title, description, status, dueDate } = req.body;
      task.title = title;
      task.description = description;
      task.status = status;
      task.dueDate = dueDate;
      res.status(201).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  });
  
  // DELETE /tasks/:id: Delete a task by ID
  app.delete('/tasks/:id', (req: Request, res: Response) => {
    const taskIndex = tasks.findIndex(t => t.id === (req.params.id));
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
