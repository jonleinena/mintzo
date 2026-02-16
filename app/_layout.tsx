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
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import {
  useSubscriptionStore,
  setupSubscriptionListener,
  removeSubscriptionListener,
} from "@/stores/subscriptionStore";
import type { Session } from "@supabase/supabase-js";
import type { User } from "@/types/user";

const FREE_TRIAL_KEY = "mintzo_free_trial_used";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfileToUser(profile: any, email: string | undefined): User {
  return {
    id: profile.id,
    email,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    authType: profile.auth_type || "email",
    academyId: profile.academy_id,
    academyGroupId: profile.academy_group_id,
    onboardingComplete: profile.onboarding_complete,
    hasUsedFreeTrial: profile.has_used_free_trial,
    targetExamLevel: profile.target_exam_level || "B2",
    targetExamDate: profile.target_exam_date
      ? new Date(profile.target_exam_date)
      : new Date(),
    dailyPracticeGoal: profile.daily_practice_goal || 45,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractSettingsFromProfile(profile: any) {
  return {
    targetExamLevel: profile.target_exam_level || "B2",
    targetExamDate: profile.target_exam_date ?? null,
    dailyPracticeGoal: profile.daily_practice_goal || 45,
    onboardingComplete: profile.onboarding_complete ?? false,
  };
}

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

  useEffect(() => {
    initializePurchases().then((initialized) => {
      if (initialized) setupSubscriptionListener();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loginUser(session.user.id).then(() => checkSubscription());

        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(async ({ data: profile }) => {
            if (!profile) return;

            // Sync local free trial flag to profile if needed
            if (!profile.has_used_free_trial) {
              const localFlag = await AsyncStorage.getItem(FREE_TRIAL_KEY);
              if (localFlag === "true") {
                profile.has_used_free_trial = true;
                supabase
                  .from("profiles")
                  .update({ has_used_free_trial: true })
                  .eq("id", session.user.id)
                  .then(() => AsyncStorage.removeItem(FREE_TRIAL_KEY));
              }
            }

            setUser(mapProfileToUser(profile, session.user.email));
            setSettingsFromProfile(extractSettingsFromProfile(profile));
          });
      }
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

      loginUser(session.user.id).then(() => checkSubscription());

      supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (!profile) return;
          setUser(mapProfileToUser(profile, session.user.email));
          setSettingsFromProfile(extractSettingsFromProfile(profile));
        });
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
