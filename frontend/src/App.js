import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Navbar from './components/Navbar';
const PrivateRoute = ({ children }) => { const { user } = useAuth(); return user ? children : <Navigate to='/login' />; };
const AdminRoute = ({ children }) => { const { user } = useAuth(); return user?.role==='admin' ? children : <Navigate to='/dashboard' />; };
function AppRoutes() {
  const { user } = useAuth();
  return (<><Navbar /><Routes>
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path='/projects' element={<PrivateRoute><AdminRoute><Projects /></AdminRoute></PrivateRoute>} />
    <Route path='/tasks' element={<PrivateRoute><Tasks /></PrivateRoute>} />
    <Route path='*' element={<Navigate to={user ? '/dashboard' : '/login'} />} />
  </Routes></>);
}
export default function App() {
  return (<AuthProvider><Router><Toaster position='top-right' /><AppRoutes /></Router></AuthProvider>);
}
