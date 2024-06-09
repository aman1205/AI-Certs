// src/App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./component/Form";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { setTasks, deleteTask, updateTask, addTask } from './tasksSlice';
import { Task } from './types';

const App: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [buttonText, setButtonText] = useState("Create Task");
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('http://localhost:8000/tasks');
      dispatch(setTasks(response.data));
    };
    fetchTasks();
  }, [dispatch]);

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
        await axios.delete(`http://localhost:8000/tasks/${taskId}`);
        dispatch(deleteTask(taskId));
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
      // Update task
      try {
        await axios.put(`http://localhost:8000/tasks/${task.id}`, task);
        dispatch(updateTask(task));
        alert('Task updated successfully');
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      // Create new task
      try {
        const response = await axios.post('http://localhost:8000/tasks', task);
        dispatch(addTask(response.data));
        alert('Task created successfully');
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Completed</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{task.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">{task.completed ? "Completed" : "Pending"}</td>
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
                        onClick={() => handleDeleteTaskClick(task.id)}
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
};

export default App;
