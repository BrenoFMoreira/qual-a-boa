import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual a Boa 🍻</Text>
      <Text style={styles.subtitle}>Descubra onde a noite está rolando em BH</Text>
      <Text style={styles.hint}>Em breve: Os rolês mais quentes da região</Text>
      {/* Link temporário só para testar a navegação; sai na sub-etapa 2c */}
      <Link href={{ pathname: "/venue/[id]", params: { id: "v1" } }} style={styles.link}>
        Abrir local de teste →
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.accent,
    textAlign: "center",
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: colors.highlight,
    textAlign: "center",
  },
  link: {
    marginTop: 32,
    fontSize: 16,
    color: colors.accent,
    textDecorationLine: "underline",
  },
});
