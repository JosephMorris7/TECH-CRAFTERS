import { useState, useEffect, useRef, useMemo } from "react";

// ─── THEME & GLOBAL STYLES ────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #080b12;
      --bg2:      #0d1120;
      --bg3:      #131929;
      --card:     #111827;
      --border:   #1e2d45;
      --border2:  #253348;
      --accent:   #3b82f6;
      --accent2:  #06b6d4;
      --gold:     #f59e0b;
      --danger:   #ef4444;
      --success:  #10b981;
      --text:     #f1f5f9;
      --text2:    #94a3b8;
      --text3:    #475569;
      --glow:     0 0 40px rgba(59,130,246,0.15);
      --glow2:    0 0 80px rgba(6,182,212,0.1);
    }

    body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; overflow-x: hidden; }

    h1, h2, h3, h4 { font-family: 'Syne', sans-serif; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(2.2);opacity:0} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes orbit { from{transform:rotate(0deg) translateX(120px) rotate(0deg)} to{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
    @keyframes orbit2 { from{transform:rotate(180deg) translateX(80px) rotate(-180deg)} to{transform:rotate(540deg) translateX(80px) rotate(-540deg)} }
    @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes urgentPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }

    .fade-up { animation: fadeUp 0.7s ease both; }
    .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
    .fade-up-2 { animation: fadeUp 0.7s 0.2s ease both; }
    .fade-up-3 { animation: fadeUp 0.7s 0.35s ease both; }
    .fade-up-4 { animation: fadeUp 0.7s 0.5s ease both; }
    .fade-in { animation: fadeIn 0.4s ease both; }

    button { font-family: 'Outfit', sans-serif; cursor: pointer; }
    input, textarea, select { font-family: 'Outfit', sans-serif; }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      padding: 13px 28px;
      cursor: pointer;
      transition: all 0.25s;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content:'';
      position:absolute;
      inset:0;
      background:linear-gradient(135deg,var(--accent2),var(--accent));
      opacity:0;
      transition:opacity 0.25s;
    }
    .btn-primary:hover::before { opacity:1; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(59,130,246,0.35); }
    .btn-primary span { position:relative; z-index:1; }

    .btn-ghost {
      background: transparent;
      color: var(--text2);
      border: 1px solid var(--border2);
      border-radius: 12px;
      font-weight: 500;
      font-size: 14px;
      padding: 11px 22px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: var(--accent); color: var(--text); background: rgba(59,130,246,0.06); }

    .input-field {
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-size: 14px;
      padding: 13px 16px;
      width: 100%;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
    .input-field::placeholder { color: var(--text3); }
  `}</style>
);

// ─── GRID BACKGROUND ──────────────────────────────────────────────────────────
const GridBg = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: `
      linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
  }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse 40% 30% at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 60%)",
    }} />
  </div>
);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK = [
  { id: 1, company: "Google", role: "SWE Intern", eligibility: "3rd/4th year CSE, CGPA ≥ 7.5", deadline: "2026-03-16", source: "WhatsApp", link: "https://careers.google.com", stipend: "₹1,00,000/mo", location: "Bangalore", status: "Not Applied", addedAt: "2026-03-10" },
  { id: 2, company: "Amazon", role: "SDE Intern", eligibility: "CSE/IT, any year, DSA strong", deadline: "2026-03-18", source: "Email", link: "https://amazon.jobs", stipend: "₹85,000/mo", location: "Hyderabad", status: "Applied", addedAt: "2026-03-09" },
  { id: 3, company: "Microsoft", role: "Data Analyst Intern", eligibility: "Any branch, final year", deadline: "2026-03-22", source: "Telegram", link: "https://careers.microsoft.com", stipend: "₹70,000/mo", location: "Pune", status: "Not Applied", addedAt: "2026-03-11" },
  { id: 4, company: "Razorpay", role: "Frontend Intern", eligibility: "Any year, React experience", deadline: "2026-04-01", source: "WhatsApp", link: "https://razorpay.com/jobs", stipend: "₹50,000/mo", location: "Bangalore", status: "Not Applied", addedAt: "2026-03-08" },
  { id: 5, company: "ISRO", role: "Research Fellow", eligibility: "ECE/EEE, CGPA ≥ 8.0", deadline: "2026-04-10", source: "Email", link: "https://isro.gov.in", stipend: "₹12,000/mo", location: "Ahmedabad", status: "Not Applied", addedAt: "2026-03-07" },
  { id: 6, company: "Zomato", role: "Data Science Intern", eligibility: "CSE/Math, Python required", deadline: "2026-04-15", source: "Telegram", link: "https://zomato.com/careers", stipend: "₹40,000/mo", location: "Gurgaon", status: "Not Applied", addedAt: "2026-03-06" },
];

