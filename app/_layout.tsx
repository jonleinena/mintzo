import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { supabase } from "@/services/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import type { Session } from "@supabase/supabase-js";
import { ElevenLabsProvider } from "@elevenlabs/react-native";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function useProtectedRoute(session: Session | null, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const { onboardingComplete } = useSettingsStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";

    if (!onboardingComplete && !inOnboarding) {
      router.replace("/(onboarding)/welcome");
    } else if (onboardingComplete && inOnboarding) {
      router.replace("/(tabs)");
    }
  }, [session, isLoading, segments, onboardingComplete]);
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch profile and set user
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: profile.id,
                email: session.user.email,
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
              });
            }
          });
      }
      setLoading(false);
      setIsLoading(false);
      SplashScreen.hideAsync();
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
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
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
    </ElevenLabsProvider>
  );
}
