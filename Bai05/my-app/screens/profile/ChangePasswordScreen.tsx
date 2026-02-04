import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import api from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const changePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPass.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await api.put("/profile/change-password", {
        old_password: oldPass,
        new_password: newPass,
      });

      Alert.alert("Thành công", "Đổi mật khẩu thành công!");
      navigation.goBack();
    } catch {
      Alert.alert("Lỗi", "Sai mật khẩu hoặc lỗi server");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#C73776" />
        </TouchableOpacity>

        <Text style={styles.title}>Đổi mật khẩu</Text>
        <Text style={styles.subtitle}>Tạo mật khẩu mới cho tài khoản</Text>

        {/* Form */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#B0728F"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Mật khẩu cũ"
            placeholderTextColor="#B0728F"
            secureTextEntry={!showOldPass}
            style={styles.input}
            value={oldPass}
            onChangeText={setOldPass}
          />
          <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
            <Ionicons
              name={showOldPass ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#B0728F"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-open-outline"
            size={20}
            color="#B0728F"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Mật khẩu mới"
            placeholderTextColor="#B0728F"
            secureTextEntry={!showNewPass}
            style={styles.input}
            value={newPass}
            onChangeText={setNewPass}
          />
          <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
            <Ionicons
              name={showNewPass ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#B0728F"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="#B0728F"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Xác nhận mật khẩu mới"
            placeholderTextColor="#B0728F"
            secureTextEntry={!showNewPass}
            style={styles.input}
            value={confirmPass}
            onChangeText={setConfirmPass}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={changePassword}>
          <Text style={styles.buttonText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE8EF",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFF7FA",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#D98AA8",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 7,
    borderWidth: 1.5,
    borderColor: "#F2B4C8",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#C73776",
    marginBottom: 6,
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#B0728F",
    marginBottom: 30,
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEFF5",
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EFB2C6",
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#9B2C5F",
  },
  button: {
    backgroundColor: "#E5568C",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
