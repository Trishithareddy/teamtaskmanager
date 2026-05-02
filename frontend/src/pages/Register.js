import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'member' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await registerUser(form); login(data); toast.success('Account created!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };
  const s = { page:{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'100vh',background:'#f0f4f8'}, card:{background:'#fff',padding:'40px',borderRadius:'12px',width:'360px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)',display:'flex',flexDirection:'column',gap:'14px'}, input:{padding:'10px 14px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px'}, btn:{padding:'12px',background:'#1A56A0',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'} };
  return (<div style={s.page}><form onSubmit={handleSubmit} style={s.card}>
    <h2 style={{margin:0,color:'#1A56A0',textAlign:'center'}}>Create Account</h2>
    <input style={s.input} placeholder='Full Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
    <input style={s.input} type='email' placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
    <input style={s.input} type='password' placeholder='Password (min 6)' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
    <select style={s.input} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
      <option value='member'>Member</option>
      <option value='admin'>Admin</option>
    </select>
    <button style={s.btn} type='submit' disabled={loading}>{loading?'Creating...':'Register'}</button>
    <p style={{textAlign:'center',fontSize:'13px'}}>Have account? <Link to='/login'>Login</Link></p>
  </form></div>);
}
