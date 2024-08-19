 import React, { useState, useEffect, useRef } from 'react';
// Import Bootstrap JS
import 'bootstrap';
import { useSharedContext } from '../hooks/useSharedContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';

const TaskView = () => {
  
  const [taskState, updateTaskState] = useSharedContext('taskView');
  const { tasks } = taskState || { tasks: [] };
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    const now = new Date();
    const upcomingTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff <= 3 && daysDiff > 0;
    });

    if (upcomingTasks.length > 0) {
      // Here you would typically show a notification in VS Code
      console.log('Upcoming tasks:', upcomingTasks);
    }
  }, [tasks]);

  const filteredAndSortedTasks = tasks
    .filter(task => filter === 'all' || task.status === filter)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'dueDate') {
        return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      }
      return 0;
    });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    updateTaskState(prevState => ({ ...prevState, tasks: newTasks }));
  };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      description: '',
      status: 'To-do',
      priority: 'Medium',
      assignedTo: 'User',
      relatedTests: [],
      dueDate: new Date(),
      subtasks: []
    };
    updateTaskState(prevState => ({
      ...prevState,
      tasks: [...prevState.tasks, newTask]
    }));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (editedTask) => {
    if (!validateTask(editedTask)) return;

    updateTaskState(prevState => ({
      ...prevState,
      tasks: prevState.tasks.map(t => t.id === editedTask.id ? editedTask : t)
    }));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      updateTaskState(prevState => ({
        ...prevState,
        tasks: prevState.tasks.filter(t => t.id !== taskId)
      }));
    }
  };

  const validateTask = (task) => {
    if (task.title.trim() === '') {
      alert('Task title cannot be empty');
      return false;
    }
    if (tasks.some(t => t.id !== task.id && t.title === task.title)) {
      alert('Task title must be unique');
      return false;
    }
    return true;
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className="task-view container mt-4">
      <h2 className="mb-4">Tasks</h2>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={handleAddTask}>Add Task</button>
        <select className="form-select d-inline-block w-auto me-2" onChange={(e) => setFilter(e.target['value'])}>
          <option value="all">All</option>
          <option value="To-do">To-do</option>
          <option value="In-progress">In-progress</option>
          <option value="Done">Done</option>
        </select>
        <select className="form-select d-inline-block w-auto" onChange={(e) => setSortBy(e.target['value'])}>
          <option value="priority">Sort by Priority</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul className="list-group" {...provided.droppableProps} ref={provided.innerRef}>
              {filteredAndSortedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="list-group-item mb-2"
                    >
                      {editingTask && editingTask.id === task.id ? (
                        <TaskEditForm task={task} onSave={handleSaveTask} onCancel={() => setEditingTask(null)} />
                      ) : (
                        <TaskItem 
                          task={task} 
                          onEdit={handleEditTask} 
                          onDelete={handleDeleteTask}
                          isExpanded={expandedTasks[task.id]}
                          onToggleExpansion={() => toggleTaskExpansion(task.id)}
                        />
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const TaskItem = ({ task, onEdit, onDelete, isExpanded, onToggleExpansion }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h5>{task.title}</h5>
        <p className="mb-1">{task.description}</p>
        <span className="badge bg-primary me-2">{task.status}</span>
        <span className="badge bg-secondary me-2">{task.priority}</span>
        <span className="badge bg-info me-2">{task.assignedTo}</span>
        <span className="badge bg-warning">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
      <div>
        <button className="btn btn-sm btn-outline-secondary me-2" onClick={onToggleExpansion}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
    {isExpanded && (
      <div className="mt-3">
        <h6>Subtasks:</h6>
        <ul>
          {task.subtasks.map((subtask, index) => (
            <li key={index}>{subtask}</li>
          ))}
        </ul>
        <h6>Related Tests:</h6>
        <ul>
          {task.relatedTests.map((test, index) => (
            <li key={index}>{test}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const TaskEditForm = ({ task, onSave, onCancel }) => {
  const [editedTask, setEditedTask] = useState(task);
  const [newSubtask, setNewSubtask] = useState('');
  const [newRelatedTest, setNewRelatedTest] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleDateChange = (date) => {
    setEditedTask(prevTask => ({ ...prevTask, dueDate: date }));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() !== '') {
      setEditedTask(prevTask => ({
        ...prevTask,
        subtasks: [...prevTask.subtasks, newSubtask.trim()]
      }));
      setNewSubtask('');
    }
  };

  const handleAddRelatedTest = () => {
    if (newRelatedTest.trim() !== '') {
      setEditedTask(prevTask => ({
        ...prevTask,
        relatedTests: [...prevTask.relatedTests, newRelatedTest.trim()]
      }));
      setNewRelatedTest('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="title"
          value={editedTask.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          name="description"
          value={editedTask.description}
          onChange={handleChange}
          placeholder="Task Description"
        />
      </div>
      <div className="mb-3">
        <select className="form-select" name="status" value={editedTask.status} onChange={handleChange}>
          <option value="To-do">To-do</option>
          <option value="In-progress">In-progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div className="mb-3">
        <select className="form-select" name="priority" value={editedTask.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="mb-3">
        <select className="form-select" name="assignedTo" value={editedTask.assignedTo} onChange={handleChange}>
          <option value="User">User</option>
          <option value="AI">AI</option>
        </select>
      </div>
      <div className="mb-3">
        <DatePicker
          selected={new Date(editedTask.dueDate)}
          onChange={handleDateChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <h6>Subtasks:</h6>
        <ul>
          {editedTask.subtasks.map((subtask, index) => (
            <li key={index}>{subtask}</li>
          ))}
        </ul>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target['value'])}
            placeholder="New Subtask"
          />
          <button type="button" className="btn btn-outline-secondary" onClick={handleAddSubtask}>Add</button>
        </div>
      </div>
      <div className="mb-3">
        <h6>Related Tests:</h6>
        <ul>
          {editedTask.relatedTests.map((test, index) => (
            <li key={index}>{test}</li>
          ))}
        </ul>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newRelatedTest}
            onChange={(e) => setNewRelatedTest(e.target['value'])}
            placeholder="New Related Test"
          />
          <button type="button" className="btn btn-outline-secondary" onClick={handleAddRelatedTest}>Add</button>
        </div>
      </div>
      <button type="submit" className="btn btn-primary me-2">Save</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default TaskView;