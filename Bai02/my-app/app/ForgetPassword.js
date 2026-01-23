import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import api from "../services/api";

export default function ForgetPassword() {
  const [step, setStep] = useState(1); // 1: nhập email/phone, 2: nhập OTP + mật khẩu mới
  const [inputType, setInputType] = useState("email"); // email hoặc phone
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate số điện thoại (10-11 số)
  const validatePhone = (phone) => {
    const regex = /^(0|\+84)[0-9]{9,10}$/;
    return regex.test(phone);
  };

  // Validate mật khẩu
  const validatePassword = (password) => {
    if (password.length < 6) {
      return { valid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
    }
    return { valid: true };
  };

  // Bước 1: Gửi OTP
  const handleSendOTP = async () => {
    // Validate input
    if (inputType === "email") {
      if (!email) {
        Alert.alert("Thông báo", "Vui lòng nhập email");
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert("Thông báo", "Email không hợp lệ");
        return;
      }
    } else {
      if (!phone) {
        Alert.alert("Thông báo", "Vui lòng nhập số điện thoại");
        return;
      }
      if (!validatePhone(phone)) {
        Alert.alert("Thông báo", "Số điện thoại không hợp lệ (10-11 số)");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = inputType === "email" 
        ? { email } 
        : { phone };
      
      const res = await api.post("/forgot-password/send-otp", payload);
      Alert.alert("Thành công", res.data.message || "Mã OTP đã được gửi!");
      setStep(2);
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác minh OTP và đặt lại mật khẩu
  const handleResetPassword = async () => {
    // Validate OTP
    if (!otp || otp.length !== 6) {
      Alert.alert("Thông báo", "Vui lòng nhập mã OTP 6 chữ số");
      return;
    }

    // Validate mật khẩu mới
    if (!newPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập mật khẩu mới");
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      Alert.alert("Thông báo", passwordValidation.message);
      return;
    }

    // Validate xác nhận mật khẩu
    if (!confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng xác nhận mật khẩu mới");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Thông báo", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        otp,
        newPassword,
        ...(inputType === "email" ? { email } : { phone }),
      };

      const res = await api.post("/forgot-password/reset-password", payload);
      
      Alert.alert(
        "Thành công", 
        res.data.message || "Đặt lại mật khẩu thành công!",
        [
          {
            text: "OK",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại OTP
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const payload = inputType === "email" ? { email } : { phone };
      await api.post("/forgot-password/send-otp", payload);
      Alert.alert("Thành công", "Mã OTP mới đã được gửi!");
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.message || "Không thể gửi lại OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      router.replace("/");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>🔐 Quên Mật Khẩu</Text>
          <Text style={styles.subtitle}>
            {step === 1 
              ? "Nhập email hoặc số điện thoại để nhận mã OTP"
              : "Nhập mã OTP và mật khẩu mới"}
          </Text>

          {/* STEP 1: Nhập email/phone */}
          {step === 1 && (
            <>
              {/* Toggle email/phone */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    inputType === "email" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setInputType("email")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      inputType === "email" && styles.toggleTextActive,
                    ]}
                  >
                    📧 Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    inputType === "phone" && styles.toggleButtonActive,
                  ]}
                  onPress={() => setInputType("phone")}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      inputType === "phone" && styles.toggleTextActive,
                    ]}
                  >
                    📱 Số điện thoại
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Input email hoặc phone */}
              {inputType === "email" ? (
                <TextInput
                  placeholder="Nhập email của bạn"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              ) : (
                <TextInput
                  placeholder="Nhập số điện thoại (VD: 0901234567)"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={11}
                  editable={!loading}
                />
              )}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Gửi mã OTP</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2: Nhập OTP + Mật khẩu mới */}
          {step === 2 && (
            <>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Mã OTP đã được gửi đến:{"\n"}
                  <Text style={styles.infoHighlight}>
                    {inputType === "email" ? email : phone}
                  </Text>
                </Text>
              </View>

              <TextInput
                placeholder="Nhập mã OTP (6 chữ số)"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                editable={!loading}
              />

              <TextInput
                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
              />

              <TextInput
                placeholder="Xác nhận mật khẩu mới"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={loading}
                style={styles.resendButton}
              >
                <Text style={styles.resendText}>
                  Không nhận được mã? Gửi lại OTP
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Nút quay lại */}
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            disabled={loading}
          >
            <Text style={styles.backText}>
              {step === 1 ? "← Quay lại đăng nhập" : "← Quay lại"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F8",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#F7F8FA",
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: "#4A90E2",
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A0C4E8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#E8F4FD",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
  infoHighlight: {
    fontWeight: "bold",
    color: "#4A90E2",
  },
  resendButton: {
    marginTop: 16,
    alignItems: "center",
  },
  resendText: {
    color: "#4A90E2",
    fontSize: 14,
  },
  backButton: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    alignItems: "center",
  },
  backText: {
    color: "#666",
    fontSize: 14,
  },
});
