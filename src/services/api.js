import axios from 'axios';
import localforage from 'localforage';

// Configure axios instance for JSONPlaceholder API
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

// Configure localforage for local storage
localforage.config({
  name: 'todo-app',
  storeName: 'todos',
});

// API service class for todo operations
export class TodoService {
  // Get all todos from JSONPlaceholder API
  static async getAllTodos() {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new Error('Failed to fetch todos');
    }
  }

  // Get a specific todo by ID
  static async getTodoById(id) {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo ${id}:`, error);
      throw new Error(`Failed to fetch todo with ID ${id}`);
    }
  }

  // Create a new todo (simulated)
  static async createTodo(todoData) {
    try {
      // For JSONPlaceholder, this will return a simulated response
      const response = await api.post('/todos', {
        title: todoData.title,
        completed: false,
        userId: 1, // Default user ID
      });
      
      // Also store locally for persistence
      const localTodo = {
        ...response.data,
        id: Date.now(), // Use timestamp as ID for local storage
        isLocal: true,
      };
      
      await localforage.setItem(`todo-${localTodo.id}`, localTodo);
      return localTodo;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('Failed to create todo');
    }
  }

  // Update a todo (simulated)
  static async updateTodo(id, todoData) {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      
      // Update local storage if it's a local todo
      const localTodo = await localforage.getItem(`todo-${id}`);
      if (localTodo) {
        const updatedTodo = { ...localTodo, ...todoData };
        await localforage.setItem(`todo-${id}`, updatedTodo);
        return updatedTodo;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw new Error(`Failed to update todo with ID ${id}`);
    }
  }

  // Delete a todo (simulated)
  static async deleteTodo(id) {
    try {
      await api.delete(`/todos/${id}`);
      
      // Remove from local storage if it exists
      await localforage.removeItem(`todo-${id}`);
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      throw new Error(`Failed to delete todo with ID ${id}`);
    }
  }

  // Get locally stored todos
  static async getLocalTodos() {
    try {
      const localTodos = [];
      await localforage.iterate((value, key) => {
        if (key.startsWith('todo-')) {
          localTodos.push(value);
        }
      });
      return localTodos;
    } catch (error) {
      console.error('Error fetching local todos:', error);
      return [];
    }
  }

  // Search todos by title
  static async searchTodos(query) {
    try {
      const allTodos = await this.getAllTodos();
      const localTodos = await this.getLocalTodos();
      
      const combinedTodos = [...allTodos, ...localTodos];
      
      return combinedTodos.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching todos:', error);
      throw new Error('Failed to search todos');
    }
  }
}

export default TodoService;

