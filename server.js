const dotenv = require("dotenv");
const cron = require("node-cron");
const axios = require("axios");
const { HEALTH_CHECK_URL } = require("./utils/constants");

dotenv.config({ path: "./config.env" });

const app = require("./app");

// Cron job to ping the backend every 14 minutes
if (process.env.NODE_ENV === "production")
  cron.schedule("*/14 * * * *", async () => {
    try {
      console.log("Pinging backend to keep the server awake!");
      await axios.get(HEALTH_CHECK_URL);
    } catch (err) {
      console.error("Error pinging backend:", err);
    }
  });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
