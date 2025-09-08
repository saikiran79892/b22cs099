const { customAlphabet } = require('nanoid');
const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

module.exports = function generateShortcode() {
  return nano();
};
