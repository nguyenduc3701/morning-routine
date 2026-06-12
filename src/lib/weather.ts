/**
 * Weather service for fetching weather info from Open-Meteo API
 * Toàn bộ code viết bằng tiếng Anh, giải thích bằng tiếng Việt theo luật của dự án.
 */

export interface WeatherInfo {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  description: string;
  tempMin: number;
  tempMax: number;
}

/**
 * Ánh xạ mã thời tiết WMO sang mô tả theo 5 ngôn ngữ
 */
const WEATHER_DESCRIPTIONS: Record<string, Record<number, string>> = {
  vi: {
    0: "Trời quang đãng, không mưa",
    1: "Trời ít mây, tạnh ráo",
    2: "Trời nhiều mây, có lúc hửng nắng",
    3: "Trời âm u, nhiều mây",
    45: "Có sương mù nhẹ",
    48: "Có sương mù dày đặc",
    51: "Mưa phùn nhẹ",
    53: "Mưa phùn vừa",
    55: "Mưa phùn đặc",
    56: "Mưa phùn lạnh giá nhẹ",
    57: "Mưa phùn lạnh giá dày",
    61: "Có mưa rào nhẹ",
    63: "Có mưa vừa",
    65: "Có mưa to đến rất to",
    66: "Mưa buốt giá nhẹ",
    67: "Mưa buốt giá nặng",
    71: "Có tuyết rơi nhẹ",
    73: "Có tuyết rơi vừa",
    75: "Có tuyết rơi dày",
    77: "Có mưa tuyết hạt nhỏ",
    80: "Mưa rào nhẹ rải rác",
    81: "Mưa rào vừa",
    82: "Mưa rào rất to và dồn dập",
    85: "Mưa tuyết nhẹ rải rác",
    86: "Mưa tuyết dày",
    95: "Có dông sét",
    96: "Có dông kèm mưa đá nhỏ",
    99: "Có dông kèm mưa đá lớn"
  },
  en: {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  },
  jp: {
    0: "快晴",
    1: "晴れ",
    2: "曇り",
    3: "薄曇り",
    45: "霧",
    48: "霧氷",
    51: "弱い霧雨",
    53: "霧雨",
    55: "強い霧雨",
    56: "弱い着氷性の霧雨",
    57: "強い着氷性の霧雨",
    61: "小雨",
    63: "雨",
    65: "大雨",
    66: "弱い着氷性の雨",
    67: "強い着氷性の雨",
    71: "小雪",
    73: "雪",
    75: "大雪",
    77: "霧雪",
    80: "にわか雨",
    81: "強いにわか雨",
    82: "激しいにわか雨",
    85: "にわか雪",
    86: "強いにわか雪",
    95: "雷雨",
    96: "雹を伴う弱い雷雨",
    99: "雹を伴う強い雷雨"
  },
  cn: {
    0: "晴朗",
    1: "大部晴朗",
    2: "多云",
    3: "阴天",
    45: "雾",
    48: "雾凇",
    51: "毛毛细雨",
    53: "中等细雨",
    55: "浓密细雨",
    56: "轻微冻细雨",
    57: "浓密冻细雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "轻微冻雨",
    67: "大冻雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "雪粒",
    80: "阵雨",
    81: "中等阵雨",
    82: "暴雨",
    85: "小阵雪",
    86: "大阵雪",
    95: "雷阵雨",
    96: "雷阵雨伴有小冰雹",
    99: "雷阵雨伴有大冰雹"
  },
  kr: {
    0: "맑음",
    1: "대체로 맑음",
    2: "구름 조금",
    3: "흐림",
    45: "안개",
    48: "서리 안개",
    51: "가벼운 이슬비",
    53: "보통 이슬비",
    55: "강한 이슬비",
    56: "가벼운 얼어붙는 이슬비",
    57: "강한 얼어붙는 이슬비",
    61: "약한 비",
    63: "보통 비",
    65: "강한 비",
    66: "약한 진눈깨비",
    67: "강한 진눈깨비",
    71: "약한 눈",
    73: "보통 눈",
    75: "강한 눈",
    77: "싸락눈",
    80: "소나기",
    81: "보통 소나기",
    82: "강한 소나기",
    85: "약한 소나기눈",
    86: "강한 소나기눈",
    95: "뇌우",
    96: "우박을 동반한 약한 뇌우",
    99: "우박을 동반한 강한 뇌우"
  }
};

