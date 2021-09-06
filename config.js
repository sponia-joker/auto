export const username = "dashabi999";

export const token =
  "J-TaXXHMwi_lvwbn4h9PV34VfhOApJ6etEsq-xSonp8=.eyJ1IjoyNjUwOTksImEiOjU0NDQwNTgsInQiOiJmNGM0NjFkNGU1MzRlZmZlIiwiayI6MX0=";

export const touzhu_token =
  "J-TaXXHMwi_lvwbn4h9PV34VfhOApJ6etEsq-xSonp8=.eyJ1IjoyNjUwOTksImEiOjU0NDQwNTgsInQiOiJmNGM0NjFkNGU1MzRlZmZlIiwiayI6MX0=";

export const api = "https://666.yshi208.com";

// export const api = "https://666.wtlpecitqh.com";

export const interval = 1; //默认监听时间间隔为2秒

export const headers = {
  accept: "application/json, text/plain, */*",
  "accept-language": "zh-CN,zh;q=0.9",
  // authorization: config.touzhu_token,
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
  touzhu_token,
  headers,
};
