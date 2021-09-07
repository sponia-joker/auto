import fetch from "node-fetch";
import st from "silly-datetime";
import { v4 as uuidv4 } from "uuid";
import schedule from "node-schedule";
import config from "./config.js";
import chalk from "chalk";
import _ from "lodash";

/**
 * 全局变量，保存已经投注的订单id
 */

const hasOrder = {};

// 监听次数索引

let index = 1;

async function addRecord(order) {
  hasOrder[order.ID] = true;
  const SerialNumber = getCurrentQiHao();
  console.log(chalk.bgGreen("当前期号", SerialNumber));
  let response = {};
  try {
    response = await fetch(`${config.api}/api/Bet/Confirm`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${config.token}`,
        "content-type": "application/json; charset=UTF-8",
        "sec-ch-ua":
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: `${config.api}/Bet/60`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify({
        LotteryGameID: 60, //腾讯分分彩的ID
        SerialNumber: SerialNumber, // 期号
        IsLoginByWeChat: false,
        Guid: uuidv4(), // 随机生成全局唯一ID
        BetMode: 0,
        BetGuid: null,
        Bets: [
          {
            BetTypeCode: order.BetTypeCode, // 定位胆
            Number: order.Number, // 下注号码
            CompressedNumberCrc: null,
            IsCompressed: false,
            Position: "",
            Unit: 0.1,
            Multiple: 1, // 倍数
            ReturnRate: 0,
          },
        ],
      }),
      method: "POST",
      mode: "cors",
    });
    const data = await response.json();
    const { Success, ErrorMessage } = data;
    if (Success) {
      console.log(chalk.green("投注成功", JSON.stringify(data)));
    } else {
      console.log(chalk.red("投注失败", ErrorMessage));
    }
  } catch (error) {
    console.log(
      chalk.bgRed("投注发生错误", Array.from(response.headers.values()))
    );
  }
}

async function refreshToken() {
  let response = {};
  try {
    response = await fetch(`${config.api}/api/Token/Refresh`, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${config.token}`,
        "sec-ch-ua":
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: `${config.api}/InstantMessage`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    });
    /**
     * {
   "isAgent":true,
   "expires_in":1800,
   "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGMxOTk0IiwiTWVyY2hhbnRDb2RlIjoiZGYiLCJQbGF5ZXJUeXBlIjoiYWdlbnQiLCJuYmYiOjE2MzA5MzE0MDIsImV4cCI6MTYzMDkzMzIwMn0.6yoTZyutT_fsfn1LWjLNel8CLS4_zq5CAzuze6SbdRA"
}
     */
    const data = await response.json();
    const { access_token } = data;
    config.token = access_token;
  } catch (error) {
    console.log(
      chalk.bgRed("刷新Token发生错误", Array.from(response.headers.values()))
    );
  }
}

