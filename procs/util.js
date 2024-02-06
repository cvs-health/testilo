/*
  util.js
  Utility functions.
*/

// CONSTANTS

// Array of 62 alphanumeric characters.
const alphaNumChars = (() => {
  const digits = Array(10).fill('').map((digit, index) => index.toString());
  const uppers = Array(26).fill('').map((letter, index) => String.fromCodePoint(65 + index));
  const lowers = Array(26).fill('').map((letter, index) => String.fromCodePoint(97 + index));
  return digits.concat(uppers, lowers);
})();

// FUNCTIONS

// Returns a string representing a date and time.
const getTimeString = date => date.toISOString().slice(0, 19);
// Returns a string representing the date and time.
exports.getNowString = () => getTimeString(new Date());
// Returns a time stamp representing a date and time.
const getTimeStamp
= exports.getTimeStamp
= date => getTimeString(date).replace(/[-:]/g, '').slice(2, 13);
// Returns a time stamp representing the date and time.
exports.getNowStamp = () => getTimeStamp(new Date());
// Inserts a character periodically in a string.
const punctuate = (string, insertion, chunkSize) => {
  const segments = [];
  let startIndex = 0;
  while (startIndex < string.length) {
    segments.push(string.slice(startIndex, startIndex + chunkSize));
    startIndex += chunkSize;
  }
  return segments.join(insertion);
};
// Converts a compact timestamp to a date.
exports.dateOf = timeStamp => {
  if (/^\d{6}T\d{4}$/.test(timeStamp)) {
    const dateString = punctuate(timeStamp.slice(0, 6), '-', 2);
    const timeString = punctuate(timeStamp.slice(7, 11), ':', 2);
    return new Date(`20${dateString}T${timeString}Z`);
  } else {
    return null;
  }
};
// Returns a base-62 alphanumeric representation of an integer.
exports.alphaNumOf = num => {
  let resultDigits = [];
  while (num || ! resultDigits.length) {
    const remainder = num % 62;
    resultDigits.unshift(alphaNumChars[remainder]);
    num = Math.floor(num / 62);
  }
  return resultDigits.join('');
};
// Returns a random string.
exports.getRandomString = length => {
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(alphaNumChars[Math.floor(62 * Math.random())]);
  }
  return chars.join('');
};
// Returns a horizontal SVG graph bar.
const getSVGBar = (num, max, isRight) => {
  const widthFrac = 100 * num / max;
  const x = isRight ? `${100 - widthFrac}%` : '0';
  return `<rect height="100%" x="${x}" width="${widthFrac}%"></rect>`;
};
// Returns a table cell containing an SVG graph bar.
exports.getBarCell = (num, colMax, svgWidth, isRight = false) => {
  const bar = getSVGBar(num, colMax, isRight);
  const svg = `<svg height="0.7rem" width="${svgWidth}rem">${bar}</svg>`;
  const rightClass = isRight ? ' class="right"' : '';
  const cell = `<td aria-hidden="true"${rightClass}>${svg}</td>`;
  return cell;
};
