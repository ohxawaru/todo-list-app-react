import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import TodoList from './components/TodoList';
import TodoDetail from './components/TodoDetail';
import NotFound from './components/NotFound';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Main App component that sets up routing and global providers
 * Includes React Query provider, Error Boundary, and React Router
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Routes>
              {/* Home route - Todo List */}
              <Route path="/" element={<TodoList />} />
              
              {/* Todo Detail route */}
              <Route path="/todo/:id" element={<TodoDetail />} />
              
              {/* 404 Not Found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
