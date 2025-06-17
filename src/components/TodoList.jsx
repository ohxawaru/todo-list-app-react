import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, ChevronLeft, ChevronRight, Loader, AlertCircle, Plus } from 'lucide-react';
import TodoItem from './TodoItem';
import CreateTodo from './CreateTodo';
import TodoService from '../services/api';

/**
 * TodoList component - Main component that displays the list of todos
 * Includes search, filter, pagination, and CRUD operations
 */
const TodoList = () => {
  // State for search, filter, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(10);

  // React Query client for cache management
  const queryClient = useQueryClient();

  // Fetch todos using React Query
  const {
    data: todos = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const [apiTodos, localTodos] = await Promise.all([
        TodoService.getAllTodos(),
        TodoService.getLocalTodos()
      ]);
      return [...apiTodos, ...localTodos];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create todo mutation
  const createTodoMutation = useMutation({
    mutationFn: TodoService.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
    onError: (error) => {
      console.error('Error creating todo:', error);
    }
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, todoData }) => TodoService.updateTodo(id, todoData),
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
    onError: (error) => {
      console.error('Error updating todo:', error);
    }
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: TodoService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    return filtered;
  }, [todos, searchQuery, filterStatus]);

  // Pagination calculations
  const totalTodos = filteredTodos.length;
  const totalPages = Math.ceil(totalTodos / todosPerPage);
  const startIndex = (currentPage - 1) * todosPerPage;
  const endIndex = startIndex + todosPerPage;
  const currentTodos = filteredTodos.slice(startIndex, endIndex);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // Handler functions
  const handleCreateTodo = async (todoData) => {
    await createTodoMutation.mutateAsync(todoData);
  };

  const handleToggleTodo = async (id, todoData) => {
    await updateTodoMutation.mutateAsync({ id, todoData });
  };

  const handleEditTodo = async (id, todoData) => {
    await updateTodoMutation.mutateAsync({ id, todoData });
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodoMutation.mutateAsync(id);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="border-4 border-blue-600 border-t-transparent rounded-full w-8 h-8 animate-spin mx-auto mb-4" role="status" aria-label="Loading"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Failed to load todos</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Try again"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Todo App</h1>
          <p className="text-gray-600">Keep track of your tasks</p>
        </header>

        {/* Create Todo Form */}
        <CreateTodo
          onCreateTodo={handleCreateTodo}
          isLoading={createTodoMutation.isLoading}
        />

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search todos..."
                  aria-label="Search todos"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter todos"
                className="w-full px-3 py-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="pending">Incomplete</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {currentTodos.length} of {totalTodos} todos
            {searchQuery && (
              <span> for "{searchQuery}"</span>
            )}
            {filterStatus !== 'all' && (
              <span> ({filterStatus})</span>
            )}
          </div>
        </div>

        {/* Todo List */}
        {currentTodos.length > 0 ? (
          <div className="space-y-4 mb-8">
            {currentTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchQuery || filterStatus !== 'all' ? 'No tasks found' : 'Ready to get organized?'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search terms or filter settings to find what you\'re looking for.'
                : 'Create your first task and start building productive habits today.'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => document.querySelector('button[class*="border-dashed"]')?.click()}
                className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Task
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 flex items-center space-x-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">Page {currentPage}</span>
                <span>of</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">{totalPages}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    
                    // Show first page, last page, current page, and adjacent pages
                    const showPage = page === 1 || page === totalPages || 
                                   Math.abs(page - currentPage) <= 1;
                    
                    if (!showPage && page === 2 && currentPage > 4) {
                      return <span key={page} className="px-3 py-2 text-gray-400 text-sm">...</span>;
                    }
                    
                    if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                      return <span key={page} className="px-3 py-2 text-gray-400 text-sm">...</span>;
                    }
                    
                    if (!showPage) {
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isCurrentPage
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;

