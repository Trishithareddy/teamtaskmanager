import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await loginUser(form); login(data); toast.success('Welcome back, ' + data.name); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };
  const s = { page:{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'#f0f4f8'}, card:{background:'#fff',padding:'40px',borderRadius:'12px',width:'360px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)',display:'flex',flexDirection:'column',gap:'14px'}, input:{padding:'10px 14px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px'}, btn:{padding:'12px',background:'#1A56A0',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'} };
  return (<div style={s.page}><form onSubmit={handleSubmit} style={s.card}>
    <h2 style={{margin:0,color:'#1A56A0',textAlign:'center'}}>Team Task Manager</h2>
    <input style={s.input} type='email' placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
    <input style={s.input} type='password' placeholder='Password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
    <button style={s.btn} type='submit' disabled={loading}>{loading?'Signing in...':'Login'}</button>
    <p style={{textAlign:'center',fontSize:'13px'}}>No account? <Link to='/register'>Register</Link></p>
  </form></div>);
}
