import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/theme";

// Layout raiz: uma PILHA (Stack). As abas ficam no fundo da pilha
// e a tela de um local é "empilhada" por cima quando o usuário toca nela.
export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: "Voltar",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* As abas já têm cabeçalho próprio, então escondemos o do Stack */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="venue/[id]" options={{ title: "Local" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
