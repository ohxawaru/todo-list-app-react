import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

/**
 * CreateTodo component for adding new todos
 * Features a collapsible form with validation
 */
const CreateTodo = ({ onCreateTodo, isLoading }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (title.trim() === '') {
      setError('Please enter a todo title');
      return;
    }

    if (title.trim().length < 3) {
      setError('Todo title must be at least 3 characters long');
      return;
    }

    try {
      await onCreateTodo({ title: title.trim() });
      // Reset form on success
      setTitle('');
      setError('');
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
      setError('Failed to create todo. Please try again.');
    }
  };

  /**
   * Handle input change with error clearing
   */
  const handleInputChange = (e) => {
    setTitle(e.target.value);
    if (error) {
      setError('');
    }
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    setTitle('');
    setError('');
    setIsFormOpen(false);
  };

  /**
   * Handle key press events
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
      {!isFormOpen ? (
        /* Collapsed State - Add Button */
        <button
          onClick={() => setIsFormOpen(true)}
          disabled={isLoading}
          className="w-full flex items-center justify-center py-6 px-6 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 hover:text-blue-800 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-200">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-lg font-medium">Add New Task</span>
          </div>
        </button>
      ) : (
        /* Expanded State - Create Form */
        <div className="animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
            </div>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700 mb-3">
                What needs to be done?
              </label>
              <input
                id="todo-title"
                type="text"
                value={title}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter your task description..."
                disabled={isLoading}
                autoFocus
                className={`w-full px-4 py-3 border-0 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-lg transition-all duration-200 text-gray-900 placeholder-gray-500 text-base ${
                  error
                    ? 'ring-2 ring-red-500/20 bg-red-50'
                    : ''
                }`}
              />
              
              {/* Error Message */}
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
              
              {/* Character Count */}
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Minimum 3 characters required
                </p>
                <p className={`text-xs ${
                  title.length > 80 ? 'text-amber-600' : title.length > 95 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {title.length}/100
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading || title.trim().length === 0}
                className={`px-6 py-3 text-sm font-medium text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  isLoading || title.trim().length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateTodo;