/**
 * Lấy mô tả thời tiết dựa trên mã WMO và ngôn ngữ
 * @param code Mã thời tiết WMO
 * @param locale Ngôn ngữ (vi, en, jp, cn, kr)
 * @returns Mô tả bằng ngôn ngữ được chọn
 */
function getWeatherDescription(code: number, locale: string): string {
  const languageDict = WEATHER_DESCRIPTIONS[locale] || WEATHER_DESCRIPTIONS['en'];
  return languageDict[code] || (WEATHER_DESCRIPTIONS['en'][code] || "Unknown weather");
}

/**
 * Gọi API Open-Meteo để lấy thông tin thời tiết Hà Nội
 * Tọa độ Hà Nội: vĩ độ 21.0285, kinh độ 105.8542
 */
export async function fetchHanoiWeather(locale: string = 'en', customUrl?: string | null): Promise<WeatherInfo> {
  const latitude = 21.0285;
  const longitude = 105.8542;
  const defaultUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Bangkok`;
  const url = customUrl || defaultUrl;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      next: {
        revalidate: 1800 // Cache dữ liệu trong 30 phút
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = await response.json();

    const current = data.current;
    const daily = data.daily;

    if (!current || !daily) {
      throw new Error("Invalid response structure from weather API");
    }

    return {
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      description: getWeatherDescription(current.weather_code, locale),
      tempMin: daily.temperature_2m_min[0] ?? current.temperature_2m,
      tempMax: daily.temperature_2m_max[0] ?? current.temperature_2m
    };
  } catch (error) {
    console.error("Error in fetchHanoiWeather:", error);
    throw error;
  }
}

/**
 * Trả về một chuỗi tóm tắt thời tiết được dịch theo locale để truyền vào AI hoặc TTS
 */
export async function getHanoiWeatherSummary(locale: string = 'en'): Promise<string> {
  try {
    const weather = await fetchHanoiWeather(locale);
    
    switch (locale) {
      case 'vi':
        return `Thời tiết Hà Nội hôm nay: ${weather.description}. Nhiệt độ hiện tại là ${weather.temperature}°C (cảm giác thực tế như ${weather.apparentTemperature}°C). Nhiệt độ thấp nhất trong ngày khoảng ${weather.tempMin}°C, cao nhất khoảng ${weather.tempMax}°C. Độ ẩm không khí là ${weather.humidity}% và tốc độ gió khoảng ${weather.windSpeed} km/h.`;
      case 'jp':
        return `今日のハノイの天気は${weather.description}です。現在の気温は${weather.temperature}°C（体感温度は${weather.apparentTemperature}°C）です。今日の最低気温は約${weather.tempMin}°C、最高気温は約${weather.tempMax}°Cです。湿度は${weather.humidity}%で、風速は約${weather.windSpeed} km/hです。`;
      case 'cn':
        return `今天河内的天气：${weather.description}。当前温度为 ${weather.temperature}°C（体感温度为 ${weather.apparentTemperature}°C）。今天最低温度约为 ${weather.tempMin}°C，最高温度约为 ${weather.tempMax}°C。空气湿度为 ${weather.humidity}%，风速约为 ${weather.windSpeed} 公里/小时。`;
      case 'kr':
        return `오늘 하노이 날씨는 ${weather.description}입니다. 현재 기온은 ${weather.temperature}°C(체감 기온 ${weather.apparentTemperature}°C)입니다. 최저 기온은 약 ${weather.tempMin}°C, 최고 기온은 약 ${weather.tempMax}°C입니다. 습도는 ${weather.humidity}%이며, 풍속은 약 ${weather.windSpeed} km/h입니다.`;
      case 'en':
      default:
        return `Hanoi weather today: ${weather.description}. Current temperature is ${weather.temperature}°C (feels like ${weather.apparentTemperature}°C). Today's low is about ${weather.tempMin}°C, high is about ${weather.tempMax}°C. Humidity is ${weather.humidity}% and wind speed is around ${weather.windSpeed} km/h.`;
    }
  } catch (error) {
    console.error("Failed to generate weather summary for AI:", error);
    switch (locale) {
      case 'vi': return "Thời tiết Hà Nội hôm nay hiện không thể cập nhật do lỗi hệ thống.";
      case 'jp': return "システムエラーのため、今日のハノイの天気を更新できません。";
      case 'cn': return "由于系统错误，今天河内的天气目前无法更新。";
      case 'kr': return "시스템 오류로 인해 오늘 하노이 날씨를 업데이트할 수 없습니다.";
      case 'en':
      default: return "Hanoi weather today cannot be updated due to a system error.";
    }
  }
}
