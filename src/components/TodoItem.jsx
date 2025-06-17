import React, { useState } from 'react';
import { Check, X, Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * TodoItem component represents a single todo item in the list
 * Handles individual todo operations like toggle completion, edit, and delete
 */
const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle saving the edited todo title
   */
  const handleSave = async () => {
    if (editTitle.trim() === '') {
      alert('Todo title cannot be empty');
      return;
    }

    if (editTitle.trim() === todo.title) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onEdit(todo.id, { ...todo, title: editTitle.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing todo:', error);
      alert('Failed to edit todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle canceling the edit operation
   */
  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  /**
   * Handle toggling todo completion status
   */
  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(todo.id, { ...todo, completed: !todo.completed });
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle deleting the todo
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setIsLoading(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Failed to delete todo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Handle key press events in edit mode
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className={`group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 transform hover:-translate-y-1 ${
      isLoading ? 'opacity-50' : ''
    } ${todo.completed ? 'bg-gray-50/70' : ''}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Checkbox and Title */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Completion Checkbox */}
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`mr-4 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
              todo.completed
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white hover:from-green-600 hover:to-emerald-600 scale-105'
                : 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-105'
            } ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {todo.completed && <Check className="w-4 h-4" />}
          </button>

          {/* Todo Title - Edit Mode */}
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSave}
              autoFocus
              disabled={isLoading}
              className="flex-1 mr-4 px-3 py-2 border-0 rounded-xl bg-blue-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-md transition-all duration-200 text-gray-900"
              placeholder="Enter todo title..."
            />
          ) : (
            /* Todo Title - Display Mode */
            <div className="flex-1 mr-4">
              <span
                className={`text-base font-medium transition-colors duration-200 ${
                  todo.completed
                    ? 'text-gray-500 line-through'
                    : 'text-gray-900'
                }`}
              >
                {todo.title}
              </span>
            </div>
          )}
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Edit Mode Actions */}
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-2 text-green-600 hover:text-white hover:bg-green-500 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-green-200 hover:border-green-500"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="p-2 text-red-600 hover:text-white hover:bg-red-500 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-red-200 hover:border-red-500"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Normal Mode Actions */
            <>
              {/* View Details Link */}
              <Link
                to={`/todo/${todo.id}`}
                className="p-2 text-blue-600 hover:text-white hover:bg-blue-500 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-blue-200 hover:border-blue-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Link>
              
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="p-2 text-amber-600 hover:text-white hover:bg-amber-500 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-amber-200 hover:border-amber-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              
              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 text-red-600 hover:text-white hover:bg-red-500 rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-red-200 hover:border-red-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Todo Metadata */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>ID: {todo.id}</span>
        <span>User: {todo.userId}</span>
        {todo.isLocal && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Local
          </span>
        )}
      </div>
    </div>
  );
};

export default TodoItem;

