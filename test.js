import fetch from "node-fetch";
import logger from "./logger.js";

let response ={}

try {
   response = await fetch("https://666.yshi208.com/APIV2/GraphQL?l=en-us&pf=web", {
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
    body: '{"operationName":null,"variables":{"app_key":"X3gdMHtYzc3d","account":"yyds108","password":"joker521521","captcha_id":"054c1e71562b06741a36082a0fbeba7829b9e7d9","captcha_code":"9776","google_code":null,"bank_card_real_name":null,"two_step_token":null},"query":"mutation ($app_key: String!, $account: String!, $password: String!, $captcha_id: String, $captcha_code: String, $google_code: String, $bank_card_real_name: String, $two_step_token: String) {\\n  info: Login(app_key: $app_key, account: $account, password: $password, captcha_id: $captcha_id, captcha_code: $captcha_code, google_code: $google_code, bank_card_real_name: $bank_card_real_name, two_step_token: $two_step_token) {\\n    user_id\\n    token\\n    user_info {\\n      id\\n      user_account\\n      user_email\\n      user_name\\n      is_beta\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
    method: "POST",
    mode: "cors",
  });
 
  const data = await response.json();
  console.log(data)
} catch (error) {
    logger.error(response)
  logger.error(error);
}
