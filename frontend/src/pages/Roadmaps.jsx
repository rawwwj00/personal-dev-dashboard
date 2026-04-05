import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = ['#c0392b','#e74c3c','#888888','#f0ece4','#555555','#b8972e','#27ae60','#2980b9'];
const ICONS = ['◎','◈','✦','⊞','→','⚙','✕','◻','◆','▲','★','⬟'];

function RoadmapModal({ roadmap, onClose, onSave }) {
  const [form, setForm] = useState(roadmap || { title: '', description: '', color: COLORS[0], icon: ICONS[0], items: [] });
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    setForm(f => ({ ...f, items: [...f.items, { id: Date.now().toString(), text: newItem.trim(), completed: false }] }));
    setNewItem('');
  };

  const removeItem = (id) => setForm(f => ({ ...f, items: f.items.filter(i => i.id !== id) }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    await onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div className="modal-title">{roadmap ? 'Edit Roadmap' : 'New Roadmap'}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="label">Title</label>
          <input className="input" placeholder="e.g. React Mastery" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="label">Description</label>
          <textarea className="input textarea" placeholder="What's this roadmap about?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
          <div>
            <label className="label">Color</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                  width: '26px', height: '26px', background: c,
                  cursor: 'pointer',
                  outline: form.color === c ? '2px solid var(--text)' : '2px solid transparent',
                  outlineOffset: '2px',
                  transition: 'all 0.15s',
                }} />
              ))}
            </div>
          </div>
          <div>
            <label className="label">Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))} style={{
                  fontSize: '16px', padding: '5px 8px',
                  background: form.icon === ic ? 'var(--accent)' : 'var(--surface2)',
                  border: '1px solid var(--border2)',
                  color: form.icon === ic ? '#fff' : 'var(--text2)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'var(--font-body)',
                }}>{ic}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Checklist Items ({form.items.length})</label>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', border: '1px solid var(--border)' }}>
            {form.items.map(item => (
              <div key={item.id} style={{
                display: 'flex', gap: '8px', alignItems: 'center',
                padding: '8px 12px', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: '13px', flex: 1, fontFamily: 'var(--font-body)' }}>{item.text}</span>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input className="input" placeholder="Add a task..." value={newItem} onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()} style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm" onClick={addItem}>+ Add</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Roadmap</button>
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ roadmap, isAdmin, onEdit, onDelete, onToggle }) {
  const done = roadmap.items.filter(i => i.completed).length;
  const total = roadmap.items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const [expanded, setExpanded] = useState(false);
  const color = roadmap.color || 'var(--accent)';

  return (
    <div className="card" style={{ borderTop: `3px solid ${color}`, padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px', color,
            lineHeight: 1, flexShrink: 0, letterSpacing: '0.02em',
          }}>{roadmap.icon || '◎'}</div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '22px',
              letterSpacing: '0.04em', color: 'var(--text)', lineHeight: 1,
            }}>{roadmap.title}</div>
            {roadmap.description && (
              <div style={{
                fontSize: '13px', color: 'var(--text3)', marginTop: '5px',
                fontFamily: 'var(--font-body)',
              }}>{roadmap.description}</div>
            )}
          </div>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(roadmap)}>✎</button>
            <button className="btn btn-danger btn-icon btn-sm" onClick={() => onDelete(roadmap._id)}>⌫</button>
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text3)',
        }}>{done}/{total} tasks</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '24px', color,
          lineHeight: 1,
        }}>{pct}%</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: '16px' }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: `${color} !important` }} />
      </div>

      {total > 0 && (
        <>
          <button
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--text3)', background: 'none', border: 'none',
              cursor: 'pointer', marginBottom: expanded ? '12px' : 0,
              transition: 'color 0.15s',
            }}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? '▴' : '▾'} {expanded ? 'HIDE' : 'SHOW'} TASKS
          </button>
          {expanded && (
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px' }}>
              {roadmap.items.map(item => (
                <div key={item.id} className="check-item"
                  onClick={() => isAdmin && onToggle(roadmap._id, item.id, !item.completed)}
                  style={{ cursor: isAdmin ? 'pointer' : 'default' }}>
                  <div className={`check-box${item.completed ? ' checked' : ''}`}>
                    {item.completed && <span style={{ color: '#fff', fontSize: '9px' }}>✓</span>}
                  </div>
                  <span className={`check-text${item.completed ? ' done' : ''}`}>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Roadmaps() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => api.get('/roadmaps').then(r => setRoadmaps(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (modal === 'new') await api.post('/roadmaps', form);
    else await api.put(`/roadmaps/${form._id}`, form);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this roadmap?')) return;
    await api.delete(`/roadmaps/${id}`);
    setRoadmaps(r => r.filter(x => x._id !== id));
  };

  const handleToggle = async (roadmapId, itemId, completed) => {
    const roadmap = roadmaps.find(r => r._id === roadmapId);
    const updated = { ...roadmap, items: roadmap.items.map(i => i.id === itemId ? { ...i, completed } : i) };
    setRoadmaps(rs => rs.map(r => r._id === roadmapId ? updated : r));
    await api.put(`/roadmaps/${roadmapId}`, updated);
  };

  return (
    <Layout>
      <div style={{ animation: 'fadeUp 0.4s ease' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="page-title">Roadmaps</h1>
            <p className="page-subtitle">Track your learning paths</p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setModal('new')}>+ New Roadmap</button>
          )}
        </div>

        {loading ? (
          <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em' }}>LOADING ROADMAPS...</div>
        ) : roadmaps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <div className="empty-state-title">No Roadmaps Yet</div>
            {isAdmin && <button className="btn btn-primary mt-4" onClick={() => setModal('new')}>Create your first roadmap</button>}
          </div>
        ) : (
          <div className="grid-2 stagger">
            {roadmaps.map(r => (
              <RoadmapCard key={r._id} roadmap={r} isAdmin={isAdmin}
                onEdit={r => setModal(r)} onDelete={handleDelete} onToggle={handleToggle} />
            ))}
          </div>
        )}

        {modal && (
          <RoadmapModal
            roadmap={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </Layout>
  );
}
