import {
  CheckCircle,
  Circle,
  Smile,
  Meh,
  Frown,
  Music,
  Sun,
  BarChart3,
  User,
} from "lucide-react";
import { useApp } from "../context/AppContext";


function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

function formatSessionTime(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const diffHours = (now - d) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } else if (diffHours < 48) {
    return "Yesterday";
  } else {
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

export default function ProgressScreen({ progress, isDesktop }) {
  const { t, dark, loggedIn, setAppView } = useApp();

  // Logged out state
  if (!loggedIn) {
    return (
      <div style={{ padding: "0 0 24px" }}>

        <div style={{ padding: isDesktop ? "32px 40px 0" : "20px 24px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: t.accent, marginBottom: 4 }}>Your Progress</div>
          <div style={{ fontSize: isDesktop ? 26 : 22, fontWeight: 700, color: t.text }}>Relief Journey</div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
          {[
            { num: "—", label: "Day Streak" },
            { num: "—", label: "Improvement" },
            { num: "—", label: "Avg Sleep" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: t.bgCard, borderRadius: 16, padding: "16px 14px", border: `1px solid ${t.border}`, opacity: 0.5 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: t.textMuted }}>{s.num}</div>
              <div style={{ fontSize: 11, color: t.textMuted, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
          <div style={{ background: t.bgCard, borderRadius: 16, padding: "40px 20px", border: `1px solid ${t.border}`, textAlign: "center", opacity: 0.6 }}>
            <BarChart3 size={40} color={t.textMuted} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: t.textSec }}>Your tinnitus severity chart</div>
            <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>Track your improvement over time</div>
          </div>
        </div>

        <div style={{ padding: isDesktop ? "28px 40px" : "28px 24px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${t.accentGlow}, ${dark ? "rgba(91,141,239,0.05)" : "rgba(59,111,212,0.04)"})`,
            borderRadius: 16, padding: 24, border: `1px solid ${t.accentBorder}`, textAlign: "center"
          }}>
            <User size={32} color={t.accent} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 6 }}>Sign in to track your progress</div>
            <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.6, marginBottom: 20 }}>
              Log your sessions, track tinnitus severity over time, and see your improvement visually.
            </div>
            <div onClick={() => setAppView("login")} style={{
              padding: "14px", borderRadius: 12, background: t.accent, color: "white",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 16px ${dark ? "rgba(91,141,239,0.3)" : "rgba(59,111,212,0.2)"}`
            }}>Sign In</div>
            <div style={{ marginTop: 14 }}>
              <span style={{ fontSize: 13, color: t.textMuted }}>New member? </span>
              <span onClick={() => setAppView("onboarding")} style={{ fontSize: 13, color: t.accent, fontWeight: 600, cursor: "pointer" }}>Create Account</span>
            </div>
          </div>
        </div>
        </div>
    );
  }

  const {
    streak,
    improvement,
    totalSessions,
    totalTimeHours,
    avgPerDay,
    weekDays,
    severityTrend,
    recentSessions,
  } = progress;

  // Generate chart bars from severity trend or placeholder
  const chartBars = severityTrend.length > 0
    ? severityTrend
    : [85, 82, 78, 80, 72, 68, 70, 62, 65, 58, 55, 52, 48, 50, 45, 42, 40, 38, 42, 36, 34, 32, 35, 30, 28, 32, 26, 24, 28, 22].map((v) => v);

  const moodIcons = [
    { icon: Smile, label: "Great", color: t.green },
    { icon: Smile, label: "Good", color: t.green },
    { icon: Meh, label: "Okay", color: t.yellow },
    { icon: Frown, label: "Bad", color: t.yellow },
    { icon: Frown, label: "Awful", color: t.red },
  ];

  return (
    <div style={{ padding: "0 0 24px" }}>

      <div style={{ padding: isDesktop ? "32px 40px 0" : "20px 24px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: t.accent, marginBottom: 4 }}>Your Progress</div>
        <div style={{ fontSize: isDesktop ? 26 : 22, fontWeight: 700, color: t.text }}>Relief Journey</div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 10, padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
        {[
          { num: `${streak}`, label: "Day Streak", color: t.accent, bg: t.accentGlow, border: t.accentBorder },
          { num: `${improvement}%`, label: "Improvement", color: t.green, bg: t.greenBg, border: t.greenBorder },
          { num: `${totalTimeHours}h`, label: "Total Time", color: t.yellow, bg: t.yellowBg, border: t.yellowBorder },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: s.bg, borderRadius: 16, padding: "16px 14px", border: `1px solid ${s.border}` }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.num}</div>
            <div style={{ fontSize: 11, color: t.textSec, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Severity chart */}
      <div style={{ padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Tinnitus Severity</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: t.accent, background: t.accentGlow, padding: "5px 12px", borderRadius: 20 }}>Last 30 Days</div>
        </div>
        <div style={{ background: t.bgCard, borderRadius: 16, padding: "20px 16px 16px", border: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", height: 130 }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, color: t.textMuted, width: 28, paddingRight: 6 }}>
              <span>High</span><span>Mid</span><span>Low</span>
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              {[0, 50, 100].map((top, i) => (
                <div key={i} style={{ position: "absolute", top: `${top}%`, left: 0, right: 0, height: 1, background: t.border }} />
              ))}
              <div style={{ display: "flex", alignItems: "flex-end", height: "100%", gap: 3, padding: "0 2px" }}>
                {chartBars.map((v, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${v}%`, borderRadius: 2, minWidth: 2,
                    background: v > 60 ? (dark ? "rgba(239,107,107,0.6)" : "rgba(212,80,80,0.5)")
                      : v > 40 ? (dark ? "rgba(251,191,36,0.6)" : "rgba(212,147,13,0.5)")
                      : (dark ? "rgba(74,222,128,0.6)" : "rgba(45,138,86,0.5)")
                  }} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 28, paddingTop: 8, fontSize: 10, color: t.textMuted }}>
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
        </div>
      </div>

      {/* Weekly summary */}
      <div style={{ padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 14 }}>This Week</div>
        <div style={{ display: "flex", gap: 6 }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", padding: "12px 0",
              background: d.completed ? t.greenBg : d.isToday ? t.accentGlow : t.bgInput,
              borderRadius: 12, border: `1px solid ${d.completed ? t.greenBorder : d.isToday ? t.accentBorder : t.border}`
            }}>
              <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontSize: 16 }}>
                {d.completed ? <CheckCircle size={18} color={t.green} /> : d.isToday ? <Circle size={18} color={t.accent} /> : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood tracker */}
      <div style={{ padding: isDesktop ? "24px 40px" : "20px 24px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${t.accentGlow}, ${dark ? "rgba(91,141,239,0.05)" : "rgba(59,111,212,0.04)"})`,
          borderRadius: 16, padding: 18, border: `1px solid ${t.accentBorder}`
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>How's your tinnitus right now?</div>
          <div style={{ display: "flex", gap: 8 }}>
            {moodIcons.map((e, i) => (
              <div key={i} onClick={() => setAppView("checkin")} style={{
                flex: 1, height: 44, background: t.bgInput,
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${t.border}`, cursor: "pointer"
              }}>
                <e.icon size={24} color={e.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div style={{ padding: isDesktop ? "8px 40px 0" : "8px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Recent Sessions</div>
        </div>
        {recentSessions.length === 0 ? (
          <div style={{
            padding: "24px 16px", background: t.bgCard, borderRadius: 14,
            border: `1px solid ${t.border}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 14, color: t.textMuted }}>No sessions yet. Start your first therapy session!</div>
          </div>
        ) : (
          recentSessions.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 16px", background: t.bgCard, borderRadius: 14,
              border: `1px solid ${t.border}`, marginBottom: 8
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: s.type === "Red Light" ? t.redBg : t.accentGlow,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                {s.type === "Red Light" ? <Sun size={18} color={t.red} /> : <Music size={18} color={t.accent} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.name}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{s.type} · {formatDuration(s.duration)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: t.textSec }}>{formatSessionTime(s.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Session stats */}
      <div style={{ display: "flex", gap: 10, padding: isDesktop ? "16px 40px 24px" : "16px 24px 24px" }}>
        {[
          { num: `${totalSessions}`, label: "Total Sessions" },
          { num: `${totalTimeHours}h`, label: "Total Time" },
          { num: avgPerDay, label: "Avg/Day" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: t.bgCard, borderRadius: 12, padding: "12px 10px",
            border: `1px solid ${t.border}`, textAlign: "center"
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.accent }}>{s.num}</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {!isDesktop && <NavBar active="progress" />}
    </div>
  );
}
