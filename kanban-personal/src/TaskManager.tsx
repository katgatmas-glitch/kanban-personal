import React, { useState } from 'react';
import { Plus, Search, ChevronDown, Calendar, LayoutGrid, List, BarChart3 } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Preparar la presentación',
      dueDate: '2024-07-20',
      priority: 'Alta',
      status: 'pending',
      completed: false
    },
    {
      id: 2,
      title: 'Revisar el informe',
      dueDate: '2024-07-22',
      priority: 'Media',
      status: 'pending',
      completed: false
    },
    {
      id: 3,
      title: 'Planificar la reunión',
      dueDate: '2024-07-25',
      priority: 'Baja',
      status: 'completed',
      completed: true
    },
    {
      id: 4,
      title: 'Enviar el correo electrónico',
      dueDate: '2024-07-28',
      priority: 'Alta',
      status: 'pending',
      completed: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'Media'
  });

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.title && newTask.dueDate) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: 'pending',
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', dueDate: '', priority: 'Media' });
      setShowAddModal(false);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (activeFilter.type === 'priority') {
      const priorityOrder = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (activeFilter.type === 'date') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (activeFilter.type === 'status') {
      return a.completed - b.completed;
    }
    return 0;
  });

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f9fafb;
          min-height: 100vh;
        }

        .app-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding-bottom: 80px;
        }

        /* Header */
        .header {
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-content {
          max-width: 896px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #111827;
        }

        .add-button {
          width: 48px;
          height: 48px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
          transition: background-color 0.2s;
        }

        .add-button:hover {
          background-color: #1d4ed8;
        }

        /* Main Content */
        .main {
          max-width: 896px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        /* Search */
        .search-container {
          margin-bottom: 1.5rem;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #93c5fd;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          background-color: white;
          border: 2px solid #bfdbfe;
          border-radius: 1rem;
          font-size: 1rem;
          color: #374151;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input::placeholder {
          color: #93c5fd;
        }

        .search-input:focus {
          border-color: #60a5fa;
        }

        /* Filters */
        .filter-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background-color: #dbeafe;
          color: #1e40af;
          border: none;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .filter-button:hover {
          background-color: #bfdbfe;
        }

        /* Task List */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .task-card {
          background-color: white;
          border-radius: 1rem;
          padding: 1.25rem;
          border: 2px solid #f3f4f6;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .task-card:hover {
          border-color: #bfdbfe;
        }

        .task-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        /* Checkbox */
        .checkbox {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          border: 2px solid #d1d5db;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkbox:hover {
          border-color: #60a5fa;
        }

        .checkbox.checked {
          background-color: #2563eb;
          border-color: #2563eb;
        }

        .checkbox svg {
          width: 20px;
          height: 20px;
          color: white;
        }

        /* Task Info */
        .task-info {
          flex: 1;
          min-width: 0;
        }

        .task-title {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          color: #111827;
        }

        .task-title.completed {
          text-decoration: line-through;
          color: #93c5fd;
        }

        .task-date {
          font-size: 0.875rem;
          color: #2563eb;
        }

        .task-date.completed {
          color: #93c5fd;
        }

        /* Priority Badge */
        .priority-badge {
          flex-shrink: 0;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .priority-alta {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .priority-media {
          background-color: #fef3c7;
          color: #92400e;
        }

        .priority-baja {
          background-color: #d1fae5;
          color: #065f46;
        }

        /* Bottom Navigation */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-top: 1px solid #e5e7eb;
          z-index: 10;
        }

        .nav-content {
          max-width: 896px;
          margin: 0 auto;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.2s;
        }

        .nav-button:hover {
          color: #2563eb;
        }

        .nav-button.active {
          color: #2563eb;
        }

        .nav-text {
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 50;
        }

        .modal-content {
          background-color: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          width: 100%;
          max-width: 448px;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #111827;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: #2563eb;
        }

        .button-group {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .button-cancel {
          background-color: #e5e7eb;
          color: #374151;
        }

        .button-cancel:hover {
          background-color: #d1d5db;
        }

        .button-primary {
          background-color: #2563eb;
          color: white;
        }

        .button-primary:hover {
          background-color: #1d4ed8;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem 0;
        }

        .empty-text {
          color: #9ca3af;
          font-size: 1.125rem;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .title {
            font-size: 1.25rem;
          }

          .task-title {
            font-size: 1rem;
          }

          .filter-container {
            gap: 0.5rem;
          }

          .filter-button {
            padding: 0.5rem 1rem;
            font-size: 0.813rem;
          }
        }
      `}</style>

      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="title">Tareas v3</h1>
            <button className="add-button" onClick={() => setShowAddModal(true)}>
              <Plus size={24} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Buscar tareas"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="filter-container">
            <button
              className="filter-button"
              onClick={() => setActiveFilter({ type: 'priority', value: true })}
            >
              <span>Prioridad</span>
              <ChevronDown size={18} />
            </button>
            <button
              className="filter-button"
              onClick={() => setActiveFilter({ type: 'date', value: true })}
            >
              <span>Fecha</span>
              <ChevronDown size={18} />
            </button>
            <button
              className="filter-button"
              onClick={() => setActiveFilter({ type: 'status', value: true })}
            >
              <span>Estado</span>
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Task List */}
          <div className="task-list">
            {sortedTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-content">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`checkbox ${task.completed ? 'checked' : ''}`}
                  >
                    {task.completed && (
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="task-info">
                    <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                      {task.title}
                    </h3>
                    <p className={`task-date ${task.completed ? 'completed' : ''}`}>
                      Vence: {task.dueDate}
                    </p>
                  </div>

                  {/* Priority Badge */}
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {sortedTasks.length === 0 && (
            <div className="empty-state">
              <p className="empty-text">No se encontraron tareas</p>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          <div className="nav-content">
            <button className="nav-button">
              <LayoutGrid size={24} />
              <span className="nav-text">Kanban</span>
            </button>
            <button className="nav-button active">
              <List size={24} />
              <span className="nav-text">Tareas</span>
            </button>
            <button className="nav-button">
              <Calendar size={24} />
              <span className="nav-text">Calendario</span>
            </button>
            <button className="nav-button">
              <BarChart3 size={24} />
              <span className="nav-text">Progreso</span>
            </button>
          </div>
        </nav>

        {/* Add Task Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Nueva Tarea</h2>
              
              <div className="form-container">
                <div className="form-group">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="form-input"
                    placeholder="Nombre de la tarea"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de vencimiento</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prioridad</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="form-select"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="button-group">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="button button-cancel"
                >
                  Cancelar
                </button>
                <button
                  onClick={addTask}
                  className="button button-primary"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TaskManager;