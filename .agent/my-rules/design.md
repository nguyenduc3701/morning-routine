# Morning Routine Dawn Color Palette & Design Tokens

Bảng màu và hệ thống kiểu chữ này được thiết kế dựa trên sự chuyển đổi màu sắc của bầu trời buổi sáng từ đêm đen cho đến lúc bình minh ló rạng, kết hợp với triết lý thiết kế kiểu chữ (Typography) tinh tế của Apple. Hãy bám sát hệ thống này trong tất cả giao diện và cấu hình CSS/Tailwind.

---

## 1. Hệ Màu Chủ Đạo (Core Colors)

| Vai trò thiết kế | Tên màu | Mã Hex | Ý nghĩa thiết kế & Cách dùng |
| :--- | :--- | :--- | :--- |
| **Primary (Night Sky)** | Indigo Navy | `#1F2A5F` | Đại diện cho bầu trời đêm. Làm màu nền chính cho app (Dark Mode), màu của các nút chính (Primary Button), các container lớn. |
| **Secondary (Twilight)** | Twilight Purple | `#7B5C9C` | Đại diện cho hoàng hôn/chạng vạng. Sử dụng cho border, active state phụ, hover state, tiêu đề phụ. |
| **Accent Dawn (Rose)** | Dawn Rose | `#DA8593` | Đại diện cho tia nắng ban mai đầu tiên. Dùng cho nút kêu gọi hành động nổi bật (CTA), biểu tượng phát nhạc active, thông báo đặc biệt. |
| **Accent Sunrise (Gold)** | Sunrise Gold | `#FECD71` | Đại diện cho ánh mặt trời rực rỡ. Dùng làm viền cho nút phát nhạc khi đang phát (TTS Playing), cảnh báo, các điểm nhấn (highlights) cần sự ấm áp. |
| **Accent Sky (Blue)** | Morning Sky Blue | `#8CD4E6` | Đại diện cho bầu trời sáng rõ. Dùng cho thanh tiến trình (progress bar), thông tin thời tiết, tin tức, trạng thái hoàn thành. |

---

## 2. Hệ Kiểu Chữ Chuẩn Apple (Apple-Inspired Multilingual Typography)

Để mang lại trải nghiệm tinh tế, mượt mà và cao cấp như thiết kế của Apple (SF Pro, PingFang, Apple SD Gothic Neo) đồng thời hỗ trợ hiển thị hoàn hảo tiếng Việt cùng các ngôn ngữ CJK (Trung - Nhật - Hàn), hệ thống font stack sau đây được áp dụng:

### Font Family Stack cấu hình trong CSS/Tailwind:
```css
font-family: 
  /* Ưu tiên 1: Hệ font Apple mặc định trên macOS & iOS (SF Pro Display / Text) */
  -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
  /* Ưu tiên 2: Font hỗ trợ tiếng Nhật của Apple */
  "Hiragino Kaku Gothic ProN", "Hiragino Sans", 
  /* Ưu tiên 3: Font hỗ trợ tiếng Trung (PingFang) của Apple */
  "PingFang SC", "PingFang TC", 
  /* Ưu tiên 4: Font hỗ trợ tiếng Hàn (Apple SD Gothic Neo) */
  "Apple SD Gothic Neo", 
  /* Ưu tiên 5: Fallbacks mã nguồn mở cao cấp cho Windows/Linux/Android (đảm bảo hiển thị trơn tru đa ngôn ngữ) */
  "Inter", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Segoe UI", "Roboto", sans-serif;
```

### Nguyên tắc trình bày Typography của Apple:
- **Font Weight (Độ đậm)**: Sử dụng các sắc độ đậm rõ ràng để phân cấp thông tin:
  - Tiêu đề chính (Large Titles): `font-semibold` hoặc `font-bold` (đặc biệt thích hợp cho tiếng Nhật/Hàn/Trung khi hiển thị tiêu đề lớn).
  - Body text: `font-normal` (nhẹ nhàng, dễ đọc).
- **Letter Spacing (Khoảng cách chữ)**:
  - Cấu hình khoảng cách chữ khít hơn một chút đối với các tiêu đề lớn (`tracking-tight` tương đương `-0.011em` đến `-0.022em`) để tạo cảm giác chuyên nghiệp của iOS/macOS.
  - Giữ khoảng cách mặc định hoặc hơi rộng (`tracking-normal`) cho phần nội dung đọc bằng tiếng Việt, tiếng Anh và CJK để tối ưu khả năng đọc.
- **Line Height (Chiều cao dòng)**:
  - Luôn đảm bảo chiều cao dòng tối ưu từ `1.4` đến `1.6` (`leading-relaxed` hoặc `leading-normal`) để các ký tự tiếng Việt có dấu và ký tự tượng hình CJK không bị chồng chéo nhau.

---

## 3. Chiến Lược Giao Diện (Theme Strategy)

- **Trạng thái Nền (Backgrounds)**:
  - Nền chính (Main Background): Sử dụng sắc độ tối pha từ màu Primary `#1F2A5F` (ví dụ: `#0A0D1D` hoặc `#0F1225`) kết hợp hiệu ứng glassmorphism để tạo chiều sâu.
  - Nền Card/Container: Sử dụng màu `#1F2A5F` với độ mờ nhẹ (`bg-primary/20`) kết hợp với border mỏng màu Secondary (`#7B5C9C`).
- **Typography**:
  - Văn bản chính (Primary Text): Màu trắng hoặc xám nhạt (`#F8FAFC`).
  - Văn bản phụ (Secondary Text): Sử dụng màu Sky Blue `#8CD4E6` ở dạng mờ (`text-sky-blue/70`) hoặc màu xám nhạt.
- **Trạng thái Tương tác (Interactive States)**:
  - Khi hover các nút: Dịch chuyển từ màu nền sang gradient hòa quyện giữa Twilight Purple `#7B5C9C` và Dawn Rose `#DA8593`.
  - Khi TTS đang phát (Audio Player Active): Trình phát nhạc sẽ có viền phát sáng (glow border) màu Sunrise Gold `#FECD71` hoặc Morning Sky Blue `#8CD4E6`.
