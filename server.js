// dependencies
require("dotenv").config();
var express = require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');

// var exphbs = require("express-handlebars");

// import all files in models folder
var db = require("./models");

// set up an instance of express server
var app = express();

app.use(cookieParser());
app.use(session({secret: "socalcharm"}));

// set PORT for express
// Heroku needs process.env.PORT
var PORT = process.env.PORT || 3000;

// Middleware so express can handle data parsing from browser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// static directory accessible by anyone via web browser
app.use(express.static("public"));

// Handlebars
// app.engine(
//     "handlebars",
//     exphbs({
//         defaultLayout: "main"
//     })
// );
// app.set("view engine", "handlebars");

// Routes for express server to follow 
// & passes an arguement (app) as an instance of express server with these routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// force: false won't create database if exists
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
//  force : true clears the `testdb`
if (process.env.NODE_ENV === "test") {
    syncOptions.force = true;
}

// Syncing models  to database & then starts the server 
db.sequelize.sync(syncOptions).then(function() {
    app.listen(PORT, function() {
        console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
        );
    });
});

// export express server instance
module.exports = app;