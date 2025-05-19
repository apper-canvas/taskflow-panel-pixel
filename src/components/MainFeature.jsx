import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { format } from 'date-fns';

function MainFeature({ activeTab }) {
  // State for tasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return [];
      }
    }
    return [
      { 
        id: '1', 
        title: 'Create project plan', 
        description: 'Outline the key deliverables and timeline',
        status: 'todo', 
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        createdAt: new Date().toISOString() 
      },
      { 
        id: '2', 
        title: 'Review design mockups', 
        description: 'Check the new homepage design and provide feedback',
        status: 'inprogress', 
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        createdAt: new Date().toISOString() 
      },
      { 
        id: '3', 
        title: 'Update documentation', 
        description: 'Add new API endpoints to the developer docs',
        status: 'completed', 
        priority: 'low',
        dueDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    ];
  });

  // State for task creation
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
  });

  // State for task editing
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Reset new task form when closing
  const resetNewTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
    });
  };

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    const taskToAdd = {
      id: Date.now().toString(),
      ...newTask,
      dueDate: new Date(newTask.dueDate).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, taskToAdd]);
    toast.success("Task added successfully");
    setIsAddTaskOpen(false);
    resetNewTaskForm();
  };

  // Edit an existing task
  const handleEditTask = (e) => {
    e.preventDefault();
    
    if (!editingTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setTasks(tasks.map(task => 
      task.id === editingTask.id ? {
        ...editingTask,
        dueDate: new Date(editingTask.dueDate).toISOString(),
        ...(editingTask.status === 'completed' && !task.completedAt && {
          completedAt: new Date().toISOString()
        })
      } : task
    ));

    toast.success("Task updated successfully");
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Handle status change
  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {
        ...task,
        status: newStatus,
        ...(newStatus === 'completed' && !task.completedAt && {
          completedAt: new Date().toISOString()
        })
      } : task
    ));
    toast.success(`Task moved to ${newStatus}`);
  };

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Icons
  const PlusIcon = getIcon('plus');
  const EditIcon = getIcon('edit');
  const TrashIcon = getIcon('trash-2');
  const CheckCircleIcon = getIcon('check-circle');
  const ClockIcon = getIcon('clock');
  const CalendarIcon = getIcon('calendar');
  const FlagIcon = getIcon('flag');
  const XIcon = getIcon('x');
  
  // Priority icons
  const priorityIcons = {
    low: getIcon('arrow-down'),
    medium: getIcon('minus'),
    high: getIcon('arrow-up')
  };

  // Priority colors
  const priorityColors = {
    low: 'text-green-500',
    medium: 'text-blue-500',
    high: 'text-accent'
  };

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Status options
  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  // Task Card Component
  const TaskCard = ({ task }) => {
    const PriorityIcon = priorityIcons[task.priority];
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        transition={{ duration: 0.2 }}
        className={`task-item task-item-${task.priority} mb-4`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-surface-800 dark:text-surface-100">{task.title}</h3>
          <button 
            onClick={() => {
              setEditingTask({
                ...task,
                dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd')
              });
              setIsEditModalOpen(true);
            }}
            className="text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100"
          >
            <EditIcon className="h-4 w-4" />
          </button>
        </div>
        
        {task.description && (
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className={`flex items-center gap-1 text-xs ${priorityColors[task.priority]}`}>
            <PriorityIcon className="h-3 w-3" />
            <span className="capitalize">{task.priority}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
            <CalendarIcon className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          
          <div className={`task-status status-${task.status} ml-auto`}>
            {task.status === 'todo' ? 'To Do' : task.status === 'inprogress' ? 'In Progress' : 'Completed'}
          </div>
        </div>
      </motion.div>
    );
  };

  // Add Task Modal
  const AddTaskModal = () => (
    <AnimatePresence>
      {isAddTaskOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-surface-900 bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-card max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
              <h2 className="text-lg font-semibold">Add New Task</h2>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddTask} className="p-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="input resize-none"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add details about this task"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    className="input"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="input"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  className="input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Edit Task Modal
  const EditTaskModal = () => (
    <AnimatePresence>
      {isEditModalOpen && editingTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-surface-900 bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-card max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
              <h2 className="text-lg font-semibold">Edit Task</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditTask} className="p-4 space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="edit-title"
                  required
                  className="input"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  className="input resize-none"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Add details about this task"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    className="input"
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="edit-priority"
                    className="input"
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="edit-dueDate"
                  className="input"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                />
              </div>
              
              <div className="flex flex-wrap justify-between pt-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleDeleteTask(editingTask.id)}
                  className="btn border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-500 dark:hover:bg-red-900/30 flex items-center gap-1"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render appropriate view based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'board':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="card h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-blue-500" />
                  <span>To Do</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2.5 py-0.5 dark:bg-blue-900 dark:text-blue-300">
                    {todoTasks.length}
                  </span>
                </h3>
              </div>
              
              <div className="space-y-1">
                <AnimatePresence>
                  {todoTasks.length > 0 ? (
                    todoTasks.map(task => <TaskCard key={task.id} task={task} />)
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-surface-500 dark:text-surface-400 py-6"
                    >
                      No tasks to do
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          
            {/* In Progress Column */}
            <div className="card h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FlagIcon className="h-5 w-5 text-yellow-500" />
                  <span>In Progress</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full px-2.5 py-0.5 dark:bg-yellow-900 dark:text-yellow-300">
                    {inProgressTasks.length}
                  </span>
                </h3>
              </div>
              
              <div className="space-y-1">
                <AnimatePresence>
                  {inProgressTasks.length > 0 ? (
                    inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-surface-500 dark:text-surface-400 py-6"
                    >
                      No tasks in progress
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          
            {/* Completed Column */}
            <div className="card h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span>Completed</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full px-2.5 py-0.5 dark:bg-green-900 dark:text-green-300">
                    {completedTasks.length}
                  </span>
                </h3>
              </div>
              
              <div className="space-y-1">
                <AnimatePresence>
                  {completedTasks.length > 0 ? (
                    completedTasks.map(task => <TaskCard key={task.id} task={task} />)
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-surface-500 dark:text-surface-400 py-6"
                    >
                      No completed tasks
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );
        
      case 'list':
        return (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-surface-700 dark:text-surface-300 uppercase border-b border-surface-200 dark:border-surface-700">
                  <tr>
                    <th scope="col" className="px-4 py-3">Title</th>
                    <th scope="col" className="px-4 py-3 hidden sm:table-cell">Priority</th>
                    <th scope="col" className="px-4 py-3 hidden md:table-cell">Due Date</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {tasks.length > 0 ? (
                      tasks.map(task => {
                        const PriorityIcon = priorityIcons[task.priority];
                        return (
                          <motion.tr 
                            key={task.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-surface-200 dark:border-surface-700"
                          >
                            <td className="px-4 py-3 font-medium text-surface-800 dark:text-surface-200">
                              {task.title}
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <div className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
                                <PriorityIcon className="h-4 w-4" />
                                <span className="capitalize">{task.priority}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell text-surface-600 dark:text-surface-400">
                              {formatDate(task.dueDate)}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                className="block w-full py-1 px-2 text-xs rounded border border-surface-300 dark:border-surface-700 
                                bg-white dark:bg-surface-800 focus:ring-1 focus:ring-primary"
                              >
                                {statusOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => {
                                  setEditingTask({
                                    ...task,
                                    dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd')
                                  });
                                  setIsEditModalOpen(true);
                                }}
                                className="text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100"
                              >
                                <EditIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="px-4 py-8 text-center text-surface-500 dark:text-surface-400" colSpan={5}>
                          No tasks found
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'calendar':
        return (
          <div className="card">
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 mx-auto text-surface-400 dark:text-surface-600 mb-4" />
              <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">Calendar View</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Calendar view will be available in the next update
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="card p-6 text-center">
            <p className="text-surface-600 dark:text-surface-400">
              Select a tab to view tasks
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Add Task Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            resetNewTaskForm();
            setIsAddTaskOpen(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Task</span>
        </button>
      </div>
      
      {/* Tab Content */}
      {renderTabContent()}
      
      {/* Modals */}
      <AddTaskModal />
      <EditTaskModal />
    </div>
  );
}

export default MainFeature;