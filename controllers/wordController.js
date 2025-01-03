const moment = require("moment-timezone");
const wordList = require("../data/import-data");

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer as JavaScript numbers are 64-bit floating-point by default
  }
  return Math.abs(hash); // Ensure it's positive
}

const generatePrefilledLocations = (word, date) => {
  const seed = `${word}-${date}`;
  const hash = hashString(seed);

  // Get two distinct indices within the word length
  const firstPosition = hash % word.length;
  const secondPosition = Math.floor(hash / word.length) % word.length;

  // Ensure the positions are unique
  return firstPosition === secondPosition
    ? [firstPosition, (secondPosition + 1) % word.length]
    : [firstPosition, secondPosition];
};

exports.getWordOfTheDay = (req, res) => {
  // Expecting timezone from the client
  const { timezone } = req.query;

  if (!timezone || !moment.tz.zone(timezone)) {
    return res.status(400).send({ error: "Invalid or missing timezone" });
  }

  // Get the current date in the user's timezone
  const currentDate = moment.tz(new Date(), timezone).format("YYYY-MM-DD");

  // Calculate the word index

  //1. Get number of days since Unix Epoch (12am, Jan 1, 1970) for current date
  // new Date(currentDate).getTime() gets the number of ms elapsed since 12am, Jan 1 1970, for currentDate
  // 86400000 - number of ms in a day
  const daysSinceEpoch = Math.floor(new Date(currentDate).getTime() / 86400000);

  //2. Get number of days since Unix Epoch (12am, Jan 1, 1970) for the day when the website went live
  // This is needed to compute the offset which needs to be subtracted from daysSinceEpoch to start serving words
  // from beginning of the list.
  const launchDate = new Date("2025-01-04");
  const X = Math.floor(launchDate.getTime() / 86400000);

  //3. Compute word index
  // If the website is launched on 2nd January 2025, 00:00 IST, then India and countries east of IST will correctly compute daySinceEpoch
  // (say, x) days since the Unix epoch.
  // However, due to time zone differences, countries in time zones west of IST (e.g., the USA, which is UTC-5 or UTC-8) will still be on
  // 1st January 2025.
  // For these locations, daysSinceEpoch will compute to x - 1.
  // This will result in a negative value for (daysSinceEpoch - X)
  const wordIndex = (daysSinceEpoch - X + wordList.length) % wordList.length;
  const wordOfTheDay = wordList[wordIndex];

  //4. Calculate random locations
  const pre = generatePrefilledLocations(wordOfTheDay, currentDate);

  res.status(200).json({
    status: "success",
    data: {
      word: wordOfTheDay,
      pre,
    },
  });
};
