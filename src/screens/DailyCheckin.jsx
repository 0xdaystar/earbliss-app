import { useState } from "react";
import { CheckCircle, Smile, Meh, Frown } from "lucide-react";
import { useApp } from "../context/AppContext";


const STEPS = [
  {
    type: "severity",
    question: "How loud is your tinnitus right now?",
    subtext: "Compare to when you first started the program",
    options: [
      { value: 1, label: "Barely noticeable", Icon: Smile, colorKey: "green" },
      { value: 2, label: "Mild — there but not bothersome", Icon: Smile, colorKey: "green" },
      { value: 3, label: "Moderate — noticeable and distracting", Icon: Meh, colorKey: "yellow" },
      { value: 4, label: "Loud — hard to ignore", Icon: Frown, colorKey: "yellow" },
      { value: 5, label: "Very loud — overwhelming", Icon: Frown, colorKey: "red" },
    ],
  },
  {
    type: "sleep",
    question: "How did you sleep last night?",
    subtext: "Think about how tinnitus affected your rest",
    options: [
      { value: 1, label: "Great — slept through the night", colorKey: "green" },
      { value: 2, label: "Good — woke once but fell back asleep", colorKey: "green" },
      { value: 3, label: "Fair — took a while to fall asleep", colorKey: "yellow" },
      { value: 4, label: "Poor — tinnitus kept me awake", colorKey: "red" },
      { value: 5, label: "Terrible — barely slept", colorKey: "red" },
    ],
  },
  {
    type: "impact",
    question: "How is tinnitus affecting you today?",
    subtext: "Select all that apply",
    options: [
      { label: "Can't concentrate" },
      { label: "Feeling stressed or anxious" },
      { label: "Avoiding quiet spaces" },
      { label: "Irritable or frustrated" },
      { label: "None — feeling good today" },
    ],
    multi: true,
  },
  {
    type: "sessions",
    question: "Did you complete your sessions yesterday?",
    subtext: "Track your consistency",
    options: [
      { label: "Sound therapy + Red light", colorKey: "green" },
      { label: "Sound therapy only", colorKey: "accent" },
      { label: "Red light only", colorKey: "red" },
      { label: "Skipped yesterday", colorKey: "textMuted" },
    ],
  },
];

