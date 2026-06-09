# Project Structure & Tech Stack

## 1. Tech Stack Chi Tiết
- **Framework**: Next.js (App Router)
- **Giao diện**: Tailwind CSS, Shadcn/ui
- **Quản lý trạng thái**: Zustand
- **Database**: Supabase (PostgreSQL)
- **AI Engine**: Google Gemini API (Model: gemini-1.5-flash)
- **Scraping**: Apify (Facebook Posts Scraper)
- **TTS (Text-to-Speech)**: Web Speech API (Miễn phí của trình duyệt)
- **Hạ tầng**: Vercel (Hosting & Cron Jobs)

## 2. Cấu trúc thư mục (Project Directory)
```plaintext
morning-routine-web/
├── src/
│   ├── app/            # Next.js App Router (Giao diện & API Routes)
│   │   ├── [locale]/   # Trang chủ UI chính và API theo từng ngôn ngữ
│   │   │   ├── api/    # Backend logic (Cron, Manual Trigger, Webhook)
│   │   │   └── page.tsx
│   ├── components/     # UI Components (AudioPlayer, ConfigForm, TextViewer)
│   ├── lib/            # API Utilities (Supabase, Gemini, Apify, Finance APIs)
│   ├── locales/        # Cấu hình dịch thuật tĩnh (en.json, vi.json, jp.json, cn.json, kr.json)
│   ├── store/          # Zustand Store (Quản lý playlist và trạng thái giọng đọc)
│   └── types/          # TypeScript interface definitions
├── middleware.ts       # Middleware Next.js để bắt locale và redirect
├── .env.local          # Lưu API Keys bảo mật (Không commit lên Git)
├── package.json
└── tailwind.config.js
```

## 3. Cơ sở dữ liệu (Database Schema - Supabase)
- **`users_config`**: Lưu cấu hình user (`google_token`, `facebook_pages`, `interests`, `preferred_language`).
- **`crawl_cache`**: Lưu dữ liệu thô tạm thời trong quá trình chờ cào FB.
- **`daily_routines`**: Lưu kịch bản JSON hoàn chỉnh của mỗi ngày (`user_id`, `date`, `playlist`).

## 4. Hỗ trợ Đa Ngôn Ngữ (Multi-language Support)
- **Danh sách ngôn ngữ hỗ trợ**:
  - `en` (English - Tiếng Anh)
  - `vi` (Vietnamese - Tiếng Việt)
  - `jp` (Japanese - Tiếng Nhật)
  - `cn` (Chinese - Tiếng Trung Giản Thể)
  - `kr` (Korean - Tiếng Hàn)
- **Phương án triển khai**:
  - **Routing & Middleware**: Cấu hình subfolder routing đa ngôn ngữ (ví dụ: `/[locale]/page.tsx`) sử dụng Middleware của Next.js để phát hiện locale từ tiêu đề `Accept-Language` hoặc cookie.
  - **Từ điển Dịch thuật (UI Dictionary)**: Lưu trữ các file cấu hình ngôn ngữ JSON cục bộ cho các văn bản tĩnh trên giao diện.
  - **Bản tin AI**: Khi Gemini AI biên tập kịch bản từ dữ liệu thô, nó sẽ sử dụng prompt thích hợp để dịch/tổng hợp trực tiếp nội dung kịch bản phát sang ngôn ngữ mà người dùng yêu cầu (`preferred_language`).
