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
