const fs = require("fs");

function shuffleArray(array) {
  // Use Fisher-Yates (aka Knuth) Shuffle Algorithm
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const data = fs.readFileSync(`${__dirname}/listWords.txt`, "utf-8");
let wordList = data.split("\n").map((word) => word.trim());
wordList = shuffleArray(wordList);

module.exports = wordList;