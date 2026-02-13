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

export default function RegisterScreen() {
  const router = useRouter();
  const { returnTo, finalTarget } = useLocalSearchParams<{
    returnTo?: string;
    finalTarget?: string;
  }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: name.trim() || undefined,
          auth_type: "email",
        },
      },
    });
    setLoading(false);
    if (error) {
      Alert.alert("Registration failed", error.message);
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
          <Text className="text-4xl font-black mb-2">Create account</Text>
          <Text className="text-base text-slate-500 mb-8">
            Start practicing for your Cambridge exam
          </Text>

          {/* Name */}
          <Text className="text-sm font-bold mb-2">Name (optional)</Text>
          <TextInput
            className="border-2 border-black rounded-md px-4 py-3 text-base mb-4"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
          />

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
          <View className="flex-row items-center border-2 border-black rounded-md mb-8">
            <TextInput
              className="flex-1 px-4 py-3 text-base"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} className="px-4">
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#64748B"
              />
            </Pressable>
          </View>

          {/* Sign Up Button */}
          <Pressable
            onPress={handleRegister}
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
              {loading ? "Creating account..." : "Create Account"}
            </Text>
          </Pressable>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base text-slate-500">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-base text-brand-violet font-bold">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
