import fetch from "node-fetch";
import _ from "lodash";
import config from "./config.js";
import logger from "./logger.js";
import baiduAaipSdk from "baidu-aip-sdk";

const AipOcrClient = baiduAaipSdk.ocr;

let client = null;

export async function getCaptchaData() {
  let response = {};
  let captchaData = {};
  const headers = { ...config.headers };
  delete headers["authorization"];
  try {
    response = await fetch(`${config.api}/APIV2/GraphQL?l=en-us&pf=web`, {
      headers,
      referrer: `${config.api}/user/login/account`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"operationName":null,"variables":{},"query":"{\\n  CaptchaData {\\n    captcha_id\\n    captcha_base64_string\\n    need_verify\\n    __typename\\n  }\\n}\\n"}',
      method: "POST",
      mode: "cors",
    });
    const data = await response.json();
    captchaData = _.get(data, "data.CaptchaData", {});
  } catch (error) {
    logger.error("获取验证码发生错误", error);
  }
  // captcha_id captcha_base64_string
  return captchaData;
}

export async function getImageToNumber(base64) {
  // 设置APPID/AK/SK
  const APP_ID = "19548350";
  const API_KEY = "GL1PYSZQT4Ua1vNypibIaZRC";
  const SECRET_KEY = "Cjkss5UnlafSA1LiuxLZBoUmhuYUYGr7";

  // 新建一个对象，建议只保存一个对象调用服务接口

  if (!client) {
    logger.info("新建orc客户端");
    client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
  }

  let response = {};

  try {
    response = await new Promise((resolve, reject) => {
      client
        .numbers(base64, { recognize_granularity: "big" })
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  } catch (error) {
    logger.error("验证码识别出现错误", error);
  }
  return _.get(response, "words_result[0].words");
}

export async function loginWanTai({
  account,
  password,
  captcha_code,
  captcha_id,
}) {
  let response = {};
  let data = {};
  const headers = { ...config.headers };
  delete headers["authorization"];
  try {
    response = await fetch(`${config.api}/APIV2/GraphQL?l=en-us&pf=web`, {
      headers,
      referrer: "https://666.yshi208.com/user/login/account",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify({
        operationName: null,
        variables: {
          app_key: "X3gdMHtYzc3d",
          account,
          password,
          captcha_id,
          captcha_code,
          google_code: null,
          bank_card_real_name: null,
          two_step_token: null,
        },
        query:
          "mutation ($app_key: String!, $account: String!, $password: String!, $captcha_id: String, $captcha_code: String, $google_code: String, $bank_card_real_name: String, $two_step_token: String) {\n  info: Login(app_key: $app_key, account: $account, password: $password, captcha_id: $captcha_id, captcha_code: $captcha_code, google_code: $google_code, bank_card_real_name: $bank_card_real_name, two_step_token: $two_step_token) {\n    user_id\n    token\n    user_info {\n      id\n      user_account\n      user_email\n      user_name\n      is_beta\n      __typename\n    }\n    __typename\n  }\n}\n",
      }),
      method: "POST",
      mode: "cors",
    });
    data = await response.json();
  } catch (error) {
    logger.error("登录平台出现错误", error);
  }
  return _.get(data, "data.info.token");
}
