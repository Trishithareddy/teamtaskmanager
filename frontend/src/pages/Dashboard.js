import { useEffect, useState } from 'react';
import { fetchDashboard, fetchTasks, updateTask } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      if (user.role === 'admin') {
        const { data } = await fetchDashboard();
        setStats(data);
        setTasks(data.tasks);
      } else {
        const { data } = await fetchTasks();
        setTasks(data);
      }
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateTask(id, { status });
      toast.success('Status updated!');
      load();
    } catch { toast.error('Failed to update'); }
  };

  const isOverdue = (task) =>
    task.dueDate && task.status !== 'completed' && new Date(task.dueDate) < new Date();

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>👋 Welcome, {user.name}</h2>

      {/* Admin Stats */}
      {user.role === 'admin' && stats && (
        <div style={styles.statsRow}>
          {[
            { label: 'Total Tasks',  value: stats.total,      color: '#1A56A0' },
            { label: 'To Do',        value: stats.todo,       color: '#f59e0b' },
            { label: 'In Progress',  value: stats.inProgress, color: '#3b82f6' },
            { label: 'Completed',    value: stats.completed,  color: '#10b981' },
            { label: '🔴 Overdue',   value: stats.overdue,    color: '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Task List */}
      <h3 style={styles.sub}>{user.role === 'admin' ? 'All Tasks' : 'My Tasks'}</h3>
      {tasks.length === 0 ? (
        <p style={{ color: '#888' }}>No tasks found.</p>
      ) : (
        <div style={styles.taskGrid}>
          {tasks.map(task => (
            <div key={task._id} style={{
              ...styles.taskCard,
              borderLeft: `4px solid ${isOverdue(task) ? '#ef4444' : statusColor(task.status)}`
            }}>
              <div style={styles.taskTitle}>
                {isOverdue(task) && <span style={styles.overdueTag}>OVERDUE</span>}
                {task.title}
              </div>
              <div style={styles.taskMeta}>
                📁 {task.project?.name} &nbsp;|&nbsp;
                👤 {task.assignedTo?.name || 'Unassigned'}
                {task.dueDate && <> &nbsp;|&nbsp; 📅 {new Date(task.dueDate).toLocaleDateString()}</>}
              </div>
              <div style={styles.taskBottom}>
                <span style={{ ...styles.badge, background: statusColor(task.status) }}>{task.status}</span>
                {(user.role === 'admin' || task.assignedTo?._id === user._id) && (
                  <select style={styles.select} value={task.status}
                    onChange={e => handleStatus(task._id, e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const statusColor = (s) => s === 'completed' ? '#10b981' : s === 'in-progress' ? '#3b82f6' : '#f59e0b';

const styles = {
  page:       { padding: '30px', maxWidth: '1100px', margin: '0 auto' },
  heading:    { color: '#1A56A0', marginBottom: '20px' },
  sub:        { color: '#333', marginTop: '30px', marginBottom: '12px' },
  center:     { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontSize: '18px' },
  statsRow:   { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' },
  statCard:   { background: '#fff', padding: '20px 28px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: '130px', textAlign: 'center' },
  taskGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' },
  taskCard:   { background: '#fff', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  taskTitle:  { fontWeight: 'bold', fontSize: '15px', marginBottom: '8px', color: '#1a1a2e' },
  taskMeta:   { fontSize: '12px', color: '#777', marginBottom: '12px' },
  taskBottom: { display: 'flex', alignItems: 'center', gap: '10px' },
  badge:      { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
  select:     { fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer' },
  overdueTag: { background: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginRight: '6px', fontWeight: 'bold' }
};
