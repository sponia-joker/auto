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

export function CallThePolice(call) {
  if(call){
    console.log(chalk.red('===============报警成功==============='))
    // fetch('https://fwalert.com/93a4e087-86b1-429c-8a4d-242e04f0f779').then(value=>{
      
    // })
  }
}
