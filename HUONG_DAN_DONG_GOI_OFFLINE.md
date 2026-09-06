# HƯỚNG DẪN ĐÓNG GÓI & XUẤT ỨNG DỤNG SANG DẠNG FILE .EXE (WINDOWS)

Ứng dụng **Hành Trình Chinh Phục Vinh Quang** đã được tích hợp sẵn toàn bộ cấu hình đóng gói máy tính chuyên nghiệp bằng **Electron** và **Electron-Builder**. Bạn có thể xuất ra file `.exe` cài đặt hoặc file chạy nhanh Portable (chép vào USB mang đi dạy mọi lớp).

---

## 🌐 GIẢI ĐÁP: KHI CHẠY DƯỚI DẠNG FILE `.EXE`, CÁC TÍNH NĂNG ONLINE CÓ BỊ ẢNH HƯỞNG KHÔNG?

**Câu trả lời ngắn gọn:** **HOÀN TOÀN KHÔNG BỊ ẢNH HƯỞNG, mà còn hoạt động linh hoạt và an toàn hơn.**

Cụ thể từng tính năng như sau:

| Tính năng | Khi máy tính CÓ MẠNG (Online) | Khi máy tính MẤT MẠNG (Offline) |
| :--- | :--- | :--- |
| **Đồng bộ Firebase Cloud** | File `.exe` tự động kết nối và đồng bộ 2 chiều với cơ sở dữ liệu đám mây thời gian thực y hệt như bản web. Mọi điểm cộng/trừ đều được lưu an toàn lên Cloud. | Ứng dụng tự động lưu vào bộ nhớ máy tính. Khi máy tính có mạng trở lại, hệ thống sẽ tự động đồng bộ bù lên đám mây. |
| **Cổng xem điểm Phụ huynh & Quét QR** | Phụ huynh quét mã QR trên điện thoại mở link web vẫn xem được điểm số mới nhất mà cô vừa chấm trên app `.exe` (vì app `.exe` đã đẩy điểm lên Firebase). | Điểm vừa chấm lưu trên máy của cô. Khi cô kết nối mạng, điểm mới sẽ tự cập nhật để phụ huynh xem trên điện thoại. |
| **Âm thanh, Avatar Chibi, Hiệu ứng** | Hoạt động mượt mà 100% (nhờ công nghệ âm thanh tự tạo Web Audio API và thư viện đồ họa đã tích hợp sẵn bên trong app). | Hoạt động trơn tru 100%, không phụ thuộc vào internet. |
| **Bánh xe may mắn, Đấu trường, Bấm giờ** | Hoạt động đầy đủ không gián đoạn. | Hoạt động bình thường không cần internet. |
| **Xuất báo cáo Excel, In ấn** | Xuất trực tiếp ra file Excel (`.xlsx`) lưu vào máy tính. | Xuất trực tiếp bình thường. |

> 📌 **Lưu ý nhỏ về link Phụ huynh**: Bản thân file `.exe` chạy trên máy tính của cô, không phải máy chủ công cộng. Do đó, đường link phụ huynh xem trên điện thoại sẽ là link trang web đã xuất bản (link Web / Cloud Run). Ứng dụng `.exe` đóng vai trò là bảng điều khiển của giáo viên, đẩy dữ liệu lên Firebase để link của phụ huynh hiển thị!

---

## 📋 QUY TRÌNH CÁC BƯỚC ĐÓNG GÓI RA FILE `.EXE`

### BƯỚC 1: Tải mã nguồn về máy tính cá nhân
1. Trên thanh công cụ hoặc menu của Google AI Studio (biểu tượng góc trên bên phải), chọn **Settings** -> **Export as ZIP** (hoặc chọn kết nối đẩy lên **GitHub** rồi clone về máy).
2. Tải file `.zip` về máy tính và giải nén ra một thư mục (Ví dụ: `D:\HanhTrinhVinhQuang`).

---

### BƯỚC 2: Cài đặt công cụ môi trường (Chỉ thực hiện 1 lần đầu)
1. Tải và cài đặt **Node.js** (chọn bản LTS ổn định nhất): [https://nodejs.org](https://nodejs.org)
2. Mở thư mục dự án vừa giải nén.
3. Nhấp chuột vào thanh địa chỉ thư mục, gõ `cmd` rồi nhấn **Enter** (để mở cửa sổ dòng lệnh ngay tại thư mục đó).
4. Nhập lệnh sau để tải các thư viện:
   ```bash
   npm install
   ```
   *(Chờ khoảng 1 - 2 phút cho đến khi hoàn tất)*

---

### BƯỚC 3: Chạy lệnh đóng gói ra file `.exe`

Tùy theo nhu cầu sử dụng, bạn gõ một trong các lệnh sau trong cửa sổ CMD:

#### Cách 1: Xuất file Portable (Khuyên dùng - 1 file duy nhất, chép vào USB chạy ngay không cần cài đặt):
```bash
npm run electron:build:portable
```

#### Cách 2: Xuất file Cài đặt có biểu tượng ngoài màn hình Desktop (Installer Setup):
```bash
npm run electron:build:win
```

---

### BƯỚC 4: Lấy file `.exe` để sử dụng
Sau khi lệnh chạy xong (thường mất khoảng 1 - 3 phút), trong thư mục dự án sẽ tự động xuất hiện thư mục mới tên là:
👉 **`dist-electron/`**

Bên trong thư mục này, bạn sẽ nhận được:
- 🌟 **`Hành Trình Vinh Quang-Portable-1.0.0.exe`**: Nhấp đúp chuột là phần mềm khởi động ngay lập tức, có thể copy vào USB để mang đi cắm vào máy tính lớp học, phòng thực hành.
- 💻 **`Hành Trình Vinh Quang-Setup-1.0.0.exe`**: Trình cài đặt tự động tạo icon ứng dụng ngoài màn hình chính Windows.

---

### BƯỚC 5: Phím tắt hữu ích khi dùng ứng dụng Desktop
- **F11**: Bật / Tắt chế độ **Toàn màn hình** (rất tiện khi chiếu lên màn hình Tivi hoặc Máy chiếu lớp học).
- **Ctrl +** hoặc **Ctrl -**: Phóng to hoặc thu nhỏ kích thước chữ và giao diện.
- **F5** hoặc **Ctrl + R**: Tải lại ứng dụng.

