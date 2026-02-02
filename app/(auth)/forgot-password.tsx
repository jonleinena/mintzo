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
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/services/supabase/client";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-6 justify-center items-center">
          <View className="bg-surface-mint border-2 border-black rounded-full w-20 h-20 items-center justify-center mb-6">
            <Ionicons name="mail" size={36} color="#000" />
          </View>
          <Text className="text-2xl font-black text-center mb-2">
            Check your email
          </Text>
          <Text className="text-base text-slate-500 text-center mb-8">
            We sent a password reset link to {email}
          </Text>
          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            className="bg-brand-violet border-2 border-black rounded-md py-4 px-8"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 4,
            }}
          >
            <Text className="text-white text-base font-bold">
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 left-6 z-10"
          >
            <Ionicons name="arrow-back" size={28} color="#000" />
          </Pressable>

          <Text className="text-4xl font-black mb-2">Reset password</Text>
          <Text className="text-base text-slate-500 mb-8">
            Enter your email and we'll send you a reset link
          </Text>

          <Text className="text-sm font-bold mb-2">Email</Text>
          <TextInput
            className="border-2 border-black rounded-md px-4 py-3 text-base mb-6"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Pressable
            onPress={handleReset}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
