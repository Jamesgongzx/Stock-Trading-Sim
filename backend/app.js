const express = require("express");
const morgan = require("morgan");
const session = require('express-session');
const fs = require('fs');
const database = require("./database");

const indexRoutes = require("./routes/index");
const accountsRoutes = require("./routes/accounts");
const playersRoutes = require("./routes/players");
const stocksRoutes = require("./routes/stocks");
const shopsRoutes = require("./routes/shops");
const leaderboardsRoutes = require("./routes/leaderboards");
const meta = require("./routes/meta");

const port = process.env.PORT || 4000;

const app = express();

function executeSQL(filename) {
    let readfilepromise = new Promise((resolve, reject) => {
        fs.readFile(filename, function read(err, data) {
            if (err) {
                return reject(err)
            }

            resolve(data)
        })
    })

    return readfilepromise
        .then((data) => {
            // console.log(data.toString());
            return database.query(data.toString(), [])
        })
        .then(() => {
            console.log(`Successfully executed: ${filename}`);
        })
        .catch((err) => {console.log(`Error with file: ${filename}\n${err}`)})
}
//Body-Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("short"));

app.use(session({
	secret: 'random secret',
	resave: true,
	saveUninitialized: true,
}));

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use("/", indexRoutes);
app.use("/accounts", accountsRoutes);
app.use("/players", playersRoutes);
app.use("/stocks", stocksRoutes);
app.use("/shops", shopsRoutes);
app.use("/leaderboards", leaderboardsRoutes);
app.use("/meta", meta);
app.disable('etag');

app.use((req, res, next) => {
  res.status(404).send("error");
});

app.listen(port, () => {
    executeSQL("stocktradingsim.sql")
        .then(() => {
            return executeSQL("temp_ckoo.sql");
        })
        .catch((err) => {});
  console.log(`Server is running on ${port}`);
});