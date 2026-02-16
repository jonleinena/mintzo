import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/services/supabase/client";

export default function LoginScreen() {
  const router = useRouter();
  const { returnTo, finalTarget } = useLocalSearchParams<{
    returnTo?: string;
    finalTarget?: string;
  }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert("Login failed", error.message);
    } else if (returnTo) {
      router.replace({
        pathname: returnTo as any,
        params: finalTarget ? { returnTo: finalTarget } : undefined,
      });
    } else {
      router.replace("/(tabs)");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 left-6 z-10"
          >
            <Ionicons name="arrow-back" size={28} color="#000" />
          </Pressable>

          {/* Header */}
          <Text className="text-4xl font-black mb-2">Welcome back</Text>
          <Text className="text-base text-slate-500 mb-8">
            Sign in to continue your practice
          </Text>

          {/* Email */}
          <Text className="text-sm font-bold mb-2">Email</Text>
          <TextInput
            className="border-2 border-black rounded-md px-4 py-3 text-base mb-4"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          {/* Password */}
          <Text className="text-sm font-bold mb-2">Password</Text>
          <View className="flex-row items-center border-2 border-black rounded-md mb-2">
            <TextInput
              className="flex-1 px-4 py-3 text-base"
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} className="px-4">
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#64748B"
              />
            </Pressable>
          </View>

          {/* Forgot Password */}
          <Pressable
            onPress={() => router.push("/(auth)/forgot-password")}
            className="self-end mb-6"
          >
            <Text className="text-sm text-brand-violet font-medium">
              Forgot password?
            </Text>
          </Pressable>

          {/* Sign In Button */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-brand-violet border-2 border-black rounded-md py-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 4,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text className="text-white text-base font-bold text-center">
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </Pressable>

          {/* Register Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base text-slate-500">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-base text-brand-violet font-bold">
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
