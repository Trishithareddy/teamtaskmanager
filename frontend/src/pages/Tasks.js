import { useEffect, useState } from 'react';
import { fetchTasks, createTask, deleteTask, updateTask, fetchProjects, fetchUsers } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
export default function Tasks() {
  const { user } = useAuth();
  const [tasks,setTasks]=useState([]); const [projects,setProjects]=useState([]); const [users,setUsers]=useState([]);
  const [form,setForm]=useState({title:'',description:'',project:'',assignedTo:'',dueDate:'',status:'todo'});
  const [loading,setLoading]=useState(true);
  const load = async () => {
    try {
      const taskRes = await fetchTasks(); setTasks(taskRes.data);
      if (user.role==='admin') { const [p,u]=await Promise.all([fetchProjects(),fetchUsers()]); setProjects(p.data); setUsers(u.data); }
    } catch { toast.error('Failed to load'); } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);
  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createTask(form); toast.success('Task created!'); setForm({title:'',description:'',project:'',assignedTo:'',dueDate:'',status:'todo'}); load(); }
    catch (err) { toast.error(err.response?.data?.message||'Failed'); }
  };
  const handleDelete = async (id) => { if(!window.confirm('Delete?'))return; try{await deleteTask(id);toast.success('Deleted');load();}catch{toast.error('Failed');} };
  const handleStatus = async (id,status) => { try{await updateTask(id,{status});toast.success('Updated');load();}catch{toast.error('Failed');} };
  const isOverdue = (t) => t.dueDate && t.status!=='completed' && new Date(t.dueDate)<new Date();
  const statusColor = (s) => s==='completed'?'#10b981':s==='in-progress'?'#3b82f6':'#f59e0b';
  if (loading) return <div style={{display:'flex',justifyContent:'center',height:'60vh',alignItems:'center'}}>Loading...</div>;
  const s = { page:{padding:'30px',maxWidth:'1100px',margin:'0 auto'}, form:{background:'#fff',padding:'24px',borderRadius:'12px',boxShadow:'0 2px 10px rgba(0,0,0,0.08)',marginBottom:'30px',display:'flex',flexDirection:'column',gap:'12px'}, input:{padding:'10px 14px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'14px',flex:1}, row:{display:'flex',gap:'12px'}, btn:{padding:'10px',background:'#1A56A0',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}, grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'16px'} };
  return (<div style={s.page}>
    <h2 style={{color:'#1A56A0'}}>Tasks</h2>
    {user.role==='admin' && (<form onSubmit={handleCreate} style={s.form}>
      <h3 style={{color:'#1A56A0'}}>Create New Task</h3>
      <input style={s.input} placeholder='Task Title' value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
      <input style={s.input} placeholder='Description' value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
      <div style={s.row}>
        <select style={s.input} value={form.project} onChange={e=>setForm({...form,project:e.target.value})} required>
          <option value=''>Select Project</option>
          {projects.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select style={s.input} value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})}>
          <option value=''>Assign To</option>
          {users.map(u=><option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
      </div>
      <div style={s.row}>
        <input style={s.input} type='date' value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} />
        <select style={s.input} value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option value='todo'>To Do</option><option value='in-progress'>In Progress</option><option value='completed'>Completed</option>
        </select>
      </div>
      <button style={s.btn} type='submit'>+ Create Task</button>
    </form>)}
    {tasks.length===0?<p style={{color:'#888'}}>No tasks found.</p>:(
    <div style={s.grid}>{tasks.map(task=>(
      <div key={task._id} style={{background:'#fff',padding:'16px',borderRadius:'10px',boxShadow:'0 2px 8px rgba(0,0,0,0.07)',borderLeft:'4px solid '+(isOverdue(task)?'#ef4444':statusColor(task.status))}}>
        {isOverdue(task)&&<div style={{fontSize:'11px',fontWeight:'bold',color:'#ef4444',marginBottom:'6px'}}>OVERDUE</div>}
        <div style={{fontWeight:'bold',fontSize:'15px',marginBottom:'4px'}}>{task.title}</div>
        <div style={{fontSize:'12px',color:'#777',marginBottom:'12px',lineHeight:'1.8'}}>
          Project: {task.project?.name}<br/>Assigned: {task.assignedTo?.name||'Unassigned'}{task.dueDate&&<><br/>Due: {new Date(task.dueDate).toLocaleDateString()}</>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{background:statusColor(task.status),color:'#fff',padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'bold'}}>{task.status}</span>
          <select style={{fontSize:'12px',padding:'4px 8px',borderRadius:'6px',border:'1px solid #ddd'}} value={task.status} onChange={e=>handleStatus(task._id,e.target.value)}>
            <option value='todo'>To Do</option><option value='in-progress'>In Progress</option><option value='completed'>Completed</option>
          </select>
          {user.role==='admin'&&<button onClick={()=>handleDelete(task._id)} style={{background:'#fee2e2',color:'#ef4444',border:'none',padding:'5px 8px',borderRadius:'6px',cursor:'pointer'}}>Delete</button>}
        </div>
      </div>))}
    </div>)}
  </div>);
}
