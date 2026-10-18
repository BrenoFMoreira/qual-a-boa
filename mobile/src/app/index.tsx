import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual a Boa 🍻</Text>
      <Text style={styles.subtitle}>Descubra onde a noite está rolando em BH</Text>
      <Text style={styles.hint}>Em breve: Os rolês mais quentes da região</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1033",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#c9b8ff",
    textAlign: "center",
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: "#10cf20",
    textAlign: "center",
  },
});
