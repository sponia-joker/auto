import _ from "lodash";
import fetch from "node-fetch";
import config from "./config.js";
import logger from "./logger.js";

/**
 * 获取当前期数的信息
 * @param {} params 
 * game_id: 190
    game_value: "奇趣腾讯分分彩"
    lottery_cycle_now: {now_cycle_id: 10681795, now_cycle_value: "202109041223", now_cycle_count_down: 59,…}
    future_cycle_list: [{cycle_id: 10681796, cycle_value: "202109041224", __typename: "LotteryCycleFuture"},…]
    last_cycle_game_result: null
    last_cycle_value: "202109041222"
    now_cycle_count_down: 59
    now_cycle_id: 10681795
    now_cycle_value: "202109041223"
    __typename: "LotteryCycleNow"
 */
async function GetLotteryCycle() {
  let response = {};
  let data = {};
  try {
    response = await fetch(`${config.api}/APIV2/GraphQL?l=zh-cn&pf=web`, {
      headers: config.touzhuHeaders,
      referrer: `${config.api}/lottery/190`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"operationName":"GetLotteryCycle","variables":{"game_id":190,"row_count":20},"query":"query GetLotteryCycle($game_id: Int!, $row_count: Int) {\\n  LotteryGame(game_id: $game_id) {\\n    game_id\\n    game_value\\n    official_website\\n    official_website_remind\\n    lottery_cycle_now {\\n      now_cycle_id\\n      now_cycle_value\\n      now_cycle_count_down\\n      last_cycle_value\\n      last_cycle_game_result\\n      future_cycle_list {\\n        cycle_id\\n        cycle_value\\n        __typename\\n      }\\n      __typename\\n    }\\n    lottery_result_history(row_count: $row_count) {\\n      cycle_value\\n      game_result\\n      open_time\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}',
      method: "POST",
      mode: "cors",
    });
    data = await response.json();
  } catch (error) {
    logger.error("获取当前期号信息出现错误", Array.from(response.headers.values()));
  }
  return _.get(data, "data.LotteryGame", {});
}

/**
 * 进行投注
 * @param
 * @returns
 */
export async function AddLotteryOrders({ params = {} }) {
  logger.info("投注订单的参数", JSON.stringify(params));
  const lotteryCycle = await GetLotteryCycle();
  const game_cycle_id = lotteryCycle.lottery_cycle_now.now_cycle_id;
  const now_cycle_value = lotteryCycle.lottery_cycle_now.now_cycle_value; // 期号
  let response = {};
  let data = {};
  if (now_cycle_value === params.order.game_cycle_value) {
    // 当前期号和监听用户投注期号相同
    try {
      response = await fetch(`${config.api}/APIV2/GraphQL?l=zh-cn&pf=web`, {
        headers: config.touzhuHeaders,
        referrer: `${config.api}/lottery/190`,
        referrerPolicy: "strict-origin-when-cross-origin",
        body: JSON.stringify({
          operationName: "AddLotteryOrders",
          variables: {
            input: [
              {
                game_id: 190, // 奇趣分分彩
                // 定位胆 65 中三组六复式 113   不定位后四2码  71  不定位后四1码 70
                game_type_id: params.order.game_type_id,
                game_cycle_id: game_cycle_id,
                bet_info: params.bet_info,
                bet_mode: params.bet_mode,
                bet_multiple: params.bet_multiple,
                bet_percent_type: "AdjustPercentType",
                bet_percent: 0,
              },
            ],
          },
          query:
            "mutation AddLotteryOrders($input: [AddLotteryOrderInputObj]!) {\n  AddLotteryOrders(orders: $input) {\n    message\n    order_ids\n    __typename\n  }\n}\n",
        }),
        method: "POST",
        mode: "cors",
      });
      data = await response.json();
    } catch (error) {
      logger.error("投注订单发生错误", Array.from(response.headers.values()));
      return {
        hasError: true,
        data: {
          message: Array.from(response.headers.values()),
        },
      };
    }
    const errors = _.get(data, "errors");
    if (errors) {
      return {
        hasError: true,
        data: errors,
      };
    } else {
      return {
        hasError: false,
        data,
      };
    }
  } else {
    return {
      hasError: true,
      data: {
        message: `期号不一致，已经错过投注时间${now_cycle_value}-${params.order.game_cycle_value}`,
      },
    };
  }
}
