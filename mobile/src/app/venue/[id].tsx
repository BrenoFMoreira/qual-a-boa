import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/theme";

// [id] no nome do arquivo = parte variável do endereço. /venue/v1 → id = "v1"
export default function VenueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>id: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { color: colors.text, fontSize: 18 },
});
