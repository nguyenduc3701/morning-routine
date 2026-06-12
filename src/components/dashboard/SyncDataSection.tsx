'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSyncStore } from '@/store/syncStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useAudioPlaylistStore } from '@/store/audioPlaylistStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { RefreshCw, Play, CheckCircle2 } from 'lucide-react';

/**
 * Hàm lấy kịch bản giả lập đã được dịch theo ngôn ngữ lựa chọn
 */
const getLocalizedMockText = (catId: string, catName: string, isFacebook: boolean, locale: string): string => {
  switch (locale) {
    case 'vi':
      if (catId === 'cat_gold') return "Giá vàng hôm nay: Vàng miếng SJC niêm yết ở mức 85 triệu đồng một lượng. Giá vàng nhẫn duy trì mức ổn định so với hôm qua.";
      if (catId === 'cat_vn30') return "Chỉ số VN30 hiện tại đóng cửa ở mốc 1250 điểm, tăng nhẹ 3 điểm. Bitcoin đang giao dịch ở mức 64,000 USD.";
      if (catId === 'cat_3') return "Lịch trình Google Calendar của bạn hôm nay: Lúc 9 giờ sáng bạn có cuộc họp với nhóm phát triển dự án. Lúc 2 giờ chiều có buổi hẹn thảo luận kế hoạch Marketing. Buổi tối lúc 7 giờ có lớp học tiếng Anh trực tuyến.";
      if (isFacebook) return `Bản tin từ trang mạng xã hội ${catName}. Có hai bài viết nổi bật vừa được chia sẻ, thảo luận về xu hướng phát triển công nghệ mới và các mẹo tối ưu hóa công việc buổi sáng.`;
      return `Đây là nội dung cho danh mục ${catName}. Chúc bạn một ngày mới tốt lành và tràn đầy năng lượng.`;

    case 'jp':
      if (catId === 'cat_gold') return "今日の金価格：金価格は1グラムあたり12,000円を維持しています。";
      if (catId === 'cat_vn30') return "昨日の日経平均株価は300円小幅に上昇し、38,500円で取引を終えました。";
      if (catId === 'cat_3') return "今日のGoogleカレンダーの予定：午前9時からプロジェクト開発チームとの会議があります。午後2時からマーケティング計画のディスカッションがあります。夜7時からオンライン英語レッスンがあります。";
      if (isFacebook) return `ソーシャルネットワーク ${catName} からのニュース。最近共有された注目すべき投稿が2件あり、新しいテクノロジーのトレンドと朝の生産性を高めるコツについて議論されています。`;
      return `これは ${catName} カテゴリのコンテンツです。素晴らしい一日をお過ごしください。`;

    case 'cn':
      if (catId === 'cat_gold') return "今日黄金零售价维持在每克550元。";
      if (catId === 'cat_vn30') return "昨日上证指数微涨15点，收于3050点。";
      if (catId === 'cat_3') return "您今天的谷歌日历日程安排：上午9点与项目开发团队开会。下午2点有营销计划讨论会。晚上7点有在线英语课。";
      if (isFacebook) return `来自社交媒体页面 ${catName} 的简报。刚刚分享了两篇热门文章，讨论了新技术发展趋势以及优化早晨工作流程的技巧。`;
      return `这是 ${catName} 栏目的内容。祝您新的一天充满活力，工作顺利。`;

    case 'kr':
      if (catId === 'cat_gold') return "국내 금 시세는 돈당 40만 원 선을 유지하고 있습니다.";
      if (catId === 'cat_vn30') return "어제 코스피 지수는 15포인트 소폭 상승하여 2650포인트로 마감했습니다.";
      if (catId === 'cat_3') return "오늘의 구글 캘린더 일정: 오전 9시에 프로젝트 개발 팀과의 회의가 있습니다. 오후 2시에 마케팅 계획 논의 세션이 있습니다. 저녁 7시에 온라인 영어 강의가 예정되어 있습니다.";
      if (isFacebook) return `소셜 미디어 페이지 ${catName}의 브리핑입니다. 새로 공유된 인기 게시물 2개가 있으며, 새로운 기술 트렌드와 아침 업무 효율화 팁에 대해 논의하고 있습니다.`;
      return `이것은 ${catName} 카테고리의 콘텐츠입니다. 활기차고 좋은 하루 보내세요!`;

    case 'en':
    default:
      if (catId === 'cat_gold') return "Gold price remains stable at 2,300 dollars per ounce.";
      if (catId === 'cat_vn30') return "The Dow Jones index closed up slightly by 50 points yesterday, anchoring at 39,000 points. Bitcoin is currently at $64,000.";
      if (catId === 'cat_3') return "Your Google Calendar schedule today: At 9:00 AM you have a meeting with the project development team. At 2:00 PM there is a marketing plan discussion. In the evening at 7:00 PM, you have an online English class.";
      if (isFacebook) return `Updates from social media page ${catName}. There are two highlighted posts recently shared, discussing new technology trends and morning workflow optimization tips.`;
      return `This is the content for ${catName} category. Have a great and energetic day ahead!`;
  }
};

