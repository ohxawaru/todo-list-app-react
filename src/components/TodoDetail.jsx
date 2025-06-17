import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, X, Edit2, Trash2, Calendar, User, Hash, Loader, AlertCircle } from 'lucide-react';
import TodoService from '../services/api';

/**
 * TodoDetail component - Shows detailed view of a single todo item
 * Includes edit and delete functionality
 */
const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch todo details
  const {
    data: todo,
    isLoading,
    error
  } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => TodoService.getTodoById(parseInt(id)),
    enabled: !!id,
    retry: 1,
  });

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, todoData }) => TodoService.updateTodo(id, todoData),
    onSuccess: () => {
      queryClient.invalidateQueries(['todo', id]);
      queryClient.invalidateQueries(['todos']);
    }
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: TodoService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      navigate('/');
    }
  });

  // Handler functions
  const handleToggleComplete = async () => {
    if (!todo) return;
    
    try {
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        todoData: { ...todo, completed: !todo.completed }
      });
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update todo. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodoMutation.mutateAsync(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Failed to delete todo. Please try again.');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading todo details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Todo not found</h2>
          <p className="text-gray-600 mb-4">
            The todo you're looking for doesn't exist or has been deleted.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Todo List
          </Link>
        </div>
      </div>
    );
  }

  if (!todo) {
    return null;
  }

  const isUpdating = updateTodoMutation.isLoading || deleteTodoMutation.isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Task List
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Task Details</h1>
        </div>

        {/* Todo Detail Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Todo Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {/* Completion Status */}
                  <button
                    onClick={handleToggleComplete}
                    disabled={isUpdating}
                    className={`mr-3 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                        : 'border-gray-300 hover:border-green-400'
                    } ${isUpdating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </button>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    todo.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {todo.completed ? 'Completed' : 'Pending'}
                  </span>
                  
                  {/* Local Badge */}
                  {todo.isLocal && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Local
                    </span>
                  )}
                </div>
                
                {/* Todo Title */}
                <h2 className={`text-xl font-semibold transition-colors duration-200 ${
                  todo.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                }`}>
                  {todo.title}
                </h2>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={handleToggleComplete}
                  disabled={isUpdating}
                  className={`p-2 rounded-md border transition-colors duration-200 ${
                    todo.completed
                      ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50'
                      : 'border-green-300 text-green-600 hover:bg-green-50'
                  } ${isUpdating ? 'cursor-not-allowed opacity-50' : ''}`}
                  title={todo.completed ? 'Mark as Pending' : 'Mark as Complete'}
                >
                  {todo.completed ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="p-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Delete Todo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Todo Metadata */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Todo ID */}
              <div className="flex items-center">
                <Hash className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Todo ID</p>
                  <p className="text-sm text-gray-900">{todo.id}</p>
                </div>
              </div>
              
              {/* User ID */}
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-sm text-gray-900">{todo.userId}</p>
                </div>
              </div>
              
              {/* Creation Date (for local todos) */}
              {todo.isLocal && (
                <div className="flex items-center sm:col-span-2">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">
                      {new Date(todo.id).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Todo Actions */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleToggleComplete}
                disabled={isUpdating}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 ${
                  todo.completed
                    ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {isUpdating ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : todo.completed ? (
                  <X className="w-4 h-4 mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {todo.completed ? 'Mark as Pending' : 'Mark as Complete'}
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isUpdating}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteTodoMutation.isLoading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete Todo
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {todo.isLocal
                  ? 'This is a locally created todo and will persist in your browser storage.'
                  : 'This todo is fetched from JSONPlaceholder API for demonstration purposes.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;

