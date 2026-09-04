# HƯỚNG DẪN ĐÓNG GÓI & CHẠY ỨNG DỤNG OFFLINE TRÊN MÁY TÍNH (.EXE)

Ứng dụng **Hành Trình Chinh Phục Vinh Quang** đã được cấu hình sẵn toàn bộ mã nguồn để đóng gói thành phần mềm máy tính chạy offline 100% bằng **Electron**.

---

## 📥 BƯỚC 1: Tải mã nguồn về máy tính
1. Trong Google AI Studio, vào menu **Settings** hoặc biểu tượng bánh răng ở góc trên bên phải.
2. Chọn **Export as ZIP** để tải toàn bộ source code về máy tính.
3. Giải nén file `.zip` vào một thư mục trên máy tính của bạn (Ví dụ: `D:\HanhTrinhVinhQuang`).

---

## 🛠️ BƯỚC 2: Cài đặt môi trường cần thiết (Chỉ làm 1 lần)
1. Cài đặt **Node.js** (Bản LTS miễn phí): Tải tại [https://nodejs.org](https://nodejs.org)
2. Mở thư mục dự án vừa giải nén.
3. Mở **Command Prompt (CMD)** hoặc **PowerShell** tại thư mục đó và chạy lệnh:
   ```bash
   npm install
   ```

---

## 🚀 BƯỚC 3: Đóng gói thành phần mềm Desktop (.exe)

Bạn có thể chọn một trong các lệnh đóng gói dưới đây:

### 1. Đóng gói bản Cài đặt (Setup Installer) & Bản Portable (Chạy ngay không cần cài đặt):
```bash
npm run electron:build:win
```

### 2. Chỉ đóng gói bản Portable (Dạng 1 file .exe duy nhất - copy vào USB chạy được trên mọi máy):
```bash
npm run electron:build:portable
```

### 3. Đóng gói cho macOS (File .dmg):
```bash
npm run electron:build:mac
```

---

## 📂 BƯỚC 4: Vị trí file sau khi đóng gói hoàn tất
Sau khi chạy lệnh trên xong, bạn sẽ thấy thư mục mới được tạo ra tên là:
👉 **`dist-electron/`**

Bên trong sẽ có:
- **`Hành Trình Vinh Quang-Setup-1.0.0.exe`**: Bộ cài đặt tự động tạo biểu tượng ngoài màn hình Desktop.
- **`Hành Trình Vinh Quang-Portable-1.0.0.exe`**: File chạy trực tiếp, chỉ cần nhấp đúp là mở ngay lập tức (không cần cài đặt).

---

## 💡 BƯỚC 5: Chạy thử trực tiếp trên máy không cần đóng gói (Dành cho nhà phát triển)
Nếu muốn mở nhanh cửa sổ phần mềm để kiểm tra:
```bash
npm run electron:dev
```

---

## 🌟 Ưu điểm khi chạy bản Desktop Offline:
- Chạy nhanh, ổn định 100% khi không có internet.
- Tự động lưu toàn bộ dữ liệu lớp học, điểm số, lịch sử chấm điểm và ảnh học sinh vào ổ cứng máy tính.
- Phím tắt tiện lợi:
  - **F11**: Bật / Tắt chế độ toàn màn hình (rất thích hợp chiếu máy chiếu / tivi trên lớp học).
  - **Ctrl + / Ctrl -**: Phóng to, thu nhỏ giao diện theo ý muốn.
  - **F5 / Ctrl + R**: Tải lại ứng dụng.