export function SyncDataSection() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const { status, progress, startSync, completeSync } = useSyncStore();
  const [isFetching, setIsFetching] = useState(false);

  const startSyncWithData = async () => {
    // Dừng ngay audio đang phát (nếu có) trước khi lấy data mới
    useAudioPlaylistStore.getState().stop();
    
    startSync();
    setIsFetching(true);
    
    try {
      // Lấy URL thời tiết từ Store (để cho phép thay đổi URL sau này)
      const weatherCat = useCategoryStore.getState().categories.find(c => c.id === 'cat_1');
      const weatherUrlQuery = weatherCat?.url ? `&weatherUrl=${encodeURIComponent(weatherCat.url)}` : '';

      // Gọi API AI Briefing (sử dụng Gemini sinh kịch bản)
      const response = await fetch(`/api/briefing?locale=${locale}${weatherUrlQuery}`);
      const data = await response.json();
      
      if (data.error) {
        console.error("AI API returned error:", data.error);
        throw new Error(data.error);
      }

      // Bản dịch mã ngôn ngữ từ locale sang SpeechSynthesis BCP 47 language code
      const localeToLangMap: Record<string, string> = {
        vi: 'vi-VN',
        en: 'en-US',
        jp: 'ja-JP',
        cn: 'zh-CN',
        kr: 'ko-KR'
      };
      const speechLang = localeToLangMap[locale] || 'en-US';

      // Lấy danh sách các danh mục đang hoạt động
      const activeCats = useCategoryStore.getState().categories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.order - b.order);

      // Tạo nội dung tương ứng cho từng danh mục dựa trên locale
      const playlist = activeCats.map(cat => {
        let text = "";
        
        // Lấy text do AI sinh ra dựa trên ID category
        if (cat.isFacebook) {
          text = data['cat_facebook'] || getLocalizedMockText(cat.id, cat.name, cat.isFacebook, locale);
        } else {
          text = data[cat.id] || getLocalizedMockText(cat.id, cat.name, cat.isFacebook, locale);
        }

        return {
          id: cat.id,
          name: cat.name,
          text,
          lang: speechLang
        };
      });

      // Lưu playlist vào store
      useAudioPlaylistStore.getState().setPlaylist(playlist);
    } catch (error) {
      console.error("Failed to sync AI briefing data, falling back to mock:", error);
      
      // Fallback nếu có lỗi mạng hoặc API Key chưa được cấu hình
      const localeToLangMap: Record<string, string> = {
        vi: 'vi-VN',
        en: 'en-US',
        jp: 'ja-JP',
        cn: 'zh-CN',
        kr: 'ko-KR'
      };
      const speechLang = localeToLangMap[locale] || 'en-US';

      const activeCats = useCategoryStore.getState().categories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.order - b.order);
      const fallbackPlaylist = activeCats.map(cat => ({
        id: cat.id,
        name: cat.name,
        text: getLocalizedMockText(cat.id, cat.name, cat.isFacebook, locale),
        lang: speechLang
      }));
      useAudioPlaylistStore.getState().setPlaylist(fallbackPlaylist);
    } finally {
      setIsFetching(false);
    }
  };

  // Giả lập tiến trình chạy mượt trên UI
  useEffect(() => {
    if (status === 'syncing') {
      const interval = setInterval(() => {
        useSyncStore.setState((state) => {
          // Nếu API chưa trả về xong, giữ tiến trình tối đa ở mức 90%
          if (isFetching && state.progress >= 90) {
            return state;
          }

          if (state.progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              completeSync();
            }, 300);
            return state;
          }

          const increment = Math.floor(Math.random() * 9) + 3;
          return { progress: Math.min(100, state.progress + increment) };
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [status, isFetching, completeSync]);

  return (
    <section id="prepare-data-section" className="w-full">
      <GlassCard className="rounded-xl p-sm md:p-md space-y-sm w-full transition-all duration-300" glow={status === 'syncing'}>
        
        {status === 'idle' && (
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">
              {t('syncIdle')}
            </span>
            <button
              onClick={startSyncWithData}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary text-[#0A0F2C] hover:bg-tertiary/90 hover:scale-105 transition-all text-sm font-bold shadow-[0_0_15px_rgba(239,191,101,0.3)]"
            >
              <Play size={14} strokeWidth={2} />
              {t('startSync')}
            </button>
          </div>
        )}

        {status === 'syncing' && (
          <>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">
                {t('syncing')}
              </span>
              <div className="flex items-center gap-xs">
                <RefreshCw size={14} strokeWidth={2} className="text-tertiary animate-spin-slow" />
                <span className="font-label-sm text-label-sm text-tertiary">{Math.min(100, progress)}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="progress-gradient h-full rounded-full transition-all duration-200 ease-out" 
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
          </>
        )}

        {status === 'completed' && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} strokeWidth={2} className="text-[#8CD4E6]" />
              <span className="font-body-md text-body-md text-[#8CD4E6] font-medium">
                {t('syncCompleted')}
              </span>
            </div>
            <button
              onClick={startSyncWithData}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-on-surface-variant hover:text-white text-sm font-medium"
            >
              <RefreshCw size={14} strokeWidth={2} />
              {t('reSync')}
            </button>
          </div>
        )}

      </GlassCard>
    </section>
  );
}
