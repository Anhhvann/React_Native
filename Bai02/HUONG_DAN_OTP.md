# 🔐 Hướng Dẫn Chức Năng Quên Mật Khẩu với OTP

## 📋 Tính Năng

1. **Bước 1: Gửi OTP**
   - Người dùng nhập email
   - Hệ thống kiểm tra email tồn tại
   - Tạo OTP 6 chữ số ngẫu nhiên
   - OTP hết hạn sau 10 phút

2. **Bước 2: Xác Minh OTP**
   - Người dùng nhập mã OTP
   - Kiểm tra OTP chính xác và chưa hết hạn
   - Cho phép tiếp tục đến bước đặt lại mật khẩu

3. **Bước 3: Đặt Lại Mật Khẩu**
   - Người dùng nhập mật khẩu mới
   - Xác nhận mật khẩu
   - Cập nhật mật khẩu trong database
   - Xóa OTP sau khi sử dụng

## 🗂️ Cấu Trúc File

### Frontend (React Native)
- **ForgetPassword.js** - Màn hình quên mật khẩu (3 bước)
- **LoginScreen.js** - Cập nhật thêm nút "Quên mật khẩu?"

### Backend (Node.js)
- **routes/auth.js** - Cập nhật với 3 API endpoint mới:
  - POST `/api/forgot-password/send-otp`
  - POST `/api/forgot-password/verify-otp`
  - POST `/api/forgot-password/reset-password`

## 🚀 Cách Sử Dụng

### 1. Frontend - Thêm điều hướng
Màn hình đăng nhập hiện có link "Quên mật khẩu?" dẫn đến `ForgetPassword.js`

### 2. Backend - API Endpoints

#### Gửi OTP
```bash
POST /api/forgot-password/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "OTP sent successfully"
}
```

#### Xác Minh OTP
```bash
POST /api/forgot-password/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "message": "OTP verified successfully"
}
```

#### Đặt Lại Mật Khẩu
```bash
POST /api/forgot-password/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}

Response:
{
  "message": "Password reset successfully"
}
```

## 🔧 Cấu Hình

### Thời Gian Hết Hạn OTP
Mở file `backend/routes/auth.js`, tìm dòng:
```javascript
const expiryTime = Date.now() + 10 * 60 * 1000; // 10 phút
```
Thay `10` thành số phút muốn (ví dụ: 5 phút = `5 * 60 * 1000`)

### Gửi Email OTP (Tùy Chọn)
Hiện tại OTP chỉ in ra console. Để gửi email thực tế:

1. Cài đặt nodemailer:
```bash
npm install nodemailer
```

2. Cập nhật hàm `sendOTPEmail()` trong `backend/routes/auth.js`:
```javascript
const nodemailer = require('nodemailer');

function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Mã OTP để đặt lại mật khẩu',
    text: `Mã OTP của bạn: ${otp}\nMã này có hiệu lực trong 10 phút.`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log('Error sending email:', err);
    else console.log('Email sent:', info.response);
  });
}
```

## ⚠️ Lưu Ý Quan Trọng

1. **Bảo Mật**: Trong production nên lưu OTP vào Redis thay vì RAM
2. **Email**: Cần cấu hình SMTP để gửi email thực
3. **HTTPS**: Chắc chắn sử dụng HTTPS khi deploy
4. **Rate Limiting**: Nên thêm giới hạn số lần gửi OTP

## 🧪 Kiểm Tra

1. Chạy backend: `node server.js`
2. Chạy frontend: `npm start`
3. Nhấn "Quên mật khẩu?" trên màn hình đăng nhập
4. Nhập email tồn tại
5. Kiểm tra console backend để xem OTP
6. Nhập OTP vừa nhận
7. Đặt lại mật khẩu mới
8. Thử đăng nhập với mật khẩu mới

## 📞 Hỗ Trợ

- Kiểm tra console React Native để xem lỗi API
- Kiểm tra console Node.js để xem lỗi backend
- Đảm bảo backend đang chạy trên cùng IP với frontend