function daysLeft(deadline) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(deadline) - today) / 86400000);
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onStart }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const words = ["WhatsApp.", "Email.", "Telegram.", "Chaos."];
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "40px 20px" }}>
      <GridBg />

      {/* Cursor glow */}
      <div style={{
        position: "fixed", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        left: mousePos.x - 250, top: mousePos.y - 250,
        pointerEvents: "none", zIndex: 1, transition: "left 0.1s, top 0.1s",
      }} />

      {/* Floating orbs */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 200, height: 200, zIndex: 0 }}>
        <div style={{ position: "absolute", width: 12, height: 12, borderRadius: "50%", background: "var(--accent)", animation: "orbit 8s linear infinite", boxShadow: "0 0 20px var(--accent)" }} />
        <div style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "var(--accent2)", animation: "orbit2 5s linear infinite", boxShadow: "0 0 14px var(--accent2)" }} />
      </div>
      <div style={{ position: "absolute", bottom: "20%", right: "8%", width: 160, height: 160, zIndex: 0 }}>
        <div style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "var(--gold)", animation: "orbit 11s linear infinite reverse", boxShadow: "0 0 16px var(--gold)" }} />
      </div>

      {/* Hero content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 740 }}>

        {/* Badge */}
        <div className="fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 36, fontSize: 13, color: "var(--accent2)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
          Built for students · Hackathon 2026
        </div>

        {/* Main headline */}
        <h1 className="fade-up-1" style={{ fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 8 }}>
          CAPTURE
        </h1>
        <h2 className="fade-up-2" style={{
          fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 400, color: "var(--text2)",
          marginBottom: 24, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.5px",
        }}>
          Stop losing opportunities in{" "}
          <span key={wordIdx} style={{
            color: "var(--accent)", fontWeight: 600,
            display: "inline-block", animation: "fadeUp 0.4s ease both",
          }}>
            {words[wordIdx]}
          </span>
        </h2>

        <p className="fade-up-3" style={{
          fontSize: 17, color: "var(--text2)", lineHeight: 1.75,
          maxWidth: 540, margin: "0 auto 48px", fontWeight: 300,
        }}>
          One platform to capture, parse, and track every internship opportunity — from any source — before the deadline slips by.
        </p>

        {/* CTA */}
        <div className="fade-up-4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={onStart}
            style={{ fontSize: 17, padding: "15px 40px", borderRadius: 14 }}>
            <span>Start Now →</span>
          </button>
          <button className="btn-ghost" style={{ padding: "15px 28px" }}>
            Watch demo
          </button>
        </div>

        {/* Feature pills */}
        <div className="fade-up-4" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 56 }}>
          {["AI-powered parsing", "Deadline alerts", "Multi-source", "One dashboard"].map(f => (
            <div key={f} style={{
              background: "var(--bg3)", border: "1px solid var(--border)",
              borderRadius: 100, padding: "7px 16px", fontSize: 12.5, color: "var(--text2)",
            }}>
              ✦ {f}
            </div>
          ))}
        </div>

        {/* Floating mockup preview */}
        <div className="fade-up-4" style={{
          marginTop: 72, position: "relative",
          animation: "float 6s ease-in-out infinite",
        }}>
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 20, padding: 20, maxWidth: 480, margin: "0 auto",
            boxShadow: "0 0 80px rgba(59,130,246,0.12), 0 40px 80px rgba(0,0,0,0.6)",
            textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 8 }}>opportunities.app</span>
            </div>
            {[
              { co: "Google", role: "SWE Intern", days: 3, urgent: true },
              { co: "Amazon", role: "SDE Intern", days: 5, urgent: false },
              { co: "Microsoft", role: "Data Analyst", days: 9, urgent: false },
            ].map((o, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 14px", borderRadius: 10, marginBottom: 8,
                background: o.urgent ? "rgba(239,68,68,0.06)" : "var(--bg3)",
                border: o.urgent ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border)",
                animation: o.urgent ? "urgentPulse 2s infinite" : "none",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{o.co} — {o.role}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Deadline in {o.days} days</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: o.urgent ? "#ef4444" : "var(--accent2)",
                  background: o.urgent ? "rgba(239,68,68,0.12)" : "rgba(6,182,212,0.1)",
                  padding: "4px 10px", borderRadius: 20,
                }}>
                  {o.urgent ? "⚠ Urgent" : `${o.days}d left`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    if (mode === "signup" && !form.name) { setError("Please enter your name."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: form.name || form.email.split("@")[0], email: form.email });
    }, 1200);
  }

  function handleGoogle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: "Student User", email: "student@gmail.com" });
    }, 1000);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 20 }}>
      <GridBg />
      <div className="fade-in" style={{
        position: "relative", zIndex: 2, width: "100%", maxWidth: 420,
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 24, padding: "40px 36px",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.08)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            marginBottom: 14, fontSize: 22,
          }}>⚡</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>CAPTURE</h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Google button */}
        <button onClick={handleGoogle} disabled={loading}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12,
            background: "var(--bg3)", border: "1px solid var(--border2)",
            color: "var(--text)", fontWeight: 500, fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            cursor: "pointer", marginBottom: 24, transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border2)"}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 6 }}>Full Name</label>
              <input className="input-field" placeholder="Ravi Kumar" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
          )}
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 6 }}>Email</label>
            <input className="input-field" type="email" placeholder="you@college.edu" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 6 }}>Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>

          {error && <div style={{ fontSize: 13, color: "var(--danger)", background: "rgba(239,68,68,0.08)", borderRadius: 8, padding: "10px 14px" }}>{error}</div>}

          <button className="btn-primary" type="submit" disabled={loading}
            style={{ width: "100%", marginTop: 4, padding: "14px", fontSize: 15 }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading && <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text3)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(m => m === "login" ? "signup" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ADD MODAL ────────────────────────────────────────────────────────────────
function AddModal({ onClose, onAdd }) {
  const [tab, setTab] = useState("paste"); // paste | form
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", eligibility: "", deadline: "", stipend: "", location: "", link: "", source: "WhatsApp" });

  async function parse() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Extract internship/opportunity info. Reply ONLY with valid JSON, no markdown:\n{"company":"","role":"","eligibility":"","deadline":"YYYY-MM-DD or null","stipend":"","location":"","link":""}\n\nMessage:\n${text}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      setParsed(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setParsed({ _error: true });
    }
    setLoading(false);
  }

  function handleAdd() {
    const src = tab === "paste" ? parsed : form;
    if (!src || src._error) return;
    onAdd({ id: Date.now(), ...src, source: form.source || "WhatsApp", status: "Not Applied", addedAt: new Date().toISOString().split("T")[0] });
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(6px)" }}>
      <div className="fade-in" style={{
        background: "var(--card)", border: "1px solid var(--border2)",
        borderRadius: 22, padding: "32px 28px", width: "100%", maxWidth: 520,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add Opportunity</h3>
          <button onClick={onClose} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, width: 32, height: 32, color: "var(--text2)", fontSize: 16, cursor: "pointer" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22, background: "var(--bg3)", borderRadius: 12, padding: 4 }}>
          {["paste", "form"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "9px", borderRadius: 9, border: "none",
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "#fff" : "var(--text2)",
              fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            }}>
              {t === "paste" ? "⚡ Paste Message" : "✏ Manual Entry"}
            </button>
          ))}
        </div>

        {tab === "paste" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>Paste any WhatsApp, email, or Telegram message below.</div>
            <textarea className="input-field" value={text} onChange={e => setText(e.target.value)}
              rows={5} placeholder={"Amazon Internship 2026\nRole: SDE Intern\nEligibility: 3rd & 4th year CSE\nDeadline: April 10\nApply: amazon.jobs/internship"}
              style={{ resize: "vertical" }} />
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {["WhatsApp", "Email", "Telegram"].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, source: s }))}
                  style={{
                    padding: "6px 14px", borderRadius: 20, border: "1px solid",
                    borderColor: form.source === s ? "var(--accent)" : "var(--border)",
                    background: form.source === s ? "rgba(59,130,246,0.12)" : "transparent",
                    color: form.source === s ? "var(--accent)" : "var(--text2)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{s}</button>
              ))}
            </div>
            {parsed && !parsed._error && (
              <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 16, fontSize: 13 }}>
                <div style={{ color: "var(--success)", fontWeight: 700, marginBottom: 8 }}>✓ Extracted successfully</div>
                {[["Company", "company"], ["Role", "role"], ["Deadline", "deadline"], ["Eligibility", "eligibility"]].map(([l, k]) => parsed[k] && (
                  <div key={k} style={{ color: "var(--text2)", marginBottom: 3 }}><span style={{ color: "var(--text3)" }}>{l}: </span>{parsed[k]}</div>
                ))}
              </div>
            )}
            {parsed?._error && (
              <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 14, fontSize: 13, color: "var(--danger)" }}>
                Could not parse. Try manual entry.
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" onClick={parse} disabled={loading || !text.trim()} style={{ flex: 1 }}>
                <span>{loading ? "Parsing…" : "Parse with AI"}</span>
              </button>
              {parsed && !parsed._error && (
                <button className="btn-ghost" onClick={handleAdd} style={{ padding: "11px 22px", color: "var(--success)", borderColor: "var(--success)" }}>Add →</button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[["Company", "company", "Google"], ["Role", "role", "SWE Intern"], ["Eligibility", "eligibility", "3rd/4th year CSE"], ["Deadline", "deadline", "date"], ["Stipend", "stipend", "₹50,000/mo"], ["Location", "location", "Bangalore"], ["Link", "link", "https://"]].map(([label, key, ph]) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: 5 }}>{label}</label>
                <input className="input-field" type={key === "deadline" ? "date" : "text"} placeholder={key !== "deadline" ? ph : undefined}
                  value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 4 }}>
              {["WhatsApp", "Email", "Telegram"].map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, source: s }))}
                  style={{
                    padding: "6px 14px", borderRadius: 20, border: "1px solid",
                    borderColor: form.source === s ? "var(--accent)" : "var(--border)",
                    background: form.source === s ? "rgba(59,130,246,0.12)" : "transparent",
                    color: form.source === s ? "var(--accent)" : "var(--text2)",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{s}</button>
              ))}
            </div>
            <button className="btn-primary" onClick={handleAdd} disabled={!form.company || !form.role}>
              <span>Save Opportunity</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── OPPORTUNITY CARD ─────────────────────────────────────────────────────────