async function getOrderList() {
  const start_time = st.format(new Date(), "YYYY/MM/DD 03:00");
  const end_time = st.format(
    new Date(new Date().setDate(new Date().getDate() + 1)),
    "YYYY/MM/DD 03:00"
  );
  let response = {};
  try {
    response = await fetch("https://sk.df668s.com/api/TeamBetRecord/Search", {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${config.token}`,
        "content-type": "application/json; charset=UTF-8",
        "sec-ch-ua":
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: `${config.api}/BetRecord?PageType=Team`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify({
        draw: 1,
        columns: [
          {
            data: "LoginId",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "CreateTime",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "IssueSerialNumber",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "LotteryName",
            name: "",
            searchable: true,
            orderable: false,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "BetTypeName",
            name: "",
            searchable: true,
            orderable: false,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "Cost",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "Prize",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "RealEarn",
            name: "",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "State",
            name: "State",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "function",
            name: "",
            searchable: true,
            orderable: false,
            search: {
              value: "",
              regex: false,
            },
          },
        ],
        order: [
          {
            column: 1,
            dir: "desc",
          },
        ],
        start: 0,
        length: 1,
        search: {
          value: "",
          regex: false,
        },
        withHour: true,
        isTeamReport: true,
        gameType: 0,
        lotteryGameId: "",
        startTime: start_time,
        endTime: end_time,
        loginId: config.username,
      }),
      method: "POST",
      mode: "cors",
    });
    const data = await response.json();
    return _.get(data, "data");
  } catch (error) {
    console.log(
      chalk.bgRed(
        "获取投注记录列表发生错误",
        Array.from(response.headers.values())
      )
    );
  }
}

/**
 * 
 * @returns 
 * CurrentIssue: {
    LotteryID: 60,
    Date: 1630857600000,
    CloseTimeStamp: 1630939850000,
    StartTimeStamp: 1630939790000,
    SequenceNumber: '1371',
    SerialNumber: '202109061371'
  },
 */
// async function getCurrentQiHao() {
//   let response = {};
//   try {
//     response = await fetch("https://sk.df668s.com/api/Bet/IssueInfo/60", {
//       headers: {
//         accept: "application/json, text/javascript, */*; q=0.01",
//         "accept-language": "en-US,en;q=0.9",
//         authorization: `Bearer ${config.token}`,
//         "content-type": "application/json; charset=UTF-8",
//         "sec-ch-ua":
//           '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-origin",
//         "x-requested-with": "XMLHttpRequest",
//       },
//       referrer: "https://sk.df668s.com/Bet/60",
//       referrerPolicy: "strict-origin-when-cross-origin",
//       body: '{"OldIssueLength":20}',
//       method: "POST",
//       mode: "cors",
//     });
//     const data = await response.json();
//     return data.CurrentIssue;
//   } catch (error) {
//     console.log(
//       chalk.bgRed("获取当前期号出现问题", Array.from(response.headers.values()))
//     );
//   }
// }

function getCurrentQiHao() {
  const date = new Date();

  const year = date.getFullYear(); //获取完整的年份(4位,1970-????)
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); //获取当前月份(0-11,0代表1月)

  const day = date.getDate().toString().padStart(2, "0");

  const hour = date.getHours();
  const minute = date.getMinutes();

  const number = (hour * 60 + minute + 1).toString().padStart(4, "0"); //获取当前小时数(0-23)

  return `${year}${month}${day}${number}`;
}

async function getOrderDetail(ID) {
  let response = {};
  try {
    response = await fetch(`${config.api}/api/BetRecord/Detail/${ID}`, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        authorization: `Bearer ${config.token}`,
        "sec-ch-ua":
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: `${config.api}/BetRecord?PageType=Team`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "POST",
      mode: "cors",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(
      chalk.bgRed("获取订单详情失败", Array.from(response.headers.values()))
    );
  }
}

function run() {
  schedule.scheduleJob("46-50 * * * * *", () => {
    console.log(
      `正在第${index}次监听下级用户【${
        config.username
      }】是否正在投注【时间：${st.format(new Date(), "YYYY-MM-DD HH:mm:ss")}】`
    );
    start();
    index++;
  });
}

async function start() {
  const orderList = await getOrderList();
  // order的三种状态：未中奖NOPRIZE, 中奖 WIN, 未开奖  BET
  /**
   * ID order的id，用来获取详情
   *
   */
  for (let order of orderList) {
    const { ID, State } = order;
    console.log(State);
    if (State === "BET" && !hasOrder[ID]) {
      const orderDetail = await getOrderDetail(ID);
      await addRecord(orderDetail);
    }
  }
}

function timeRefresh() {
  var rule = new schedule.RecurrenceRule();
  rule.minute = [0, 10, 20, 30, 40, 50];
  var j = schedule.scheduleJob(rule, function () {
    console.log(
      "======准备刷新Token=======",
      st.format(new Date(), "YYYY-MM-DD HH:mm:ss")
    );
    refreshToken();
  });
}

run();
timeRefresh();
