# Todo List Application

A modern, responsive React todo list application built with Vite, featuring full CRUD operations, search, filtering, pagination, and local storage integration.

## 🚀 Features

- **Full CRUD Operations**: Create, read, update, and delete todos
- **JSONPlaceholder Integration**: Fetches initial todos from the JSONPlaceholder API
- **Local Storage**: Locally created todos persist in browser storage
- **Search & Filter**: Real-time search and filter by completion status
- **Pagination**: Navigate through todos with smart pagination
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Modern UI**: Clean, accessible interface built with Tailwind CSS
- **Performance Optimized**: Uses React Query for efficient data management

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing for navigation
- **React Query**: Data fetching, caching, and synchronization
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **Localforage**: Enhanced local storage
- **Lucide React**: Beautiful, customizable icons

## 📁 Project Structure

```
todo-list-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CreateTodo.jsx      # Todo creation form
│   │   ├── ErrorBoundary.jsx   # Error boundary component
│   │   ├── NotFound.jsx        # 404 page component
│   │   ├── TodoItem.jsx        # Individual todo item
│   │   ├── TodoList.jsx        # Main todo list with search/filter
│   │   └── TodoDetail.jsx      # Detailed todo view
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles (Tailwind)
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-list-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Usage

### Creating Todos
1. Click the "Add New Todo" button on the main page
2. Enter your todo title in the form
3. Click "Create Todo" to save

### Managing Todos
- **Mark Complete**: Click the checkbox next to any todo
- **Edit**: Click the edit icon to modify the todo title
- **Delete**: Click the trash icon to remove a todo
- **View Details**: Click the eye icon to see full todo details

### Search and Filter
- **Search**: Use the search bar to find todos by title
- **Filter**: Use the dropdown to show all, pending, or completed todos
- **Clear**: Click the × button in the search bar to clear search

### Navigation
- **Pagination**: Use the pagination controls to navigate through pages
- **Todo Details**: Click on any todo to view its detailed page
- **Back Navigation**: Use browser back button or in-app navigation

## 🔧 Configuration

### API Configuration

The application uses JSONPlaceholder API by default. You can modify the API endpoint in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});
```

### Tailwind Customization

Customize the design system in `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add your customizations here
    },
  },
  plugins: [],
}
```

## 🎯 Key Components

### TodoList Component
- Main component that orchestrates the todo list functionality
- Handles search, filtering, pagination, and CRUD operations
- Uses React Query for efficient data management

### TodoItem Component
- Renders individual todo items with inline editing
- Handles toggle completion, edit, and delete actions
- Responsive design with proper loading states

### CreateTodo Component
- Collapsible form for creating new todos
- Input validation and error handling
- Auto-focus and keyboard navigation support

### TodoDetail Component
- Detailed view of individual todos
- Full CRUD operations in a dedicated page
- Responsive layout with metadata display

### API Service
- Centralized API logic with error handling
- Integration with both JSONPlaceholder and local storage
- Consistent interface for all data operations

## 🔒 Data Persistence

### Local Storage
- New todos are stored locally using Localforage
- Persists across browser sessions
- Seamless integration with API data

### API Integration
- Initial todos loaded from JSONPlaceholder
- Simulated CRUD operations for demo purposes
- Real-time updates with React Query

## 🎨 Design Principles

### Accessibility
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management

### Responsive Design
- Mobile-first approach
- Flexible layouts with CSS Grid and Flexbox
- Touch-friendly interactive elements
- Optimized for various screen sizes

### User Experience
- Loading states for all async operations
- Error boundaries with user-friendly messages
- Intuitive navigation and feedback
- Consistent visual hierarchy

## 🐛 Error Handling

### Error Boundary
- Catches JavaScript errors in component tree
- Displays fallback UI with recovery options
- Logs errors for debugging

### API Error Handling
- Network error recovery
- User-friendly error messages
- Retry mechanisms

### Form Validation
- Real-time input validation
- Clear error messaging
- Prevention of invalid submissions

## 🚀 Performance Optimizations

### React Query
- Intelligent caching and background updates
- Optimistic updates for better UX
- Automatic retry logic

### Code Splitting
- Component-level code splitting ready
- Lazy loading capabilities

### Memoization
- Strategic use of useMemo and useCallback
- Optimized re-rendering

## 🧪 Testing Considerations

### Unit Testing
- Test individual components in isolation
- Mock API calls and external dependencies
- Validate component behavior and state changes

### Integration Testing
- Test component interactions
- Validate data flow between components
- Test routing and navigation

### E2E Testing
- Test complete user workflows
- Validate API integration
- Test responsive design across devices

## 📈 Future Enhancements

### Potential Features
- [ ] User authentication and authorization
- [ ] Todo categories and tags
- [ ] Due dates and reminders
- [ ] Drag and drop reordering
- [ ] Export/import functionality
- [ ] Dark mode support
- [ ] Offline support with service workers
- [ ] Real-time collaboration
- [ ] Advanced filtering options
- [ ] Todo templates

### Technical Improvements
- [ ] Add comprehensive testing suite
- [ ] Implement PWA features
- [ ] Add internationalization (i18n)
- [ ] Optimize bundle size
- [ ] Add performance monitoring
- [ ] Implement advanced error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for the demo API
- [Tailwind CSS](https://tailwindcss.com/) for the design system
- [Lucide](https://lucide.dev/) for the beautiful icons
- [React Query](https://tanstack.com/query) for state management
- [Vite](https://vitejs.dev/) for the amazing development experience

