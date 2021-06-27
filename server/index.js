const key = require("./key");
const express = require("express");
const redis = require("redis");
const cors = require("cors");
const { Pool } = require("pg");
// Express app setup
const PORT = 5000 || process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Postgres setup
const pgClient = new Pool({
  user: key.pgUser,
  host: key.pgHost,
  database: key.pgDatabase,
  password: key.pgPassword,
  port: key.pgPort,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});
// Redis setup
const redisClient = redis.createClient({
  host: key.redisHost,
  port: key.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();
// Express route handlers
app.get("/", (req, res) => {
  res.send("Hello there");
});
app.get("/values/all", async (req, res) => {
  try {
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
  } catch (error) {
    console.log(error);
  }
});

app.get("/values/current", (req, res) => {
  try {
    redisClient.hgetall("values", (err, values) => {
      res.send(values);
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/values", async (req, res) => {
  try {
    const { index } = req.body;
    if (parseInt(index) > 40) {
      return res.status(422).send("Index to high");
    }
    redisClient.hset("values", index, "Nothing yet!");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
    res.send({ working: true });
  } catch (error) {
    console.log(error);
  }
});
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
