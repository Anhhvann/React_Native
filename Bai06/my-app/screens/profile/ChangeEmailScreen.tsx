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

export default function ChangeEmailScreen() {
  const navigation = useNavigation<any>();
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!newEmail) {
      Alert.alert("Thông báo", "Vui lòng nhập email mới");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      await api.post("/profile/send-otp", { new_email: newEmail });
      Alert.alert("Thành công", "OTP đã được gửi đến email mới!");
      setStep(2);
    } catch {
      Alert.alert("Lỗi", "Không thể gửi OTP. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      Alert.alert("Thông báo", "Vui lòng nhập mã OTP");
      return;
    }

    setLoading(true);
    try {
      await api.post("/profile/verify-otp", { new_email: newEmail, otp });
      Alert.alert("Thành công", "Đổi email thành công!");
      navigation.goBack();
    } catch {
      Alert.alert("Lỗi", "Mã OTP không đúng!");
    } finally {
      setLoading(false);
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

        <Text style={styles.title}>Đổi Email</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "Nhập email mới để nhận mã xác thực"
            : "Nhập mã OTP đã gửi đến email của bạn"}
        </Text>

        {/* Step indicator */}
        <View style={styles.stepContainer}>
          <View style={[styles.stepCircle, styles.stepActive]}>
            <Text style={styles.stepText}>1</Text>
          </View>
          <View
            style={[styles.stepLine, step === 2 && styles.stepLineActive]}
          />
          <View
            style={[styles.stepCircle, step === 2 && styles.stepActive]}
          >
            <Text style={[styles.stepText, step === 1 && styles.stepTextInactive]}>
              2
            </Text>
          </View>
        </View>

        {step === 1 ? (
          <>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#B0728F"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email mới"
                placeholderTextColor="#B0728F"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={sendOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang gửi..." : "Gửi OTP"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Ionicons
                name="keypad-outline"
                size={20}
                color="#B0728F"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập mã OTP"
                placeholderTextColor="#B0728F"
                value={otp}
                onChangeText={setOTP}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={verifyOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang xác thực..." : "Xác nhận"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => setStep(1)}
            >
              <Text style={styles.resendText}>← Quay lại thay đổi email</Text>
            </TouchableOpacity>
          </>
        )}
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
    marginBottom: 25,
    fontSize: 15,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFEFF5",
    borderWidth: 2,
    borderColor: "#EFB2C6",
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: "#E5568C",
    borderColor: "#E5568C",
  },
  stepLine: {
    width: 60,
    height: 3,
    backgroundColor: "#EFB2C6",
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: "#E5568C",
  },
  stepText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepTextInactive: {
    color: "#B0728F",
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
  buttonDisabled: {
    backgroundColor: "#F5A0B8",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: "#C73776",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
