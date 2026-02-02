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

export default function EditInfoScreen() {
  const navigation = useNavigation<any>();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const saveInfo = async () => {
    if (!fullName || !phone) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await api.put("/profile/info", {
        full_name: fullName,
        address,
        phone,
      });

      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin!");
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

        <Text style={styles.title}>Chỉnh sửa thông tin</Text>
        <Text style={styles.subtitle}>Cập nhật thông tin cá nhân của bạn</Text>

        {/* Form */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#B0728F"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Họ tên"
            placeholderTextColor="#B0728F"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            color="#B0728F"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Địa chỉ"
            placeholderTextColor="#B0728F"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="call-outline"
            size={20}
            color="#B0728F"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="#B0728F"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={saveInfo}>
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
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
