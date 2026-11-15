const { readAll, writeAll } = require('../data/taskStore');

const ALLOWED_STATUS = ['pending', 'in-progress', 'completed'];
const ALLOWED_PRIORITY = ['low', 'medium', 'high'];

// GET /tasks - list all tasks
exports.getAllTasks = (req, res) => {
  const tasks = readAll();
  res.status(200).json({ count: tasks.length, data: tasks });
};

// GET /tasks/:id - get a single task
exports.getTaskById = (req, res) => {
  const id = Number(req.params.id);
  const task = readAll().find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: `Task with id ${id} not found.` });
  }
  res.status(200).json({ data: task });
};

// POST /tasks - create a new task
exports.createTask = (req, res) => {
  const { title, description, status, priority, assignee } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'title is required.' });
  }
  if (status && !ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${ALLOWED_STATUS.join(', ')}` });
  }
  if (priority && !ALLOWED_PRIORITY.includes(priority)) {
    return res.status(400).json({ message: `priority must be one of: ${ALLOWED_PRIORITY.join(', ')}` });
  }

  const tasks = readAll();
  const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const now = new Date().toISOString();

  const newTask = {
    id: nextId,
    title: title.trim(),
    description: description || '',
    status: status || 'pending',
    priority: priority || 'medium',
    assignee: assignee || null,
    createdAt: now,
    updatedAt: now
  };

  tasks.push(newTask);
  writeAll(tasks);
  res.status(201).json({ message: 'Task created.', data: newTask });
};

// PUT /tasks/:id - update an existing task
exports.updateTask = (req, res) => {
  const id = Number(req.params.id);
  const tasks = readAll();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Task with id ${id} not found.` });
  }

  const { title, description, status, priority, assignee } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ message: 'title cannot be empty.' });
  }
  if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${ALLOWED_STATUS.join(', ')}` });
  }
  if (priority !== undefined && !ALLOWED_PRIORITY.includes(priority)) {
    return res.status(400).json({ message: `priority must be one of: ${ALLOWED_PRIORITY.join(', ')}` });
  }

  const current = tasks[index];
  const updated = {
    ...current,
    title: title !== undefined ? title.trim() : current.title,
    description: description !== undefined ? description : current.description,
    status: status !== undefined ? status : current.status,
    priority: priority !== undefined ? priority : current.priority,
    assignee: assignee !== undefined ? assignee : current.assignee,
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updated;
  writeAll(tasks);
  res.status(200).json({ message: 'Task updated.', data: updated });
};

// DELETE /tasks/:id - delete a task
exports.deleteTask = (req, res) => {
  const id = Number(req.params.id);
  const tasks = readAll();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Task with id ${id} not found.` });
  }

  const [removed] = tasks.splice(index, 1);
  writeAll(tasks);
  res.status(200).json({ message: 'Task deleted.', data: removed });
};