import { Tabs } from "expo-router/js-tabs";
import { SymbolView } from "expo-symbols";

import { colors } from "@/constants/theme";

// Layout das abas. Cada <Tabs.Screen name="..."> aponta para um arquivo
// desta pasta: "index" → index.tsx, "perfil" → perfil.tsx.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Agora", // texto da aba
          headerTitle: "Qual a Boa 🍻", // texto do cabeçalho
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: "person.fill", android: "person", web: "person" }}
              tintColor={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
