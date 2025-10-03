import { useState } from 'react';
import { Plus, Search, ChevronDown, Calendar, LayoutGrid, List, BarChart3 } from 'lucide-react';

const App = () => {
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

  const priorityColors = {
    'Alta': 'bg-red-100 text-red-700',
    'Media': 'bg-yellow-100 text-yellow-700',
    'Baja': 'bg-green-100 text-green-700'
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Tareas</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
            <input
              type="text"
              placeholder="Buscar tareas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-blue-200 rounded-2xl text-gray-700 placeholder-blue-300 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveFilter({ type: 'priority', value: true })}
            className="flex items-center gap-2 px-5 py-3 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
          >
            <span className="font-medium">Prioridad</span>
            <ChevronDown size={18} />
          </button>
          <button
            onClick={() => setActiveFilter({ type: 'date', value: true })}
            className="flex items-center gap-2 px-5 py-3 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
          >
            <span className="font-medium">Fecha</span>
            <ChevronDown size={18} />
          </button>
          <button
            onClick={() => setActiveFilter({ type: 'status', value: true })}
            className="flex items-center gap-2 px-5 py-3 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
          >
            <span className="font-medium">Estado</span>
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {sortedTasks.map(task => (
            <div
              key={task.id}
              className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-blue-200 transition-all shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-medium mb-1 ${
                      task.completed ? 'line-through text-blue-400' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className={`text-sm ${task.completed ? 'text-blue-300' : 'text-blue-600'}`}>
                    Vence: {task.dueDate}
                  </p>
                </div>

                {/* Priority Badge */}
                <span
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron tareas</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
            <LayoutGrid size={24} />
            <span className="text-xs font-medium">Kanban</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <List size={24} />
            <span className="text-xs font-medium">Tareas</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
            <Calendar size={24} />
            <span className="text-xs font-medium">Calendario</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-600 transition-colors">
            <BarChart3 size={24} />
            <span className="text-xs font-medium">Progreso</span>
          </button>
        </div>
      </nav>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Nueva Tarea</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Nombre de la tarea"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addTask}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;