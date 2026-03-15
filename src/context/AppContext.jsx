import { createContext, useContext, useState, useCallback } from "react";
import { darkTheme, lightTheme } from "../utils/theme";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState("therapy");
  const [appView, setAppView] = useState("main"); // main, login, onboarding, checkin
  const [loggedIn, setLoggedIn] = useState(false);

  const t = dark ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => setDark((d) => !d), []);

  const navigate = useCallback((screenId) => {
    setScreen(screenId);
    setAppView("main");
  }, []);

  return (
    <AppContext.Provider
      value={{
        dark,
        setDark,
        t,
        toggleTheme,
        screen,
        setScreen,
        appView,
        setAppView,
        loggedIn,
        setLoggedIn,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
