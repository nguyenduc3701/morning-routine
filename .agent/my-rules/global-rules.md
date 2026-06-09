# Global Development Rules & Best Practices

Quy tắc này áp dụng cho toàn bộ quá trình phát triển mã nguồn, cấu trúc dự án và thiết kế giao diện nhằm đảm bảo tính ổn định, dễ bảo trì và trải nghiệm người dùng cao cấp.

---

## 1. Type Safety & TypeScript
- **Strict Type Checking**: Luôn bật chế độ `strict: true` trong cấu hình TypeScript. Không bao giờ sử dụng kiểu `any`. Hãy dùng `unknown` hoặc định nghĩa interface/type cụ thể.
- **Explicit Returns**: Mọi hàm, component và API handler phải khai báo kiểu trả về rõ ràng (ví dụ: `function getData(): Promise<Data[]>`, `const Player: FC<PlayerProps> = ...`).
- **Path Aliases**: Sử dụng absolute import dạng `@/components/...` thay vì relative path dài dòng (`../../components/...`).

## 2. Language & Commenting Conventions
- **Code & Variables**: Toàn bộ mã nguồn bao gồm tên biến, tên hàm, tên file, thư mục, database columns, API routes, css classes và types phải sử dụng **100% tiếng Anh**.
- **Comments & Notes**: Các đoạn bình luận (comments) giải thích logic code phức tạp hoặc các ghi chú (notes) trong mã nguồn phải sử dụng **tiếng Việt** để dễ dàng trao đổi và nắm bắt ý đồ.

## 3. Architecture, Package Management & Rendering (Next.js & React)
- **Package Manager Constraint (pnpm)**: Chỉ sử dụng duy nhất **`pnpm`** làm trình quản lý gói để cài đặt thư viện, quản lý các phụ thuộc và chạy các file script trong dự án (tuyệt đối không dùng `npm` hay `yarn`). Đảm bảo file `pnpm-lock.yaml` được duy trì và commit.
- **Priority on SSR (Server-Side Rendering)**: Ưu tiên sử dụng Server-Side Rendering (SSR) để sinh HTML động phía server cho các trang hiển thị dữ liệu thời gian thực.
- **Client-Side Fetching with TanStack Query**: Đối với các tác vụ lấy dữ liệu ở Client Component, tương tác thời gian thực hoặc cần cache/refetch tự động, **ưu tiên sử dụng TanStack Query (React Query)** thay vì dùng `useEffect` thuần hoặc các thư viện fetching khác.
- **Separation of Concerns**:
  - Tách biệt rõ ràng logic API/Cào dữ liệu (nằm trong `@/lib` hoặc `@/app/api`) khỏi UI Components.
  - Sử dụng Zustand store để quản lý global state thuần giao diện (như trạng thái trình phát nhạc, playlist UI) kết hợp với TanStack Query cho data-driven state.

## 4. UI/UX, SEO, GEO, Responsive & Multi-language Optimization
- **Full Multi-language Support (en, vi, jp, cn, kr)**: Luôn đảm bảo toàn bộ mã nguồn giao diện được tạo ra hỗ trợ đầy đủ 5 ngôn ngữ: Tiếng Anh (`en`), Tiếng Việt (`vi`), Tiếng Nhật (`jp`), Tiếng Trung (`cn`), và Tiếng Hàn (`kr`).
  - Không hardcode các chuỗi ký tự hiển thị (UI strings). Tất cả văn bản giao diện phải đi qua hệ thống dịch thuật cục bộ (UI translation dictionaries/JSON files).
  - Dữ liệu động sinh ra từ AI hoặc DB phải hỗ trợ lọc và chuyển đổi theo ngôn ngữ ưu tiên (`preferred_language`) của người dùng.
- **SEO & GEO Optimization**:
  - Tích hợp cấu hình metadata tĩnh và động chuẩn SEO (Title, Description, Open Graph, Twitter Cards) tương thích theo từng ngôn ngữ địa phương (locale).
  - Sử dụng đúng cấu trúc thẻ Heading ngữ nghĩa (`h1` duy nhất, phân cấp `h2`, `h3`).
  - Hỗ trợ tối ưu hóa hiển thị theo khu vực địa lý (GEO) thông qua thẻ ngôn ngữ `<html lang="...">`, cấu hình múi giờ phù hợp và hiển thị định dạng tiền tệ/thời gian chuẩn hóa theo locale người dùng.
