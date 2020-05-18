var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "new_Sem4_Project",
});

var app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname + "/login.html"));
});

app.post("/auth", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;

  if (username && password) {
    connection.query(
      "SELECT * FROM Users WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }

        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/frontpage.html");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.get("/frontpage.html", function (request, response) {
  response.sendFile(path.join(__dirname+"/frontpage.html"))
});

app.listen(3000);