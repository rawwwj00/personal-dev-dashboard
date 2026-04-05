import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const DOMAINS = ['Web App', 'Mobile', 'API/Backend', 'AI/ML', 'DevOps', 'Design', 'CLI Tool', 'Game', 'Other'];

function ProjectCard({ project, isAdmin, onEdit, onDelete }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
    if (videoRef.current && project.showVideo && project.videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden', cursor: 'default' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Red accent top */}
      <div style={{ height: '2px', background: 'var(--accent)' }} />

      {/* Media area */}
      <div style={{ position: 'relative', height: '200px', background: 'var(--bg3)' }}>
        {project.thumbnailUrl && (
          <img src={project.thumbnailUrl} alt={project.title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'opacity 0.3s',
              opacity: (hovered && project.showVideo && project.videoUrl) ? 0 : 1,
              display: 'block',
            }}
          />
        )}
        {!project.thumbnailUrl && !project.videoUrl && (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface2)',
            fontFamily: 'var(--font-display)', fontSize: '48px',
            color: 'var(--text4)', letterSpacing: '0.05em',
          }}>◈</div>
        )}
        {project.showVideo && project.videoUrl && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted loop playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
            }}
          />
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(6,6,6,0.96) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '14px',
          gap: '8px',
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.showLive && project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>
                ↗ Live
              </a>
            )}
            {project.showGithub && project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm" onClick={e => e.stopPropagation()}>
                ⌥ GitHub
              </a>
            )}
          </div>
        </div>

        {/* Domain badge — Adaux-style label */}
        {project.domain && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            padding: '3px 10px',
            background: 'rgba(6,6,6,0.9)',
            border: '1px solid var(--border2)',
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--text2)',
          }}>{project.domain}</div>
        )}

        {/* Video indicator */}
        {project.showVideo && project.videoUrl && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            padding: '3px 8px',
            background: 'rgba(6,6,6,0.9)',
            border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border2)'}`,
            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: hovered ? 'var(--accent2)' : 'var(--text3)',
            display: 'flex', alignItems: 'center', gap: '5px',
            transition: 'all 0.15s',
          }}>
            <div style={{
              width: '5px', height: '5px',
              background: hovered ? 'var(--accent)' : 'var(--text4)',
              animation: hovered ? 'pulse-glow 1s infinite' : 'none',
              flexShrink: 0,
            }} />
            {hovered ? 'LIVE' : 'VIDEO'}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              letterSpacing: '0.04em', color: 'var(--text)', marginBottom: '5px', lineHeight: 1,
            }}>{project.title}</div>
            {project.description && (
              <div style={{
                fontSize: '13px', color: 'var(--text2)', lineHeight: 1.55,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                fontFamily: 'var(--font-body)',
              }}>
                {project.description}
              </div>
            )}
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: '4px', marginLeft: '10px', flexShrink: 0 }}>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(project)}>✎</button>
              <button className="btn btn-danger btn-icon btn-sm" onClick={() => onDelete(project._id)}>⌫</button>
            </div>
          )}
        </div>

        {project.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project || {
    title: '', description: '', domain: '', thumbnailUrl: '', videoUrl: '',
    githubUrl: '', liveUrl: '', tags: [], showGithub: true, showVideo: true, showLive: true, featured: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState({ thumb: false, video: false });

  const uploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    const isVideo = type === 'video';
    fd.append(isVideo ? 'video' : 'image', file);
    setUploading(u => ({ ...u, [isVideo ? 'video' : 'thumb']: true }));
    try {
      const { data } = await api.post(`/projects/upload/${isVideo ? 'video' : 'thumbnail'}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(f => ({ ...f, [isVideo ? 'videoUrl' : 'thumbnailUrl']: data.url, [isVideo ? 'videoCloudId' : 'thumbnailCloudId']: data.publicId }));
    } catch (err) { alert('Upload failed: ' + (err.response?.data?.error || err.message)); }
    finally { setUploading(u => ({ ...u, [isVideo ? 'video' : 'thumb']: false })); }
  };

  const addTag = () => {
    if (!tagInput.trim() || form.tags.includes(tagInput.trim())) return;
    setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
    setTagInput('');
  };

  const Toggle = ({ field, label }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>{label}</span>
      <label className="toggle">
        <input type="checkbox" checked={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.checked }))} />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div className="modal-title">{project ? 'Edit Project' : 'New Project'}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="label">Project Title *</label>
            <input className="input" placeholder="My Awesome Project" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="label">Description</label>
            <textarea className="input textarea" placeholder="What does this project do?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Domain / Category</label>
            <select className="input" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}>
              <option value="">Select domain</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">GitHub URL</label>
            <input className="input" placeholder="https://github.com/..." value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Live URL</label>
            <input className="input" placeholder="https://..." value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="label">Thumbnail {uploading.thumb && '(Uploading...)'}</label>
            <input type="file" accept="image/*" onChange={e => uploadFile(e, 'image')} className="input" style={{ padding: '7px' }} />
            {form.thumbnailUrl && <div style={{ fontSize: '10px', color: 'var(--green)', marginTop: '5px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.2em' }}>✓ UPLOADED</div>}
          </div>
          <div className="form-group">
            <label className="label">Demo Video {uploading.video && '(Uploading...)'}</label>
            <input type="file" accept="video/*" onChange={e => uploadFile(e, 'video')} className="input" style={{ padding: '7px' }} />
            {form.videoUrl && <div style={{ fontSize: '10px', color: 'var(--green)', marginTop: '5px', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.2em' }}>✓ UPLOADED</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="label">Tags</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input className="input" placeholder="React, Node, etc" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} style={{ flex: 1 }} />
            <button className="btn btn-ghost btn-sm" onClick={addTag}>Add</button>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {form.tags.map(t => (
              <span key={t} className="tag" style={{ cursor: 'pointer' }} onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}>
                {t} ✕
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '18px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            color: 'var(--text3)', letterSpacing: '0.3em', textTransform: 'uppercase',
            marginBottom: '8px',
          }}>Visibility Toggles</div>
          <Toggle field="showGithub" label="Show GitHub Link" />
          <Toggle field="showVideo" label="Show Video Playback on Hover" />
          <Toggle field="showLive" label="Show Live Link" />
          <div style={{ borderBottom: 'none' }}>
            <Toggle field="featured" label="Mark as Featured" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={async () => { await onSave(form); onClose(); }}>Save Project</button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('All');

  const load = () => api.get('/projects').then(r => setProjects(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (modal === 'new') await api.post('/projects', form);
    else await api.put(`/projects/${form._id}`, form);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    setProjects(p => p.filter(x => x._id !== id));
  };

  const domains = ['All', ...new Set(projects.map(p => p.domain).filter(Boolean))];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.domain === filter);

  return (
    <Layout>
      <div style={{ animation: 'fadeUp 0.4s ease' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Hover a card to preview the demo</p>
          </div>
          {isAdmin && <button className="btn btn-primary" onClick={() => setModal('new')}>+ New Project</button>}
        </div>

        {/* Filter tabs — Adaux-style pill-less buttons */}
        {domains.length > 1 && (
          <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap', marginBottom: '28px', border: '1px solid var(--border)', alignSelf: 'flex-start', width: 'fit-content' }}>
            {domains.map(d => (
              <button key={d} onClick={() => setFilter(d)}
                style={{
                  padding: '8px 18px',
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  background: filter === d ? 'var(--accent)' : 'transparent',
                  color: filter === d ? '#fff' : 'var(--text3)',
                  border: 'none',
                  borderRight: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>{d}</button>
            ))}
          </div>
        )}

        {loading
          ? <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em' }}>LOADING...</div>
          : filtered.length === 0
            ? (
              <div className="empty-state">
                <div className="empty-state-icon">◈</div>
                <div className="empty-state-title">No Projects Yet</div>
                {isAdmin && <button className="btn btn-primary mt-4" onClick={() => setModal('new')}>Add your first project</button>}
              </div>
            )
            : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }} className="stagger">
                {filtered.map(p => (
                  <ProjectCard key={p._id} project={p} isAdmin={isAdmin} onEdit={p => setModal(p)} onDelete={handleDelete} />
                ))}
              </div>
            )
        }

        {modal && (
          <ProjectModal project={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />
        )}
      </div>
    </Layout>
  );
}
