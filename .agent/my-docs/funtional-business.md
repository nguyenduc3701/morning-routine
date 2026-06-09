# Business Functional & Workflow Specification

## 1. Mục tiêu kinh doanh (Business Objective)
Xây dựng một ứng dụng "Morning Routine" giúp người dùng cá nhân hóa thông tin buổi sáng. Hệ thống tự động thu thập tin tức, tài chính và lịch trình, sau đó tổng hợp thành bản tin âm thanh có thể nghe ngay khi thức dậy.

## 2. Tính năng cốt lõi (Core Features)
- **Cấu hình cá nhân**: Đăng nhập, thiết lập sở thích (Thời tiết, Tài chính, Lịch Google) và nhập 3 Page Facebook để theo dõi.
- **Tự động hóa & Lập lịch**: Người dùng có thể cấu hình thời gian để Cron Job tự động chạy, hoặc có thể click kích hoạt thủ công để hệ thống thu thập dữ liệu và tổng hợp bản tin ngay lập tức.
- **Trình phát âm thanh**: Phát tin bằng giọng nói (Web Speech API), hỗ trợ Next/Back giữa các phân đoạn.
- **Xem văn bản**: Hiển thị kịch bản dạng text đồng bộ với giọng đọc.

## 3. Luồng hoạt động (Workflow)
- **Thiết lập**: User cấu hình sở thích và nguồn dữ liệu.
- **Chuẩn bị (Theo giờ đã cấu hình hoặc Thủ công)**:
  - Kích hoạt Backend (thông qua Cron Job hoặc user click thủ công).
  - Backend gọi API bên thứ 3 (Tài chính, Weather, Facebook API).
  - Gemini AI tổng hợp dữ liệu, biên tập kịch bản thành JSON (gồm nhiều phân đoạn).
  - Lưu kịch bản vào Database (Supabase).
- **Tiêu thụ (Sau khi quá trình chuẩn bị hoàn tất)**:
  - User mở Web, nút "Bấm để nghe" sáng lên.
  - Web bốc kịch bản từ DB, phát âm thanh qua trình duyệt.
  - User dùng nút Next/Back để chuyển đổi nội dung.
