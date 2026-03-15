import { useState, useRef, useCallback, useEffect } from "react";

const GUIDED_STEPS = [
  { time: 0, title: "Prepare", desc: "Find a quiet, comfortable spot. Sit or recline." },
  { time: 30, title: "Insert Device", desc: "Place EarBliss Hush in both ears and get comfortable." },
  { time: 60, title: "Start Session", desc: "Press the button on the device. The red light activates automatically." },
  { time: 90, title: "Relax & Breathe", desc: "Close your eyes. Take slow, deep breaths. Let your body settle." },
  { time: 300, title: "Midpoint Check", desc: "You're halfway. Stay relaxed. The light is working at the cellular level." },
  { time: 480, title: "Final Stretch", desc: "Two minutes remaining. Continue breathing deeply." },
  { time: 600, title: "Session Complete", desc: "Remove the device. Log how your tinnitus feels right now." },
];

export function useRedLightTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(10 * 60); // 10 min default
  const [elapsed, setElapsed] = useState(0);
  const [selectedEar, setSelectedEar] = useState("Both");
  const [power, setPower] = useState(5); // mW: cycles 5 → 8 → 10

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pauseOffsetRef = useRef(0);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setElapsed(0);
    pauseOffsetRef.current = 0;
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const e = Math.floor((now - startTimeRef.current) / 1000) + pauseOffsetRef.current;
      setElapsed(e);
    }, 250);
  }, []);

  const pause = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPaused(true);
    pauseOffsetRef.current = elapsed;
  }, [elapsed]);

  const resume = useCallback(() => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const e = Math.floor((now - startTimeRef.current) / 1000) + pauseOffsetRef.current;
      setElapsed(e);
    }, 250);
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);

    // Save session if meaningful
    if (elapsed > 30) {
      const sessions = JSON.parse(localStorage.getItem("earbliss_sessions") || "[]");
      sessions.unshift({
        id: Date.now(),
        type: "Red Light",
        name: "EarBliss Hush",
        duration: elapsed,
        ear: selectedEar,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("earbliss_sessions", JSON.stringify(sessions.slice(0, 100)));
    }

    setElapsed(0);
    pauseOffsetRef.current = 0;
  }, [elapsed, selectedEar]);

  const togglePause = useCallback(() => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  const cyclePower = useCallback(() => {
    setPower((prev) => {
      if (prev === 5) return 8;
      if (prev === 8) return 10;
      return 5;
    });
  }, []);

  // Auto-stop when time's up
  useEffect(() => {
    if (isRunning && elapsed >= duration) {
      stop();
    }
  }, [isRunning, elapsed, duration, stop]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const remaining = Math.max(0, duration - elapsed);

  // Determine which guided steps are done/active
  const stepsWithStatus = GUIDED_STEPS.map((step, i) => {
    const nextStep = GUIDED_STEPS[i + 1];
    const done = elapsed >= (nextStep ? nextStep.time : duration);
    const active = !done && elapsed >= step.time;
    return { ...step, done, active };
  });

  return {
    isRunning,
    isPaused,
    duration,
    setDuration,
    elapsed,
    remaining,
    selectedEar,
    setSelectedEar,
    power,
    cyclePower,
    start,
    pause,
    resume,
    stop,
    togglePause,
    steps: stepsWithStatus,
  };
}
