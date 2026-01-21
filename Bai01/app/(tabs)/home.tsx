import { View, Text, StyleSheet, Image } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* Avatar */}
        <Image
          source={require("../../assets/images/avatar.jpg")}
          style={styles.avatar}
        />

        <Text style={styles.title}>Xin chào 👋</Text>

        <Text style={styles.text}>
          Mình là <Text style={styles.highlight}>Vân Ánh</Text>
        </Text>

        <Text style={styles.text}>
          Sinh viên năm 3 ngành Công nghệ Thông tin
        </Text>

        <Text style={styles.footer}>
          📱 Bài tập đầu tiên{"\n"}
          <Text style={styles.bold}>
            Lập Trình Di Động Nâng Cao
          </Text> 🚀
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f7",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",

    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4facfe",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 6,
  },
  highlight: {
    color: "#4facfe",
    fontWeight: "bold",
  },
  footer: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 14,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
});
