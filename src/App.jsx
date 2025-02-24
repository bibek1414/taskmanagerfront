import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/use-toast';
import { Toaster } from './components/ui/Toaster';
import AppRoutes from './routes';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;