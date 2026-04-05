import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CATEGORIES = ['All', 'CLI', 'Design', 'Testing', 'DevOps', 'AI', 'Database', 'Security', 'Productivity', 'Other'];

function ToolModal({ tool, onClose, onSave }) {
  const [form, setForm] = useState(tool || { name: '', description: '', url: '', category: 'Other', icon: '⚙', tags: [] });
  const [tagInput, setTagInput] = useState('');

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{tool ? 'Edit Tool' : 'Add Tool'}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="label">Tool Name *</label>
          <input className="input" placeholder="e.g. HTTPie" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="label">Description</label>
          <textarea className="input textarea" style={{ minHeight: '60px' }} placeholder="What does this tool do?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="label">URL *</label>
          <input className="input" placeholder="https://..." value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Icon (emoji)</label>
            <input className="input" maxLength={2} placeholder="⚙" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} />
          </div>
        </div>
        <div className="form-group">
          <label className="label">Tags</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input className="input" placeholder="http, rest, cli..." value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } }} style={{ flex: 1 }} />
            <button className="btn btn-ghost btn-sm" onClick={() => { if (tagInput.trim()) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(''); } }}>Add</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {form.tags.map(t => <span key={t} className="tag" style={{ cursor: 'pointer' }} onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}>{t} ✕</span>)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={async () => {
            if (!form.name || !form.url) return alert('Name and URL required');
            await onSave(form); onClose();
          }}>Save Tool</button>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ tool, isAdmin, onEdit, onDelete }) {
  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer"
      style={{ display: 'block', textDecoration: 'none' }}
      onClick={e => { if (e.target.closest('.tool-actions')) e.preventDefault(); }}
    >
      <div className="card" style={{
        display: 'flex', gap: '14px', alignItems: 'flex-start',
        padding: '16px 18px', cursor: 'pointer',
      }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '18px', flexShrink: 0,
        }}>{tool.icon || '⚙'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              fontSize: '13px', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text)',
            }}>{tool.name}</div>
            {isAdmin && (
              <div className="tool-actions" style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={e => { e.preventDefault(); onEdit(tool); }}>✎</button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={e => { e.preventDefault(); onDelete(tool._id); }}>⌫</button>
              </div>
            )}
          </div>
          {tool.description && (
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '4px', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
              {tool.description}
            </div>
          )}
          {tool.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
              {tool.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '14px',
          color: 'var(--text3)', flexShrink: 0,
        }}>↗</div>
      </div>
    </a>
  );
}

export default function Tools() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const load = () => api.get('/tools').then(r => setTools(r.data.tools)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (modal === 'new') await api.post('/tools', form);
    else await api.put(`/tools/${form._id}`, form);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this tool?')) return;
    await api.delete(`/tools/${id}`);
    setTools(t => t.filter(x => x._id !== id));
  };

  const categories = ['All', ...new Set(tools.map(t => t.category))];

  let filtered = tools;
  if (activeCategory !== 'All') filtered = filtered.filter(t => t.category === activeCategory);
  if (search) filtered = filtered.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = filtered.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <Layout adminOnly>
      <div style={{ animation: 'fadeUp 0.4s ease' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">Dev Tools</h1>
            <p className="page-subtitle">Your curated toolkit — less-known gems</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('new')}>+ Add Tool</button>
        </div>

        {/* Search + filter — Adaux-style bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'stretch' }}>
          <input
            className="input" placeholder="Search tools..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: '1 1 200px' }}
          />
          <div style={{ display: 'flex', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                style={{
                  padding: '8px 16px',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  background: activeCategory === c ? 'var(--accent)' : 'transparent',
                  color: activeCategory === c ? '#fff' : 'var(--text3)',
                  border: 'none',
                  borderRight: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}>{c}</button>
            ))}
          </div>
        </div>

        {loading
          ? <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em' }}>LOADING TOOLS...</div>
          : filtered.length === 0
            ? (
              <div className="empty-state">
                <div className="empty-state-icon">⚙</div>
                <div className="empty-state-title">{search ? 'No Tools Match' : 'No Tools Yet'}</div>
                <button className="btn btn-primary mt-4" onClick={() => setModal('new')}>Add your first tool</button>
              </div>
            )
            : (
              <div>
                {Object.entries(grouped).map(([category, categoryTools]) => (
                  <div key={category} style={{ marginBottom: '40px' }}>
                    {/* Adaux section header with rule */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: '24px',
                        letterSpacing: '0.04em', color: 'var(--text)', lineHeight: 1,
                      }}>{category}</div>
                      <div style={{ width: '24px', height: '2px', background: 'var(--accent)' }} />
                      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                        color: 'var(--text3)', letterSpacing: '0.2em', textTransform: 'uppercase',
                      }}>
                        {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                      {categoryTools.map(t => (
                        <ToolCard key={t._id} tool={t} isAdmin={isAdmin} onEdit={t => setModal(t)} onDelete={handleDelete} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
        }

        {modal && <ToolModal tool={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      </div>
    </Layout>
  );
}