- **Mobile-First & Fluid Responsiveness**: Thiết kế và phát triển giao diện theo cách tiếp cận **Mobile-First**.
  - Viết CSS/Tailwind classes ưu tiên màn hình di động nhỏ trước tiên, sau đó scale-up dần bằng các responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
  - Bố cục layout phải uyển chuyển (fluid components), sử dụng flexbox/grid thích ứng tốt để tránh lỗi tràn khung (overflow) hay mất chữ trên các kích thước thiết bị khác nhau (mobile, tablet, desktop).
- **Cross-browser Compatibility**: Đảm bảo ứng dụng chạy mượt mà và tương thích tốt trên các trình duyệt hiện đại phổ biến (Safari, Chrome, Firefox, Edge) trên cả iOS/macOS và Android/Windows.
  - Với các API đặc thù của trình duyệt (như **Web Speech API**), bắt buộc phải có bước kiểm tra hỗ trợ giao diện (`if (typeof window !== 'undefined' && 'speechSynthesis' in window)`) và xử lý fallback an toàn cho trình duyệt không hỗ trợ.
- **Adherence to Core Design Language (Colors & Typography)**: Toàn bộ giao diện phải bám sát nghiêm ngặt bảng màu và hệ kiểu chữ được định nghĩa trong file nguyên tắc thiết kế [design.md](file:///Users/minhducnguyen/morning-routine/.agent/my-rules/design.md):
  - **Bảng Màu**: Sử dụng các mã hex chuẩn (Primary `#1F2A5F`, Secondary `#7B5C9C`, Dawn Rose `#DA8593`, Sunrise Gold `#FECD71`, Sky Blue `#8CD4E6`) cho màu nền, đường viền, điểm nhấn và màu phát sáng.
  - **Kiểu Chữ (Typography)**: Cấu hình chính xác font family stack chuẩn Apple-inspired (ưu tiên font hệ thống Apple và fallback Noto Sans CJK/Inter) để đảm bảo hiển thị đồng đều trên mọi thiết bị.
  - **Quy tắc Trình bày**: Tuân thủ hướng dẫn về độ đậm (font weight), khoảng cách khít cho tiêu đề (`tracking-tight`), và chiều cao dòng an toàn (`leading-relaxed` hoặc `leading-normal`) để tránh lỗi dấu tiếng Việt hoặc chữ tượng hình CJK bị đè nhau.
- **Premium Aesthetics**: Thiết kế giao diện cao cấp kết hợp hiệu ứng Glassmorphic (`backdrop-blur-md bg-white/10`) sử dụng các mã hex và kiểu chữ quy định ở trên.
- **Micro-animations**: Hover effect mượt mà (`transition-all duration-300 ease-in-out hover:scale-[1.02]`).

## 5. Database & API Query Optimization
- **Optimized DB Scripts**: Mọi script khởi tạo database (Supabase/PostgreSQL) must được tối ưu hiệu năng:
  - Khai báo đầy đủ indexes cho các cột thường xuyên được `WHERE`, `JOIN` hoặc `ORDER BY`.
  - Thiết lập ràng buộc khóa ngoại (foreign keys) với hành vi thích hợp (`ON DELETE CASCADE`,...).
- **Minimize DB Queries**: Thiết kế API tối giản số lần truy vấn tới Database trong 1 request.
  - Sử dụng `JOIN` hoặc `JSON aggregation` trong SQL để lấy dữ liệu liên quan thay vì gọi tuần tự nhiều câu lệnh query riêng biệt.
  - Tránh triệt để lỗi truy vấn N+1. Áp dụng cơ chế cache dữ liệu nếu dữ liệu ít thay đổi.

## 6. Error Handling & Reliability
- **Boundary Validation**: Xác thực dữ liệu đầu vào tại các cổng API hoặc khi nhận dữ liệu từ nguồn ngoài (như Supabase, Apify) bằng thư viện xác thực như **Zod**.
- **Safe Async Calls**: Tất cả các tác vụ bất đồng bộ gọi API ngoài phải nằm trong khối `try-catch` với thông báo lỗi thân thiện và giải pháp fallback.
- **Zero-Placeholder Policy**: Không viết code dạng placeholder (`// TODO`). Mọi tính năng phải hoạt động hoàn chỉnh.
