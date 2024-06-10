/*
  © 2024 CVS Health and/or one of its affiliates. All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/*
  util.js
  Utility functions.
*/

// CONSTANTS

// Array of 36 alphanumeric characters.
const alphaNumChars = (() => {
  const digits = Array(10).fill('').map((digit, index) => index.toString());
  const lowers = Array(26).fill('').map((letter, index) => String.fromCodePoint(97 + index));
  return digits.concat(lowers);
})();
// Tools.
const tools = exports.tools = {
  alfa: 'Alfa',
  aslint: 'ASLint',
  axe: 'Axe',
  ed11y: 'Editoria11y',
  htmlcs: 'HTML CodeSniffer',
  ibm: 'Accessibility Checker',
  nuVal: 'Nu Html Checker',
  qualWeb: 'QualWeb',
  testaro: 'Testaro',
  wave: 'WAVE',
  wax: 'WallyAX'
};

// FUNCTIONS

// Returns a string representing a date and time.
const getTimeString = date => date.toISOString().slice(0, 19);
// Returns a string representing the date and time.
const getNowString = exports.getNowString = () => getTimeString(new Date());
// Returns a string representing an ISO date.
const getNowDate = exports.getNowDate = () => getNowString().slice(0, 10);
// Returns a string representing a date with slashes.
exports.getNowDateSlash = () => getNowDate().replace(/-/g, '/');
// Returns a time stamp representing a date and time.
const getTimeStamp
= exports.getTimeStamp
= date => getTimeString(date).replace(/[-:]/g, '').slice(2, 13);
// Returns a time stamp representing the date and time.
const getNowStamp = exports.getNowStamp = () => getTimeStamp(new Date());
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
// Returns a base-36 alphanumeric representation of an integer.
exports.alphaNumOf = num => {
  let resultDigits = [];
  while (num || ! resultDigits.length) {
    const remainder = num % 36;
    resultDigits.unshift(alphaNumChars[remainder]);
    num = Math.floor(num / 36);
  }
  return resultDigits.join('');
};
// Returns a random string.
const getRandomString = exports.getRandomString = length => {
  const chars = [];
  for (let i = 0; i < length; i++) {
    chars.push(alphaNumChars[Math.floor(36 * Math.random())]);
  }
  return chars.join('');
};
// Returns a file ID.
exports.getFileID = randomLength => {
  const timePart = getNowStamp();
  const randomPart = getRandomString(randomLength);
  return `${timePart}-${randomPart}-0`;
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
// Returns whether a tool ID is the ID of a Testaro-integrated tool.
exports.isToolID = toolID => toolIDs.includes(toolID);
