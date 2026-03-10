import "../global.css";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/services/supabase/client";
import {
  initializePurchases,
  loginUser,
  logoutUser,
} from "@/services/revenuecat/purchaseService";
import { mapProfileToUser } from "@/features/auth/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  useSubscriptionStore,
  setupSubscriptionListener,
  removeSubscriptionListener,
} from "@/stores/subscriptionStore";
import type { Session } from "@supabase/supabase-js";
import { FREE_TRIAL_KEY } from "@/constants/examConfig";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function useHasHydrated(): boolean {
  return useSyncExternalStore(
    useSettingsStore.persist.onFinishHydration,
    () => useSettingsStore.persist.hasHydrated(),
    () => false
  );
}

function useProtectedRoute(session: Session | null, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const { onboardingComplete } = useSettingsStore();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    if (isLoading || !hasHydrated) return;

    const inOnboarding = segments[0] === "(onboarding)";

    if (!onboardingComplete && !inOnboarding) {
      router.replace("/(onboarding)/welcome");
    } else if (onboardingComplete && inOnboarding) {
      router.replace("/(tabs)");
    }
  }, [session, isLoading, hasHydrated, segments, onboardingComplete]);
}

function hideSplashWhenHydrated() {
  if (useSettingsStore.persist.hasHydrated()) {
    SplashScreen.hideAsync();
  } else {
    useSettingsStore.persist.onFinishHydration(() => {
      SplashScreen.hideAsync();
    });
  }
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setLoading } = useAuthStore();
  const { setSettingsFromProfile, resetSettings } = useSettingsStore();
  const { checkSubscription, reset: resetSubscription } =
    useSubscriptionStore();

  // Shared logic for hydrating user + settings from a Supabase session.
  // Anonymous users only get setUser (for exam_sessions RLS) - we skip the
  // profile fetch and settings sync so onboarding_complete=false on the
  // server doesn't redirect them away from the exam flow.
  const syncSessionUser = async (session: Session) => {
    const { user: authUser } = session;
    const isAnonymous = authUser.is_anonymous === true;

    loginUser(authUser.id).then(() => {
      if (!isAnonymous) checkSubscription();
    });

    if (isAnonymous) {
      // Still set a minimal user so RLS-gated inserts (exam_sessions) work
      setUser({
        id: authUser.id,
        email: undefined,
        authType: "anonymous",
        onboardingComplete: false,
        hasUsedFreeTrial: false,
        targetExamLevel: "B2",
        targetExamDate: new Date(),
        dailyPracticeGoal: 45,
        createdAt: new Date(authUser.created_at),
        updatedAt: new Date(authUser.updated_at ?? authUser.created_at),
      });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (!profile) return;

    // Sync local free trial flag to profile if needed
    if (!profile.has_used_free_trial) {
      const localFlag = await AsyncStorage.getItem(FREE_TRIAL_KEY);
      if (localFlag === "true") {
        profile.has_used_free_trial = true;
        supabase
          .from("profiles")
          .update({ has_used_free_trial: true })
          .eq("id", authUser.id)
          .then(() => AsyncStorage.removeItem(FREE_TRIAL_KEY));
      }
    }

    setUser(mapProfileToUser(profile, authUser));
    setSettingsFromProfile({
      targetExamLevel: profile.target_exam_level ?? "B2",
      targetExamDate: profile.target_exam_date ?? null,
      dailyPracticeGoal: profile.daily_practice_goal ?? 45,
      onboardingComplete: profile.onboarding_complete ?? false,
    });
  };

  useEffect(() => {
    initializePurchases().then((initialized) => {
      if (initialized) setupSubscriptionListener();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) syncSessionUser(session);
      setLoading(false);
      setIsLoading(false);
      hideSplashWhenHydrated();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setUser(null);
        resetSettings();
        logoutUser();
        resetSubscription();
        return;
      }
      syncSessionUser(session);
    });

    return () => {
      subscription.unsubscribe();
      removeSubscriptionListener();
    };
  }, []);

  useProtectedRoute(session, isLoading);

  return (
    <ElevenLabsProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="exam" />
          <Stack.Screen
            name="paywall"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
    </ElevenLabsProvider>
  );
}
