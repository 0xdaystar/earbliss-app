import { CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";


function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RedLightScreen({ timer, isDesktop }) {
  const { t, dark } = useApp();
  const {
    isRunning,
    isPaused,
    remaining,
    duration,
    elapsed,
    power,
    cyclePower,
    start,
    stop,
    togglePause,
    steps,
  } = timer;

  const displayTime = formatTime(remaining);
  const mins = displayTime.split(":")[0];
  const secs = displayTime.split(":")[1];
  const durationMin = Math.round(duration / 60);

  return (
    <div style={{ padding: "0 0 24px" }}>

      <div style={{ padding: isDesktop ? "32px 40px 0" : "20px 24px 0", textAlign: "center" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: t.red,
            marginBottom: 4,
          }}
        >
          Red Light Therapy
        </div>
        <div style={{ fontSize: isDesktop ? 26 : 22, fontWeight: 700, color: t.text }}>
          {isRunning ? "Session Active" : "Guided Session"}
        </div>
      </div>

      {/* Timer circle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isDesktop ? "40px 0 28px" : "32px 0 20px",
        }}
      >
        <div style={{ position: "relative" }}>
          {[50, 30].map((inset, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: -inset,
                borderRadius: "50%",
                border: `1px solid ${dark ? `rgba(239,107,107,${0.04 + i * 0.04})` : `rgba(212,80,80,${0.04 + i * 0.03})`}`,
              }}
            />
          ))}
          <div
            style={{
              width: isDesktop ? 200 : 170,
              height: isDesktop ? 200 : 170,
              borderRadius: "50%",
              background: isRunning
                ? `conic-gradient(from 180deg, ${t.red}, ${dark ? "#C45050" : "#EF6B6B"}, ${t.red})`
                : dark
                  ? "rgba(239,107,107,0.12)"
                  : "rgba(212,80,80,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isRunning
                ? `0 0 50px ${dark ? "rgba(239,107,107,0.15)" : "rgba(212,80,80,0.12)"}`
                : "none",
              transition: "all 0.5s ease",
            }}
          >
            <div
              style={{
                width: isDesktop ? 172 : 144,
                height: isDesktop ? 172 : 144,
                borderRadius: "50%",
                background: dark
                  ? "linear-gradient(135deg, #1A0E0E, #1A1224)"
                  : "linear-gradient(135deg, #FFFFFF, #F7F0F0)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: isDesktop ? 44 : 36,
                  fontWeight: 700,
                  color: t.text,
                  letterSpacing: -1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {mins}:{secs}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: t.red,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {isRunning ? "remaining" : "tap start"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session info */}
      <div style={{ display: "flex", gap: 10, padding: isDesktop ? "0 40px" : "0 24px" }}>
        <div
          style={{
            flex: 1,
            background: t.bgCard,
            borderRadius: 12,
            padding: "12px 10px",
            border: `1px solid ${t.border}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: t.red }}>{durationMin} min</div>
          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>Duration</div>
        </div>
        <div
          onClick={() => { if (!isRunning) cyclePower(); }}
          style={{
            flex: 1,
            background: t.bgCard,
            borderRadius: 12,
            padding: "12px 10px",
            border: `1px solid ${t.border}`,
            textAlign: "center",
            cursor: isRunning ? "default" : "pointer",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: t.yellow }}>{power}mW</div>
          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>
            Power{!isRunning ? " (tap)" : ""}
          </div>
        </div>
      </div>

      {/* Start button (when not running) */}
      {!isRunning && (
        <div style={{ padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
          <div
            onClick={start}
            style={{
              padding: "16px",
              borderRadius: 14,
              textAlign: "center",
              background: t.red,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 20px ${dark ? "rgba(239,107,107,0.3)" : "rgba(212,80,80,0.2)"}`,
            }}
          >
            Start Session
          </div>
        </div>
      )}

      {/* Guided steps */}
      <div style={{ padding: isDesktop ? "24px 40px 0" : "20px 24px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 14 }}>
          Guided Steps
        </div>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 4,
              position: "relative",
            }}
          >
            {i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 11,
                  top: 28,
                  bottom: -4,
                  width: 2,
                  background: s.done ? t.green : t.border,
                }}
              />
            )}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                flexShrink: 0,
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: s.done ? t.greenBg : s.active ? t.redBg : t.bgInput,
                border: `1.5px solid ${s.done ? t.green : s.active ? t.red : t.border}`,
              }}
            >
              {s.done ? (
                <CheckCircle size={14} color={t.green} />
              ) : s.active ? (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: t.red,
                    animation: "pulse 2s infinite",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: t.textMuted,
                    opacity: 0.4,
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.textMuted,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatTime(s.time)}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: s.done ? t.green : s.active ? t.text : t.textMuted,
                  }}
                >
                  {s.title}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: s.active ? t.textSec : t.textMuted,
                  lineHeight: 1.5,
                  marginTop: 2,
                }}
              >
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls (when running) */}
      {isRunning && (
        <div style={{ padding: isDesktop ? "16px 40px" : "16px 24px" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div
              onClick={togglePause}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 14,
                textAlign: "center",
                background: t.bgCard,
                border: `1px solid ${t.border}`,
                fontSize: 14,
                fontWeight: 600,
                color: t.textSec,
                cursor: "pointer",
              }}
            >
              {isPaused ? "Resume Session" : "Pause Session"}
            </div>
            <div
              onClick={stop}
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: 14,
                textAlign: "center",
                background: dark ? "rgba(239,107,107,0.15)" : "rgba(212,80,80,0.1)",
                border: `1px solid ${dark ? "rgba(239,107,107,0.2)" : "rgba(212,80,80,0.15)"}`,
                fontSize: 14,
                fontWeight: 600,
                color: t.red,
                cursor: "pointer",
              }}
            >
              End Session
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: t.textMuted,
              marginTop: 12,
            }}
          >
            Device will auto-stop when the session ends
          </div>
        </div>
      )}

    </div>
  );
}
