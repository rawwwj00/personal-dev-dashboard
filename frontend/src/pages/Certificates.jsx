import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function CertModal({ cert, onClose, onSave }) {
  const [form, setForm] = useState(cert || {
    title: '', issuer: '', date: '', imageUrl: '',
    verificationUrl: '', showVerification: true, visible: true, cloudinaryId: '',
  });
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      console.log('[FRONTEND CERTIFICATE UPLOAD] Starting upload for file:', file.name);
      const { data } = await api.post('/certificates/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log('[FRONTEND CERTIFICATE UPLOAD] Response received:', JSON.stringify(data));
      setForm(f => ({ ...f, imageUrl: data.url, cloudinaryId: data.publicId }));
      console.log('[FRONTEND CERTIFICATE UPLOAD] Form state updated');
    } catch (err) { 
      console.error('[FRONTEND CERTIFICATE UPLOAD ERROR]', err.message);
      alert('Upload failed: ' + (err.response?.data?.error || err.message)); 
    }
    finally { setUploading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{cert ? 'Edit Certificate' : 'Add Certificate'}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="label">Certificate Title *</label>
          <input className="input" placeholder="e.g. AWS Solutions Architect" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="label">Issued by *</label>
          <input className="input" placeholder="e.g. Amazon Web Services" value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="label">Date</label>
          <input className="input" type="month" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="label">Certificate Image {uploading && '(Uploading...)'}</label>
          <input type="file" accept="image/*" onChange={uploadImage} className="input" style={{ padding: '7px' }} />
          {form.imageUrl && (
            <div style={{ marginTop: '8px', border: '1px solid var(--border)' }}>
              <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
            </div>
          )}
        </div>
        <div className="form-group">
          <label className="label">Verification URL</label>
          <input className="input" placeholder="https://..." value={form.verificationUrl} onChange={e => setForm(f => ({ ...f, verificationUrl: e.target.value }))} />
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: '18px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.3em',
            marginBottom: '10px',
          }}>Visibility</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text2)', fontFamily: 'var(--font-body)' }}>Show Verification Link to Guests</span>
            <label className="toggle">
              <input type="checkbox" checked={form.showVerification} onChange={e => setForm(f => ({ ...f, showVerification: e.target.checked }))} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={uploading}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={async () => {
              if (!form.title || !form.issuer) return alert('Title and issuer required');
              await onSave(form); onClose();
            }}
            disabled={uploading}
            style={{ opacity: uploading ? 0.5 : 1, cursor: uploading ? 'not-allowed' : 'pointer' }}
          >
            {uploading ? 'Uploading...' : 'Save Certificate'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CertCard({ cert, isAdmin, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      style={{ perspective: '1000px', cursor: 'pointer', height: '300px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'var(--surface)', border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          {/* Red accent top bar */}
          <div style={{ height: '3px', background: 'var(--accent)' }} />
          {cert.imageUrl ? (
            <img src={cert.imageUrl} alt={cert.title} style={{ width: '100%', height: '52%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{
              height: '52%',
              background: 'var(--surface2)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '48px',
                color: 'var(--accent)', letterSpacing: '0.05em',
              }}>CERT</div>
            </div>
          )}
          <div style={{ padding: '16px 18px' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              letterSpacing: '0.04em', color: 'var(--text)', lineHeight: 1.2,
              marginBottom: '5px',
            }}>{cert.title}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
              color: 'var(--text3)', letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>{cert.issuer}</div>
            {cert.date && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--text4)', marginTop: '4px', letterSpacing: '0.15em',
              }}>{cert.date}</div>
            )}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
              color: 'var(--text4)', marginTop: '10px', letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}>Tap to flip ↩</div>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '28px 24px', textAlign: 'center', gap: '14px',
        }}>
          <div style={{ width: '32px', height: '2px', background: 'var(--accent)' }} />
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '22px',
            letterSpacing: '0.04em', color: 'var(--text)', lineHeight: 1.2,
          }}>{cert.title}</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
            color: 'var(--text3)', letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>Issued by {cert.issuer}</div>
          {cert.verificationUrl && cert.showVerification && (
            <a
              href={cert.verificationUrl} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}
              style={{ marginTop: '6px' }}
            >↗ Verify Certificate</a>
          )}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); onEdit(cert); }}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); onDelete(cert._id); }}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => api.get('/certificates').then(r => setCerts(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (modal === 'new') await api.post('/certificates', form);
    else await api.put(`/certificates/${form._id}`, form);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return;
    await api.delete(`/certificates/${id}`);
    setCerts(c => c.filter(x => x._id !== id));
  };

  return (
    <Layout>
      <div style={{ animation: 'fadeUp 0.4s ease' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="page-title">Certificates</h1>
            <p className="page-subtitle">Tap a card to flip and verify</p>
          </div>
          {isAdmin && <button className="btn btn-primary" onClick={() => setModal('new')}>+ Add Certificate</button>}
        </div>

        {loading
          ? <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em' }}>LOADING...</div>
          : certs.length === 0
            ? (
              <div className="empty-state">
                <div className="empty-state-icon">✦</div>
                <div className="empty-state-title">No Certificates Yet</div>
                {isAdmin && <button className="btn btn-primary mt-4" onClick={() => setModal('new')}>Add your first certificate</button>}
              </div>
            )
            : (
              <div className="grid-3 stagger">
                {certs.map(c => (
                  <CertCard key={c._id} cert={c} isAdmin={isAdmin} onEdit={c => setModal(c)} onDelete={handleDelete} />
                ))}
              </div>
            )
        }

        {modal && <CertModal cert={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
      </div>
    </Layout>
  );
}
