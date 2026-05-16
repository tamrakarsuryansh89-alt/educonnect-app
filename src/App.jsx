import { useState, useEffect, useRef } from "react";

// ─── Subject → Tutor Mapping (expanded) ──────────────────────────────────────
const SUBJECT_TUTORS = {
  Mathematics: { emoji: "📐", color: "#4f8ef7" },
  Physics: { emoji: "⚛️", color: "#7c3aed" },
  Chemistry: { emoji: "🧪", color: "#10b981" },
  Biology: { emoji: "🧬", color: "#ec4899" },
  "Computer Science": { emoji: "💻", color: "#f59e0b" },
  English: { emoji: "📖", color: "#06b6d4" },
  History: { emoji: "🏛️", color: "#f97316" },
  Geography: { emoji: "🌍", color: "#84cc16" },
  Economics: { emoji: "📊", color: "#a855f7" },
  "Political Science": { emoji: "⚖️", color: "#ef4444" },
};

const ALL_SUBJECTS = Object.keys(SUBJECT_TUTORS);

// ─── Mock Database ────────────────────────────────────────────────────────────
const MOCK_DB = {
  students: [
    { id: "s1", name: "Rahul Sharma", email: "rahul@student.com", password: "pass123", subject: "Mathematics", tutor: "t1", meetings: [], progress: 72, streak: 5, rating: null },
    { id: "s2", name: "Priya Patel", email: "priya@student.com", password: "pass123", subject: "Chemistry", tutor: "t3", meetings: [], progress: 58, streak: 3, rating: null },
    { id: "s3", name: "Arjun Singh", email: "arjun@student.com", password: "pass123", subject: "Computer Science", tutor: "t5", meetings: [], progress: 85, streak: 9, rating: null },
  ],
  tutors: [
    { id: "t1", name: "Dr. Amit Kumar", email: "amit@tutor.com", password: "tutor123", subjects: ["Mathematics", "Physics"], students: ["s1"], bio: "IIT Delhi alumni, 8 years experience", rating: 4.8, sessions: 142 },
    { id: "t2", name: "Prof. Sunita Verma", email: "sunita@tutor.com", password: "tutor123", subjects: ["Physics", "Mathematics"], students: ["s2"], bio: "PhD Physics, specializing in JEE prep", rating: 4.6, sessions: 98 },
    { id: "t3", name: "Dr. Neha Gupta", email: "neha@tutor.com", password: "tutor123", subjects: ["Chemistry", "Biology"], students: ["s3"], bio: "AIIMS graduate, NEET expert", rating: 4.9, sessions: 210 },
    { id: "t4", name: "Ms. Kavya Reddy", email: "kavya@tutor.com", password: "tutor123", subjects: ["Biology", "Chemistry"], students: [], bio: "MSc Biology, 5 years coaching experience", rating: 4.7, sessions: 76 },
    { id: "t5", name: "Mr. Rohan Malhotra", email: "rohan@tutor.com", password: "tutor123", subjects: ["Computer Science", "Mathematics"], students: [], bio: "Google SWE, BTech IIT Bombay", rating: 4.9, sessions: 134 },
    { id: "t6", name: "Ms. Anjali Sharma", email: "anjali@tutor.com", password: "tutor123", subjects: ["English", "History"], students: [], bio: "MA English Literature, Oxford", rating: 4.5, sessions: 88 },
    { id: "t7", name: "Mr. Vikram Nair", email: "vikram@tutor.com", password: "tutor123", subjects: ["History", "Geography", "Political Science"], students: [], bio: "UPSC cleared, 10 yrs humanities exp", rating: 4.6, sessions: 165 },
    { id: "t8", name: "Dr. Pooja Joshi", email: "pooja@tutor.com", password: "tutor123", subjects: ["Economics", "Political Science"], students: [], bio: "PhD Economics, ex-RBI researcher", rating: 4.8, sessions: 92 },
    { id: "t9", name: "Mr. Sanjay Mehta", email: "sanjay@tutor.com", password: "tutor123", subjects: ["Geography", "Economics"], students: [], bio: "MSc Geography, specializes in UPSC maps", rating: 4.4, sessions: 54 },
  ],
  meetings: [
    { id: "m1", tutorId: "t1", studentId: "s1", studentName: "Rahul Sharma", subject: "Algebra Basics", date: "2026-05-18", time: "16:00", duration: "60", status: "upcoming", notes: "Chapter 3 revision", seen: false },
    { id: "m2", tutorId: "t3", studentId: "s2", studentName: "Priya Patel", subject: "Organic Chemistry", date: "2026-05-19", time: "17:00", duration: "45", status: "upcoming", notes: "Reactions & Mechanisms", seen: false },
    { id: "m3", tutorId: "t5", studentId: "s3", studentName: "Arjun Singh", subject: "Data Structures", date: "2026-05-20", time: "15:00", duration: "90", status: "upcoming", notes: "Trees and Graphs", seen: false },
    { id: "m4", tutorId: "t1", studentId: "s1", studentName: "Rahul Sharma", subject: "Calculus Intro", date: "2026-04-20", time: "16:00", duration: "60", status: "completed", notes: "Done", seen: true },
  ],
  announcements: [
    { id: "a1", title: "Summer Batch Starting June 1!", body: "Register now for intensive 3-month courses in all subjects.", date: "2026-05-14", important: true },
    { id: "a2", title: "New Tutors Added", body: "We've added Geography, Economics, and Political Science specialists.", date: "2026-05-10", important: false },
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
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    msg: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    trending: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    fire: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    announce: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  };
  return icons[name] || null;
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #07090f;
    --surface: #0f1623;
    --surface2: #161f30;
    --surface3: #1c2840;
    --border: #1e2d47;
    --border2: #243551;
    --accent: #4f8ef7;
    --accent2: #7c3aed;
    --gold: #f59e0b;
    --green: #10b981;
    --red: #ef4444;
    --pink: #ec4899;
    --cyan: #06b6d4;
    --text: #e2e8f0;
    --muted: #5a7090;
    --muted2: #8099b8;
    --font: 'Sora', sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --r: 14px;
    --r-lg: 20px;
  }
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }
  .app { min-height: 100vh; }

  /* LANDING */
  .landing { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; padding:2rem; }
  .landing::before { content:''; position:fixed; inset:0; background:radial-gradient(ellipse 80% 60% at 50% -10%,#1e3a6e55,transparent),radial-gradient(ellipse 50% 40% at 80% 80%,#4f8ef715,transparent),radial-gradient(ellipse 40% 60% at 10% 60%,#7c3aed0c,transparent); pointer-events:none; }
  .grid-bg { position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(#1f2d4528 1px,transparent 1px),linear-gradient(90deg,#1f2d4528 1px,transparent 1px);background-size:52px 52px;mask-image:radial-gradient(ellipse 90% 80% at 50% 50%,black 30%,transparent 100%); }
  .logo-badge { display:flex;align-items:center;gap:10px;background:#ffffff08;border:1px solid #ffffff12;padding:8px 18px;border-radius:100px;font-size:13px;color:var(--accent);letter-spacing:.05em;margin-bottom:2rem;backdrop-filter:blur(10px); }
  .logo-dot { width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent);animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:.3;} }
  .landing h1 { font-size:clamp(2.4rem,6vw,5rem);font-weight:800;text-align:center;line-height:1.08;letter-spacing:-.03em;margin-bottom:1.5rem; }
  .landing h1 span { background:linear-gradient(135deg,#4f8ef7,#7c3aed 50%,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent; }
  .landing > p { color:var(--muted2);font-size:1.05rem;text-align:center;max-width:480px;line-height:1.7;margin-bottom:3rem; }
  .portal-cards { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:860px;width:100%; }
  @media(max-width:640px){.portal-cards{grid-template-columns:1fr;}}
  .portal-card { background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:2rem;cursor:pointer;transition:all .3s ease;position:relative;overflow:hidden;text-align:center; }
  .portal-card::after { content:'';position:absolute;inset:0;background:var(--card-glow,transparent);opacity:0;transition:opacity .3s;border-radius:var(--r-lg); }
  .portal-card:hover { transform:translateY(-8px);border-color:var(--card-color);box-shadow:0 24px 60px -10px var(--card-shadow); }
  .portal-card:hover::after { opacity:1; }
  .card-icon { width:60px;height:60px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 1.2rem;font-size:1.8rem; }
  .portal-card h3 { font-size:1.15rem;font-weight:700;margin-bottom:.5rem; }
  .portal-card p { color:var(--muted2);font-size:.85rem;line-height:1.55; }
  .card-arrow { margin-top:1.2rem;color:var(--muted);font-size:.85rem;transition:color .3s; }
  .portal-card:hover .card-arrow { color:var(--card-color); }

  /* AUTH */
  .auth-wrap { min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;position:relative; }
  .auth-card { background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:2.5rem;width:100%;max-width:440px;position:relative;z-index:1; }
  .auth-back { position:absolute;top:2rem;left:2rem;background:#ffffff08;border:1px solid var(--border);color:var(--muted2);padding:8px 16px;border-radius:100px;cursor:pointer;font-size:13px;transition:all .2s;font-family:var(--font); }
  .auth-back:hover { color:var(--text);border-color:var(--accent); }
  .auth-header { text-align:center;margin-bottom:2rem; }
  .auth-icon { font-size:2.5rem;margin-bottom:.8rem; }
  .auth-header h2 { font-size:1.6rem;font-weight:700;margin-bottom:.3rem; }
  .auth-header p { color:var(--muted2);font-size:.9rem; }
  .tabs { display:flex;background:var(--bg);border-radius:10px;padding:4px;margin-bottom:1.5rem; }
  .tab { flex:1;padding:9px;text-align:center;border-radius:8px;cursor:pointer;font-size:.88rem;color:var(--muted);transition:all .2s;border:none;background:none;font-family:var(--font);font-weight:500; }
  .tab.active { background:var(--surface2);color:var(--text); }
  label { display:block;font-size:.82rem;color:var(--muted2);margin-bottom:.35rem;font-weight:500;letter-spacing:.01em; }
  input,select,textarea { width:100%;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-size:.9rem;font-family:var(--font);transition:border-color .2s;outline:none;margin-bottom:1rem; }
  input:focus,select:focus,textarea:focus { border-color:var(--accent);box-shadow:0 0 0 3px #4f8ef715; }
  select option { background:var(--surface); }
  .btn { width:100%;padding:12px;border-radius:12px;border:none;font-weight:600;font-size:.92rem;cursor:pointer;font-family:var(--font);transition:all .2s;letter-spacing:.01em; }
  .btn-primary { background:linear-gradient(135deg,#4f8ef7,#7c3aed);color:white; }
  .btn-primary:hover { opacity:.88;transform:translateY(-1px);box-shadow:0 8px 24px #4f8ef740; }
  .btn-danger { background:var(--red);color:white;width:auto;padding:7px 14px;font-size:.82rem;border-radius:8px; }
  .btn-sm { width:auto;padding:8px 16px;font-size:.85rem;border-radius:9px; }
  .btn-green { background:var(--green);color:white; }
  .btn-ghost { background:transparent;border:1px solid var(--border);color:var(--muted2); }
  .btn-ghost:hover { border-color:var(--accent);color:var(--text); }
  .err { color:var(--red);font-size:.84rem;margin-bottom:1rem;text-align:center;background:#ef444415;padding:8px 12px;border-radius:8px;border:1px solid #ef444430; }
  .success { color:var(--green);font-size:.84rem;margin-bottom:1rem;text-align:center;background:#10b98115;padding:8px 12px;border-radius:8px; }

  /* DASHBOARD */
  .dashboard { display:flex;min-height:100vh; }
  .sidebar { width:230px;background:var(--surface);border-right:1px solid var(--border);padding:1.4rem;display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh;overflow-y:auto; }
  .sidebar-logo { font-weight:800;font-size:1.15rem;margin-bottom:2rem;display:flex;align-items:center;gap:9px; }
  .sidebar-logo .dot { width:8px;height:8px;background:var(--accent);border-radius:50%;box-shadow:0 0 10px var(--accent); }
  .nav-section { font-size:.68rem;color:var(--muted);letter-spacing:.12em;text-transform:uppercase;margin:1.2rem 0 .4rem;padding-left:4px; }
  .nav-item { display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:10px;cursor:pointer;color:var(--muted2);font-size:.87rem;transition:all .2s;margin-bottom:1px;border:none;background:none;width:100%;font-family:var(--font);font-weight:500;text-align:left; }
  .nav-item:hover { background:var(--surface2);color:var(--text); }
  .nav-item.active { background:#4f8ef718;color:var(--accent); }
  .sidebar-footer { margin-top:auto;padding-top:1rem;border-top:1px solid var(--border); }
  .main { flex:1;padding:2rem;overflow-y:auto;min-width:0; }
  .page-header { margin-bottom:2rem; }
  .page-header h1 { font-size:1.55rem;font-weight:700;letter-spacing:-.02em; }
  .page-header p { color:var(--muted2);font-size:.87rem;margin-top:.3rem; }

  /* STATS */
  .stats-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1rem;margin-bottom:1.5rem; }
  .stat-card { background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:1.3rem;transition:border-color .2s; }
  .stat-card:hover { border-color:var(--border2); }
  .stat-label { color:var(--muted2);font-size:.76rem;font-weight:500;margin-bottom:.4rem;letter-spacing:.02em; }
  .stat-value { font-size:1.9rem;font-weight:800;font-family:var(--mono); }
  .stat-sub { color:var(--muted);font-size:.74rem;margin-top:.3rem; }

  /* CARDS */
  .card { background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:1.4rem;margin-bottom:1.4rem; }
  .card h3 { font-size:.95rem;font-weight:600;margin-bottom:1.1rem;color:var(--text); }
  .card-row { display:grid;grid-template-columns:1fr 1fr;gap:1.4rem;margin-bottom:1.4rem; }
  @media(max-width:640px){.card-row{grid-template-columns:1fr;}}

  /* MEETING CARDS */
  .meeting-card { background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:1.1rem;margin-bottom:.9rem;display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;transition:all .2s; }
  .meeting-card:hover { border-color:var(--border2);background:var(--surface3); }
  .meeting-info { flex:1;min-width:0; }
  .meeting-subject { font-weight:600;font-size:.92rem;margin-bottom:.45rem; }
  .meeting-meta { display:flex;gap:.8rem;flex-wrap:wrap; }
  .meta-item { display:flex;align-items:center;gap:4px;color:var(--muted2);font-size:.79rem; }
  .badge { padding:3px 9px;border-radius:100px;font-size:.72rem;font-weight:600;display:inline-flex;align-items:center;gap:4px; }
  .badge-upcoming { background:#4f8ef720;color:var(--accent); }
  .badge-done { background:#10b98120;color:var(--green); }
  .badge-cancelled { background:#ef444420;color:var(--red); }
  .badge-student { background:#7c3aed20;color:#a78bfa; }
  .badge-tutor { background:#f59e0b20;color:var(--gold); }
  .badge-admin { background:#ef444420;color:var(--red); }
  .badge-hot { background:#ef444420;color:var(--red); }

  /* TABLE */
  table { width:100%;border-collapse:collapse; }
  th { text-align:left;padding:9px 12px;font-size:.73rem;color:var(--muted2);font-weight:600;letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--border); }
  td { padding:11px 12px;font-size:.87rem;border-bottom:1px solid #ffffff06; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:#ffffff03; }
  .avatar { width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.82rem;flex-shrink:0; }
  .user-row { display:flex;align-items:center;gap:9px; }

  /* FORM */
  .form-grid { display:grid;grid-template-columns:1fr 1fr;gap:0 1rem; }
  @media(max-width:640px){.form-grid{grid-template-columns:1fr;}}
  .form-actions { display:flex;gap:.8rem;justify-content:flex-end;margin-top:.5rem; }

  /* TIMELINE */
  .timeline { position:relative;padding-left:1.4rem; }
  .timeline::before { content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--border); }
  .tl-item { position:relative;margin-bottom:1.4rem; }
  .tl-dot { position:absolute;left:-1.78rem;top:4px;width:11px;height:11px;border-radius:50%;background:var(--accent);border:2px solid var(--bg);box-shadow:0 0 8px var(--accent); }
  .tl-time { font-family:var(--mono);font-size:.77rem;color:var(--accent);margin-bottom:.25rem; }
  .tl-title { font-weight:600;font-size:.92rem; }
  .tl-sub { color:var(--muted2);font-size:.79rem;margin-top:.2rem; }

  /* MODAL / POPUP */
  .modal-overlay { position:fixed;inset:0;background:#000000aa;backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn .2s ease; }
  @keyframes fadeIn { from{opacity:0;}to{opacity:1;} }
  .modal { background:var(--surface);border:1px solid var(--border2);border-radius:24px;padding:2rem;width:100%;max-width:500px;animation:slideUp .25s ease;position:relative; }
  @keyframes slideUp { from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;} }
  .modal h3 { font-size:1.15rem;font-weight:700;margin-bottom:1.3rem; }
  .modal-footer { display:flex;gap:.8rem;justify-content:flex-end;margin-top:1.2rem; }
  .close-btn { position:absolute;top:1rem;right:1rem;background:var(--surface2);border:1px solid var(--border);color:var(--muted2);cursor:pointer;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;transition:all .2s; }
  .close-btn:hover { color:var(--text);border-color:var(--accent); }

  /* SESSION REMINDER POPUP */
  .reminder-popup { position:fixed;top:1.5rem;right:1.5rem;z-index:300;display:flex;flex-direction:column;gap:.7rem;max-width:340px; }
  .reminder-card { background:var(--surface);border:1px solid var(--accent);border-radius:16px;padding:1.1rem;box-shadow:0 8px 32px #4f8ef730;animation:slideIn .35s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden; }
  .reminder-card::before { content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2)); }
  @keyframes slideIn { from{transform:translateX(120%);opacity:0;}to{transform:translateX(0);opacity:1;} }
  .reminder-title { font-weight:700;font-size:.9rem;margin-bottom:.3rem;color:var(--accent); }
  .reminder-body { font-size:.82rem;color:var(--muted2);line-height:1.5; }
  .reminder-dismiss { position:absolute;top:.6rem;right:.6rem;background:none;border:none;color:var(--muted);cursor:pointer;padding:4px;border-radius:6px;display:flex;align-items:center;justify-content:center; }
  .reminder-dismiss:hover { color:var(--text); }

  /* PROGRESS BAR */
  .progress-bar-wrap { background:var(--bg);border-radius:100px;height:8px;overflow:hidden; }
  .progress-bar { height:100%;border-radius:100px;transition:width .5s ease; }

  /* TUTOR BROWSE */
  .tutor-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem; }
  .tutor-browse-card { background:var(--surface2);border:1px solid var(--border);border-radius:var(--r);padding:1.2rem;transition:all .2s;cursor:default; }
  .tutor-browse-card:hover { border-color:var(--border2);transform:translateY(-2px); }
  .tutor-rating { display:flex;align-items:center;gap:3px;color:var(--gold);font-size:.82rem;font-weight:600; }
  .stars { display:flex;gap:1px; }

  /* STREAK */
  .streak-badge { display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,#f97316,#ef4444);color:white;padding:5px 12px;border-radius:100px;font-size:.82rem;font-weight:700;box-shadow:0 4px 16px #ef444440; }

  /* ANNOUNCEMENT */
  .announcement-card { border-left:3px solid var(--accent);background:var(--surface2);border-radius:0 var(--r) var(--r) 0;padding:1rem 1.2rem;margin-bottom:.8rem; }
  .announcement-card.important { border-left-color:var(--gold); }
  .announcement-title { font-weight:600;font-size:.9rem;margin-bottom:.25rem; }
  .announcement-body { color:var(--muted2);font-size:.82rem;line-height:1.5; }
  .announcement-date { color:var(--muted);font-size:.75rem;margin-top:.4rem; }

  /* MISC */
  .divider { height:1px;background:var(--border);margin:1.2rem 0; }
  .empty { text-align:center;padding:2.5rem;color:var(--muted2); }
  .empty-icon { font-size:2.2rem;margin-bottom:.6rem; }
  .mt1 { margin-top:1rem; }
  .flex { display:flex; }
  .gap { gap:.8rem; }
  .items-center { align-items:center; }
  .justify-between { justify-content:space-between; }
  .text-muted { color:var(--muted2);font-size:.84rem; }
  .notif-dot { width:8px;height:8px;border-radius:50%;background:var(--red);display:inline-block;margin-left:4px;box-shadow:0 0 6px var(--red); }

  @media(max-width:768px){
    .sidebar { width:58px;padding:.9rem .7rem; }
    .sidebar-logo span,.nav-section,.nav-item span,.sidebar-footer span { display:none; }
    .sidebar-logo { justify-content:center; }
    .nav-item { justify-content:center; }
    .main { padding:1.2rem .9rem; }
  }

  /* Search input */
  .search-wrap { position:relative;margin-bottom:1.2rem; }
  .search-wrap input { padding-left:38px;margin-bottom:0; }
  .search-icon { position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none; }

  /* Rating stars */
  .star-input { display:flex;gap:4px;margin-bottom:1rem; }
  .star-input button { background:none;border:none;cursor:pointer;font-size:1.4rem;padding:2px;transition:transform .1s; }
  .star-input button:hover { transform:scale(1.2); }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRatingStars(r) {
  return "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
}
function getSubjectTutors(subject, tutors) {
  return tutors.filter(t => t.subjects.includes(subject));
}
function getDaysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

// ─── Session Reminder Popup ───────────────────────────────────────────────────
function SessionReminders({ meetings, userId, role, onDismiss }) {
  const [shown, setShown] = useState([]);

  useEffect(() => {
    const upcoming = meetings.filter(m => {
      if (m.seen) return false;
      if (role === "student" && m.studentId !== userId) return false;
      if (role === "tutor" && m.tutorId !== userId) return false;
      if (m.status !== "upcoming") return false;
      const days = getDaysUntil(m.date);
      return days >= 0 && days <= 3;
    });
    setShown(upcoming);
  }, [meetings, userId, role]);

  if (!shown.length) return null;

  return (
    <div className="reminder-popup">
      {shown.map(m => {
        const days = getDaysUntil(m.date);
        return (
          <div className="reminder-card" key={m.id}>
            <div className="reminder-title">
              🔔 {days === 0 ? "Session TODAY!" : days === 1 ? "Session Tomorrow!" : `Session in ${days} days`}
            </div>
            <div className="reminder-body">
              <strong>{m.subject}</strong><br />
              📅 {m.date} at {m.time} · {m.duration} min
              {m.notes ? <><br />📝 {m.notes}</> : null}
            </div>
            <button className="reminder-dismiss" onClick={() => { onDismiss(m.id); setShown(p => p.filter(x => x.id !== m.id)); }}>
              <Icon name="close" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function EduConnect() {
  const [db, setDb] = useState(MOCK_DB);
  const [screen, setScreen] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = (user, role) => { setCurrentUser(user); setUserRole(role); setScreen(role + "Dash"); };
  const logout = () => { setCurrentUser(null); setUserRole(null); setScreen("landing"); };

  const addMeeting = (meeting) => {
    const newMeeting = { ...meeting, id: "m" + Date.now(), status: "upcoming", seen: false };
    setDb(prev => ({ ...prev, meetings: [...prev.meetings, newMeeting] }));
  };

  const deleteMeeting = (id) => setDb(prev => ({ ...prev, meetings: prev.meetings.filter(m => m.id !== id) }));

  const markMeetingComplete = (id) => {
    setDb(prev => ({ ...prev, meetings: prev.meetings.map(m => m.id === id ? { ...m, status: "completed" } : m) }));
  };

  const dismissReminder = (id) => {
    setDb(prev => ({ ...prev, meetings: prev.meetings.map(m => m.id === id ? { ...m, seen: true } : m) }));
  };

  const registerStudent = (data) => {
    const newStudent = { ...data, id: "s" + Date.now(), meetings: [], progress: 0, streak: 0 };
    setDb(prev => ({ ...prev, students: [...prev.students, newStudent] }));
    return newStudent;
  };

  const registerTutor = (data) => {
    const newTutor = { ...data, id: "t" + Date.now(), students: [], meetings: [], rating: 5.0, sessions: 0 };
    setDb(prev => ({ ...prev, tutors: [...prev.tutors, newTutor] }));
    return newTutor;
  };

  const addAnnouncement = (ann) => {
    setDb(prev => ({ ...prev, announcements: [{ ...ann, id: "a" + Date.now(), date: new Date().toISOString().slice(0, 10) }, ...prev.announcements] }));
  };

  const rateSession = (meetingId, rating) => {
    setDb(prev => ({ ...prev, meetings: prev.meetings.map(m => m.id === meetingId ? { ...m, rating } : m) }));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {screen === "landing" && <Landing onSelect={s => setScreen(s)} />}
        {screen === "studentAuth" && <StudentAuth db={db} onLogin={login} onRegister={registerStudent} onBack={() => setScreen("landing")} />}
        {screen === "tutorAuth" && <TutorAuth db={db} onLogin={login} onRegister={registerTutor} onBack={() => setScreen("landing")} />}
        {screen === "adminAuth" && <AdminAuth db={db} onLogin={login} onBack={() => setScreen("landing")} />}
        {screen === "studentDash" && (
          <>
            <SessionReminders meetings={db.meetings} userId={currentUser.id} role="student" onDismiss={dismissReminder} />
            <StudentDashboard user={currentUser} db={db} onLogout={logout} onRate={rateSession} />
          </>
        )}
        {screen === "tutorDash" && (
          <>
            <SessionReminders meetings={db.meetings} userId={currentUser.id} role="tutor" onDismiss={dismissReminder} />
            <TutorDashboard user={currentUser} db={db} onLogout={logout} onAddMeeting={addMeeting} onDeleteMeeting={deleteMeeting} onMarkComplete={markMeetingComplete} />
          </>
        )}
        {screen === "adminDash" && (
          <AdminDashboard user={currentUser} db={db} onLogout={logout} onDeleteMeeting={deleteMeeting} onAddMeeting={addMeeting} onMarkComplete={markMeetingComplete} onAddAnnouncement={addAnnouncement} />
        )}
      </div>
    </>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────
function Landing({ onSelect }) {
  return (
    <div className="landing">
      <div className="grid-bg" />
      <div className="logo-badge"><div className="logo-dot" /><span>EduConnect Platform v2</span></div>
      <h1>Smart Learning,<br /><span>Smarter Connections</span></h1>
      <p>Connect students with expert tutors across all subjects. Schedule sessions, track progress, and grow together.</p>
      <div className="portal-cards">
        {[
          { key:"studentAuth", icon:"📚", title:"Student Portal", desc:"Access your schedule, browse tutors, track your learning journey.", color:"#4f8ef7", shadow:"#4f8ef730", glow:"radial-gradient(circle at 50% 0%,#4f8ef712,transparent 70%)" },
          { key:"tutorAuth", icon:"🎓", title:"Tutor Portal", desc:"Manage students, schedule sessions, and deliver impactful teaching.", color:"#f59e0b", shadow:"#f59e0b30", glow:"radial-gradient(circle at 50% 0%,#f59e0b10,transparent 70%)" },
          { key:"adminAuth", icon:"⚙️", title:"Admin Panel", desc:"Full control over users, sessions, announcements, and analytics.", color:"#ef4444", shadow:"#ef444430", glow:"radial-gradient(circle at 50% 0%,#ef444410,transparent 70%)" },
        ].map(c => (
          <div key={c.key} className="portal-card" style={{"--card-color":c.color,"--card-shadow":c.shadow,"--card-glow":c.glow}} onClick={() => onSelect(c.key)}>
            <div className="card-icon" style={{background:c.color+"20"}}>{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <div className="card-arrow">Enter as {c.title.split(" ")[0]} →</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:"2.5rem",color:"var(--muted)",fontSize:"0.77rem",textAlign:"center",lineHeight:1.8}}>
        Demo credentials &nbsp;|&nbsp; Admin: admin@educonnect.com / admin@123<br/>
        Student: rahul@student.com / pass123 &nbsp;|&nbsp; Tutor: amit@tutor.com / tutor123
      </div>
    </div>
  );
}

// ─── Student Auth ─────────────────────────────────────────────────────────────
function StudentAuth({ db, onLogin, onRegister, onBack }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", subject:"" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = () => {
    const u = db.students.find(s => s.email === form.email && s.password === form.password);
    if (!u) return setErr("Invalid credentials. Try rahul@student.com / pass123");
    onLogin(u, "student");
  };
  const handleRegister = () => {
    if (!form.name||!form.email||!form.password||!form.subject) return setErr("All fields required");
    if (db.students.find(s=>s.email===form.email)) return setErr("Email already registered");
    const u = onRegister({ name:form.name, email:form.email, password:form.password, subject:form.subject, tutor:null });
    onLogin(u, "student");
  };

  return (
    <div className="auth-wrap">
      <div className="grid-bg" />
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-header"><div className="auth-icon">📚</div><h2>Student Portal</h2><p>Login or create your account</p></div>
        <div className="tabs">
          <button className={`tab ${tab==="login"?"active":""}`} onClick={()=>{setTab("login");setErr("");}}>Login</button>
          <button className={`tab ${tab==="register"?"active":""}`} onClick={()=>{setTab("register");setErr("");}}>Register</button>
        </div>
        {err && <div className="err">{err}</div>}
        {tab==="register" && <><label>Full Name</label><input placeholder="Rahul Sharma" value={form.name} onChange={set("name")} /></>}
        <label>Email</label><input type="email" placeholder="student@email.com" value={form.email} onChange={set("email")} />
        <label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        {tab==="register" && (
          <><label>Primary Subject</label>
          <select value={form.subject} onChange={set("subject")}>
            <option value="">Select subject</option>
            {ALL_SUBJECTS.map(s=><option key={s}>{s}</option>)}
          </select></>
        )}
        <button className="btn btn-primary" onClick={tab==="login"?handleLogin:handleRegister}>
          {tab==="login"?"Login to Dashboard":"Create Account"}
        </button>
      </div>
    </div>
  );
}

// ─── Tutor Auth ───────────────────────────────────────────────────────────────
function TutorAuth({ db, onLogin, onRegister, onBack }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", subjects:"", bio:"" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = () => {
    const u = db.tutors.find(t=>t.email===form.email&&t.password===form.password);
    if (!u) return setErr("Invalid credentials. Try amit@tutor.com / tutor123");
    onLogin(u, "tutor");
  };
  const handleRegister = () => {
    if (!form.name||!form.email||!form.password) return setErr("All fields required");
    if (db.tutors.find(t=>t.email===form.email)) return setErr("Email already registered");
    const u = onRegister({ name:form.name, email:form.email, password:form.password, subjects:form.subjects.split(",").map(s=>s.trim()).filter(Boolean), bio:form.bio });
    onLogin(u, "tutor");
  };

  return (
    <div className="auth-wrap">
      <div className="grid-bg" />
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-header"><div className="auth-icon">🎓</div><h2>Tutor Portal</h2><p>Login or register as a tutor</p></div>
        <div className="tabs">
          <button className={`tab ${tab==="login"?"active":""}`} onClick={()=>{setTab("login");setErr("");}}>Login</button>
          <button className={`tab ${tab==="register"?"active":""}`} onClick={()=>{setTab("register");setErr("");}}>Register</button>
        </div>
        {err && <div className="err">{err}</div>}
        {tab==="register" && <><label>Full Name</label><input placeholder="Dr. Sharma" value={form.name} onChange={set("name")} /></>}
        <label>Email</label><input type="email" placeholder="tutor@email.com" value={form.email} onChange={set("email")} />
        <label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
        {tab==="register" && <>
          <label>Subjects (comma separated)</label>
          <input placeholder="Mathematics, Physics" value={form.subjects} onChange={set("subjects")} />
          <label>Short Bio</label>
          <input placeholder="IIT alumni, 5 years experience..." value={form.bio} onChange={set("bio")} />
        </>}
        <button className="btn btn-primary" onClick={tab==="login"?handleLogin:handleRegister}>
          {tab==="login"?"Login to Dashboard":"Create Account"}
        </button>
      </div>
    </div>
  );
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────
function AdminAuth({ db, onLogin, onBack }) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const handleLogin = () => {
    if (form.email===db.admin.email&&form.password===db.admin.password) onLogin({name:"Admin",email:form.email},"admin");
    else setErr("Invalid admin credentials.");
  };
  return (
    <div className="auth-wrap">
      <div className="grid-bg" />
      <button className="auth-back" onClick={onBack}>← Back</button>
      <div className="auth-card">
        <div className="auth-header"><div className="auth-icon">⚙️</div><h2>Admin Panel</h2><p>Restricted access — Admins only</p></div>
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
function StudentDashboard({ user, db, onLogout, onRate }) {
  const [nav, setNav] = useState("home");
  const myMeetings = db.meetings.filter(m=>m.studentId===user.id);
  const myTutor = db.tutors.find(t=>t.id===user.tutor);
  const upcoming = myMeetings.filter(m=>m.status==="upcoming");
  const unread = myMeetings.filter(m=>!m.seen&&m.status==="upcoming").length;

  const NavItem = ({id,icon,label,badge}) => (
    <button className={`nav-item ${nav===id?"active":""}`} onClick={()=>setNav(id)}>
      <Icon name={icon} size={17} />
      <span>{label}</span>
      {badge>0 && <span className="notif-dot" />}
    </button>
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="dot" /><span>EduConnect</span></div>
        <div className="nav-section"><span>Menu</span></div>
        <NavItem id="home" icon="home" label="Dashboard" badge={unread} />
        <NavItem id="schedule" icon="calendar" label="My Schedule" />
        <NavItem id="tutors" icon="users" label="Browse Tutors" />
        <NavItem id="tutor" icon="user" label="My Tutor" />
        <NavItem id="progress" icon="trending" label="Progress" />
        <div className="sidebar-footer">
          <div style={{marginBottom:".7rem",display:"flex",alignItems:"center",gap:"8px"}}>
            <div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{user.name[0]}</div>
            <span style={{fontSize:".84rem",fontWeight:"600"}}>{user.name.split(" ")[0]}</span>
          </div>
          <button className="nav-item" onClick={onLogout}><Icon name="logout" size={17} /><span>Logout</span></button>
        </div>
      </aside>
      <main className="main">
        {nav==="home" && <StudentHome user={user} meetings={myMeetings} upcoming={upcoming} tutor={myTutor} announcements={db.announcements} />}
        {nav==="schedule" && <StudentSchedule meetings={myMeetings} onRate={onRate} />}
        {nav==="tutors" && <BrowseTutors subject={user.subject} allTutors={db.tutors} />}
        {nav==="tutor" && <StudentTutorView tutor={myTutor} />}
        {nav==="progress" && <StudentProgress user={user} meetings={myMeetings} />}
      </main>
    </div>
  );
}

function StudentHome({ user, meetings, upcoming, tutor, announcements }) {
  const completed = meetings.filter(m=>m.status==="completed");
  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>Welcome back, {user.name.split(" ")[0]} 👋</h1>
            <p>Here's your learning overview</p>
          </div>
          {user.streak>0 && <div className="streak-badge"><Icon name="fire" size={14}/> {user.streak} day streak</div>}
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Upcoming Sessions</div><div className="stat-value" style={{color:"var(--accent)"}}>{upcoming.length}</div><div className="stat-sub">Scheduled</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value" style={{color:"var(--green)"}}>{completed.length}</div><div className="stat-sub">All time</div></div>
        <div className="stat-card"><div className="stat-label">Progress</div><div className="stat-value" style={{color:"var(--gold)"}}>{user.progress||0}%</div><div className="stat-sub">Course completion</div></div>
        <div className="stat-card"><div className="stat-label">My Tutor</div><div className="stat-value" style={{fontSize:"1rem",paddingTop:".3rem"}}>{tutor?tutor.name.split(" ").slice(-1)[0]:"None"}</div><div className="stat-sub">{tutor?"Active":"-"}</div></div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{marginBottom:"1.4rem"}}>
        <div className="flex items-center justify-between" style={{marginBottom:".7rem"}}>
          <h3 style={{margin:0}}>📈 Course Progress</h3>
          <span style={{fontFamily:"var(--mono)",fontSize:".85rem",color:"var(--accent)"}}>{user.progress||0}%</span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{width:`${user.progress||0}%`,background:"linear-gradient(90deg,var(--accent),var(--accent2))"}} />
        </div>
        <div className="text-muted" style={{marginTop:".5rem"}}>Subject: {user.subject}</div>
      </div>

      {/* Announcements */}
      {announcements.length>0 && (
        <div className="card">
          <h3>📣 Announcements</h3>
          {announcements.slice(0,2).map(a=>(
            <div key={a.id} className={`announcement-card ${a.important?"important":""}`}>
              <div className="announcement-title">{a.important&&"⭐ "}{a.title}</div>
              <div className="announcement-body">{a.body}</div>
              <div className="announcement-date">{a.date}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3>📅 Upcoming Sessions</h3>
        {upcoming.length===0
          ? <div className="empty"><div className="empty-icon">📭</div><div>No upcoming sessions scheduled</div></div>
          : upcoming.map(m=><MeetingCard key={m.id} meeting={m} />)}
      </div>
    </>
  );
}

function StudentSchedule({ meetings, onRate }) {
  const [ratingModal, setRatingModal] = useState(null);
  const [rating, setRating] = useState(0);
  const sorted = [...meetings].sort((a,b)=>new Date(a.date)-new Date(b.date));

  return (
    <>
      <div className="page-header"><h1>My Schedule 📅</h1><p>All your tutoring sessions</p></div>
      <div className="card">
        {sorted.length===0
          ? <div className="empty"><div className="empty-icon">📭</div><div>No sessions yet</div></div>
          : <div className="timeline">
              {sorted.map(m=>(
                <div className="tl-item" key={m.id}>
                  <div className="tl-dot" style={{background:m.status==="completed"?"var(--green)":"var(--accent)"}} />
                  <div className="tl-time">{m.date} · {m.time}</div>
                  <div className="tl-title">{m.subject}</div>
                  <div className="tl-sub" style={{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"}}>
                    {m.duration} min &nbsp;·&nbsp;
                    <span className={`badge badge-${m.status==="upcoming"?"upcoming":m.status==="completed"?"done":"cancelled"}`}>{m.status}</span>
                    {m.status==="completed" && !m.rating && (
                      <button className="btn btn-ghost btn-sm" style={{padding:"3px 10px",fontSize:".75rem"}} onClick={()=>setRatingModal(m.id)}>Rate ⭐</button>
                    )}
                    {m.rating && <span className="text-muted">Your rating: {m.rating}★</span>}
                  </div>
                  {m.notes && <div className="tl-sub" style={{marginTop:".25rem"}}>📝 {m.notes}</div>}
                </div>
              ))}
            </div>}
      </div>

      {ratingModal && (
        <div className="modal-overlay" onClick={()=>setRatingModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="close-btn" onClick={()=>setRatingModal(null)}><Icon name="close" size={14}/></button>
            <h3>Rate this Session ⭐</h3>
            <p className="text-muted" style={{marginBottom:"1rem"}}>How was your tutoring experience?</p>
            <div className="star-input">
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setRating(n)} style={{color:n<=rating?"var(--gold)":"var(--muted)"}}>★</button>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={()=>setRatingModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={()=>{onRate(ratingModal,rating);setRatingModal(null);setRating(0);}}>Submit Rating</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BrowseTutors({ subject, allTutors }) {
  const [filter, setFilter] = useState(subject||"");
  const [search, setSearch] = useState("");

  const subjects = ["", ...ALL_SUBJECTS];
  const subInfo = SUBJECT_TUTORS;

  const filtered = allTutors.filter(t => {
    const matchSubject = filter ? t.subjects.includes(filter) : true;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some(s=>s.toLowerCase().includes(search.toLowerCase()));
    return matchSubject && matchSearch;
  });

  return (
    <>
      <div className="page-header"><h1>Browse Tutors 🔍</h1><p>Find the right expert for your subject</p></div>

      <div className="card" style={{marginBottom:"1.2rem"}}>
        <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",alignItems:"center"}}>
          <div className="search-wrap" style={{flex:1,minWidth:"200px",marginBottom:0}}>
            <span className="search-icon"><Icon name="search" size={15}/></span>
            <input placeholder="Search tutors or subjects..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:0}} />
          </div>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{width:"auto",marginBottom:0,minWidth:"160px"}}>
            {subjects.map(s=><option key={s} value={s}>{s||"All Subjects"}</option>)}
          </select>
        </div>
      </div>

      {/* Subject tags */}
      <div style={{display:"flex",gap:".5rem",flexWrap:"wrap",marginBottom:"1.2rem"}}>
        {ALL_SUBJECTS.map(s=>(
          <button key={s} onClick={()=>setFilter(f=>f===s?"":s)}
            style={{background:filter===s?(subInfo[s]?.color||"var(--accent)")+"25":"var(--surface2)",
              border:`1px solid ${filter===s?(subInfo[s]?.color||"var(--accent)"):"var(--border)"}`,
              color:filter===s?(subInfo[s]?.color||"var(--accent)"):"var(--muted2)",
              padding:"5px 12px",borderRadius:"100px",fontSize:".78rem",cursor:"pointer",fontFamily:"var(--font)",fontWeight:500,
              transition:"all .2s"}}>
            {subInfo[s]?.emoji} {s}
          </button>
        ))}
      </div>

      <div className="tutor-grid">
        {filtered.length===0
          ? <div className="empty" style={{gridColumn:"1/-1"}}><div className="empty-icon">🔍</div><div>No tutors found</div></div>
          : filtered.map(t=>(
            <div key={t.id} className="tutor-browse-card">
              <div className="flex items-center gap" style={{marginBottom:".8rem"}}>
                <div className="avatar" style={{width:44,height:44,borderRadius:12,background:"#f59e0b20",color:"var(--gold)",fontSize:"1rem",fontWeight:800}}>{t.name[0]}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:".9rem"}}>{t.name}</div>
                  <div className="tutor-rating">
                    <span className="stars">{getRatingStars(t.rating||5)}</span>
                    <span>{t.rating||5}</span>
                  </div>
                </div>
              </div>
              <div style={{marginBottom:".7rem",display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                {t.subjects.map(s=>(
                  <span key={s} className="badge" style={{background:(subInfo[s]?.color||"var(--accent)")+"20",color:subInfo[s]?.color||"var(--accent)"}}>
                    {subInfo[s]?.emoji} {s}
                  </span>
                ))}
              </div>
              {t.bio && <div className="text-muted" style={{fontSize:".78rem",lineHeight:1.5,marginBottom:".6rem"}}>{t.bio}</div>}
              <div className="flex justify-between" style={{fontSize:".77rem",color:"var(--muted)"}}>
                <span>👥 {t.students?.length||0} students</span>
                <span>📋 {t.sessions||0} sessions</span>
              </div>
            </div>
          ))}
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
        <div className="flex items-center gap" style={{marginBottom:"1.4rem"}}>
          <div className="avatar" style={{width:64,height:64,fontSize:"1.5rem",borderRadius:16,background:"#f59e0b20",color:"var(--gold)"}}>{tutor.name[0]}</div>
          <div>
            <div style={{fontWeight:700,fontSize:"1.15rem"}}>{tutor.name}</div>
            <div className="text-muted">{tutor.email}</div>
            <div className="tutor-rating" style={{margin:".3rem 0"}}>
              <span className="stars">{getRatingStars(tutor.rating||5)}</span>
              <span>{tutor.rating||5} rating</span>
            </div>
            <div style={{marginTop:".3rem"}}>{tutor.subjects?.map(s=>(
              <span key={s} className="badge" style={{marginRight:".3rem",background:(SUBJECT_TUTORS[s]?.color||"var(--accent)")+"20",color:SUBJECT_TUTORS[s]?.color||"var(--accent)"}}>{SUBJECT_TUTORS[s]?.emoji} {s}</span>
            ))}</div>
          </div>
        </div>
        {tutor.bio && <div style={{background:"var(--surface2)",borderRadius:"var(--r)",padding:"1rem",marginBottom:"1rem",fontSize:".87rem",color:"var(--muted2)",lineHeight:1.6}}>💬 {tutor.bio}</div>}
        <div className="divider" />
        <div className="flex gap">
          <div className="stat-card" style={{flex:1}}><div className="stat-label">Students</div><div className="stat-value">{tutor.students?.length||0}</div></div>
          <div className="stat-card" style={{flex:1}}><div className="stat-label">Sessions</div><div className="stat-value">{tutor.sessions||0}</div></div>
          <div className="stat-card" style={{flex:1}}><div className="stat-label">Subjects</div><div className="stat-value">{tutor.subjects?.length||0}</div></div>
        </div>
      </div>
    </>
  );
}

function StudentProgress({ user, meetings }) {
  const completed = meetings.filter(m=>m.status==="completed");
  const rated = meetings.filter(m=>m.rating);
  const avgRating = rated.length ? (rated.reduce((a,m)=>a+(m.rating||0),0)/rated.length).toFixed(1) : "—";
  const totalMinutes = completed.reduce((a,m)=>a+parseInt(m.duration||0),0);

  return (
    <>
      <div className="page-header"><h1>My Progress 📈</h1><p>Track your learning journey</p></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Sessions Done</div><div className="stat-value" style={{color:"var(--green)"}}>{completed.length}</div></div>
        <div className="stat-card"><div className="stat-label">Hours Learned</div><div className="stat-value" style={{color:"var(--accent)"}}>{Math.floor(totalMinutes/60)}<span style={{fontSize:"1rem"}}>h</span></div></div>
        <div className="stat-card"><div className="stat-label">Avg Rating Given</div><div className="stat-value" style={{color:"var(--gold)"}}>{avgRating}</div></div>
        <div className="stat-card"><div className="stat-label">Day Streak</div><div className="stat-value" style={{color:"var(--red)"}}>{user.streak||0}🔥</div></div>
      </div>

      <div className="card">
        <h3>🎯 Subject Progress — {user.subject}</h3>
        <div style={{marginBottom:"1rem"}}>
          <div className="flex justify-between" style={{marginBottom:".4rem"}}>
            <span className="text-muted">Completion</span>
            <span style={{fontFamily:"var(--mono)",fontSize:".85rem",color:"var(--accent)"}}>{user.progress||0}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar" style={{width:`${user.progress||0}%`,background:"linear-gradient(90deg,var(--accent),var(--accent2))"}} />
          </div>
        </div>

        <div className="divider" />
        <h3 style={{marginBottom:"1rem"}}>🏆 Achievements</h3>
        <div style={{display:"flex",gap:".7rem",flexWrap:"wrap"}}>
          {completed.length>=1 && <div style={{background:"#10b98120",border:"1px solid #10b98140",borderRadius:"var(--r)",padding:".7rem 1rem",display:"flex",alignItems:"center",gap:".5rem",fontSize:".82rem",color:"var(--green)"}}><Icon name="award" size={16}/>First Session</div>}
          {completed.length>=5 && <div style={{background:"#4f8ef720",border:"1px solid #4f8ef740",borderRadius:"var(--r)",padding:".7rem 1rem",display:"flex",alignItems:"center",gap:".5rem",fontSize:".82rem",color:"var(--accent)"}}><Icon name="award" size={16}/>5 Sessions</div>}
          {(user.streak||0)>=3 && <div style={{background:"#ef444420",border:"1px solid #ef444440",borderRadius:"var(--r)",padding:".7rem 1rem",display:"flex",alignItems:"center",gap:".5rem",fontSize:".82rem",color:"var(--red)"}}><Icon name="fire" size={16}/>Hot Streak</div>}
          {(user.progress||0)>=50 && <div style={{background:"#f59e0b20",border:"1px solid #f59e0b40",borderRadius:"var(--r)",padding:".7rem 1rem",display:"flex",alignItems:"center",gap:".5rem",fontSize:".82rem",color:"var(--gold)"}}><Icon name="star" size={16}/>Halfway There</div>}
        </div>
      </div>
    </>
  );
}

// ─── Tutor Dashboard ──────────────────────────────────────────────────────────
function TutorDashboard({ user, db, onLogout, onAddMeeting, onDeleteMeeting, onMarkComplete }) {
  const [nav, setNav] = useState("home");
  const myMeetings = db.meetings.filter(m=>m.tutorId===user.id);
  const myStudents = db.students.filter(s=>user.students?.includes(s.id));
  const unread = myMeetings.filter(m=>!m.seen&&m.status==="upcoming").length;

  const NavItem = ({id,icon,label,badge}) => (
    <button className={`nav-item ${nav===id?"active":""}`} onClick={()=>setNav(id)}>
      <Icon name={icon} size={17}/><span>{label}</span>
      {badge>0&&<span className="notif-dot"/>}
    </button>
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="dot" style={{background:"var(--gold)",boxShadow:"0 0 8px var(--gold)"}} /><span>EduConnect</span></div>
        <div className="nav-section"><span>Menu</span></div>
        <NavItem id="home" icon="home" label="Dashboard" badge={unread} />
        <NavItem id="schedule" icon="calendar" label="Schedule" />
        <NavItem id="students" icon="users" label="My Students" />
        <NavItem id="add" icon="plus" label="New Meeting" />
        <div className="sidebar-footer">
          <div style={{marginBottom:".7rem",display:"flex",alignItems:"center",gap:"8px"}}>
            <div className="avatar" style={{background:"#f59e0b20",color:"var(--gold)"}}>{user.name[0]}</div>
            <span style={{fontSize:".84rem",fontWeight:"600"}}>{user.name.split(" ")[0]}</span>
          </div>
          <button className="nav-item" onClick={onLogout}><Icon name="logout" size={17}/><span>Logout</span></button>
        </div>
      </aside>
      <main className="main">
        {nav==="home" && <TutorHome user={user} meetings={myMeetings} students={myStudents} />}
        {nav==="schedule" && <TutorSchedule meetings={myMeetings} onDelete={onDeleteMeeting} onMarkComplete={onMarkComplete} />}
        {nav==="students" && <TutorStudents students={myStudents} meetings={myMeetings} />}
        {nav==="add" && <AddMeeting user={user} students={myStudents} onAdd={(m)=>{onAddMeeting(m);setNav("schedule");}} />}
      </main>
    </div>
  );
}

function TutorHome({ user, meetings, students }) {
  const upcoming = meetings.filter(m=>m.status==="upcoming");
  const completed = meetings.filter(m=>m.status==="completed");
  const totalMinutes = completed.reduce((a,m)=>a+parseInt(m.duration||0),0);

  return (
    <>
      <div className="page-header"><h1>Tutor Dashboard 🎓</h1><p>Manage your students and sessions</p></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">My Students</div><div className="stat-value" style={{color:"var(--gold)"}}>{students.length}</div></div>
        <div className="stat-card"><div className="stat-label">Upcoming</div><div className="stat-value" style={{color:"var(--accent)"}}>{upcoming.length}</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value" style={{color:"var(--green)"}}>{completed.length}</div></div>
        <div className="stat-card"><div className="stat-label">Hours Taught</div><div className="stat-value">{Math.floor(totalMinutes/60)}<span style={{fontSize:"1rem"}}>h</span></div></div>
      </div>

      <div className="card-row">
        <div className="card" style={{margin:0}}>
          <h3>🗓 Next Sessions</h3>
          {upcoming.length===0
            ? <div className="empty"><div className="empty-icon">📭</div><div>No upcoming sessions</div></div>
            : upcoming.slice(0,3).map(m=><MeetingCard key={m.id} meeting={m} showStudent />)}
        </div>
        <div className="card" style={{margin:0}}>
          <h3>📊 My Stats</h3>
          <div style={{marginBottom:"1rem"}}>
            <div className="stat-label">Overall Rating</div>
            <div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:".3rem"}}>
              <span style={{fontSize:"1.6rem",fontWeight:800,fontFamily:"var(--mono)",color:"var(--gold)"}}>{user.rating||5}</span>
              <span style={{color:"var(--gold)",fontSize:"1rem"}}>{getRatingStars(user.rating||5)}</span>
            </div>
          </div>
          <div className="divider" />
          <div className="stat-label">Subjects Taught</div>
          <div style={{marginTop:".5rem",display:"flex",gap:".4rem",flexWrap:"wrap"}}>
            {user.subjects?.map(s=>(
              <span key={s} className="badge" style={{background:(SUBJECT_TUTORS[s]?.color||"var(--accent)")+"20",color:SUBJECT_TUTORS[s]?.color||"var(--accent)"}}>
                {SUBJECT_TUTORS[s]?.emoji} {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TutorSchedule({ meetings, onDelete, onMarkComplete }) {
  const sorted = [...meetings].sort((a,b)=>new Date(a.date)-new Date(b.date));
  return (
    <>
      <div className="page-header"><h1>My Schedule 📅</h1><p>All sessions with your students</p></div>
      <div className="card">
        {sorted.length===0
          ? <div className="empty"><div className="empty-icon">📭</div><div>No sessions scheduled</div></div>
          : sorted.map(m=>(
            <div key={m.id} className="meeting-card">
              <div className="meeting-info">
                <div className="meeting-subject">{m.subject}</div>
                <div className="meeting-meta">
                  <span className="meta-item"><Icon name="user" size={13}/>{m.studentName}</span>
                  <span className="meta-item"><Icon name="calendar" size={13}/>{m.date}</span>
                  <span className="meta-item"><Icon name="clock" size={13}/>{m.time} · {m.duration}min</span>
                </div>
                {m.notes && <div className="text-muted" style={{marginTop:".4rem"}}>📝 {m.notes}</div>}
                {m.rating && <div style={{marginTop:".4rem",color:"var(--gold)",fontSize:".8rem"}}>Student rated: {m.rating}★</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:".4rem",alignItems:"flex-end"}}>
                <span className={`badge badge-${m.status==="upcoming"?"upcoming":m.status==="completed"?"done":"cancelled"}`}>{m.status}</span>
                {m.status==="upcoming" && (
                  <button className="btn btn-green btn-sm" style={{fontSize:".78rem",padding:"5px 10px"}} onClick={()=>onMarkComplete(m.id)}>✓ Mark Done</button>
                )}
                <button className="btn btn-danger btn-sm" style={{fontSize:".78rem"}} onClick={()=>onDelete(m.id)}>Delete</button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

function TutorStudents({ students, meetings }) {
  return (
    <>
      <div className="page-header"><h1>My Students 👥</h1><p>Students assigned to you</p></div>
      <div className="card">
        {students.length===0
          ? <div className="empty"><div className="empty-icon">👥</div><div>No students assigned yet</div></div>
          : <table>
              <thead><tr><th>Student</th><th>Subject</th><th>Sessions</th><th>Progress</th></tr></thead>
              <tbody>
                {students.map(s=>{
                  const sMeetings = meetings.filter(m=>m.studentId===s.id&&m.status==="completed");
                  return (
                    <tr key={s.id}>
                      <td><div className="user-row"><div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{s.name[0]}</div>{s.name}</div></td>
                      <td><span className="badge" style={{background:(SUBJECT_TUTORS[s.subject]?.color||"var(--accent)")+"20",color:SUBJECT_TUTORS[s.subject]?.color||"var(--accent)"}}>{SUBJECT_TUTORS[s.subject]?.emoji} {s.subject}</span></td>
                      <td><span className="text-muted">{sMeetings.length} done</span></td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                          <div className="progress-bar-wrap" style={{width:80}}>
                            <div className="progress-bar" style={{width:`${s.progress||0}%`,background:"var(--green)"}} />
                          </div>
                          <span style={{fontSize:".78rem",color:"var(--muted2)"}}>{s.progress||0}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>}
      </div>
    </>
  );
}

function AddMeeting({ user, students, onAdd }) {
  const [form, setForm] = useState({ studentId:"", studentName:"", subject:"", date:"", time:"", duration:"60", notes:"" });
  const [err, setErr] = useState("");
  const set = k => e => {
    const v = e.target.value;
    if (k==="studentId") {
      const s = students.find(s=>s.id===v);
      setForm(p=>({...p,studentId:v,studentName:s?s.name:""}));
    } else setForm(p=>({...p,[k]:v}));
  };
  const submit = () => {
    if (!form.studentId||!form.subject||!form.date||!form.time) return setErr("Please fill all required fields");
    onAdd({...form,tutorId:user.id});
  };
  return (
    <>
      <div className="page-header"><h1>Schedule New Meeting ➕</h1><p>Book a tutoring session</p></div>
      <div className="card">
        {err && <div className="err">{err}</div>}
        <div className="form-grid">
          <div><label>Student *</label><select value={form.studentId} onChange={set("studentId")}><option value="">Select student</option>{students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label>Subject *</label><input placeholder="e.g. Algebra Basics" value={form.subject} onChange={set("subject")} /></div>
          <div><label>Date *</label><input type="date" value={form.date} onChange={set("date")} /></div>
          <div><label>Time *</label><input type="time" value={form.time} onChange={set("time")} /></div>
          <div><label>Duration</label><select value={form.duration} onChange={set("duration")}>{["30","45","60","90","120"].map(d=><option key={d} value={d}>{d} minutes</option>)}</select></div>
          <div><label>Notes (optional)</label><input placeholder="Topic or chapter..." value={form.notes} onChange={set("notes")} /></div>
        </div>
        <div className="form-actions"><button className="btn btn-primary btn-sm" style={{width:"auto",padding:"10px 24px"}} onClick={submit}>Schedule Meeting</button></div>
      </div>
    </>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ user, db, onLogout, onDeleteMeeting, onAddMeeting, onMarkComplete, onAddAnnouncement }) {
  const [nav, setNav] = useState("home");
  const NavItem = ({id,icon,label}) => (
    <button className={`nav-item ${nav===id?"active":""}`} onClick={()=>setNav(id)}>
      <Icon name={icon} size={17}/><span>{label}</span>
    </button>
  );
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo"><div className="dot" style={{background:"var(--red)",boxShadow:"0 0 8px var(--red)"}}/><span>Admin Panel</span></div>
        <div className="nav-section"><span>Overview</span></div>
        <NavItem id="home" icon="home" label="Dashboard" />
        <div className="nav-section"><span>Manage</span></div>
        <NavItem id="students" icon="book" label="Students" />
        <NavItem id="tutors" icon="star" label="Tutors" />
        <NavItem id="meetings" icon="calendar" label="All Meetings" />
        <NavItem id="schedule" icon="plus" label="Schedule Meeting" />
        <NavItem id="announce" icon="announce" label="Announcements" />
        <div className="sidebar-footer">
          <div style={{marginBottom:".7rem",display:"flex",alignItems:"center",gap:"8px"}}>
            <div className="avatar" style={{background:"#ef444420",color:"var(--red)"}}>A</div>
            <span style={{fontSize:".84rem",fontWeight:"600"}}>Admin</span>
          </div>
          <button className="nav-item" onClick={onLogout}><Icon name="logout" size={17}/><span>Logout</span></button>
        </div>
      </aside>
      <main className="main">
        {nav==="home" && <AdminHome db={db} />}
        {nav==="students" && <AdminStudents db={db} />}
        {nav==="tutors" && <AdminTutors db={db} />}
        {nav==="meetings" && <AdminMeetings db={db} onDelete={onDeleteMeeting} onMarkComplete={onMarkComplete} />}
        {nav==="schedule" && <AdminScheduleMeeting db={db} onAdd={(m)=>{onAddMeeting(m);setNav("meetings");}} />}
        {nav==="announce" && <AdminAnnouncements db={db} onAdd={onAddAnnouncement} />}
      </main>
    </div>
  );
}

function AdminHome({ db }) {
  const upcoming = db.meetings.filter(m=>m.status==="upcoming");
  const completed = db.meetings.filter(m=>m.status==="completed");
  const totalHours = Math.floor(db.meetings.reduce((a,m)=>a+parseInt(m.duration||0),0)/60);

  return (
    <>
      <div className="page-header"><h1>Admin Overview ⚙️</h1><p>Platform-wide statistics</p></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Students</div><div className="stat-value" style={{color:"var(--accent)"}}>{db.students.length}</div></div>
        <div className="stat-card"><div className="stat-label">Tutors</div><div className="stat-value" style={{color:"var(--gold)"}}>{db.tutors.length}</div></div>
        <div className="stat-card"><div className="stat-label">Upcoming</div><div className="stat-value" style={{color:"var(--green)"}}>{upcoming.length}</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value" style={{color:"var(--muted2)"}}>{completed.length}</div></div>
        <div className="stat-card"><div className="stat-label">Total Hours</div><div className="stat-value">{totalHours}<span style={{fontSize:"1rem"}}>h</span></div></div>
        <div className="stat-card"><div className="stat-label">Subjects</div><div className="stat-value">{ALL_SUBJECTS.length}</div></div>
      </div>

      {/* Subject coverage */}
      <div className="card">
        <h3>📚 Subject Coverage</h3>
        <div style={{display:"flex",gap:".5rem",flexWrap:"wrap"}}>
          {ALL_SUBJECTS.map(s=>{
            const count = db.tutors.filter(t=>t.subjects.includes(s)).length;
            return (
              <div key={s} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:".6rem 1rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                <span>{SUBJECT_TUTORS[s]?.emoji}</span>
                <div>
                  <div style={{fontSize:".82rem",fontWeight:600}}>{s}</div>
                  <div style={{fontSize:".72rem",color:"var(--muted2)"}}>{count} tutor{count!==1?"s":""}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-row">
        <div className="card" style={{margin:0}}>
          <h3>🎓 Recent Students</h3>
          {db.students.slice(0,4).map(s=>(
            <div key={s.id} className="flex items-center gap" style={{marginBottom:".7rem"}}>
              <div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{s.name[0]}</div>
              <div><div style={{fontWeight:600,fontSize:".88rem"}}>{s.name}</div><div className="text-muted">{s.subject}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{margin:0}}>
          <h3>📅 Recent Meetings</h3>
          {db.meetings.slice(0,3).map(m=>(
            <div key={m.id} style={{marginBottom:".9rem"}}>
              <div style={{fontWeight:600,fontSize:".88rem"}}>{m.subject}</div>
              <div className="text-muted">{m.studentName} · {m.date} {m.time}</div>
              <span className={`badge badge-${m.status==="upcoming"?"upcoming":m.status==="completed"?"done":"cancelled"}`} style={{marginTop:".3rem"}}>{m.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminStudents({ db }) {
  const [search, setSearch] = useState("");
  const filtered = db.students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.subject.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <div className="page-header"><h1>All Students 📚</h1><p>{db.students.length} registered</p></div>
      <div className="search-wrap"><span className="search-icon"><Icon name="search" size={15}/></span><input placeholder="Search students..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:0}} /></div>
      <div className="card" style={{marginTop:".8rem"}}>
        <table>
          <thead><tr><th>Name</th><th>Subject</th><th>Progress</th><th>Tutor</th></tr></thead>
          <tbody>
            {filtered.map(s=>{
              const tutor = db.tutors.find(t=>t.id===s.tutor);
              return (
                <tr key={s.id}>
                  <td><div className="user-row"><div className="avatar" style={{background:"#4f8ef720",color:"var(--accent)"}}>{s.name[0]}</div><div><div>{s.name}</div><div style={{fontSize:".75rem",color:"var(--muted)"}}>{s.email}</div></div></div></td>
                  <td><span className="badge" style={{background:(SUBJECT_TUTORS[s.subject]?.color||"var(--accent)")+"20",color:SUBJECT_TUTORS[s.subject]?.color||"var(--accent)"}}>{SUBJECT_TUTORS[s.subject]?.emoji} {s.subject}</span></td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <div className="progress-bar-wrap" style={{width:70}}><div className="progress-bar" style={{width:`${s.progress||0}%`,background:"var(--green)"}} /></div>
                      <span style={{fontSize:".77rem",color:"var(--muted2)"}}>{s.progress||0}%</span>
                    </div>
                  </td>
                  <td>{tutor?tutor.name:<span className="text-muted">Not assigned</span>}</td>
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
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState("");
  const filtered = db.tutors.filter(t=>{
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchSub = subFilter ? t.subjects.includes(subFilter) : true;
    return matchSearch && matchSub;
  });
  return (
    <>
      <div className="page-header"><h1>All Tutors 🎓</h1><p>{db.tutors.length} tutors on platform</p></div>
      <div style={{display:"flex",gap:"1rem",marginBottom:"1rem",flexWrap:"wrap"}}>
        <div className="search-wrap" style={{flex:1,minWidth:180,marginBottom:0}}>
          <span className="search-icon"><Icon name="search" size={15}/></span>
          <input placeholder="Search tutors..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:0}} />
        </div>
        <select value={subFilter} onChange={e=>setSubFilter(e.target.value)} style={{width:"auto",marginBottom:0,minWidth:160}}>
          <option value="">All Subjects</option>
          {ALL_SUBJECTS.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Tutor</th><th>Subjects</th><th>Rating</th><th>Students</th><th>Sessions</th></tr></thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.id}>
                <td><div className="user-row"><div className="avatar" style={{background:"#f59e0b20",color:"var(--gold)"}}>{t.name[0]}</div><div><div>{t.name}</div><div style={{fontSize:".75rem",color:"var(--muted)"}}>{t.email}</div></div></div></td>
                <td><div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>{t.subjects?.map(s=><span key={s} className="badge" style={{background:(SUBJECT_TUTORS[s]?.color||"var(--accent)")+"20",color:SUBJECT_TUTORS[s]?.color||"var(--accent)"}}>{SUBJECT_TUTORS[s]?.emoji} {s}</span>)}</div></td>
                <td><span style={{color:"var(--gold)",fontWeight:600}}>{t.rating||5}★</span></td>
                <td><span className="badge badge-done">{t.students?.length||0}</span></td>
                <td className="text-muted">{t.sessions||0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminMeetings({ db, onDelete, onMarkComplete }) {
  const [filter, setFilter] = useState("all");
  const filtered = db.meetings.filter(m=>filter==="all"?true:m.status===filter);
  return (
    <>
      <div className="page-header"><h1>All Meetings 📅</h1><p>{db.meetings.length} total sessions</p></div>
      <div style={{display:"flex",gap:".6rem",marginBottom:"1.2rem"}}>
        {["all","upcoming","completed"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="btn btn-ghost btn-sm"
            style={{borderColor:filter===f?"var(--accent)":"var(--border)",color:filter===f?"var(--accent)":"var(--muted2)"}}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      <div className="card">
        {filtered.length===0
          ? <div className="empty"><div className="empty-icon">📭</div><div>No meetings found</div></div>
          : filtered.map(m=>{
              const tutor = db.tutors.find(t=>t.id===m.tutorId);
              return (
                <div key={m.id} className="meeting-card">
                  <div className="meeting-info">
                    <div className="meeting-subject">{m.subject}</div>
                    <div className="meeting-meta">
                      <span className="meta-item"><Icon name="user" size={13}/>Student: {m.studentName}</span>
                      <span className="meta-item">Tutor: {tutor?.name||"—"}</span>
                      <span className="meta-item"><Icon name="calendar" size={13}/>{m.date}</span>
                      <span className="meta-item"><Icon name="clock" size={13}/>{m.time} · {m.duration}min</span>
                    </div>
                    {m.rating && <div style={{marginTop:".35rem",color:"var(--gold)",fontSize:".79rem"}}>Student rated: {m.rating}★</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:".4rem",alignItems:"flex-end"}}>
                    <span className={`badge badge-${m.status==="upcoming"?"upcoming":m.status==="completed"?"done":"cancelled"}`}>{m.status}</span>
                    {m.status==="upcoming" && <button className="btn btn-green btn-sm" style={{fontSize:".77rem",padding:"4px 10px"}} onClick={()=>onMarkComplete(m.id)}>✓ Mark Done</button>}
                    <button className="btn btn-danger btn-sm" style={{fontSize:".77rem"}} onClick={()=>onDelete(m.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}

function AdminScheduleMeeting({ db, onAdd }) {
  const [form, setForm] = useState({ tutorId:"", studentId:"", studentName:"", subject:"", date:"", time:"", duration:"60", notes:"" });
  const [err, setErr] = useState("");

  // Smart subject suggestions based on tutor
  const selectedTutor = db.tutors.find(t=>t.id===form.tutorId);

  const set = k => e => {
    const v = e.target.value;
    if (k==="studentId") {
      const s = db.students.find(s=>s.id===v);
      setForm(p=>({...p,studentId:v,studentName:s?s.name:""}));
    } else setForm(p=>({...p,[k]:v}));
  };

  const submit = () => {
    if (!form.tutorId||!form.studentId||!form.subject||!form.date||!form.time) return setErr("All required fields must be filled");
    onAdd(form);
  };

  return (
    <>
      <div className="page-header"><h1>Schedule Meeting ➕</h1><p>Book any session as admin</p></div>
      <div className="card">
        {err && <div className="err">{err}</div>}
        <div className="form-grid">
          <div>
            <label>Tutor *</label>
            <select value={form.tutorId} onChange={set("tutorId")}>
              <option value="">Select tutor</option>
              {db.tutors.map(t=><option key={t.id} value={t.id}>{t.name} — {t.subjects.join(", ")}</option>)}
            </select>
          </div>
          <div>
            <label>Student *</label>
            <select value={form.studentId} onChange={set("studentId")}>
              <option value="">Select student</option>
              {db.students.map(s=><option key={s.id} value={s.id}>{s.name} ({s.subject})</option>)}
            </select>
          </div>
          <div>
            <label>Subject / Topic *</label>
            {selectedTutor?.subjects?.length ? (
              <select value={form.subject} onChange={set("subject")}>
                <option value="">Select topic</option>
                {selectedTutor.subjects.map(s=><option key={s}>{s}</option>)}
                <option value="custom">Other (type below)</option>
              </select>
            ) : (
              <input placeholder="e.g. Algebra Basics" value={form.subject} onChange={set("subject")} />
            )}
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
            <label>Duration</label>
            <select value={form.duration} onChange={set("duration")}>
              {["30","45","60","90","120"].map(d=><option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label>Notes (optional)</label>
            <input placeholder="Topic, chapter, or instructions..." value={form.notes} onChange={set("notes")} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary btn-sm" style={{width:"auto",padding:"10px 24px"}} onClick={submit}>Schedule Meeting</button>
        </div>
      </div>
    </>
  );
}

function AdminAnnouncements({ db, onAdd }) {
  const [form, setForm] = useState({ title:"", body:"", important:false });
  const [success, setSuccess] = useState("");
  const set = k => e => setForm(p=>({...p,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));

  const submit = () => {
    if (!form.title||!form.body) return;
    onAdd(form);
    setForm({title:"",body:"",important:false});
    setSuccess("Announcement posted!");
    setTimeout(()=>setSuccess(""),3000);
  };

  return (
    <>
      <div className="page-header"><h1>Announcements 📣</h1><p>Broadcast messages to all users</p></div>
      <div className="card">
        <h3>Post New Announcement</h3>
        {success && <div className="success">{success}</div>}
        <label>Title</label><input placeholder="Announcement title..." value={form.title} onChange={set("title")} />
        <label>Message</label><textarea rows={3} placeholder="Announcement body..." value={form.body} onChange={set("body")} style={{resize:"vertical"}} />
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"1rem"}}>
          <input type="checkbox" id="imp" checked={form.important} onChange={set("important")} style={{width:"auto",marginBottom:0}} />
          <label htmlFor="imp" style={{marginBottom:0,cursor:"pointer"}}>⭐ Mark as important</label>
        </div>
        <div className="form-actions"><button className="btn btn-primary btn-sm" style={{width:"auto",padding:"10px 24px"}} onClick={submit}>Post Announcement</button></div>
      </div>

      <div className="card">
        <h3>Past Announcements</h3>
        {db.announcements.length===0
          ? <div className="empty"><div className="empty-icon">📭</div><div>No announcements</div></div>
          : db.announcements.map(a=>(
            <div key={a.id} className={`announcement-card ${a.important?"important":""}`}>
              <div className="announcement-title">{a.important&&"⭐ "}{a.title}</div>
              <div className="announcement-body">{a.body}</div>
              <div className="announcement-date">{a.date}</div>
            </div>
          ))}
      </div>
    </>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function MeetingCard({ meeting, showStudent }) {
  const days = getDaysUntil(meeting.date);
  return (
    <div className="meeting-card">
      <div className="meeting-info">
        <div className="meeting-subject">{meeting.subject}</div>
        <div className="meeting-meta">
          {showStudent && <span className="meta-item"><Icon name="user" size={13}/>{meeting.studentName}</span>}
          <span className="meta-item"><Icon name="calendar" size={13}/>{meeting.date}</span>
          <span className="meta-item"><Icon name="clock" size={13}/>{meeting.time}</span>
          <span className="meta-item">{meeting.duration} min</span>
          {meeting.status==="upcoming"&&days===0&&<span className="badge badge-hot">TODAY</span>}
          {meeting.status==="upcoming"&&days===1&&<span className="badge badge-upcoming">Tomorrow</span>}
        </div>
        {meeting.notes && <div className="text-muted" style={{marginTop:".35rem"}}>📝 {meeting.notes}</div>}
      </div>
      <span className={`badge badge-${meeting.status==="upcoming"?"upcoming":meeting.status==="completed"?"done":"cancelled"}`}>{meeting.status}</span>
    </div>
  );
}
