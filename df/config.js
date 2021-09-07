// export const username = "lc1994";
export const username = "dftest001";

export const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGMxOTk0IiwiTWVyY2hhbnRDb2RlIjoiZGYiLCJQbGF5ZXJUeXBlIjoiYWdlbnQiLCJuYmYiOjE2MzA5ODU2MTEsImV4cCI6MTYzMDk4NzQxMX0.j6wyHga__mbzpa9fdssERIgu1MCQ02mJAqtzyzvTTEY";

export const touzhuToken =
  "J-TaXXHMwi_lvwbn4h9PV34VfhOApJ6etEsq-xSonp8=.eyJ1IjoyNjUwOTksImEiOjU0NDQwNTgsInQiOiJmNGM0NjFkNGU1MzRlZmZlIiwiayI6MX0=";

export const api = "https://sk.df668s.com";

// export const api = "https://ws.dfgne7.com";

export const interval = 1; //默认监听时间间隔为2秒

export const headers = {
  accept: "application/json, text/plain, */*",
  "accept-language": "zh-CN,zh;q=0.9",
  // authorization: config.touzhuToken,
  "content-type": "application/json",
  "sec-ch-ua":
    '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
};

export default {
  username,
  token,
  api,
  interval,
  touzhuToken,
  headers,
};
