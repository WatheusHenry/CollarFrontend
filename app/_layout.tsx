import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useCallback } from "react";

import AuthProvider from "@/app/AuthContext";
import { useAuth } from "@/hooks/useAuth";

// Impede a SplashScreen de esconder automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SanFransciscoRegular: require("../assets/fonts/SFUIDisplay-Regular.otf"),
    SanFransciscoBlack: require("../assets/fonts/SFUIDisplay-Black.otf"),
    SanFransciscoBold: require("../assets/fonts/SFUIDisplay-Bold.ttf"),
    SanFransciscoHeavy: require("../assets/fonts/SFUIDisplay-Heavy.otf"),
    SanFransciscoMedium: require("../assets/fonts/SFUIDisplay-Medium.otf"),
    SanFransciscoSemibold: require("../assets/fonts/SFUIDisplay-Semibold.otf"),
    SanFransciscoThin: require("../assets/fonts/SFUIDisplay-Thin.otf"),
  });

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [isAppReady, setIsAppReady] = useState(false);

  // Função para garantir que a SplashScreen seja escondida corretamente
  const hideSplashScreen = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  useEffect(() => {
    if (loaded && !loading) {
      setIsAppReady(true);
    }
  }, [loaded, loading]);

  useEffect(() => {
    if (isAppReady) {
      hideSplashScreen();

      // Redirecionamento com base na autenticação
      if (isAuthenticated) {
        router.replace("/(tabs)/feed");
      } else {
        router.replace("/login");
      }
    }
  }, [isAppReady, isAuthenticated, router, hideSplashScreen]);

  if (!isAppReady || loading) {
    // SplashScreen permanece ativa até que o app esteja pronto
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="login"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="person" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="postDetails" options={{ headerShown: false }} />
          <Stack.Screen
            name="likedPublications"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
