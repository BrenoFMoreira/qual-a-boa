import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil (em construção)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { color: colors.text, fontSize: 18 },
});
