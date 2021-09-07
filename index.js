import _ from "lodash";
import fetch from "node-fetch";
import schedule from "node-schedule";
import chalk from "chalk";
import config from "./config.js";
import st from "silly-datetime";
import { AddLotteryOrders } from "./order.js";
import {
  convertNumberInDingWeiDan,
  convertForTwoSelectDuplex,
  callThePolice,
} from "./util.js";

/**
 * 全局变量，保存已经投注的订单id
 */

const hasOrder = {};

// 监听次数索引

let index = 1;

let hasCallPolice = false;
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
  let response = {};
  try {
    config.headers.authorization = config.token;
    response = await fetch(`${config.api}/APIV2/GraphQL?l=en-us&pf=web`, {
      headers: config.headers,
      referrer: `${config.api}/report/lotteryOrder`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify({
        operationName: "getPersonalLotteryGameRecord",
        variables: {
          input: {
            order_status_type: "OrderWaitChangeBalance",
            start_time,
            end_time,
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
    return _.get(
      data,
      "data.User.personal_lottery_game_record_page.record",
      []
    );
  } catch (error) {
    console.log(
      chalk.bgRed("获取投注记录列表发生错误", Array.from(response.headers.values()))
    );
  }
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
  try {
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
  } catch (error) {
    console.log(
      chalk.bgRed("获取订单详情发生错误", Array.from(response.headers.values()))
    );
  }
}

// 定义规则
// let rule = new schedule.RecurrenceRule();

// let second = [];

// // 通过配置config文件中的interval值,来设置监听的时间间隔
// for (let time = 0; time < 60; time = time + config.interval) {
//   second.push(time);
// }
// rule.second = second;

// 启动任务
// let job = schedule.scheduleJob(rule, () => {
//   console.log(
//     `正在第${index}次监听下级用户【${
//       config.username
//     }】是否正在投注【时间：${st.format(new Date(), "YYYY-MM-DD HH:mm:ss")}】`
//   );
//   start();
//   index++;
// });

schedule.scheduleJob("46-50 * * * * *", () => {
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

  /**
   * orderDetail:
   * {
   "user_account":"dashabi999",
   "order_id":"LBFSPKQPJLRJ",订单id
   "create_time":"2021-09-05 19:22:21",
   "game_id_v2":190,
   "game_type_name":"定位胆",
   "game_cycle_value":"202109051163",// 期号
   "bet_count":5,// 注数
   "bet_multiple":1,
   "bet_balance":"10",// 
   "result_balance":"0",
   "order_status":"OrderWaitOpen",// 订单状态
   "order_result":null,
   "bet_info":"01234, , , , ", 投注信息
   "bet_mode":"TwoYuan", 投注模式
   "bet_percent":0,// 投注返点
   "bet_percent_type":"AdjustPercentType",
   "can_cancel":true, 能否取消
   "result_balance_change_reason":"",
   "result_count":"",
  
   */
  /**
   * order
   * 
   * {
   "id":"MLPMJUKQPFJK",
   "user_account":"dashabi999",
   "game_cycle_value":"202109051209",
   "bet_info":", , , 56789, ",
   "game_value":"奇趣腾讯分分彩",
   "game_type_name":"定位胆",
   "bet_balance_display":"10",
   "result_balance_display":"0",
   "create_time":"2021-09-05 20:08:48",
   "bet_multiple":1,
   "order_status":"OrderWaitOpen",
   "can_cancel":false,
   "can_one_more":false,
   "result_balance_change_reason":null,
   "__typename":"PersonalLotteryGameRecord"
}
   */
  for (let order of orderList) {
    if (!hasCallPolice) {
      hasCallPolice = true;
      callThePolice();
    }

    if (order.order_status === "OrderWaitOpen") {
      let { id, game_value } = order;
      const orderDetail = await getOrderDetail(id);
      let {
        bet_info,
        // bet_count,
        game_type_name, // 游戏玩法
        create_time,
        game_cycle_value,
        bet_mode,
        bet_multiple,
        // bet_balance,
      } = orderDetail;
      if (!hasOrder[id]) {
        hasOrder[id] = true; // 防止订单被重复执行
        let new_bet_info = {};
        const bet_info_no_space = bet_info.replace(/\s+/g, "");
        const bet_info_array = bet_info_no_space.split(","); //去掉下注信息中的空格,转换成数组
        /**
         *  前三直选复式 35
            后三_直选复式 21
            任二组选_组选复式 81
            后三_组六复式:28
            前三_组六复式 42
            中三_组六复式 113
         *
         */
        if (game_type_name === "定位胆") {
          new_bet_info = convertNumberInDingWeiDan(bet_info_array);
          order.game_type_id = 65;
        } else if (game_type_name === "不定位_后四一码") {
          new_bet_info = `[[${bet_info_no_space}]]`;
          order.game_type_id = 70;
        } else if (game_type_name === "不定位_后四二码") {
          new_bet_info = `[[${bet_info_no_space}]]`;
          order.game_type_id = 71;
        } else if (game_type_name === "前三_直选复式") {
          new_bet_info = convertNumberInDingWeiDan(bet_info_array);
          order.game_type_id = 35;
        } else if (game_type_name === "后三_直选复式") {
          new_bet_info = convertNumberInDingWeiDan(bet_info_array);
          order.game_type_id = 21;
        } else if (game_type_name === "前三_组六复式") {
          new_bet_info = `[[${bet_info_no_space}]]`;
          order.game_type_id = 42;
        } else if (game_type_name === "中三_组六复式") {
          new_bet_info = `[[${bet_info_no_space}]]`;
          order.game_type_id = 113;
        } else if (game_type_name === "后三_组六复式") {
          new_bet_info = `[[${bet_info_no_space}]]`;
          order.game_type_id = 28;
        } else if (game_type_name === "任二组选_组选复式") {
          new_bet_info = convertForTwoSelectDuplex(bet_info.split(" "));
          order.game_type_id = 81;
        } else {
          // 其他玩法直接返回，不做处理
          return;
        }
        console.log(chalk.green("============正在投注================"));
        const { hasError, data } = await AddLotteryOrders({
          params: {
            bet_info: new_bet_info,
            order,
            bet_mode,
          },
        });
        if (!hasError) {
          console.log(chalk.green("============投注成功================"));
        }
        console.log("投注相关信息", JSON.stringify(data), hasError);
      }
    }
  }
}
