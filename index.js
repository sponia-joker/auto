import fetch from "node-fetch";
import schedule from "node-schedule";
import _ from "lodash";
import { AddLotteryOrders } from "./order.js";
import { convertNumberInDingWeiDan } from "./util.js";
import config from "./config.js";

/**
 * 获取到投注列表
 * @returns
 *
 */

async function getOrderList() {
  const response = await fetch(`${config.api}/APIV2/GraphQL?l=en-us&pf=web`, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization: config.token,
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: `${config.api}/report/lotteryOrder`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "getPersonalLotteryGameRecord",
      variables: {
        input: {
          order_status_type: "All",
          start_time: "2021-09-05 03:00:00",
          end_time: "2021-09-06 03:00:00",
          page: 1,
          page_row: 1,
          identity_range: "Team",
          user_account: config.username, // 到时候自定义指定下级用户名
          game_id: null,
          order_type: "All",
          bet_percent_type: "All",
        },
      },
      query:
        "query getPersonalLotteryGameRecord($input: PersonalLotteryGameRecordInputObj) {\n  User {\n    id\n    personal_lottery_game_record_page(input: $input) {\n      record {\n        id\n        user_account\n        game_cycle_value\n        bet_info\n        game_value\n        game_type_name\n        bet_balance_display\n        result_balance_display\n        create_time\n        bet_multiple\n        order_status\n        can_cancel\n        can_one_more\n        result_balance_change_reason\n        __typename\n      }\n      page_data {\n        current\n        pages\n        total\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  Language {\n    order_status {\n      k\n      v\n      __typename\n    }\n    __typename\n  }\n}\n",
    }),
    method: "POST",
    mode: "cors",
  });
  const data = await response.json();
  return _.get(data, "data.User.personal_lottery_game_record_page.record", []);
}
/**
 *
 * game_cycle_value 期号
 * game_value 彩种
 * game_type_name 玩法
 * bet_info 下注信息
 * user_account 用户名
 */

/**
 * 获取用户某个订单的具体投注记录
 * id 投注记录对应的id
 */
async function getOrderDetail(id) {
  const response = await fetch(`${config.api}/APIV2/GraphQL?l=en-us&pf=web`, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization: config.token,
      "content-type": "application/json",
      "sec-ch-ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: `${config.api}/report/lotteryOrder`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "getLotteryOrderDetail",
      variables: {
        id: id,
      },
      query:
        "query getLotteryOrderDetail($id: String!) {\n  User {\n    id\n    lottery_order_detail(id: $id) {\n      user_account\n      order_id\n      create_time\n      game_id_v2\n      game_type_name\n      game_cycle_value\n      bet_count\n      bet_multiple\n      bet_balance\n      result_balance\n      order_status\n      order_result\n      bet_info\n      bet_mode\n      bet_percent\n      bet_percent_type\n      can_cancel\n      result_balance_change_reason\n      result_count\n      __typename\n    }\n    __typename\n  }\n  Language {\n    lottery_game_v2 {\n      k\n      v\n      __typename\n    }\n    order_status {\n      k\n      v\n      __typename\n    }\n    bet_mode {\n      k\n      v\n      __typename\n    }\n    __typename\n  }\n}\n",
    }),
    method: "POST",
    mode: "cors",
  });
  const result = await response.json();
  return result;
}

const orderList = await getOrderList();

/**
 * order:
 * bet_balance_display: "16"
bet_info: "01256789, , , , "
bet_multiple: 1
can_cancel: false
can_one_more: true
create_time: "2021-09-04 18:57:44"
game_cycle_value: "202109041138"
game_type_name: "定位胆"
game_value: "奇趣腾讯分分彩"
id: "NFJWDMWKIQEL"
order_status: "OrderFinishWin" "OrderWaitOpen"  "OrderFinishNotWin" 订单状态
result_balance_change_reason: ""
result_balance_display: "19.660" //有余额说明是中奖
user_account: "dashabi999"
 */
for (const order of orderList) {
  if (order.order_status === "OrderFinishWin") {
    let { bet_info, game_type_name } = order;
    if (game_type_name === "定位胆") {
      const array = bet_info.replace(/\s+/g, "").split(","); //去掉下注信息中的空格,转换成数组
      AddLotteryOrders({
        params: {
          bet_info: convertNumberInDingWeiDan(array),
        },
      });
    }
  }
}