const SRC_STYLE = {
  WhatsApp: { bg: "rgba(37,211,102,0.1)", color: "#25D366", border: "rgba(37,211,102,0.25)" },
  Email:    { bg: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  Telegram: { bg: "rgba(0,136,204,0.1)", color: "#33b5e5", border: "rgba(0,136,204,0.25)" },
};

function OppCard({ opp, onToggleStatus }) {
  const days = daysLeft(opp.deadline);
  const isUrgent = days >= 0 && days <= 5;
  const isCritical = days >= 0 && days <= 2;
  const isClosed = days < 0;
  const src = SRC_STYLE[opp.source] || SRC_STYLE.Email;

  const deadlineFmt = new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <div style={{
      background: isCritical ? "rgba(239,68,68,0.04)" : "var(--card)",
      border: `1px solid ${isCritical ? "rgba(239,68,68,0.4)" : isUrgent ? "rgba(245,158,11,0.3)" : "var(--border)"}`,
      borderRadius: 16, padding: "20px 22px",
      opacity: isClosed ? 0.45 : 1,
      animation: isCritical ? "urgentPulse 2s infinite" : "none",
      transition: "all 0.2s",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {isCritical && <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.12)", padding: "3px 9px", borderRadius: 20, animation: "blink 1.2s infinite" }}>⚠ URGENT</span>}
            {isUrgent && !isCritical && <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)", background: "rgba(245,158,11,0.1)", padding: "3px 9px", borderRadius: 20 }}>⏰ Soon</span>}
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{opp.company}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}>{opp.role}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            background: isCritical ? "rgba(239,68,68,0.15)" : isUrgent ? "rgba(245,158,11,0.1)" : "rgba(6,182,212,0.08)",
            color: isCritical ? "#ef4444" : isUrgent ? "var(--gold)" : "var(--accent2)",
          }}>
            {isClosed ? "Closed" : `${deadlineFmt} · ${days}d`}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12.5, color: "var(--text3)", background: "var(--bg3)", borderRadius: 8, padding: "9px 12px", lineHeight: 1.5 }}>
        <span style={{ color: "var(--text2)" }}>Eligibility: </span>{opp.eligibility}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: src.bg, color: src.color, border: `1px solid ${src.border}` }}>
          {opp.source}
        </span>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>📍 {opp.location}</span>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>💰 {opp.stipend}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => onToggleStatus(opp.id)} style={{
            fontSize: 11.5, fontWeight: 600, padding: "5px 12px", borderRadius: 8,
            border: "1px solid",
            borderColor: opp.status === "Applied" ? "var(--success)" : "var(--border2)",
            background: opp.status === "Applied" ? "rgba(16,185,129,0.1)" : "var(--bg3)",
            color: opp.status === "Applied" ? "var(--success)" : "var(--text2)",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {opp.status === "Applied" ? "✓ Applied" : "Mark Applied"}
          </button>
          <a href={opp.link} target="_blank" rel="noreferrer" style={{
            fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 8,
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            color: "#fff", textDecoration: "none",
          }}>Apply →</a>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [opps, setOpps] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);

  // Deadline alerts
  useEffect(() => {
    const urgent = opps.filter(o => { const d = daysLeft(o.deadline); return d >= 0 && d <= 2; });
    if (urgent.length > 0) {
      setAlert(`⚠ ${urgent.length} deadline${urgent.length > 1 ? "s" : ""} in ≤2 days: ${urgent.map(o => o.company).join(", ")}`);
    }
  }, [opps]);

  const sorted = useMemo(() => {
    let list = opps;
    if (sourceFilter !== "All") list = list.filter(o => o.source === sourceFilter);
    if (statusFilter !== "All") list = list.filter(o => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o => o.company.toLowerCase().includes(q) || o.role.toLowerCase().includes(q) || o.eligibility.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const da = daysLeft(a.deadline), db = daysLeft(b.deadline);
      const urgentA = da >= 0 && da <= 5, urgentB = db >= 0 && db <= 5;
      if (urgentA && !urgentB) return -1;
      if (!urgentA && urgentB) return 1;
      return da - db;
    });
  }, [opps, search, sourceFilter, statusFilter]);

  const stats = {
    total: opps.length,
    applied: opps.filter(o => o.status === "Applied").length,
    urgent: opps.filter(o => { const d = daysLeft(o.deadline); return d >= 0 && d <= 5; }).length,
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <GridBg />

      {/* Alert banner */}
      {alert && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "linear-gradient(90deg, rgba(239,68,68,0.9), rgba(245,158,11,0.9))",
          backdropFilter: "blur(10px)",
          padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 13, fontWeight: 600, color: "#fff",
          animation: "fadeIn 0.3s ease",
        }}>
          <span>{alert}</span>
          <button onClick={() => setAlert(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 26, height: 26, borderRadius: 6, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: `${alert ? "64px" : "0px"} 16px 40px`, position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0 28px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>⚡</div>
              <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>CAPTURE</h1>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text3)", marginTop: 4, marginLeft: 46 }}>
              Hey {user.name.split(" ")[0]} 👋 — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn-primary" onClick={() => setShowModal(true)} style={{ fontSize: 13, padding: "10px 18px" }}>
              <span>+ Add</span>
            </button>
            <button className="btn-ghost" onClick={onLogout} style={{ fontSize: 12, padding: "9px 16px" }}>Sign out</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Tracked", value: stats.total, color: "var(--accent)", icon: "📋" },
            { label: "Applied", value: stats.applied, color: "var(--success)", icon: "✅" },
            { label: "Closing soon", value: stats.urgent, color: "var(--danger)", icon: "⏰" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "20px",
            }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif", letterSpacing: "-1px" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <input className="input-field" placeholder="Search company, role, skills…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "10px 14px", fontSize: 13 }} />
          <select className="input-field" style={{ width: "auto", padding: "10px 14px", fontSize: 13 }}
            value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
            <option value="All">All sources</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="Telegram">Telegram</option>
          </select>
          <select className="input-field" style={{ width: "auto", padding: "10px 14px", fontSize: 13 }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All status</option>
            <option value="Not Applied">Not Applied</option>
            <option value="Applied">Applied</option>
          </select>
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>No opportunities found</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Try different filters or add a new one</div>
            </div>
          ) : sorted.map(opp => (
            <OppCard key={opp.id} opp={opp}
              onToggleStatus={id => setOpps(prev => prev.map(o => o.id === id ? { ...o, status: o.status === "Applied" ? "Not Applied" : "Applied" } : o))} />
          ))}
        </div>
      </div>

      {showModal && (
        <AddModal
          onClose={() => setShowModal(false)}
          onAdd={opp => setOpps(prev => [opp, ...prev])}
        />
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing"); // landing | auth | dashboard
  const [user, setUser] = useState(null);

  function handleLogin(u) { setUser(u); setPage("dashboard"); }
  function handleLogout() { setUser(null); setPage("landing"); }

  return (
    <>
      <GlobalStyle />
      {page === "landing" && <LandingPage onStart={() => setPage("auth")} />}
      {page === "auth" && <AuthPage onLogin={handleLogin} />}
      {page === "dashboard" && user && <Dashboard user={user} onLogout={handleLogout} />}
    </>
  );
}
