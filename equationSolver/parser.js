const nonTerminals = {
  S: ["E=E"],
  E: ["E+F", "E-F", "F"],
  F: ["T"],
  T: ["T*G", "G"],
  G: ["N"],
  N: ["\d", "\dL"],
  L: ["\l", ""]
};

function cursor(arr) {
  let i = 0;
  return {
    forward() {
      if (arr.length > i) {
        i++;
      }
    },
    backward() {
      if (arr.length > 0) {
        i--;
      }
    },
    current() {
      return arr[i];
    }
  }
}

let currentCursor = null;

function match(val) {
  const nonTerm = nonTerminals[val];
  console.log(val, nonTerm);
  if (nonTerm) {
    for (let i = 0; i < nonTerm.length; i++) {
      for (let j = 0; j < nonTerm[i].length; j++) {
        match(nonTerm[i][j]);
      }
    }
  }
}

function parse(tokens) {
  currentCursor = cursor(tokens);
  match("S");
}

module.exports = parse;
