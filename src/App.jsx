import { useState, useEffect } from "react";

// ─── Mock Database ────────────────────────────────────────────────────────────
const MOCK_DB = {
  students: [
    { id: "s1", name: "Rahul Sharma", email: "rahul@student.com", password: "pass123", subject: "Mathematics", tutor: "t1", meetings: [] },
    { id: "s2", name: "Priya Patel", email: "priya@student.com", password: "pass123", subject: "Science", tutor: "t2", meetings: [] },
  ],
  tutors: [
    { id: "t1", name: "Amit Kumar", email: "amit@tutor.com", password: "tutor123", subjects: ["Mathematics", "Physics"], students: ["s1"], meetings: [] },
    { id: "t2", name: "Sunita Verma", email: "sunita@tutor.com", password: "tutor123", subjects: ["Chemistry", "Science"], students: ["s2"], meetings: [] },
  ],
  meetings: [
    { id: "m1", tutorId: "t1", studentId: "s1", studentName: "Rahul Sharma", subject: "Algebra Basics", date: "2026-04-10", time: "16:00", duration: "60", status: "upcoming", notes: "Chapter 3 revision" },
    { id: "m2", tutorId: "t2", studentId: "s2", studentName: "Priya Patel", subject: "Organic Chemistry", date: "2026-04-08", time: "17:00", duration: "45", status: "upcoming", notes: "" },
  ],
  admin: { email: "admin@educonnect.com", password: "admin@123" },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  };
  return icons[name] || null;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0e1a;
    --surface: #111827;
    --surface2: #1a2235;
    --border: #1f2d45;
    --accent: #4f8ef7;
    --accent2: #7c3aed;
    --gold: #f59e0b;
    --green: #10b981;
    --red: #ef4444;
    --text: #e2e8f0;
    --muted: #64748b;
    --font: 'Sora', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

  .app { min-height: 100vh; }

  /* ── Landing ── */
  .landing {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 2rem;
  }
  .landing::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% -20%, #1e3a6e44, transparent),
                radial-gradient(ellipse 60% 40% at 80% 80%, #4f8ef711, transparent),
                radial-gradient(ellipse 40% 60% at 10% 60%, #7c3aed0a, transparent);
    pointer-events: none;
  }
  .grid-bg {
    position: fixed; inset: 0; pointer-events: none;
    background-image: linear-gradient(#1f2d4522 1px, transparent 1px), linear-gradient(90deg, #1f2d4522 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%);
  }
  .logo-badge {
    display: flex; align-items: center; gap: 10px;
    background: #ffffff08; border: 1px solid #ffffff12;
    padding: 8px 18px; border-radius: 100px;
    font-size: 13px; color: var(--accent); letter-spacing: 0.05em;
    margin-bottom: 2rem; backdrop-filter: blur(10px);
  }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  .landing h1 {
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800;
    text-align: center;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;
  }
  .landing h1 span {
    background: linear-gradient(135deg, #4f8ef7, #7c3aed, #f59e0b);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .landing p {
    color: var(--muted); font-size: 1.1rem; text-align: center;
    max-width: 480px; line-height: 1.7; margin-bottom: 3rem;
  }
  .portal-cards {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
    max-width: 860px; width: 100%;
  }
  @media (max-width: 640px) { .portal-cards { grid-template-columns: 1fr; } }

  .portal-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .portal-card::before {
    content: ''; position: absolute; inset: 0;
    background: var(--card-glow, transparent);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 20px;
  }
  .portal-card:hover { transform: translateY(-6px); border-color: var(--card-color); box-shadow: 0 20px 60px -10px var(--card-shadow); }
  .portal-card:hover::before { opacity: 1; }
  .card-icon {
    width: 60px; height: 60px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 1.2rem; font-size: 1.8rem;
  }
  .portal-card h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
  .portal-card p { color: var(--muted); font-size: 0.85rem; line-height: 1.5; }
  .card-arrow { margin-top: 1.2rem; color: var(--muted); font-size: 0.85rem; transition: color 0.3s; }
  .portal-card:hover .card-arrow { color: var(--card-color); }

  /* ── Auth ── */
  .auth-wrap {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 2rem; position: relative;
  }
  .auth-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 24px; padding: 2.5rem; width: 100%; max-width: 440px;
    position: relative; z-index: 1;
  }
  .auth-back {
    position: absolute; top: 2rem; left: 2rem;
    background: #ffffff08; border: 1px solid var(--border);
    color: var(--muted); padding: 8px 16px; border-radius: 100px;
    cursor: pointer; font-size: 13px; transition: all 0.2s;
    font-family: var(--font);
  }
  .auth-back:hover { color: var(--text); border-color: var(--accent); }
  .auth-header { text-align: center; margin-bottom: 2rem; }
  .auth-icon { font-size: 2.5rem; margin-bottom: 0.8rem; }
  .auth-header h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.3rem; }
  .auth-header p { color: var(--muted); font-size: 0.9rem; }
  .tabs { display: flex; background: var(--bg); border-radius: 10px; padding: 4px; margin-bottom: 1.5rem; }
  .tab { flex: 1; padding: 9px; text-align: center; border-radius: 8px; cursor: pointer; font-size: 0.9rem; color: var(--muted); transition: all 0.2s; border: none; background: none; font-family: var(--font); font-weight: 500; }
  .tab.active { background: var(--surface2); color: var(--text); }

  label { display: block; font-size: 0.85rem; color: var(--muted); margin-bottom: 0.4rem; font-weight: 500; }
  input, select, textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 14px; color: var(--text);
    font-size: 0.9rem; font-family: var(--font);
    transition: border-color 0.2s; outline: none; margin-bottom: 1rem;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); }
  select option { background: var(--surface); }

  .btn {
    width: 100%; padding: 12px; border-radius: 12px; border: none;
    font-weight: 600; font-size: 0.95rem; cursor: pointer;
    font-family: var(--font); transition: all 0.2s; letter-spacing: 0.01em;
  }
  .btn-primary { background: linear-gradient(135deg, #4f8ef7, #7c3aed); color: white; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px #4f8ef740; }
  .btn-danger { background: var(--red); color: white; width: auto; padding: 8px 16px; font-size: 0.85rem; border-radius: 8px; }
  .btn-sm { width: auto; padding: 8px 16px; font-size: 0.85rem; border-radius: 8px; }
  .btn-green { background: var(--green); color: white; }
  .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--text); }
  .err { color: var(--red); font-size: 0.85rem; margin-bottom: 1rem; text-align: center; }
  .success { color: var(--green); font-size: 0.85rem; margin-bottom: 1rem; text-align: center; }

  /* ── Dashboard Layout ── */
  .dashboard { display: flex; min-height: 100vh; }
  .sidebar {
    width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    padding: 1.5rem; display: flex; flex-direction: column; flex-shrink: 0;
    position: sticky; top: 0; height: 100vh;
  }
  .sidebar-logo { font-weight: 800; font-size: 1.2rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 8px; }
  .sidebar-logo .dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 8px var(--accent); }
  .nav-section { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin: 1.2rem 0 0.5rem; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 10px; cursor: pointer; color: var(--muted); font-size: 0.9rem;
    transition: all 0.2s; margin-bottom: 2px; border: none; background: none;
    width: 100%; font-family: var(--font); font-weight: 500; text-align: left;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: #4f8ef720; color: var(--accent); }
  .sidebar-footer { margin-top: auto; }

  .main { flex: 1; padding: 2rem; overflow-y: auto; }
  .page-header { margin-bottom: 2rem; }
  .page-header h1 { font-size: 1.6rem; font-weight: 700; }
  .page-header p { color: var(--muted); font-size: 0.9rem; margin-top: 0.3rem; }

  /* ── Cards & Grids ── */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 1.4rem;
  }
  .stat-label { color: var(--muted); font-size: 0.8rem; font-weight: 500; margin-bottom: 0.5rem; }
  .stat-value { font-size: 2rem; font-weight: 800; font-family: var(--mono); }
  .stat-sub { color: var(--muted); font-size: 0.78rem; margin-top: 0.3rem; }

  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;
  }
  .card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1.2rem; }
  .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
  @media (max-width: 640px) { .card-row { grid-template-columns: 1fr; } }

  /* ── Meeting Cards ── */
  .meeting-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 14px; padding: 1.2rem; margin-bottom: 1rem;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
    transition: border-color 0.2s;
  }
  .meeting-card:hover { border-color: var(--accent); }
  .meeting-info { flex: 1; }
  .meeting-subject { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.5rem; }
  .meeting-meta { display: flex; gap: 1rem; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 5px; color: var(--muted); font-size: 0.82rem; }
  .badge {
    padding: 4px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 600;
  }
  .badge-upcoming { background: #4f8ef720; color: var(--accent); }
  .badge-done { background: #10b98120; color: var(--green); }
  .badge-student { background: #7c3aed20; color: #a78bfa; }
  .badge-tutor { background: #f59e0b20; color: var(--gold); }
  .badge-admin { background: #ef444420; color: var(--red); }

  /* ── Table ── */
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 10px 14px; font-size: 0.78rem; color: var(--muted); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; border-bottom: 1px solid var(--border); }
  td { padding: 12px 14px; font-size: 0.9rem; border-bottom: 1px solid #ffffff08; }
  tr:hover td { background: #ffffff04; }

  .avatar {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
  }
  .user-row { display: flex; align-items: center; gap: 10px; }

  /* ── Form inside card ── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
  @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
  .form-actions { display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 0.5rem; }

  /* ── Schedule Timeline ── */
  .timeline { position: relative; padding-left: 1.5rem; }
  .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--border); }
  .tl-item { position: relative; margin-bottom: 1.5rem; }
  .tl-dot { position: absolute; left: -1.85rem; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); border: 2px solid var(--bg); box-shadow: 0 0 8px var(--accent); }
  .tl-time { font-family: var(--mono); font-size: 0.8rem; color: var(--accent); margin-bottom: 0.3rem; }
  .tl-title { font-weight: 600; font-size: 0.95rem; }
  .tl-sub { color: var(--muted); font-size: 0.82rem; margin-top: 0.2rem; }

  /* ── Modal ── */
  .modal-overlay { position: fixed; inset: 0; background: #00000088; backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 2rem; width: 100%; max-width: 480px; }
  .modal h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; }
  .modal-footer { display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 1rem; }
  .close-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1.5rem; line-height: 1; float: right; }

  /* ── Responsive sidebar ── */
  @media (max-width: 768px) {
    .sidebar { width: 60px; padding: 1rem 0.8rem; }
    .sidebar-logo span, .nav-section, .nav-item span, .sidebar-footer span { display: none; }
    .sidebar-logo { justify-content: center; }
    .nav-item { justify-content: center; }
    .main { padding: 1.5rem 1rem; }
  }

  .divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
  .empty { text-align: center; padding: 3rem; color: var(--muted); }
  .empty-icon { font-size: 2.5rem; margin-bottom: 0.8rem; }
  .mt1 { margin-top: 1rem; }
  .flex { display: flex; }
  .gap { gap: 0.8rem; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .text-muted { color: var(--muted); font-size: 0.85rem; }
`;

// ─── State ───────────────────────────────────────────────────────────────────
export default function EduConnect() {
  const [db, setDb] = useState(MOCK_DB);
  const [screen, setScreen] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = (user, role) => {
    setCurrentUser(user);
    setUserRole(role);
    setScreen(role + "Dash");
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setScreen("landing");
  };

  const addMeeting = (meeting) => {
    const newMeeting = { ...meeting, id: "m" + Date.now(), status: "upcoming" };
    setDb(prev => ({ ...prev, meetings: [...prev.meetings, newMeeting] }));
  };

  const deleteMeeting = (id) => {
    setDb(prev => ({ ...prev, meetings: prev.meetings.filter(m => m.id !== id) }));
  };

  const registerStudent = (data) => {
    const newStudent = { ...data, id: "s" + Date.now(), meetings: [] };
    setDb(prev => ({ ...prev, students: [...prev.students, newStudent] }));
    return newStudent;
  };

  const registerTutor = (data) => {
    const newTutor = { ...data, id: "t" + Date.now(), students: [], meetings: [] };
    setDb(prev => ({ ...prev, tutors: [...prev.tutors, newTutor] }));
    return newTutor;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {screen === "landing" && <Landing onSelect={s => setScreen(s)} />}
        {screen === "studentAuth" && <StudentAuth db={db} onLogin={login} onRegister={registerStudent} onBack={() => setScreen("landing")} />}
        {screen === "tutorAuth" && <TutorAuth db={db} onLogin={login} onRegister={registerTutor} onBack={() => setScreen("landing")} />}
        {screen === "adminAuth" && <AdminAuth db={db} onLogin={login} onBack={() => setScreen("landing")} />}
        {screen === "studentDash" && <StudentDashboard user={currentUser} db={db} onLogout={logout} />}
        {screen === "tutorDash" && <TutorDashboard user={currentUser} db={db} onLogout={logout} onAddMeeting={addMeeting} onDeleteMeeting={deleteMeeting} />}
        {/* ✅ FIX 1: onAddMeeting prop add kiya */}
        {screen === "adminDash" && <AdminDashboard user={currentUser} db={db} onLogout={logout} onDeleteMeeting={deleteMeeting} onAddMeeting={addMeeting} />}
      </div>
    </>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function Landing({ onSelect }) {
  return (
    <div className="landing">
      <div className="grid-bg" />
      <div className="logo-badge"><div className="logo-dot" /><span>EduConnect Platform</span></div>
      <h1>Smart Learning,<br /><span>Smarter Connections</span></h1>
      <p>Connect students with expert tutors. Schedule sessions, track progress, and manage everything from one beautiful platform.</p>
      <div className="portal-cards">
        <div className="portal-card" style={{"--card-color":"#4f8ef7","--card-shadow":"#4f8ef730","--card-glow":"radial-gradient(circle at 50% 0%, #4f8ef710, transparent 70%)"}} onClick={() => onSelect("studentAuth")}>
          <div className="card-icon" style={{background:"#4f8ef720"}}>📚</div>
          <h3>Student Portal</h3>
          <p>Access your schedule, connect with tutors, and track your learning journey.</p>
          <div className="card-arrow">Enter as Student →</div>
        </div>
        <div className="portal-card" style={{"--card-color":"#f59e0b","--card-shadow":"#f59e0b30","--card-glow":"radial-gradient(circle at 50% 0%, #f59e0b10, transparent 70%)"}} onClick={() => onSelect("tutorAuth")}>
          <div className="card-icon" style={{background:"#f59e0b20"}}>🎓</div>
          <h3>Tutor Portal</h3>
          <p>Manage students, schedule sessions, and deliver impactful teaching.</p>
          <div className="card-arrow">Enter as Tutor →</div>
        </div>
        <div className="portal-card" style={{"--card-color":"#ef4444","--card-shadow":"#ef444430","--card-glow":"radial-gradient(circle at 50% 0%, #ef444410, transparent 70%)"}} onClick={() => onSelect("adminAuth")}>
          <div className="card-icon" style={{background:"#ef444420"}}>⚙️</div>
          <h3>Admin Panel</h3>
          <p>Full control over users, sessions, and platform analytics.</p>
          <div className="card-arrow">Enter as Admin →</div>
        </div>
      </div>
      <div style={{marginTop:"2.5rem",color:"var(--muted)",fontSize:"0.8rem"}}>
        Demo: admin@educonnect.com / admin@123 &nbsp;|&nbsp; rahul@student.com / pass123 &nbsp;|&nbsp; amit@tutor.com / tutor123
      </div>
    </div>
  );
}

// ─── Student Auth ─────────────────────────────────────────────────────────────
function StudentAuth({ db, onLogin, onRegister, onBack }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", subject: "" });
  const [err, setErr] = useState("");

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = () => {
    const u = db.students.find(s => s.email === form.email && s.password === form.password);
    if (!u) return setErr("Invalid credentials. Try rahul@student.com / pass123");
    onLogin(u, "student");
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password || !form.subject) return setErr("All fields required");
    if (db.students.find(s => s.email === form.email)) return setErr("Email already registered");
    const u = onRegister({ name: form.name, email: form.email, password: form.password, subject: form.subject, tutor: null });
    onLogin(u, "student");
  };

  return (
    <div className="auth-wrap">
      <div className="grid-bg" />
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">📚</div>
          <h2>Student Portal</h2>
          <p>Login or create your account</p>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); }}>Login</button>
          <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr(""); }}>Register</button>
        </div>
        {err && <div className="err">{err}</div>}
        {tab === "register" && (
          <><label>Full Name</label><input placeholder="Rahul Sharma" value={form.name} onChange={set("name")} /></>
        )}
        <label>Email</label><input type="email" placeholder="student@email.com" value={form.email} onChange={set("email")} />
        <label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        {tab === "register" && (
          <><label>Primary Subject</label>
          <select value={form.subject} onChange={set("subject")}>
            <option value="">Select subject</option>
            {["Mathematics","Science","Physics","Chemistry","English","History","Biology","Computer Science"].map(s => <option key={s}>{s}</option>)}
          </select></>
        )}
        <button className="btn btn-primary" onClick={tab === "login" ? handleLogin : handleRegister}>
          {tab === "login" ? "Login to Dashboard" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

// ─── Tutor Auth ───────────────────────────────────────────────────────────────
function TutorAuth({ db, onLogin, onRegister, onBack }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", subjects: "" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = () => {
    const u = db.tutors.find(t => t.email === form.email && t.password === form.password);
    if (!u) return setErr("Invalid credentials. Try amit@tutor.com / tutor123");
    onLogin(u, "tutor");
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) return setErr("All fields required");
    if (db.tutors.find(t => t.email === form.email)) return setErr("Email already registered");
    const u = onRegister({ name: form.name, email: form.email, password: form.password, subjects: form.subjects.split(",").map(s => s.trim()) });
    onLogin(u, "tutor");
  };

  return (
    <div className="auth-wrap">
      <div className="grid-bg" />
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🎓</div>
          <h2>Tutor Portal</h2>
          <p>Login or register as a tutor</p>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr(""); }}>Login</button>
          <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr(""); }}>Register</button>
        </div>
        {err && <div className="err">{err}</div>}
        {tab === "register" && <><label>Full Name</label><input placeholder="Dr. Sharma" value={form.name} onChange={set("name")} /></>}
        <label>Email</label><input type="email" placeholder="tutor@email.com" value={form.email} onChange={set("email")} />
        <label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        {tab === "register" && <><label>Subjects (comma separated)</label><input placeholder="Math, Physics, Chemistry" value={form.subjects} onChange={set("subjects")} /></>}
        <button className="btn btn-primary" onClick={tab === "login" ? handleLogin : handleRegister}>
          {tab === "login" ? "Login to Dashboard" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────
function AdminAuth({ db, onLogin, onBack }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = () => {
    if (form.email === db.admin.email && form.password === db.admin.password)
      onLogin({ name: "Admin", email: form.email }, "admin");
    else setErr("Invalid admin credentials. Use admin@educonnect.com / admin@123");
  };

  return (
    <div className="auth-wrap">
      <div className="grid-bg" />
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">⚙️</div>
          <h2>Admin Panel</h2>
          <p>Restricted access — Admins only</p>
        </div>
        {err && <div className="err">{err}</div>}
        <label>Admin Email</label><input type="email" placeholder="admin@educonnect.com" value={form.email} onChange={set("email")} />
        <label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        <button className="btn btn-primary" onClick={handleLogin}>Access Admin Panel</button>
        <div className="text-muted mt1" style={{textAlign:"center"}}>🔒 admin@educonnect.com / admin@123</div>
      </div>
    </div>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
function StudentDashboard({ user, db, onLogout }) {
  const [nav, setNav] = useState("home");
  const myMeetings = db.meetings.filter(m => m.studentId === user.id);
  const myTutor = db.tutors.find(t => t.id === user.tutor);
  const upcoming = myMeetings.filter(m => m.status === "upcoming");

  const NavItem = ({ id, icon, label }) => (
    <button className={`nav-item ${nav === id ? "active" : ""}`} onClick={() => setNav(id)}>
      <Icon name={icon} size={18} /><span>{label}</span>
    </button>
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="dot" /><span>EduConnect</span></div>
        <div className="nav-section"><span>Menu</span></div>
        <NavItem id="home" icon="home" label="Dashboard" />
        <NavItem id="schedule" icon="calendar" label="My Schedule" />
        <NavItem id="tutor" icon="user" label="My Tutor" />
        <div className="sidebar-footer">
          <div style={{marginBottom:"0.8rem",display:"flex",alignItems:"center",gap:"8px"}}>
            <div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{user.name[0]}</div>
            <span style={{fontSize:"0.85rem",fontWeight:"600"}}>{user.name.split(" ")[0]}</span>
          </div>
          <button className="nav-item" onClick={onLogout}><Icon name="logout" size={18} /><span>Logout</span></button>
        </div>
      </aside>
      <main className="main">
        {nav === "home" && <StudentHome user={user} meetings={myMeetings} upcoming={upcoming} tutor={myTutor} />}
        {nav === "schedule" && <StudentSchedule meetings={myMeetings} />}
        {nav === "tutor" && <StudentTutorView tutor={myTutor} />}
      </main>
    </div>
  );
}

function StudentHome({ user, meetings, upcoming, tutor }) {
  return (
    <>
      <div className="page-header">
        <h1>Welcome back, {user.name.split(" ")[0]} 👋</h1>
        <p>Here's your learning overview for today</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Upcoming Sessions</div><div className="stat-value" style={{color:"var(--accent)"}}>{upcoming.length}</div><div className="stat-sub">This week</div></div>
        <div className="stat-card"><div className="stat-label">Total Sessions</div><div className="stat-value">{meetings.length}</div><div className="stat-sub">All time</div></div>
        <div className="stat-card"><div className="stat-label">My Subject</div><div className="stat-value" style={{fontSize:"1.1rem",paddingTop:"0.3rem"}}>{user.subject || "—"}</div><div className="stat-sub">Primary focus</div></div>
        <div className="stat-card"><div className="stat-label">My Tutor</div><div className="stat-value" style={{fontSize:"1rem",paddingTop:"0.3rem"}}>{tutor ? tutor.name.split(" ")[0] : "Not assigned"}</div><div className="stat-sub">{tutor ? "Active" : "—"}</div></div>
      </div>
      <div className="card">
        <h3>📅 Upcoming Sessions</h3>
        {upcoming.length === 0 ? <div className="empty"><div className="empty-icon">📭</div><div>No upcoming sessions scheduled</div></div> :
          upcoming.map(m => <MeetingCard key={m.id} meeting={m} />)}
      </div>
    </>
  );
}

function StudentSchedule({ meetings }) {
  const sorted = [...meetings].sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <>
      <div className="page-header"><h1>My Schedule 📅</h1><p>All your tutoring sessions</p></div>
      <div className="card">
        {sorted.length === 0 ? <div className="empty"><div className="empty-icon">📭</div><div>No sessions yet</div></div> :
          <div className="timeline">
            {sorted.map(m => (
              <div className="tl-item" key={m.id}>
                <div className="tl-dot" />
                <div className="tl-time">{m.date} · {m.time}</div>
                <div className="tl-title">{m.subject}</div>
                <div className="tl-sub">{m.duration} min &nbsp;·&nbsp; <span className={`badge badge-${m.status === "upcoming" ? "upcoming" : "done"}`}>{m.status}</span></div>
                {m.notes && <div className="tl-sub" style={{marginTop:"0.3rem"}}>📝 {m.notes}</div>}
              </div>
            ))}
          </div>}
      </div>
    </>
  );
}

function StudentTutorView({ tutor }) {
  if (!tutor) return (
    <><div className="page-header"><h1>My Tutor 🎓</h1></div>
    <div className="card"><div className="empty"><div className="empty-icon">👤</div><div>No tutor assigned yet. Contact admin.</div></div></div></>
  );
  return (
    <>
      <div className="page-header"><h1>My Tutor 🎓</h1><p>Your personal tutor profile</p></div>
      <div className="card">
        <div className="flex items-center gap" style={{marginBottom:"1.5rem"}}>
          <div className="avatar" style={{width:64,height:64,fontSize:"1.5rem",borderRadius:16,background:"#f59e0b20",color:"var(--gold)"}}>{tutor.name[0]}</div>
          <div>
            <div style={{fontWeight:700,fontSize:"1.2rem"}}>{tutor.name}</div>
            <div className="text-muted">{tutor.email}</div>
            <div style={{marginTop:"0.4rem"}}>{tutor.subjects?.map(s => <span key={s} className="badge badge-upcoming" style={{marginRight:"0.4rem"}}>{s}</span>)}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="flex gap">
          <div className="stat-card" style={{flex:1}}><div className="stat-label">Students</div><div className="stat-value">{tutor.students?.length || 0}</div></div>
          <div className="stat-card" style={{flex:1}}><div className="stat-label">Subjects</div><div className="stat-value">{tutor.subjects?.length || 0}</div></div>
        </div>
      </div>
    </>
  );
}

// ─── Tutor Dashboard ──────────────────────────────────────────────────────────
function TutorDashboard({ user, db, onLogout, onAddMeeting, onDeleteMeeting }) {
  const [nav, setNav] = useState("home");
  const myMeetings = db.meetings.filter(m => m.tutorId === user.id);
  const myStudents = db.students.filter(s => user.students?.includes(s.id));

  const NavItem = ({ id, icon, label }) => (
    <button className={`nav-item ${nav === id ? "active" : ""}`} onClick={() => setNav(id)}>
      <Icon name={icon} size={18} /><span>{label}</span>
    </button>
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="dot" /><span>EduConnect</span></div>
        <div className="nav-section"><span>Menu</span></div>
        <NavItem id="home" icon="home" label="Dashboard" />
        <NavItem id="schedule" icon="calendar" label="Schedule" />
        <NavItem id="students" icon="users" label="My Students" />
        <NavItem id="add" icon="plus" label="New Meeting" />
        <div className="sidebar-footer">
          <div style={{marginBottom:"0.8rem",display:"flex",alignItems:"center",gap:"8px"}}>
            <div className="avatar" style={{background:"#f59e0b20",color:"var(--gold)"}}>{user.name[0]}</div>
            <span style={{fontSize:"0.85rem",fontWeight:"600"}}>{user.name.split(" ")[0]}</span>
          </div>
          <button className="nav-item" onClick={onLogout}><Icon name="logout" size={18} /><span>Logout</span></button>
        </div>
      </aside>
      <main className="main">
        {nav === "home" && <TutorHome user={user} meetings={myMeetings} students={myStudents} />}
        {nav === "schedule" && <TutorSchedule meetings={myMeetings} onDelete={onDeleteMeeting} />}
        {nav === "students" && <TutorStudents students={myStudents} />}
        {nav === "add" && <AddMeeting user={user} students={myStudents} onAdd={(m) => { onAddMeeting(m); setNav("schedule"); }} />}
      </main>
    </div>
  );
}

function TutorHome({ user, meetings, students }) {
  const upcoming = meetings.filter(m => m.status === "upcoming");
  return (
    <>
      <div className="page-header"><h1>Tutor Dashboard 🎓</h1><p>Manage your students and sessions</p></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">My Students</div><div className="stat-value" style={{color:"var(--gold)"}}>{students.length}</div></div>
        <div className="stat-card"><div className="stat-label">Upcoming</div><div className="stat-value" style={{color:"var(--accent)"}}>{upcoming.length}</div></div>
        <div className="stat-card"><div className="stat-label">Total Sessions</div><div className="stat-value">{meetings.length}</div></div>
        <div className="stat-card"><div className="stat-label">Subjects</div><div className="stat-value" style={{fontSize:"0.9rem",paddingTop:"0.3rem"}}>{user.subjects?.join(", ") || "—"}</div></div>
      </div>
      <div className="card">
        <h3>🗓 Upcoming Sessions</h3>
        {upcoming.length === 0 ? <div className="empty"><div className="empty-icon">📭</div><div>No upcoming sessions</div></div> :
          upcoming.map(m => <MeetingCard key={m.id} meeting={m} showStudent />)}
      </div>
    </>
  );
}

function TutorSchedule({ meetings, onDelete }) {
  const sorted = [...meetings].sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <>
      <div className="page-header"><h1>My Schedule 📅</h1><p>All sessions with your students</p></div>
      <div className="card">
        {sorted.length === 0 ? <div className="empty"><div className="empty-icon">📭</div><div>No sessions scheduled</div></div> :
          sorted.map(m => (
            <div key={m.id} className="meeting-card">
              <div className="meeting-info">
                <div className="meeting-subject">{m.subject}</div>
                <div className="meeting-meta">
                  <span className="meta-item"><Icon name="user" size={14} />{m.studentName}</span>
                  <span className="meta-item"><Icon name="calendar" size={14} />{m.date}</span>
                  <span className="meta-item"><Icon name="clock" size={14} />{m.time} · {m.duration}min</span>
                </div>
                {m.notes && <div className="text-muted" style={{marginTop:"0.5rem"}}>📝 {m.notes}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",alignItems:"flex-end"}}>
                <span className={`badge badge-${m.status === "upcoming" ? "upcoming" : "done"}`}>{m.status}</span>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(m.id)}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

function TutorStudents({ students }) {
  return (
    <>
      <div className="page-header"><h1>My Students 👥</h1><p>Students assigned to you</p></div>
      <div className="card">
        {students.length === 0 ? <div className="empty"><div className="empty-icon">👥</div><div>No students assigned yet</div></div> :
          <table>
            <thead><tr><th>Student</th><th>Subject</th><th>Email</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td><div className="user-row"><div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{s.name[0]}</div>{s.name}</div></td>
                  <td><span className="badge badge-upcoming">{s.subject}</span></td>
                  <td className="text-muted">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>}
      </div>
    </>
  );
}

function AddMeeting({ user, students, onAdd }) {
  const [form, setForm] = useState({ studentId: "", studentName: "", subject: "", date: "", time: "", duration: "60", notes: "" });
  const [err, setErr] = useState("");
  const set = k => e => {
    const v = e.target.value;
    if (k === "studentId") {
      const s = students.find(s => s.id === v);
      setForm(p => ({ ...p, studentId: v, studentName: s ? s.name : "" }));
    } else setForm(p => ({ ...p, [k]: v }));
  };

  const submit = () => {
    if (!form.studentId || !form.subject || !form.date || !form.time) return setErr("Please fill all required fields");
    onAdd({ ...form, tutorId: user.id });
  };

  return (
    <>
      <div className="page-header"><h1>Schedule New Meeting ➕</h1><p>Book a tutoring session with a student</p></div>
      <div className="card">
        {err && <div className="err">{err}</div>}
        <div className="form-grid">
          <div>
            <label>Student *</label>
            <select value={form.studentId} onChange={set("studentId")}>
              <option value="">Select student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Subject *</label>
            <input placeholder="e.g. Algebra Basics" value={form.subject} onChange={set("subject")} />
          </div>
          <div>
            <label>Date *</label>
            <input type="date" value={form.date} onChange={set("date")} />
          </div>
          <div>
            <label>Time *</label>
            <input type="time" value={form.time} onChange={set("time")} />
          </div>
          <div>
            <label>Duration (minutes)</label>
            <select value={form.duration} onChange={set("duration")}>
              {["30","45","60","90","120"].map(d => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
          <div>
            <label>Notes (optional)</label>
            <input placeholder="Topic or chapter to cover..." value={form.notes} onChange={set("notes")} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary btn-sm" style={{width:"auto",padding:"10px 24px"}} onClick={submit}>Schedule Meeting</button>
        </div>
      </div>
    </>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
// ✅ FIX 2: onAddMeeting prop add kiya
function AdminDashboard({ user, db, onLogout, onDeleteMeeting, onAddMeeting }) {
  const [nav, setNav] = useState("home");
  const NavItem = ({ id, icon, label }) => (
    <button className={`nav-item ${nav === id ? "active" : ""}`} onClick={() => setNav(id)}>
      <Icon name={icon} size={18} /><span>{label}</span>
    </button>
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="dot" style={{background:"var(--red)",boxShadow:"0 0 8px var(--red)"}} /><span>Admin Panel</span></div>
        <div className="nav-section"><span>Overview</span></div>
        <NavItem id="home" icon="home" label="Dashboard" />
        <div className="nav-section"><span>Manage</span></div>
        <NavItem id="students" icon="book" label="Students" />
        <NavItem id="tutors" icon="star" label="Tutors" />
        <NavItem id="meetings" icon="calendar" label="All Meetings" />
        {/* ✅ FIX 3: Schedule Meeting nav item add kiya */}
        <NavItem id="schedule" icon="plus" label="Schedule Meeting" />
        <div className="sidebar-footer">
          <div style={{marginBottom:"0.8rem",display:"flex",alignItems:"center",gap:"8px"}}>
            <div className="avatar" style={{background:"#ef444420",color:"var(--red)"}}>A</div>
            <span style={{fontSize:"0.85rem",fontWeight:"600"}}>Admin</span>
          </div>
          <button className="nav-item" onClick={onLogout}><Icon name="logout" size={18} /><span>Logout</span></button>
        </div>
      </aside>
      <main className="main">
        {nav === "home" && <AdminHome db={db} />}
        {nav === "students" && <AdminStudents db={db} />}
        {nav === "tutors" && <AdminTutors db={db} />}
        {nav === "meetings" && <AdminMeetings db={db} onDelete={onDeleteMeeting} />}
        {/* ✅ FIX 4: Schedule Meeting page render kiya */}
        {nav === "schedule" && <AdminScheduleMeeting db={db} onAdd={(m) => { onAddMeeting(m); setNav("meetings"); }} />}
      </main>
    </div>
  );
}

function AdminHome({ db }) {
  const upcoming = db.meetings.filter(m => m.status === "upcoming");
  return (
    <>
      <div className="page-header"><h1>Admin Overview ⚙️</h1><p>Platform-wide statistics and activity</p></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Students</div><div className="stat-value" style={{color:"var(--accent)"}}>{db.students.length}</div></div>
        <div className="stat-card"><div className="stat-label">Total Tutors</div><div className="stat-value" style={{color:"var(--gold)"}}>{db.tutors.length}</div></div>
        <div className="stat-card"><div className="stat-label">Total Sessions</div><div className="stat-value">{db.meetings.length}</div></div>
        <div className="stat-card"><div className="stat-label">Upcoming</div><div className="stat-value" style={{color:"var(--green)"}}>{upcoming.length}</div></div>
      </div>
      <div className="card-row">
        <div className="card" style={{margin:0}}>
          <h3>🎓 Recent Students</h3>
          {db.students.slice(0, 4).map(s => (
            <div key={s.id} className="flex items-center gap" style={{marginBottom:"0.8rem"}}>
              <div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{s.name[0]}</div>
              <div><div style={{fontWeight:600,fontSize:"0.9rem"}}>{s.name}</div><div className="text-muted">{s.subject}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{margin:0}}>
          <h3>📅 Recent Meetings</h3>
          {db.meetings.slice(0, 3).map(m => (
            <div key={m.id} style={{marginBottom:"1rem"}}>
              <div style={{fontWeight:600,fontSize:"0.9rem"}}>{m.subject}</div>
              <div className="text-muted">{m.studentName} · {m.date} {m.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminStudents({ db }) {
  return (
    <>
      <div className="page-header"><h1>All Students 📚</h1><p>{db.students.length} students registered</p></div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Tutor</th></tr></thead>
          <tbody>
            {db.students.map(s => {
              const tutor = db.tutors.find(t => t.id === s.tutor);
              return (
                <tr key={s.id}>
                  <td><div className="user-row"><div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{s.name[0]}</div>{s.name}</div></td>
                  <td className="text-muted">{s.email}</td>
                  <td><span className="badge badge-upcoming">{s.subject}</span></td>
                  <td>{tutor ? tutor.name : <span className="text-muted">Not assigned</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminTutors({ db }) {
  return (
    <>
      <div className="page-header"><h1>All Tutors 🎓</h1><p>{db.tutors.length} tutors on platform</p></div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Subjects</th><th>Students</th></tr></thead>
          <tbody>
            {db.tutors.map(t => (
              <tr key={t.id}>
                <td><div className="user-row"><div className="avatar" style={{background:"#f59e0b20",color:"var(--gold)"}}>{t.name[0]}</div>{t.name}</div></td>
                <td className="text-muted">{t.email}</td>
                <td>{t.subjects?.map(s => <span key={s} className="badge badge-upcoming" style={{marginRight:"4px"}}>{s}</span>)}</td>
                <td><span className="badge badge-done">{t.students?.length || 0} students</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminMeetings({ db, onDelete }) {
  return (
    <>
      <div className="page-header"><h1>All Meetings 📅</h1><p>{db.meetings.length} total sessions</p></div>
      <div className="card">
        {db.meetings.length === 0 ? <div className="empty"><div className="empty-icon">📭</div><div>No meetings scheduled</div></div> :
          db.meetings.map(m => {
            const tutor = db.tutors.find(t => t.id === m.tutorId);
            return (
              <div key={m.id} className="meeting-card">
                <div className="meeting-info">
                  <div className="meeting-subject">{m.subject}</div>
                  <div className="meeting-meta">
                    <span className="meta-item"><Icon name="user" size={14} />Student: {m.studentName}</span>
                    <span className="meta-item">Tutor: {tutor?.name || "Unknown"}</span>
                    <span className="meta-item"><Icon name="calendar" size={14} />{m.date}</span>
                    <span className="meta-item"><Icon name="clock" size={14} />{m.time} · {m.duration}min</span>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",alignItems:"flex-end"}}>
                  <span className={`badge badge-${m.status === "upcoming" ? "upcoming" : "done"}`}>{m.status}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(m.id)}>Delete</button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

// ✅ FIX 5: Naya AdminScheduleMeeting component — tutor + student dono select kar sakte hain
function AdminScheduleMeeting({ db, onAdd }) {
  const [form, setForm] = useState({
    tutorId: "", studentId: "", studentName: "",
    subject: "", date: "", time: "", duration: "60", notes: ""
  });
  const [err, setErr] = useState("");

  const set = k => e => {
    const v = e.target.value;
    if (k === "studentId") {
      const s = db.students.find(s => s.id === v);
      setForm(p => ({ ...p, studentId: v, studentName: s ? s.name : "" }));
    } else {
      setForm(p => ({ ...p, [k]: v }));
    }
  };

  const submit = () => {
    if (!form.tutorId || !form.studentId || !form.subject || !form.date || !form.time)
      return setErr("Saare required fields fill karo");
    onAdd(form);
  };

  return (
    <>
      <div className="page-header"><h1>Schedule Meeting ➕</h1><p>Admin ki taraf se koi bhi session book karo</p></div>
      <div className="card">
        {err && <div className="err">{err}</div>}
        <div className="form-grid">
          <div>
            <label>Tutor *</label>
            <select value={form.tutorId} onChange={set("tutorId")}>
              <option value="">Select tutor</option>
              {db.tutors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label>Student *</label>
            <select value={form.studentId} onChange={set("studentId")}>
              <option value="">Select student</option>
              {db.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label>Subject *</label>
            <input placeholder="e.g. Algebra Basics" value={form.subject} onChange={set("subject")} />
          </div>
          <div>
            <label>Date *</label>
            <input type="date" value={form.date} onChange={set("date")} />
          </div>
          <div>
            <label>Time *</label>
            <input type="time" value={form.time} onChange={set("time")} />
          </div>
          <div>
            <label>Duration (minutes)</label>
            <select value={form.duration} onChange={set("duration")}>
              {["30","45","60","90","120"].map(d => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label>Notes (optional)</label>
            <input placeholder="Topic ya chapter jo cover karna hai..." value={form.notes} onChange={set("notes")} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary btn-sm" style={{width:"auto",padding:"10px 24px"}} onClick={submit}>
            Schedule Meeting
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Shared MeetingCard ───────────────────────────────────────────────────────
function MeetingCard({ meeting, showStudent }) {
  return (
    <div className="meeting-card">
      <div className="meeting-info">
        <div className="meeting-subject">{meeting.subject}</div>
        <div className="meeting-meta">
          {showStudent && <span className="meta-item"><Icon name="user" size={14} />{meeting.studentName}</span>}
          <span className="meta-item"><Icon name="calendar" size={14} />{meeting.date}</span>
          <span className="meta-item"><Icon name="clock" size={14} />{meeting.time}</span>
          <span className="meta-item">{meeting.duration} min</span>
        </div>
        {meeting.notes && <div className="text-muted" style={{marginTop:"0.4rem"}}>📝 {meeting.notes}</div>}
      </div>
      <span className={`badge badge-${meeting.status === "upcoming" ? "upcoming" : "done"}`}>{meeting.status}</span>
    </div>
  );
}