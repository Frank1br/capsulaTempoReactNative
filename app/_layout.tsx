import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { Fraunces_400Regular_Italic, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AnimatedSplash } from '@/components/AnimatedSplash';
import { CapsulesProvider, useCapsules } from '@/lib/capsules';
import { ThemeProvider, useTheme, useThemePreference } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

// AnimatedSplash draws the same picture as the native splash, so hide it without a fade.
SplashScreen.setOptions({
  fade: false,
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <CapsulesProvider>
        <RootStack />
      </CapsulesProvider>
    </ThemeProvider>
  );
}

function RootStack() {
  const t = useTheme();
  const capsules = useCapsules();
  const theme = useThemePreference();
  // Waiting for the saved theme too keeps the app from flashing the wrong one.
  const loaded = capsules.loaded && theme.loaded;
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  return (
    <>
      {/* Light text while the splash covers the screen, then follow the theme. */}
      <StatusBar style={t.dark || showSplash ? 'light' : 'dark'} />
      <View style={[styles.page, { backgroundColor: t.sunk }]}>
        <View style={[styles.column, { backgroundColor: t.bg }]}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="nova" options={{ presentation: 'modal' }} />
            <Stack.Screen name="editar/[id]" options={{ presentation: 'modal' }} />
          </Stack>
        </View>
      </View>
      {showSplash && <AnimatedSplash ready={loaded} onFinish={hideSplash} />}
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  // The app is drawn for phones: in a wide browser window it stays a centered column.
  column: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : undefined,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
