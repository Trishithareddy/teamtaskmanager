import { useEffect, useState } from 'react';
import { fetchProjects, createProject, deleteProject, fetchUsers } from '../utils/api';
import toast from 'react-hot-toast';
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name:'', description:'', members:[] });
  const [loading, setLoading] = useState(true);
  const load = async () => {
    try { const [p,u] = await Promise.all([fetchProjects(), fetchUsers()]); setProjects(p.data); setUsers(u.data); }
    catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createProject(form); toast.success('Project created!'); setForm({name:'',description:'',members:[]}); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await deleteProject(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };
  const toggleMember = (id) => setForm(f => ({ ...f, members: f.members.includes(id) ? f.members.filter(m=>m!==id) : [...f.members,id] }));
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}>Loading...</div>;
  const s = { page:{padding:'30px',maxWidth:'1000px',margin:'0 auto'}, form:{background:'#fff',padding:'24px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.08)',marginBottom:'30px',display:'flex',flexDirection:'column',gap:'12px'}, input:{padding:'10px 14px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px'}, btn:{padding:'10px',background:'#1A56A0',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}, grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}, card:{background:'#fff',padding:'20px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.07)'} };
  return (<div style={s.page}>
    <h2 style={{color:'#1A56A0'}}>Projects</h2>
    <form onSubmit={handleCreate} style={s.form}>
      <h3 style={{color:'#1A56A0'}}>Create New Project</h3>
      <input style={s.input} placeholder='Project Name' value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
      <input style={s.input} placeholder='Description' value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
      <div><label style={{fontSize:'13px',fontWeight:'bold'}}>Add Members:</label>
        <div style={{display:'flex',flexDirection:'column',gap:'6px',marginTop:'6px'}}>
          {users.filter(u=>u.role==='member').map(u=>(
            <label key={u._id} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px'}}>
              <input type='checkbox' checked={form.members.includes(u._id)} onChange={()=>toggleMember(u._id)} />{u.name} ({u.email})
            </label>))}
        </div>
      </div>
      <button style={s.btn} type='submit'>+ Create Project</button>
    </form>
    <div style={s.grid}>{projects.map(p=>(
      <div key={p._id} style={s.card}>
        <div style={{fontWeight:'bold',fontSize:'16px',marginBottom:'6px'}}>{p.name}</div>
        <div style={{fontSize:'13px',color:'#777',marginBottom:'8px'}}>{p.description||'No description'}</div>
        <div style={{fontSize:'12px',color:'#555',marginBottom:'12px'}}>Members: {p.members.length>0?p.members.map(m=>m.name).join(', '):'None'}</div>
        <button onClick={()=>handleDelete(p._id)} style={{background:'#fee2e2',color:'#ef4444',border:'none',padding:'6px 12px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:'bold'}}>Delete</button>
      </div>))}
    </div>
  </div>);
}
