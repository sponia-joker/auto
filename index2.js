import _ from "lodash";
import fetch from "node-fetch";
import schedule from "node-schedule";
import chalk from "chalk";
import config from "./config.js";
import st from "silly-datetime";
import { AddLotteryOrders } from "./order.js";
import { convertNumberInDingWeiDan, CallThePolice } from "./util.js";

/**
 * 全局变量，保存已经打印的订单id
 */

const hasPrint = {};

// 监听次数索引

let index = 1;
/**
 * 获取指定用户的投注记录
 * @returns
 *
 */

async function getOrderList() {
  const start_time = st.format(new Date(), "YYYY-MM-DD 03:00:00");
  const end_time = st.format(
    new Date(new Date().setDate(new Date().getDate() + 1)),
    "YYYY-MM-DD 03:00:00"
  );
  config.headers.authorization = config.token;
  const response = await fetch(`${config.api}/APIV2/GraphQL?l=en-us&pf=web`, {
    headers: config.headers,
    referrer: `${config.api}/report/lotteryOrder`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      operationName: "getPersonalLotteryGameRecord",
      variables: {
        input: {
          order_status_type: "OrderWaitChangeBalance", // OrderWaitChangeBalance 等待开奖  All 全部
          start_time: start_time,
          end_time: end_time,
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
  const orderList = _.get(
    data,
    "data.User.personal_lottery_game_record_page.record",
    []
  );
  CallThePolice(orderList.length > 0);
  return orderList;
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
  config.headers.authorization = config.token;
  const response = await fetch(`${config.api}/APIV2/GraphQL?l=en-us&pf=web`, {
    headers: config.headers,
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
  const data = await response.json();
  const orderDetail = _.get(data, "data.User.lottery_order_detail");
  return orderDetail;
}

// 定义规则
let rule = new schedule.RecurrenceRule();
let second = [];

// 通过配置config文件中的interval值,来设置监听的时间间隔
for (let time = 0; time < 60; time = time + config.interval) {
  second.push(time);
}
rule.second = second;

// 启动任务
let job = schedule.scheduleJob(rule, () => {
  console.log(
    `正在第${index}次监听下级用户【${
      config.username
    }】是否正在投注【时间：${st.format(new Date(), "YYYY-MM-DD HH:mm:ss")}】`
  );
  start();
  index++;
});
async function start() {
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
    if (order.order_status === "OrderWaitOpen") {
      let { id } = order;
      const orderDetail = await getOrderDetail(id);
      let {
        bet_info,
        game_value,
        game_type_name,
        create_time,
        game_cycle_value,
        bet_mode,
        bet_multiple,
        bet_balance,
      } = orderDetail;
      if (!hasPrint[id]) {
        console.log(`
        投注期号：${game_cycle_value}
        投注的内容:${chalk.red(bet_info)}
        投注彩种:${game_value}
        投注玩法:${game_type_name}
        投注时间:${create_time}
        投注模式:${bet_mode}
        投注倍数:${bet_multiple}
        投注金额:${bet_balance}
        `);
      } else {
        hasPrint[id] = true;
      }
    }
  }
}
