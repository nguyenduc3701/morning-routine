# Morning Routine - Agent Guidelines

Welcome! When working on this project, you must adhere to the rules defined below. This file acts as the global entry point for all AI assistants (Antigravity, Cursor, Cline, Claude).

## 1. Core Architecture & Breaking Changes
<!-- BEGIN:nextjs-agent-rules -->
**This is NOT the Next.js you know**
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 2. Project Ecosystem (`/.agent/`)
This project utilizes an advanced agentic ecosystem located in the `/.agent/` directory. AI agents **MUST** explore and utilize these resources when performing complex tasks:
- **`/.agent/my-rules/`**: Contains core conventions and architectural decisions.
  - [Global Rules](file:///Users/minhducnguyen/morning-routine/.agent/my-rules/global-rules.md)
  - [Design Tokens & Palette](file:///Users/minhducnguyen/morning-routine/.agent/my-rules/design.md)
- **`/.agent/my-skills/`**: Contains specialized skill routines and helper scripts for the AI.
- **`/.agent/my-workflows/`**: Contains step-by-step processes for common development tasks.
- **`/.agent/my-docs/`**: Additional project documentation and context.
- **`/.agent/scratch/`**: Temporary area for the AI to store scratchpads or temporary data.

Before proposing major architectural changes, UI modifications, or complex workflows, you must review the relevant files in the `/.agent/` directory.

## 3. UI Layout & CSS Best Practices (Critical Preventative Measures)
<!-- BEGIN:ui-layout-rules -->
To prevent layout breakages, text wrapping into single-word columns, and elements collapsing unexpectedly:
1. **Separate Layout and Scroll**: Never use `flex items-center justify-center` and `overflow-y-auto` (or `overflow-x-auto`) on the same container. Create a parent container for scrolling (`overflow-y-auto w-full h-full`) and a child container for centering (`flex flex-col items-center w-full max-w-[...]`).
2. **Always Constrain Width for Flex Children**: When using `flex-1` (or `flex-grow`), always explicitly define the width (e.g., `min-w-0 w-full`) to prevent children from collapsing to `min-content` (which causes text to wrap aggressively).
3. **Height Constraints**: For `overflow-y-auto` to work, the parent container MUST have a constrained height (e.g., `h-screen`, `max-h-[...]`, or flex basis with a constrained grand-parent).
4. **Fallback to Inline Styles for Complex Alignments**: If Tailwind's flex/overflow interaction causes persistent issues, prefer explicit inline CSS styles (`display: flex`, `flexDirection: column`, `alignItems: center`, `width: 100%`) for critical UI shells.
<!-- END:ui-layout-rules -->

## 4. Absolute Non-Negotiables (Quy tắc bất di bất dịch)
Dù làm bất kỳ task nào, bạn phải tuân thủ nghiêm ngặt:
- **Ngôn ngữ**: 100% Code/Biến/Tên file bằng **Tiếng Anh**. Comments/Notes giải thích bằng **Tiếng Việt**.
- **Package Manager**: Chỉ sử dụng **`pnpm`** (Tuyệt đối không dùng `npm` hay `yarn`).
- **Code Quality**: `strict: true` cho TypeScript. **Không** dùng `any`. **Không** để lại code `// TODO` (Zero-Placeholder).
- Tham khảo chi tiết tại: [Global Rules](file:///Users/minhducnguyen/morning-routine/.agent/my-rules/global-rules.md)
