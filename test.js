// bet_info: "[[\"1\",\"1\",\"1\",\"1\",\"1\"],[[\"4\",\"7\"]]]"  (万千百十个) 47

// bet_info: "[[\"0\",\"0\",\"0\",\"1\",\"1\"],[[\"4\",\"6\",\"7\"]]]" (十个) 47

function convertForTwoSelectDuplex(array) {
  const positions = array[0];
  const numbers = array[1];
  const wan = Number(positions.includes("万"))
  const qian = Number(positions.includes("千"))
  const bai = Number(positions.includes("百"))
  const shi = Number(positions.includes("十"))
  const ge = Number(positions.includes("个"))
  const numbersString = numbers.split(""); // [ '4', '6', '7' ]
  return `[[${wan},${qian},${bai},${shi},${ge}],[${numbersString}]]`;
}

console.log(convertForTwoSelectDuplex("(千十个) 0123456789".split(" ")));
