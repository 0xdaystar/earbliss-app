import { useApp } from "../context/AppContext";

export default function StatusBar() {
  const { t } = useApp();
  return (
    <div
      style={{
        padding: "12px 24px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 13,
        fontWeight: 600,
        color: t.text,
      }}
    >
      <span>
        {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: 10 }}>
          {[4, 6, 8, 10].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                background: t.text,
                borderRadius: 1,
                opacity: i < 3 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
          <rect x="0.5" y="0.5" width="17" height="9" rx="2" stroke={t.text} strokeWidth="1" fill="none" />
          <rect x="18.5" y="3" width="1.5" height="4" rx="0.5" fill={t.text} />
          <rect x="2" y="2" width="12" height="6" rx="1" fill={t.green} />
        </svg>
      </div>
    </div>
  );
}
