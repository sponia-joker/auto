import fetch from "node-fetch";

async function start() {
  const response = await fetch(
    "https://666.yshi208.com/APIV2/GraphQL?l=en-us&pf=web",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: "https://666.yshi208.com/user/login/account",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"operationName":null,"variables":{},"query":"{\\n  CaptchaData {\\n    captcha_id\\n    captcha_base64_string\\n    need_verify\\n    __typename\\n  }\\n}\\n"}',
      method: "POST",
      mode: "cors",
    }
  );
  console.log(response);
}

start();
