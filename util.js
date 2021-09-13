import chalk from "chalk";
import fetch from "node-fetch";

export function convertNumberInDingWeiDan(array) {
  let str = "[";
  let sub_str = "[";
  for (let i = 0; i < array.length; i++) {
    if (array[i] === "") {
      if (i === array.length - 1) {
        str = str + "[]";
      } else {
        str = str + "[],";
      }
    } else {
      const sNumber = array[i].toString();
      for (var j = 0; j < sNumber.length; j++) {
        if (j === sNumber.length - 1) {
          sub_str = sub_str + `"${sNumber.charAt(j)}"` + "";
        } else {
          sub_str = sub_str + `"${sNumber.charAt(j)}"` + ",";
        }
      }

      if (i === array.length - 1) {
        sub_str = sub_str + "]";
      } else {
        sub_str = sub_str + "],";
      }

      str = str + sub_str;
      sub_str = "[";
    }
  }

  str = str + "]";

  return str;
}

/**
 * bet_info: "[[\"1\",\"1\",\"1\",\"1\",\"1\"],[[\"4\",\"7\"]]]"  (万千百十个) 47
 * bet_info: "[[\"0\",\"0\",\"0\",\"1\",\"1\"],[[\"4\",\"6\",\"7\"]]]" (十个) 47
 *             [[0,1,0,1,1],[0,1,2,3,4,5,6,7,8,9]]
 * @param {*} array
 * @returns
 */

export function convertForTwoSelectDuplex(array) {
  const positions = array[0];
  const numbers = array[1];
  const wan = Number(positions.includes("万"));
  const qian = Number(positions.includes("千"));
  const bai = Number(positions.includes("百"));
  const shi = Number(positions.includes("十"));
  const ge = Number(positions.includes("个"));
  const numbersString = numbers.split(""); // [ '4', '6', '7' ]
  return `[[${wan},${qian},${bai},${shi},${ge}],[[${numbersString}]]]`;
}

export function callThePolice() {
  fetch("https://fwalert.com/93a4e087-86b1-429c-8a4d-242e04f0f779").then(
    () => {
      console.log(chalk.red("===============报警成功==============="));
    }
  );
}
