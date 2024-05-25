import { useState, useEffect } from "react";
import axios from "axios";
import Form from "./component/Form";

interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
}

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [buttonText, setButtonText] = useState("Create Task");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get<Task[]>('http://localhost:8000/tasks');
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const handleAddTaskClick = () => {
    setCurrentTask(null);
    setIsFormOpen(true);
    setButtonText("Create Task");
  };

  const handleEditTaskClick = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
    setButtonText("Edit Task");
  };

  const handleDeleteTaskClick = async (taskId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8000/tasks/${taskId}`);
        if (response.status === 204) {
          setTasks(tasks.filter(task => task.id !== taskId));
          alert('Task deleted successfully');
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = async (task: Task) => {
  
    if (currentTask) {
      try {
        const response = await axios.put(`http://localhost:8000/tasks/${task.id}`, task);
        if (response.status === 201) {
          setTasks(tasks.map(t => t.id === task.id ? task : t));
          alert('Task updated successfully');
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      // Create a new task
      try {
        const response = await axios.post('http://localhost:8000/tasks', task);
        if (response.status === 201) {
          setTasks([...tasks, response.data]);
          alert('Task created successfully');
        }
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {isFormOpen && (
        <Form
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          task={currentTask}
          buttonText={buttonText}
        />
      )}
      <section className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <button
            className="inline-flex items-center justify-center h-10 px-6 font-medium text-gray-50 bg-gray-900 rounded-md shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
            onClick={handleAddTaskClick}
          >
            New Task
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{task.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{task.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{task.description}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="inline-flex items-center justify-center h-10 px-6 font-medium text-gray-50 bg-blue-600 rounded-md shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                        type="button"
                        onClick={() => handleEditTaskClick(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center justify-center h-10 px-6 font-medium text-gray-50 bg-red-600 rounded-md shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                        type="button"
                        onClick={() => handleDeleteTaskClick(task?.id || '')}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
