import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "earbliss_sessions";
const CHECKIN_KEY = "earbliss_checkins";
const STREAK_KEY = "earbliss_streak";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getDaysBetween(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

export function useProgress() {
  const [sessions, setSessions] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [streak, setStreak] = useState(0);

  // Load from localStorage
  const reload = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const s = raw ? JSON.parse(raw) : [];
    setSessions(s);

    const rawC = localStorage.getItem(CHECKIN_KEY);
    const c = rawC ? JSON.parse(rawC) : [];
    setCheckins(c);

    // Calculate streak
    const rawStreak = localStorage.getItem(STREAK_KEY);
    const streakData = rawStreak ? JSON.parse(rawStreak) : { count: 0, lastDate: null };
    setStreak(streakData.count);
  }, []);

  useEffect(() => {
    reload();
    // Listen for storage changes (other tabs)
    const handler = () => reload();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [reload]);

  const saveCheckin = useCallback((answers) => {
    const checkins = JSON.parse(localStorage.getItem(CHECKIN_KEY) || "[]");
    checkins.unshift({
      id: Date.now(),
      date: getToday(),
      timestamp: new Date().toISOString(),
      ...answers,
    });
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkins.slice(0, 365)));

    // Update streak
    const rawStreak = localStorage.getItem(STREAK_KEY);
    const streakData = rawStreak ? JSON.parse(rawStreak) : { count: 0, lastDate: null };
    const today = getToday();

    if (streakData.lastDate === today) {
      // Already checked in today
    } else if (streakData.lastDate && getDaysBetween(streakData.lastDate, today) === 1) {
      streakData.count += 1;
      streakData.lastDate = today;
    } else if (!streakData.lastDate || getDaysBetween(streakData.lastDate, today) > 1) {
      streakData.count = 1;
      streakData.lastDate = today;
    }
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
    reload();
  }, [reload]);

  // Computed stats
  const totalSessions = sessions.length;
  const totalTimeSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalTimeHours = (totalTimeSeconds / 3600).toFixed(1);

  // Sessions in last 7 days
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentSessions = sessions.filter((s) => new Date(s.timestamp).getTime() > weekAgo);
  const avgPerDay = recentSessions.length > 0 ? (recentSessions.length / 7).toFixed(1) : "0";

  // Weekly completion (which days had sessions)
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    const hasSessions = sessions.some((s) => s.timestamp && s.timestamp.startsWith(dateStr));
    weekDays.push({
      label: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()],
      date: dateStr,
      completed: hasSessions,
      isToday: dateStr === getToday(),
    });
  }

  // Recent checkin severity trend (last 7)
  const recentCheckins = checkins.slice(0, 7);
  const severityTrend = recentCheckins.map((c) => c.severity || 3).reverse();

  // Improvement estimate (compare first vs last severity)
  let improvement = 0;
  if (checkins.length >= 2) {
    const first = checkins[checkins.length - 1].severity || 5;
    const last = checkins[0].severity || 3;
    improvement = Math.max(0, Math.round(((first - last) / first) * 100));
  }

  return {
    sessions,
    checkins,
    streak,
    totalSessions,
    totalTimeHours,
    avgPerDay,
    weekDays,
    severityTrend,
    improvement,
    saveCheckin,
    reload,
    recentSessions: sessions.slice(0, 5),
  };
}