export default function DailyCheckin({ progress, isDesktop }) {
  const { t, dark, setAppView } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSelections, setMultiSelections] = useState({});

  const isDone = step >= STEPS.length;
  const current = STEPS[step];

  const handleSelect = (value) => {
    setAnswers({ ...answers, [current.type]: value });
    setStep(step + 1);

    // If completing last step, save
    if (step === STEPS.length - 1) {
      const finalAnswers = { ...answers, [current.type]: value };
      progress.saveCheckin({
        severity: finalAnswers.severity,
        sleep: finalAnswers.sleep,
        impact: Object.keys(multiSelections).filter((k) => multiSelections[k]),
        sessions: finalAnswers.sessions,
      });
    }
  };

  const handleMultiContinue = () => {
    const selected = Object.keys(multiSelections).filter((k) => multiSelections[k]);
    setAnswers({ ...answers, impact: selected });
    setStep(step + 1);
  };

  if (isDone) {
    const { streak, severityTrend } = progress;
    const trend = severityTrend.length > 0 ? severityTrend : [4, 4, 3, 3, 3, 2, 2];

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minHeight: 0 }}>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: t.greenBg, border: `2px solid ${t.greenBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          }}>
            <CheckCircle size={36} color={t.green} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, textAlign: "center", marginBottom: 8 }}>Check-in Complete</div>
          <div style={{ fontSize: 14, color: t.textSec, textAlign: "center", lineHeight: 1.6, marginBottom: 12 }}>
            Your data has been logged. Keep it up — consistency is how recovery works.
          </div>

          {/* Streak */}
          <div style={{
            background: t.accentGlow, borderRadius: 14, padding: "16px 24px",
            border: `1px solid ${t.accentBorder}`, textAlign: "center", marginBottom: 28,
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: t.accent }}>{streak}</div>
            <div style={{ fontSize: 12, color: t.textSec }}>Day check-in streak</div>
          </div>

          {/* Trend */}
          <div style={{
            width: "100%", background: t.bgCard, borderRadius: 14,
            padding: 18, border: `1px solid ${t.border}`, marginBottom: 28,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>Your 7-day trend</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
              {trend.map((v, i) => (
                <div key={i} style={{
                  flex: 1, height: `${v * 20}%`, borderRadius: 4,
                  background: i === trend.length - 1 ? t.accent : (v <= 2 ? `${t.green}90` : v <= 3 ? `${t.yellow}90` : `${t.red}60`),
                }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: t.textMuted }}>{d}</span>
              ))}
            </div>
          </div>

          <div onClick={() => setAppView("main")} style={{
            width: "100%", padding: "16px", borderRadius: 14, textAlign: "center",
            background: t.accent, color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
          }}>Continue to App</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minHeight: 0 }}>


      {/* Header */}
      <div style={{ padding: isDesktop ? "24px 40px 0" : "16px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: t.accent }}>Morning Check-in</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>{new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</div>
        </div>
        <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12 }}>Takes about 30 seconds</div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? t.accent : t.barTrack,
              opacity: i < step ? 0.4 : 1,
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: isDesktop ? "28px 40px" : "24px 24px" }}>
        <div style={{ fontSize: isDesktop ? 22 : 20, fontWeight: 700, color: t.text, lineHeight: 1.35, marginBottom: 6 }}>
          {current.question}
        </div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 24 }}>{current.subtext}</div>

        {/* Severity with face icons */}
        {current.type === "severity" && current.options.map((opt, i) => (
          <div key={i} onClick={() => handleSelect(opt.value)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px", borderRadius: 14, marginBottom: 10,
            background: t.bgCard, border: `1px solid ${t.border}`, cursor: "pointer",
          }}>
            <opt.Icon size={26} color={t[opt.colorKey]} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{opt.label}</div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${t[opt.colorKey]}15`, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: t[opt.colorKey],
            }}>{opt.value}</div>
          </div>
        ))}

        {/* Sleep */}
        {current.type === "sleep" && current.options.map((opt, i) => (
          <div key={i} onClick={() => handleSelect(opt.value)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px", borderRadius: 14, marginBottom: 10,
            background: t.bgCard, border: `1px solid ${t.border}`, cursor: "pointer",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: t[opt.colorKey], flexShrink: 0 }} />
            <span style={{ fontSize: 15, color: t.text }}>{opt.label}</span>
          </div>
        ))}

        {/* Impact — multi */}
        {current.multi && (
          <>
            {current.options.map((opt, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 18px", borderRadius: 14, marginBottom: 10,
                background: multiSelections[opt.label] ? t.accentGlow : t.bgCard,
                border: `1px solid ${multiSelections[opt.label] ? t.accentBorder : t.border}`,
                cursor: "pointer",
              }} onClick={() => setMultiSelections({ ...multiSelections, [opt.label]: !multiSelections[opt.label] })}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${multiSelections[opt.label] ? t.accent : t.border}`,
                  background: multiSelections[opt.label] ? t.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {multiSelections[opt.label] && <CheckCircle size={14} color="white" />}
                </div>
                <span style={{ fontSize: 15, color: t.text }}>{opt.label}</span>
              </div>
            ))}
            <div onClick={handleMultiContinue} style={{
              padding: "14px", borderRadius: 12, textAlign: "center", marginTop: 8,
              background: t.accent, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>Continue</div>
          </>
        )}

        {/* Sessions */}
        {current.type === "sessions" && current.options.map((opt, i) => (
          <div key={i} onClick={() => handleSelect(opt.label)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 18px", borderRadius: 14, marginBottom: 10,
            background: t.bgCard, border: `1px solid ${t.border}`, cursor: "pointer",
          }}>
            <CheckCircle size={20} color={t[opt.colorKey]} />
            <span style={{ fontSize: 15, color: t.text }}>{opt.label}</span>
          </div>
        ))}
      </div>

      {/* Back */}
      {step > 0 && !current.multi && (
        <div style={{ padding: "0 24px 16px" }}>
          <div onClick={() => setStep(step - 1)} style={{
            textAlign: "center", fontSize: 14, fontWeight: 600, color: t.textSec, cursor: "pointer",
          }}>← Back</div>
        </div>
      )}

      {/* Skip */}
      <div style={{ textAlign: "center", padding: "0 24px 20px" }}>
        <span onClick={() => setAppView("main")} style={{ fontSize: 13, color: t.textMuted, cursor: "pointer" }}>Skip for now</span>
      </div>
    </div>
  );
}
