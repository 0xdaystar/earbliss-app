import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";


const quizQuestions = [
  {
    question: "What best describes your tinnitus?",
    options: ["Constant ringing", "Intermittent buzzing", "Hissing or humming", "Clicking or pulsing", "Multiple sounds"],
  },
  {
    question: "How long have you had tinnitus?",
    options: ["Less than 3 months", "3-12 months", "1-3 years", "3-5 years", "More than 5 years"],
  },
  {
    question: "When is your tinnitus the worst?",
    options: ["At bedtime", "In quiet rooms", "During work/focus", "All the time", "It varies"],
  },
  {
    question: "How severely does it affect your daily life?",
    options: ["Mild — noticeable but manageable", "Moderate — affects sleep or focus", "Significant — impacts most activities", "Severe — hard to function normally"],
  },
  {
    question: "What have you tried before?",
    options: ["Nothing yet", "Supplements or vitamins", "Sound machines or apps", "Hearing aids", "ENT or doctor visits", "Multiple of the above"],
  },
  {
    question: "What's your #1 goal with EarBliss?",
    options: ["Sleep better at night", "Reduce the ringing volume", "Improve focus and concentration", "Feel less stressed and anxious", "All of the above"],
  },
];

export default function OnboardingScreen({ isDesktop }) {
  const { t, dark, setLoggedIn, setAppView } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const isResults = step >= quizQuestions.length;
  const currentQ = quizQuestions[step];

  const selectOption = (optionIdx) => {
    setAnswers({ ...answers, [step]: optionIdx });
    setStep(step + 1);
  };

  if (isResults) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minHeight: 0 }}>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: t.greenBg, border: `2px solid ${t.greenBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
          }}>
            <CheckCircle size={36} color={t.green} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, textAlign: "center", marginBottom: 8 }}>
            Your Personalized Relief Plan is Ready
          </div>
          <div style={{ fontSize: 14, color: t.textSec, textAlign: "center", lineHeight: 1.6, marginBottom: 28 }}>
            Based on your answers, we've customized your EarBliss program for maximum relief.
          </div>

          <div style={{ width: "100%", marginBottom: 24 }}>
            {[
              { label: "Recommended Focus", value: "Bedtime Relief", color: t.accent },
              { label: "Sound Therapy", value: "Deep Calm + Night Rain", color: t.accent },
              { label: "Red Light Sessions", value: "1x daily, 10 min", color: t.red },
              { label: "Expected Timeline", value: "2-4 weeks for improvement", color: t.green },
            ].map((r, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 16px", background: t.bgCard, borderRadius: 12,
                border: `1px solid ${t.border}`, marginBottom: 8,
              }}>
                <span style={{ fontSize: 13, color: t.textMuted }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div onClick={() => { setLoggedIn(true); setAppView("main"); }} style={{
            width: "100%", padding: "16px", borderRadius: 14, textAlign: "center",
            background: t.accent, color: "white", fontSize: 16, fontWeight: 700,
            cursor: "pointer", boxShadow: `0 4px 16px ${dark ? "rgba(91,141,239,0.3)" : "rgba(59,111,212,0.2)"}`,
          }}>Start Your Relief Program</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minHeight: 0 }}>


      {/* Progress bar */}
      <div style={{ padding: "16px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.textSec }}>Question {step + 1} of {quizQuestions.length}</span>
          <span style={{ fontSize: 12, color: t.textMuted }}>{Math.round(((step + 1) / quizQuestions.length) * 100)}%</span>
        </div>
        <div style={{ height: 4, background: t.barTrack, borderRadius: 2 }}>
          <div style={{
            width: `${((step + 1) / quizQuestions.length) * 100}%`,
            height: "100%", background: t.accent, borderRadius: 2,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: isDesktop ? "32px 40px" : "28px 24px" }}>
        <div style={{ fontSize: isDesktop ? 22 : 20, fontWeight: 700, color: t.text, lineHeight: 1.4, marginBottom: 28 }}>
          {currentQ.question}
        </div>

        {currentQ.options.map((opt, i) => (
          <div
            key={i}
            onClick={() => selectOption(i)}
            style={{
              padding: "16px 18px", borderRadius: 14, marginBottom: 10,
              background: t.bgCard, border: `1px solid ${t.border}`,
              fontSize: 15, color: t.text, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: `2px solid ${t.border}`, flexShrink: 0,
            }} />
            <span>{opt}</span>
          </div>
        ))}
      </div>

      {step > 0 && (
        <div style={{ padding: "0 24px 20px" }}>
          <div onClick={() => setStep(step - 1)} style={{
            textAlign: "center", fontSize: 14, fontWeight: 600, color: t.textSec, cursor: "pointer"
          }}>← Back</div>
        </div>
      )}

      {/* Skip link */}
      <div style={{ textAlign: "center", padding: "0 24px 20px" }}>
        <span onClick={() => setAppView("main")} style={{ fontSize: 13, color: t.textMuted, cursor: "pointer" }}>Skip for now</span>
      </div>
    </div>
  );
}
