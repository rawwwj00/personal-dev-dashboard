import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function StatCard({ label, value, icon }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.35em', textTransform: 'uppercase',
        color: 'var(--text3)', marginBottom: '12px',
      }}>{icon} &nbsp;{label}</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '52px', lineHeight: 1,
        color: 'var(--text)', letterSpacing: '0.02em',
      }}>{value}</div>
    </div>
  );
}

function RoadmapMini({ roadmap }) {
  const done = roadmap.items.filter(i => i.completed).length;
  const total = roadmap.items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text)',
          }}>{roadmap.title}</div>
          <div style={{
            fontSize: '11px', color: 'var(--text3)',
            fontFamily: 'var(--font-mono)', marginTop: '3px',
            letterSpacing: '0.1em',
          }}>{done}/{total} tasks</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px', color: 'var(--accent)',
          lineHeight: 1,
        }}>{pct}%</div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CertCard({ cert }) {
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      {cert.imageUrl ? (
        <div style={{
          height: '100px',
          backgroundImage: `url(${cert.imageUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, var(--surface), transparent)',
          }} />
        </div>
      ) : (
        <div style={{
          height: '60px',
          background: 'var(--surface2)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--accent)',
          letterSpacing: '0.1em',
        }}>CERT</div>
      )}
      <div style={{ padding: '12px 14px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          fontSize: '12px', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text)',
          lineHeight: 1.3, marginBottom: '4px',
        }}>{cert.title}</div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{cert.issuer}</div>
        {cert.verificationUrl && cert.showVerification && (
          <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: '10px', color: 'var(--accent2)',
              display: 'block', marginTop: '8px',
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
            ↗ Verify
          </a>
        )}
      </div>
    </div>
  );
}

function ProjectMini({ project }) {
  return (
    <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'center' }}>
      {project.thumbnailUrl ? (
        <div style={{
          width: '48px', height: '36px',
          backgroundImage: `url(${project.thumbnailUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          flexShrink: 0, border: '1px solid var(--border)',
        }} />
      ) : (
        <div style={{
          width: '48px', height: '36px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          fontFamily: 'var(--font-display)', fontSize: '16px',
          color: 'var(--text3)',
        }}>◈</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: 'var(--text)',
        }}>{project.title}</div>
        <div style={{
          fontSize: '10px', color: 'var(--text3)',
          fontFamily: 'var(--font-mono)', marginTop: '2px',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>{project.domain || 'Project'}</div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {project.showLive && project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener"
            style={{ fontSize: '14px', color: 'var(--text3)' }}>↗</a>
        )}
        {project.showGithub && project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener"
            style={{ fontSize: '14px', color: 'var(--text3)' }}>⌥</a>
        )}
      </div>
    </div>
  );
}

// Adaux-style section heading
function SectionHeading({ title, linkTo, linkLabel = 'View all →' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px', letterSpacing: '0.04em',
          color: 'var(--text)', lineHeight: 1,
        }}>{title}</div>
        <div style={{ width: '24px', height: '2px', background: 'var(--accent)' }} />
      </div>
      <Link to={linkTo} style={{
        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--text3)',
        transition: 'color 0.15s',
      }}>{linkLabel}</Link>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [data, setData] = useState({ roadmaps: [], certs: [], projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/roadmaps'),
      api.get('/certificates'),
      api.get('/projects'),
    ]).then(([r, c, p]) => {
      setData({ roadmaps: r.data, certs: c.data, projects: p.data });
    }).finally(() => setLoading(false));
  }, []);

  const allItems = data.roadmaps.flatMap(r => r.items);
  const totalDone = allItems.filter(i => i.completed).length;
  const totalPct = allItems.length ? Math.round((totalDone / allItems.length) * 100) : 0;

  return (
    <Layout>
      <div style={{ animation: 'fadeUp 0.4s ease' }}>
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            {!isAdmin && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(184,151,46,0.08)', border: '1px solid rgba(184,151,46,0.2)',
                padding: '5px 14px', marginBottom: '14px',
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'var(--yellow)',
              }}>
                👁 GUEST VIEW — READ ONLY
              </div>
            )}
            <h1 className="page-title">
              {isAdmin ? 'Your Dashboard' : "Dev Dashboard"}
            </h1>
            <p className="page-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid-4 stagger" style={{ marginBottom: '32px' }}>
          <StatCard label="Roadmaps" value={data.roadmaps.length} icon="◎" />
          <StatCard label="Progress" value={`${totalPct}%`} icon="→" />
          <StatCard label="Certificates" value={data.certs.length} icon="✦" />
          <StatCard label="Projects" value={data.projects.length} icon="◈" />
        </div>

        {/* Overall progress — Adaux red rule style */}
        <div className="card" style={{ marginBottom: '40px', padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '28px',
                letterSpacing: '0.04em', color: 'var(--text)', lineHeight: 1,
              }}>Overall Learning Progress</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px',
                color: 'var(--text3)', marginTop: '6px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>{totalDone} of {allItems.length} tasks completed</div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '56px',
              color: 'var(--accent)', lineHeight: 1,
            }}>{totalPct}%</div>
          </div>
          <div className="progress-bar" style={{ height: '3px' }}>
            <div className="progress-fill" style={{ width: `${totalPct}%` }} />
          </div>
        </div>

        {/* Roadmaps + Certs */}
        <div className="grid-2" style={{ marginBottom: '40px' }}>
          <div>
            <SectionHeading title="Roadmaps" linkTo="/roadmaps" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {loading
                ? <div style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.1em' }}>LOADING...</div>
                : data.roadmaps.length === 0
                  ? <div style={{ color: 'var(--text3)', fontSize: '12px', padding: '24px', textAlign: 'center', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>NO ROADMAPS YET</div>
                  : data.roadmaps.slice(0, 4).map(r => <RoadmapMini key={r._id} roadmap={r} />)
              }
            </div>
          </div>

          <div>
            <SectionHeading title="Certificates" linkTo="/certificates" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {!loading && (data.certs.length === 0
                ? <div style={{ gridColumn: '1/-1', color: 'var(--text3)', fontSize: '12px', padding: '24px', textAlign: 'center', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>NO CERTIFICATES YET</div>
                : data.certs.slice(0, 4).map(c => <CertCard key={c._id} cert={c} />)
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div>
          <SectionHeading title="Projects" linkTo="/projects" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {!loading && (data.projects.length === 0
              ? <div style={{ color: 'var(--text3)', fontSize: '12px', padding: '24px', textAlign: 'center', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>NO PROJECTS YET</div>
              : data.projects.slice(0, 5).map(p => <ProjectMini key={p._id} project={p} />)
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
