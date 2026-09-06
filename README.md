# Quản lý một lớp học

Ứng dụng React, TypeScript và Zustand dành cho một lớp chủ nhiệm: danh sách học sinh, tổ, điểm thi đua, điểm danh, huy hiệu, đổi quà và báo cáo. Dữ liệu lưu trên trình duyệt hoặc máy chạy Electron; hiện không đồng bộ qua Firebase.

## Chạy và kiểm tra

Cần Node.js 22 trở lên và npm. Cài đúng phiên bản trong `package-lock.json`:

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run preview -- --host 127.0.0.1 --port 4173
```

`check` chạy TypeScript, kiểm thử dữ liệu và service worker, sau đó tạo bản production. `build` tạo danh sách cache từ toàn bộ tài nguyên thực tế trong `dist`, bao gồm các trang tải riêng và font tiếng Việt. Khi phát hành web, dùng toàn bộ thư mục `dist`, trên HTTPS hoặc localhost. Đóng các tab cũ rồi mở lại để kích hoạt bản cập nhật service worker.

Đóng gói Windows trên môi trường có công cụ Electron:

```sh
npm run electron:build:win
```

## Dữ liệu và nâng cấp

- Trước khi thay bản đang dùng, vào mục sao lưu và tải file JSON. Giữ file này ở nơi riêng; dữ liệu lớp không tự gửi lên GitHub.
- Ứng dụng quản lý một lớp. Đổi tên không xóa học sinh và lịch sử. Nếu bản cũ chứa nhiều lớp, giữ lớp đang chọn và chuyển những lớp còn lại vào danh sách đã lưu trong mục sao lưu.
- Nhập Excel ở chế độ thay danh sách sẽ giữ danh sách cũ cùng điểm, huy hiệu, đổi quà và điểm danh trong bản lưu trữ. Có thể phục hồi từ mục sao lưu; chỉ một lớp được quản lý tại một thời điểm.
- Khi phục hồi, thay danh sách hoặc đặt lại toàn bộ, ứng dụng khởi tạo tải bản sao trước khi ghi thay đổi. Hãy kiểm tra file đã xuất hiện trong thư mục tải xuống của trình duyệt.
- Định dạng lưu mới là phiên bản 1, đọc được định dạng cũ phiên bản 0. Không dùng bản ứng dụng cũ để mở dữ liệu đã nâng cấp; nếu cần quay lại bản cũ, dùng file sao lưu được xuất trước khi nâng cấp.
- Dữ liệu sai định dạng được giữ nguyên và chặn chỉnh sửa cho đến khi phục hồi hợp lệ. Khi hết dung lượng hoặc không có quyền lưu, thay đổi chưa được ghi sẽ không hiển thị như đã lưu. Nếu một cửa sổ khác vừa ghi dữ liệu, tải lại cửa sổ hiện tại trước khi tiếp tục.
- Giới hạn dung lượng `localStorage` vẫn còn: ảnh tải lên và các bản lưu trữ lớn chiếm dung lượng. Sao lưu JSON định kỳ; cập nhật này chưa chuyển sang cơ sở dữ liệu dung lượng lớn.

## Các thay đổi chính

- Điểm danh ghi trong một lần, lưu lại cùng ngày không cộng thưởng lặp. Chỉnh trạng thái cập nhật đúng phần thưởng ngày đó; hoàn tác một đợt điểm danh hoàn tác cả đợt. Với bản điểm danh cũ thiếu thông tin thưởng, không suy đoán và không tự thưởng lần nữa.
- Xếp hạng theo ngày/tuần/tháng dựa trên giao dịch của kỳ đó, theo múi giờ Việt Nam. Không có giao dịch thì điểm kỳ bằng 0; điểm âm không được xếp cấp cao nhất.
- Nhập Excel giữ tổ; lịch sử hiển thị mới nhất trước; báo cáo không coi học sinh thiếu trạng thái là đã có mặt.
- Tải riêng các trang, hạn chế component cập nhật theo toàn bộ store, không ghi dữ liệu khi chỉ mở hộp thoại hoặc thông báo.
- Sửa vòng đời camera, timer chia tổ, vùng cuộn khi in, cache offline và khóa quyền Electron. Nâng SheetJS và bỏ thư viện không sử dụng. Firestore rules trong mã nguồn từ chối truy cập; chưa triển khai rules lên dự án Firebase nào.

## Phạm vi xác minh

Kiểm thử tự động bao gồm toàn vẹn dữ liệu, phục hồi, lỗi hết dung lượng, xung đột cửa sổ, điểm danh, điểm thưởng, nhập tổ, ngày Việt Nam và hành vi service worker trong môi trường mô phỏng. Kiểm tra TypeScript và build production thành công.

Trình duyệt kiểm thử trong môi trường sửa mã không mở được địa chỉ localhost. Cần kiểm tra thao tác giao diện, in nhiều trang, camera thật, chế độ offline trên trình duyệt và gói Electron trên máy sử dụng trước khi thay bản đang chạy. Kiểm thử service worker mô phỏng không thay thế việc thử offline trên thiết bị thực tế.
