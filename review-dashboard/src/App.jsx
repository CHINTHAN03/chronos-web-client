import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Telemetry from './pages/dashboard-views/Telemetry';
import Automations from './pages/dashboard-views/Automations';

function App() {
  const isAuthenticated = !!localStorage.getItem('jwt_token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      >
        
        <Route index element={<Navigate to="telemetry" replace />} />
        
        
        <Route path="telemetry" element={<Telemetry />} />
        <Route path="automations" element={<Automations />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;