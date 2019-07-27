const stateMap = {
  1: {
    transitions: {
      "[0-9]": 2,
      "[a-z]": 3,
    }
  },
  2: {
    transitions: {
      "=": 4,
      "[0-9]": 2,
      "[a-z]": 3,
      "[+/-*]": 5,
    }
  },
  3: {
    transitions: {
      "=": 4,
      "[+/-*]": 5
    }
  },
  4: {
    transitions: {
      "[0-9]": 9,
      "[a-z]": 10,
    }
  },
  5: {
    transitions: {
      "[0-9]": 6,
      "[a-z]": 8,
    }
  },
  6: {
    transitions: {
      "[0-9]": 6,
      "[a-z]": 8,
      "[+/-*]": 5,
      "=": 4,
    }
  },
  8: {
    transitions: {
      "=": 4,
      "[+/-*]": 5,
    }
  },
  9: {
    accept: true,
    transitions: {
      "[0-9]": 9,
      "[a-z]": 10,
      "[+/-*]": 11,
    }
  },
  10: {
    accept: true,
    transitions: {
      "[+/-*]": 11,
    }
  },
  11: {
    transitions: {
      "[a-z]": 13,
      "[0-9]": 12,
    }
  },
  12: {
    accept: true,
    transitions: {
      "[0-9]": 12,
      "[a-z]": 13,
    }
  },
  13: {
    accept: true,
    transitions: {
      "[+/-*]": 11,
    }
  }
};

const getTokenClass = (token) => {
  if (token.match(/[0-9]/))
    return "[0-9]";
  else if (token.match(/[a-z]/))
    return "[a-z]";
  else if (token.match(/[\-/*+]/))
    return "[+/-*]";
  else if (token === "=")
    return "=";
  else if (token === " ")
    return "whitespace";
  return null;
};

function classToToken(className, buff) {
  if (className === "[0-9]") {
    return {
      type: "NUMBER_LITERAL",
      value: buff,
    };
  } else if (className === "[a-z]") {
    return {
      type: "IDENTIFIER",
      value: buff,
    };
  } else if (className === "[+/-*]") {
    return {
      type: "OPERATOR",
      value: buff,
    };
  } else if (className === "=") {
    return {
      type: "EQUAL",
      value: null,
    };
  }

  throw new Error("Unrecognized className " + className);
}

function tokenize(input) {
  let tokens = [];
  let buff = "";
  let state = 1;

  let lastTokenClass = null;
  for (let i = 0; i < input.length; i++) {
    const token = input[i];
    const tokenClass = getTokenClass(token);
    if (tokenClass === "whitespace") {
      continue;
    }

    if (tokenClass === null) {
      throw new Error("Unrecognized token " + token);
    }

    const transitions = stateMap[state].transitions;
    if (!transitions[tokenClass]) {
      throw new Error("Unexpected token " + token + " at position " + i + "(" + state + ")");
    }

    state = transitions[tokenClass];
    if (lastTokenClass !== null && tokenClass !== lastTokenClass) {
      tokens.push(classToToken(lastTokenClass, buff));
      buff = "";
    }

    buff += token;
    lastTokenClass = tokenClass;
  }

  if (stateMap[state].accept !== true) {
    throw new Error("Unexpected END OF STRING");
  }

  if (buff) {
    tokens.push(classToToken(lastTokenClass, buff));
  }
  return tokens;
}

module.exports = tokenize;
