import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 24px',background:'#1A56A0',color:'#fff'}}>
      <div style={{fontWeight:'bold',fontSize:'18px'}}>Team Task Manager</div>
      <div style={{display:'flex',gap:'20px'}}>
        <Link to='/dashboard' style={{color:'#fff',textDecoration:'none'}}>Dashboard</Link>
        {user?.role==='admin' && <Link to='/projects' style={{color:'#fff',textDecoration:'none'}}>Projects</Link>}
        <Link to='/tasks' style={{color:'#fff',textDecoration:'none'}}>Tasks</Link>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'14px',color:'#cde'}}>{user?.name} ({user?.role})</span>
        <button onClick={handleLogout} style={{background:'#fff',color:'#1A56A0',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontWeight:'bold'}}>Logout</button>
      </div>
    </nav>
  );
}
