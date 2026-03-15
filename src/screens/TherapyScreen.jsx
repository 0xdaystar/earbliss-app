import {
  SkipBack,
  SkipForward,
  Pause,
  Play,
  Volume1,
  Volume2,
  Moon,
  Radio,
} from "lucide-react";
import { useApp } from "../context/AppContext";


function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TherapyScreen({ soundEngine, isDesktop }) {
  const { t, dark } = useApp();
  const {
    isPlaying,
    currentSound,
    volume,
    remaining,
    togglePlayPause,
    changeSound,
    changeVolume,
    presets,
    presetNames,
    bedtimeEnabled,
    setBedtimeEnabled,
    bedtimeDuration,
    setBedtimeDuration,
    bedtimeTimeLeft,
    customFrequency,
    changeCustomFrequency,
  } = soundEngine;

  const preset = presets[currentSound];
  const displayTime = formatTime(remaining);
  const mins = displayTime.split(":")[0];
  const secs = displayTime.split(":")[1];

  // Generate waveform bars based on playing state
  const waveHeights = Array.from({ length: 35 }, (_, i) => {
    const base = 18 + Math.sin(i * 0.5) * 15 + Math.cos(i * 0.3) * 10;
    return isPlaying ? base + Math.random() * 8 : base * 0.4;
  });

  const bedtimeOptions = [
    { label: "15 min", value: 15 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "1 hour", value: 60 },
  ];

  return (
    <div style={{ padding: "0 0 24px" }}>

      <div style={{ padding: isDesktop ? "32px 40px 0" : "20px 24px 0", textAlign: "center" }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: t.accent,
            marginBottom: 4,
          }}
        >
          Sound Therapy
        </div>
        <div style={{ fontSize: isDesktop ? 26 : 22, fontWeight: 700, color: t.text }}>
          {isPlaying ? "Session Active" : "Ready to Start"}
        </div>
      </div>

      {/* Timer circle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isDesktop ? "48px 0 36px" : "36px 0 24px",
        }}
      >
        <div style={{ position: "relative" }}>
          {[55, 35, 15].map((inset, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: -inset,
                borderRadius: "50%",
                border: `1px solid ${dark ? `rgba(91,141,239,${0.04 + i * 0.04})` : `rgba(59,111,212,${0.04 + i * 0.03})`}`,
              }}
            />
          ))}
          <div
            style={{
              width: isDesktop ? 240 : 200,
              height: isDesktop ? 240 : 200,
              borderRadius: "50%",
              background: isPlaying
                ? `conic-gradient(from 180deg, ${t.accent}, ${dark ? "#3B6FD4" : "#5B8DEF"}, ${t.accent})`
                : dark
                  ? "rgba(91,141,239,0.15)"
                  : "rgba(59,111,212,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isPlaying
                ? `0 0 60px ${dark ? "rgba(91,141,239,0.2)" : "rgba(59,111,212,0.15)"}`
                : "none",
              transition: "all 0.5s ease",
            }}
          >
            <div
              style={{
                width: isDesktop ? 210 : 172,
                height: isDesktop ? 210 : 172,
                borderRadius: "50%",
                background: dark
                  ? "linear-gradient(135deg, #0D1224, #131A30)"
                  : "linear-gradient(135deg, #FFFFFF, #F0F2F7)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: isDesktop ? 48 : 40,
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
                  color: t.accent,
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {isPlaying ? "remaining" : "tap play"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sound wave visualization */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2.5,
          padding: "0 32px",
          height: 44,
        }}
      >
        {waveHeights.map((h, i) => (
          <div
            key={i}
            style={{
              width: isDesktop ? 4 : 2.5,
              height: h * 0.65,
              borderRadius: 2,
              background:
                isPlaying && i >= 12 && i <= 22
                  ? `linear-gradient(to top, ${t.accent}, ${dark ? "#7BA4F7" : "#8BB5FF"})`
                  : dark
                    ? "rgba(91,141,239,0.15)"
                    : "rgba(59,111,212,0.12)",
              transition: "height 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Now Playing */}
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <div style={{ fontSize: 12, color: t.textMuted }}>
          {isPlaying ? "Now Playing" : "Selected"}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginTop: 2 }}>
          {currentSound === "Custom Hz"
            ? `Custom — ${customFrequency} Hz`
            : `${currentSound} — ${preset?.description?.split(" ")[0] || ""} Hz`}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          marginTop: 28,
        }}
      >
        {["prev", "play", "next"].map((btn) => {
          const handleClick = () => {
            if (btn === "play") {
              togglePlayPause();
            } else {
              const idx = presetNames.indexOf(currentSound);
              const next =
                btn === "prev"
                  ? presetNames[(idx - 1 + presetNames.length) % presetNames.length]
                  : presetNames[(idx + 1) % presetNames.length];
              changeSound(next);
            }
          };
          return (
            <div
              key={btn}
              onClick={handleClick}
              style={{
                width: btn === "play" ? 64 : 44,
                height: btn === "play" ? 64 : 44,
                borderRadius: "50%",
                background:
                  btn === "play"
                    ? t.accent
                    : dark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.04)",
                border: btn === "play" ? "none" : `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  btn === "play"
                    ? `0 4px 20px ${dark ? "rgba(91,141,239,0.35)" : "rgba(59,111,212,0.25)"}`
                    : "none",
                cursor: "pointer",
                transition: "transform 0.1s",
              }}
            >
              {btn === "play" ? (
                isPlaying ? (
                  <Pause size={24} color="white" />
                ) : (
                  <Play size={24} color="white" style={{ marginLeft: 2 }} />
                )
              ) : btn === "prev" ? (
                <SkipBack size={20} color={t.textMuted} />
              ) : (
                <SkipForward size={20} color={t.textMuted} />
              )}
            </div>
          );
        })}
      </div>

      {/* Volume */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "24px 36px 0" }}>
        <Volume1 size={16} color={t.textMuted} />
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            style={{
              width: "100%",
              height: 4,
              appearance: "none",
              background: `linear-gradient(to right, ${t.accent} ${volume * 100}%, ${t.barTrack} ${volume * 100}%)`,
              borderRadius: 2,
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>
        <Volume2 size={16} color={t.textMuted} />
      </div>

      {/* Sound selection — grid */}
      <div style={{ padding: "20px 24px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 12 }}>
          Sound Library
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {presetNames.map((s, i) => {
            const active = s === currentSound;
            return (
              <div
                key={i}
                onClick={() => changeSound(s)}
                style={{
                  padding: "14px 10px",
                  borderRadius: 14,
                  textAlign: "center",
                  background: active ? t.accentGlow : t.bgCard,
                  border: `1px solid ${active ? t.accentBorder : t.border}`,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: active ? t.accent : t.text,
                  }}
                >
                  {s}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom frequency controls */}
      {currentSound === "Custom Hz" && (
        <div style={{ padding: "16px 24px 0" }}>
          <div
            style={{
              background: t.bgCard,
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${t.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Radio size={18} color={t.accent} />
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>
                Custom Frequency
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  fontSize: 18,
                  fontWeight: 700,
                  color: t.accent,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {customFrequency} Hz
              </div>
            </div>
            <input
              type="range"
              min="20"
              max="20000"
              step="1"
              value={customFrequency}
              onChange={(e) => changeCustomFrequency(parseInt(e.target.value))}
              style={{
                width: "100%",
                height: 4,
                appearance: "none",
                background: `linear-gradient(to right, ${t.accent} ${((customFrequency - 20) / (20000 - 20)) * 100}%, ${t.barTrack} ${((customFrequency - 20) / (20000 - 20)) * 100}%)`,
                borderRadius: 2,
                outline: "none",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 6,
                fontSize: 11,
                color: t.textMuted,
              }}
            >
              <span>20 Hz</span>
              <span>20,000 Hz</span>
            </div>
            {/* Quick frequency presets */}
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              {[128, 256, 432, 440, 528, 1000, 6000, 10000].map((f) => (
                <div
                  key={f}
                  onClick={() => changeCustomFrequency(f)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    background: customFrequency === f ? t.accentGlow : t.bgInput,
                    color: customFrequency === f ? t.accent : t.textMuted,
                    border: `1px solid ${customFrequency === f ? t.accentBorder : t.border}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {f >= 1000 ? `${f / 1000}k` : f} Hz
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bedtime Mode */}
      <div style={{ padding: "24px 24px 24px" }}>
        <div
          style={{
            background: dark
              ? "linear-gradient(135deg, #0D1020, #141830)"
              : "linear-gradient(135deg, #ECEDF4, #E0E2ED)",
            borderRadius: 16,
            padding: 20,
            border: `1px solid ${t.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Moon size={20} color={dark ? "#8B9FD4" : "#6B7FB0"} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>Bedtime Mode</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>
                  {bedtimeEnabled && bedtimeTimeLeft
                    ? `Fading out in ${formatTime(bedtimeTimeLeft)}`
                    : "Sound fades as you fall asleep"}
                </div>
              </div>
            </div>
            <div
              onClick={() => setBedtimeEnabled(!bedtimeEnabled)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: bedtimeEnabled
                  ? dark
                    ? "rgba(91,141,239,0.3)"
                    : "rgba(59,111,212,0.25)"
                  : t.barTrack,
                display: "flex",
                alignItems: "center",
                padding: 2,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: bedtimeEnabled ? t.accent : t.textMuted,
                  marginLeft: bedtimeEnabled ? 20 : 0,
                  transition: "margin-left 0.2s, background 0.2s",
                  boxShadow: bedtimeEnabled
                    ? `0 2px 6px ${dark ? "rgba(91,141,239,0.3)" : "rgba(59,111,212,0.25)"}`
                    : "none",
                }}
              />
            </div>
          </div>
          {bedtimeEnabled && (
            <div style={{ display: "flex", gap: 8 }}>
              {bedtimeOptions.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => setBedtimeDuration(opt.value)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 10,
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      bedtimeDuration === opt.value
                        ? dark
                          ? "rgba(139,159,212,0.15)"
                          : "rgba(107,127,176,0.1)"
                        : t.bgInput,
                    color:
                      bedtimeDuration === opt.value
                        ? dark
                          ? "#8B9FD4"
                          : "#6B7FB0"
                        : t.textMuted,
                    border:
                      bedtimeDuration === opt.value
                        ? `1px solid ${dark ? "rgba(139,159,212,0.2)" : "rgba(107,127,176,0.15)"}`
                        : `1px solid ${t.border}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
