import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { darkTheme, lightTheme } from "../utils/theme";
import { supabase } from "../lib/supabase";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [dark, setDark] = useState(true);
  const [screen, setScreen] = useState("therapy");
  const [appView, setAppView] = useState("loading"); // loading, login, onboarding, main, checkin
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const t = dark ? darkTheme : lightTheme;
  const loggedIn = !!user;

  const toggleTheme = useCallback(() => setDark((d) => !d), []);

  const navigate = useCallback((screenId) => {
    setScreen(screenId);
    setAppView("main");
  }, []);

  // Navigate to a screen, but require auth for protected screens
  const protectedScreens = ["redlight", "progress", "account"];
  const navigateWithAuth = useCallback((screenId) => {
    if (!user && protectedScreens.includes(screenId)) {
      if (screenId === "account") {
        setAppView("login");
      } else {
        setShowLoginModal(true);
      }
      return;
    }
    setScreen(screenId);
    setAppView("main");
  }, [user]);

  // Check if user has completed onboarding
  const checkOnboardingStatus = useCallback(async (userId) => {
    if (!supabase) return false;
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .single();
    return data?.onboarding_completed ?? false;
  }, []);

  // Route user to the right view based on auth + onboarding status
  const routeUser = useCallback(async (session) => {
    if (!session?.user) {
      setUser(null);
      setAppView("main"); // Allow unauthenticated access to therapy
      setAuthLoading(false);
      return;
    }
    setUser(session.user);
    const completed = await checkOnboardingStatus(session.user.id);
    setAppView(completed ? "main" : "onboarding");
    setAuthLoading(false);
  }, [checkOnboardingStatus]);

  // Mark onboarding as done
  const completeOnboarding = useCallback(async (answers) => {
    if (!user) return;
    if (supabase) {
      await supabase.from("profiles").upsert({
        id: user.id,
        onboarding_completed: true,
        onboarding_answers: answers,
        updated_at: new Date().toISOString(),
      });
    }
    setAppView("main");
  }, [user]);

  // Sign out
  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setScreen("therapy");
    setAppView("main");
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!supabase) {
      // No Supabase configured — allow therapy access
      setAppView("main");
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      routeUser(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        routeUser(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [routeUser]);

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
        user,
        loggedIn,
        navigate,
        navigateWithAuth,
        authLoading,
        showLoginModal,
        setShowLoginModal,
        completeOnboarding,
        signOut,
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
