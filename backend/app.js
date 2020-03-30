const express = require("express");
const morgan = require("morgan");
const session = require('express-session');
const fs = require('fs');
const connection = require("./connection");

const indexRoutes = require("./routes/index");
const accountsRoutes = require("./routes/accounts");
const playersRoutes = require("./routes/players");
const stocksRoutes = require("./routes/stocks");
const shopsRoutes = require("./routes/shops");

const port = process.env.PORT || 4000;

const app = express();

function executeSQL(filename) {
    fs.readFile(filename, function read(err, data) {
        if (err) {
            throw err;
        }
        // Invoke the next step here however you like
        // console.log(content.toString());   // Put all of the code here (not the best solution)
        connection.query(data.toString(), function(err, results) {
            if (err) throw err;
            console.log(`Successfully executed: ${filename}`);
        });

    });
}
//Body-Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("short"));

app.use(session({
	secret: 'random secret',
	resave: true,
	saveUninitialized: true
}));

//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/", indexRoutes);
app.use("/accounts", accountsRoutes);
app.use("/players", playersRoutes);
app.use("/stocks", stocksRoutes);
app.use("/shops", shopsRoutes);

app.use((req, res, next) => {
  res.status(404).send("error");
});

app.listen(port, () => {
    executeSQL("stocktradingsim.sql");
  console.log(`Server is running on ${port}`);
});
