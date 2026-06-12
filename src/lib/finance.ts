/**
 * Finance service for fetching financial data
 * Toàn bộ code viết bằng tiếng Anh, giải thích bằng tiếng Việt theo luật của dự án.
 */

export interface FinanceData {
  gold: {
    xauusd: { price: number; change: number };
    bt9999ntt: { buy: number; sell: number; changeBuy: number; changeSell: number };
    dohnl: { buy: number; sell: number; changeBuy: number; changeSell: number };
  } | null;
  btc: {
    price: number;
    changePercent: number;
    changeValue: number;
  } | null;
  vn30: {
    index: number;
    change: number;
  } | null;
}

/**
 * Fetch gold prices from vang.today
 */
async function fetchGoldData() {
  try {
    const response = await fetch('https://www.vang.today/api/prices?days=2', {
      next: { revalidate: 1800 } // Cache 30 minutes
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.success || !data.history || data.history.length === 0) return null;

    const latest = data.history[0].prices;
    if (!latest) return null;

    return {
      xauusd: latest.XAUUSD ? { 
        price: latest.XAUUSD.buy, 
        change: latest.XAUUSD.day_change_buy 
      } : { price: 0, change: 0 },
      bt9999ntt: latest.BT9999NTT ? { 
        buy: latest.BT9999NTT.buy, 
        sell: latest.BT9999NTT.sell, 
        changeBuy: latest.BT9999NTT.day_change_buy, 
        changeSell: latest.BT9999NTT.day_change_sell 
      } : { buy: 0, sell: 0, changeBuy: 0, changeSell: 0 },
      dohnl: latest.DOHNL ? { 
        buy: latest.DOHNL.buy, 
        sell: latest.DOHNL.sell, 
        changeBuy: latest.DOHNL.day_change_buy, 
        changeSell: latest.DOHNL.day_change_sell 
      } : { buy: 0, sell: 0, changeBuy: 0, changeSell: 0 }
    };
  } catch (error) {
    console.error("Error fetching Gold:", error);
    return null;
  }
}

/**
 * Fetch BTC price from Binance
 */
async function fetchBTCData() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', {
      next: { revalidate: 300 } // Cache 5 mins
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      price: parseFloat(data.lastPrice),
      changePercent: parseFloat(data.priceChangePercent),
      changeValue: parseFloat(data.priceChange)
    };
  } catch (error) {
    console.error("Error fetching BTC:", error);
    return null;
  }
}

/**
 * Fetch VN30 from Binance API with symbol VNINDEX
 */
async function fetchVN30Data() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=VNINDEX', {
      next: { revalidate: 300 } // Cache 5 mins
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      index: parseFloat(data.lastPrice),
      change: parseFloat(data.priceChange)
    };
  } catch (error) {
    console.error("Error fetching VN30:", error);
    return null;
  }
}

export async function getGoldText(): Promise<string> {
  const gold = await fetchGoldData();
  const formatNum = (num: number) => new Intl.NumberFormat('vi-VN').format(num);
  if (!gold) return "Hiện tại không thể cập nhật giá vàng.";

  let goldText = "Giá vàng hôm nay: ";
  if (gold.xauusd && gold.xauusd.price > 0) {
    const changeStr = gold.xauusd.change > 0 ? `tăng ${formatNum(gold.xauusd.change)}` : (gold.xauusd.change < 0 ? `giảm ${formatNum(Math.abs(gold.xauusd.change))}` : 'không đổi');
    goldText += `Vàng thế giới (XAU/USD) là ${formatNum(gold.xauusd.price)} USD/oz (${changeStr}). `;
  }
  if (gold.bt9999ntt && gold.bt9999ntt.buy > 0) {
    const changeStr = gold.bt9999ntt.changeBuy > 0 ? `tăng ${formatNum(gold.bt9999ntt.changeBuy)}đ` : (gold.bt9999ntt.changeBuy < 0 ? `giảm ${formatNum(Math.abs(gold.bt9999ntt.changeBuy))}đ` : 'không đổi');
    goldText += `Nhẫn tròn trơn Bảo Tín mua vào ${formatNum(gold.bt9999ntt.buy)}đ (${changeStr}). `;
  }
  if (gold.dohnl && gold.dohnl.buy > 0) {
    const changeStr = gold.dohnl.changeBuy > 0 ? `tăng ${formatNum(gold.dohnl.changeBuy)}đ` : (gold.dohnl.changeBuy < 0 ? `giảm ${formatNum(Math.abs(gold.dohnl.changeBuy))}đ` : 'không đổi');
    goldText += `DOJI Hà Nội mua vào ${formatNum(gold.dohnl.buy)}đ (${changeStr}).`;
  }
  return goldText;
}

export async function getBtcText(): Promise<string> {
  const btc = await fetchBTCData();
  const formatNum = (num: number) => new Intl.NumberFormat('vi-VN').format(num);
  if (!btc) return "Hiện tại không thể cập nhật giá Bitcoin.";

  const changeStr = btc.changeValue > 0 ? `tăng ${formatNum(btc.changeValue)} USD (${btc.changePercent.toFixed(2)}%)` : (btc.changeValue < 0 ? `giảm ${formatNum(Math.abs(btc.changeValue))} USD (${Math.abs(btc.changePercent).toFixed(2)}%)` : 'không đổi');
  return `Tiền điện tử Bitcoin (BTC) đang ở mức ${formatNum(btc.price)} USD, ${changeStr} so với 24h qua.`;
}

export async function getVn30Text(): Promise<string> {
  const vn30 = await fetchVN30Data();
  const formatNum = (num: number) => new Intl.NumberFormat('vi-VN').format(num);
  if (!vn30) return "Hiện tại chỉ số chứng khoán VN30 đang đóng cửa tĩnh hoặc không lấy được dữ liệu.";

  const changeStr = vn30.change > 0 ? `tăng ${formatNum(vn30.change)} điểm` : (vn30.change < 0 ? `giảm ${formatNum(Math.abs(vn30.change))} điểm` : 'không đổi');
  return `Chỉ số chứng khoán VN30 đang ở mức ${formatNum(vn30.index)} điểm, ${changeStr} so với phiên trước.`;
}
