import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TodosPage.css';

const TodosPage = () => {
  const { userId } = useParams();
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriterion, setSortCriterion] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:5010/todos?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [userId]);

  const sortTodos = (criterion) => {
    const sortedTodos = [...todos];
    switch (criterion) {
      case 'id':
        sortedTodos.sort((a, b) => a.id - b.id);
        break;
      case 'title':
        sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'completed':
        sortedTodos.sort((a, b) => a.completed - b.completed);
        break;
      case 'random':
        sortedTodos.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }
    setTodos(sortedTodos);
  };

  // הוספת פריט חדש
  const addTodo = async () => {
    if (!newTodoTitle) return;

    const newTodo = {
      userId: Number(userId), // ודא ש-userId הוא מספר
      title: newTodoTitle,
      completed: false,
    };

    try {
      const response = await fetch('http://localhost:5010/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const savedTodo = await response.json(); // קבלת ה-TODO המלא מהשרת
        setTodos([...todos, { ...savedTodo, userId: Number(savedTodo.userId) }]); // הבטחת עקביות
        setNewTodoTitle('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  //עריכת פריט
  const startEditing = (id, title) => {
    setEditingTodoId(id);
    setEditingTitle(title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const saveEdit = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: editingTitle } : todo
    );

    const updatedTodo = updatedTodos.find((todo) => todo.id === id);

    try {
      const response = await fetch(`http://localhost:5010/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        setTodos(updatedTodos);
        cancelEditing();
      }
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };


  // מחיקת פריט
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5010/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // עדכון מצב הפריט
  const toggleCompletion = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    const updatedTodo = updatedTodos.find((todo) => todo.id === id);

    try {
      const response = await fetch(`http://localhost:5010/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // סינון לפי קריטריון חיפוש
  const filteredTodos = todos.filter((todo) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      todo.id.toString().includes(searchLower) ||
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.completed ? 'completed' : 'not completed').includes(searchLower)
    );
  });

  return (
    <div className='todos-page'>
      <div className="todos-container">
        <h1>Todos</h1>
        {/* חיפוש */}
        <div className="search-sort">
          <input
            type="text"
            placeholder="Search todos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select onChange={(e) => sortTodos(e.target.value)}>
            <option value="">Sort By</option>
            <option value="id">ID</option>
            <option value="title">Title</option>
            <option value="completed">Completion</option>
            <option value="random">Random</option>
          </select>
        </div>
        <ul className="todos-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              {editingTodoId === todo.id ? (
                <div>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(todo.id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div>
                  <span>
                    <strong>ID:</strong> {todo.id} - <strong>Title:</strong> {todo.title}
                  </span>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompletion(todo.id)}
                  />
                  <button onClick={() => startEditing(todo.id, todo.title)}>Edit</button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {/* הוספה */}
        <div className="add-todo">
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <button onClick={addTodo}>Add</button>
        </div>

      </div>
    </div>
  );
};

export default TodosPage;
