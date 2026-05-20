import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const devWords = [
  { word: 'Developer', lang: 'English' },
  { word: 'Desenvolvedor', lang: 'Português' },
  { word: 'Разработчик', lang: 'Русский' },
  { word: '開発者', lang: '日本語' },
  { word: '개발자', lang: '한국어' },
  { word: 'Entwickler', lang: 'Deutsch' },
  { word: 'Développeur', lang: 'Français' },
  { word: 'مطور', lang: 'عربي' },
  { word: 'डेवलपर', lang: 'हिन्दी' },
  { word: '开发者', lang: '中文' },
  { word: 'Разробник', lang: 'Українська' },
  { word: 'Geliştirici', lang: 'Türkçe' },
];

function Preloader({ onDone }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index >= devWords.length) { onDone(); return; }
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => { setIndex(i => i + 1); setVisible(true); }, 100);
    }, 200);
    return () => clearTimeout(t);
  }, [index]);

  if (index >= devWords.length) return null;
  const item = devWords[index];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9000,
    }}>
      {/* Adaux-style ticker line at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px', background: 'var(--accent)',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', padding: '0 40px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text3)',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: '20px',
          transition: 'opacity 0.2s',
          opacity: visible ? 1 : 0,
        }}>
          {item.lang}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(72px, 12vw, 140px)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          color: 'var(--text)',
          transition: 'opacity 0.2s, transform 0.2s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
        }}>
          {item.word}
        </div>
        {/* Adaux-style progress rule */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '48px', justifyContent: 'center' }}>
          {devWords.map((_, i) => (
            <div key={i} style={{
              width: i === index ? '32px' : '8px',
              height: '2px',
              background: i === index ? 'var(--accent)' : 'var(--border3)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '32px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px', fontWeight: 600,
        letterSpacing: '0.4em', textTransform: 'uppercase',
        color: 'var(--text4)',
      }}>RAJ's DevDash</div>
    </div>
  );
}

export default function LoginPage() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin, loginGuest } = useAuth();
  const navigate = useNavigate();

  const handleAdmin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginAdmin(password);
      navigate('/dashboard');
    } catch {
      setError('Invalid password. Try again.');
    } finally { setLoading(false); }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await loginGuest();
      navigate('/dashboard');
    } catch { setError('Failed to enter as guest.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      {showPreloader && <Preloader onDone={() => setShowPreloader(false)} />}

      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Adaux-style red top rule */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '3px', background: 'var(--accent)',
        }} />

        {/* Subtle grid background like Adaux */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%', maxWidth: '400px',
          position: 'relative',
          animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        }}>
          {/* Logo area */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '56px',
              letterSpacing: '0.06em',
              color: 'var(--text)',
              lineHeight: 1,
              marginBottom: '6px',
            }}>DevDash</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px', fontWeight: 600,
              color: 'var(--text3)',
              letterSpacing: '0.4em', textTransform: 'uppercase',
            }}>Raj's Developer Portfolio</div>
            <div style={{ width: '32px', height: '3px', background: 'var(--accent)', marginTop: '16px' }} />
          </div>

          {/* Login card */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border2)',
            padding: '32px',
          }}>
            <form onSubmit={handleAdmin}>
              <div style={{ marginBottom: '16px' }}>
                <label className="label">Admin Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(192,57,43,0.08)',
                  border: '1px solid rgba(192,57,43,0.3)',
                  color: 'var(--accent2)', fontSize: '13px',
                  marginBottom: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>{error}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ justifyContent: 'center', width: '100%', marginBottom: '12px' }}
              >
                {loading ? '···' : '→ Enter as Admin'}
              </button>
            </form>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              color: 'var(--text4)', fontSize: '11px',
              fontFamily: 'var(--font-mono)', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              margin: '16px 0',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              or
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <button
              onClick={handleGuest}
              className="btn btn-ghost w-full"
              disabled={loading}
              style={{ justifyContent: 'center', width: '100%' }}
            >
              👁 View as Guest
            </button>
          </div>

          <p style={{
            marginTop: '20px', fontSize: '11px',
            color: 'var(--text4)', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.15em', fontWeight: 600,
          }}>
            GUEST ACCESS — PORTFOLIO, PROJECTS & CERTIFICATES
          </p>
          <p style={{
            marginTop: '20px', fontSize: '11px',
            color: '#FF0000', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.15em', fontWeight: 600,
          }}>
            It is Highly Recommended to view this site in PC/Desktop.
          </p>
        </div>
      </div>
    </>
  );
}
