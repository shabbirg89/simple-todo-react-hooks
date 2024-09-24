//App.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Moon, Sun, Plus, Trash2 } from 'lucide-react';

// Theme context
const ThemeContext = React.createContext();

// TodoItem component
const TodoItem = ({ todo, toggleTodo, deleteTodo }) => {
  return (
    <li className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        <input 
          type="checkbox" 
          checked={todo.completed} 
          onChange={() => toggleTodo(todo.id)}
          className="mr-2"
        />
        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
          {todo.text}
        </span>
      </div>
      <button onClick={() => deleteTodo(todo.id)} className="text-red-500">
        <Trash2 size={18} />
      </button>
    </li>
  );
};

// TodoList component
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const theme = useContext(ThemeContext);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(storedTodos);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
      inputRef.current.focus();
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <form onSubmit={addTodo} className="mb-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
          className="w-full p-2 border rounded text-black"
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded w-full flex items-center justify-center">
          <Plus size={18} className="mr-2" /> Add Todo
        </button>
      </form>
      <ul>
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            toggleTodo={toggleTodo} 
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
};

// App component
const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="max-w-md mx-auto pt-10">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center bg-blue-500 text-white">
              <h1 className="text-2xl font-bold">Simple Todo List</h1>
              <button onClick={toggleTheme} className="focus:outline-none">
                {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
              </button>
            </div>
            <TodoList />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;