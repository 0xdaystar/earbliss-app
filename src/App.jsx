import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { useSoundEngine } from "./hooks/useSoundEngine";
import { useRedLightTimer } from "./hooks/useRedLightTimer";
import { useProgress } from "./hooks/useProgress";
import DesktopSidebar from "./components/DesktopSidebar";
import NavBar from "./components/NavBar";
import TherapyScreen from "./screens/TherapyScreen";
import RedLightScreen from "./screens/RedLightScreen";
import ProgressScreen from "./screens/ProgressScreen";
import AccountScreen from "./screens/AccountScreen";
import LoginScreen from "./screens/LoginScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import DailyCheckin from "./screens/DailyCheckin";

function AppShell() {
  const { screen, appView, t, dark } = useApp();
  const soundEngine = useSoundEngine();
  const redLightTimer = useRedLightTimer();
  const progress = useProgress();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update theme-color meta tag and body background when theme changes
  useEffect(() => {
    const bg = dark ? "#0A0E1A" : "#F5F7FA";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
    document.body.style.background = bg;
  }, [dark]);

  const isDesktop = windowWidth >= 768;
  const showNav = !isDesktop && appView === "main";

  let content;
  if (appView === "login") {
    content = <LoginScreen isDesktop={isDesktop} />;
  } else if (appView === "onboarding") {
    content = <OnboardingScreen isDesktop={isDesktop} />;
  } else if (appView === "checkin") {
    content = <DailyCheckin progress={progress} isDesktop={isDesktop} />;
  } else {
    switch (screen) {
      case "therapy":
        content = <TherapyScreen soundEngine={soundEngine} isDesktop={isDesktop} />;
        break;
      case "redlight":
        content = <RedLightScreen timer={redLightTimer} isDesktop={isDesktop} />;
        break;
      case "progress":
        content = <ProgressScreen progress={progress} isDesktop={isDesktop} />;
        break;
      case "account":
        content = <AccountScreen progress={progress} isDesktop={isDesktop} />;
        break;
      default:
        content = <TherapyScreen soundEngine={soundEngine} isDesktop={isDesktop} />;
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        background: t.bg,
        display: "flex",
        overflow: "hidden",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {isDesktop && appView === "main" && <DesktopSidebar />}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div style={{ flex: 1, overflow: "auto", minHeight: 0, WebkitOverflowScrolling: "touch" }}>
          {content}
        </div>
        {showNav && <NavBar active={screen} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
