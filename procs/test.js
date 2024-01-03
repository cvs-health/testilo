// Array of 62 alphanumeric characters.
const alphaNumChars = (() => {
  const digits = Array(10).fill('').map((digit, index) => index.toString());
  const uppers = Array(26).fill('').map((letter, index) => String.fromCodePoint(65 + index));
  const lowers = Array(26).fill('').map((letter, index) => String.fromCodePoint(97 + index));
  return digits.concat(uppers, lowers);
})();

// Returns an alphanumeric representation of an integer.
const alphaNumOf = num => {
  let resultDigits = [];
  while (num) {
    const remainder = num % 62;
    resultDigits.unshift(alphaNumChars[remainder]);
    num = Math.floor(num / 62);
  }
  return resultDigits.join('');
};

console.log(alphaNumOf(process.argv[2]));
