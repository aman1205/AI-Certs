import request from 'supertest';
import app from '../server';

describe('Tasks API', () => {
  it('GET /tasks - should retrieve all tasks', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('POST /tasks - should create a new task', async () => {
    const newTask = { title: 'New Task', description: 'New Description', completed: false };

    const response = await request(app)
      .post('/tasks')
      .send(newTask);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newTask.title);
    expect(response.body.description).toBe(newTask.description);
  });

  it('PUT /tasks/:id - should update an existing task', async () => {
    const updatedTask = { title: 'Updated Task', description: 'Updated Description', completed: true };

    const response = await request(app)
      .put('/tasks/2ea19522-e6f9-4676-bae9-780a9fa3b2a6')
      .send(updatedTask);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedTask.title);
    expect(response.body.description).toBe(updatedTask.description);
    expect(response.body.completed).toBe(updatedTask.completed);
  });

  it('DELETE /tasks/:id - should delete a task', async () => {
    const response = await request(app).delete('/tasks/2ea19522-e6f9-4676-bae9-780a9fa3b2a6');
    expect(response.status).toBe(204);
  });
});
